import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { fulfillPaidEnrollment } from "@/lib/services/payments/enrollment-fulfillment";

/**
 * POST /api/webhooks/lemonsqueezy
 *
 * Lemon Squeezy fires this on order events. We listen for `order_created`
 * with a paid status, then fulfill the enrollment using the user_id and
 * course_id embedded in the order's custom_data.
 *
 * Security: HMAC SHA256 — same pattern as the Paystack webhook (SHA512).
 * Lemon Squeezy signs the raw body with your webhook secret.
 */
export async function POST(request: Request) {
  try {
    // 1. Read raw body before any parsing — required for signature verification
    const rawBody = await request.text();

    // 2. Extract Lemon Squeezy signature header
    const signature = request.headers.get("x-signature");
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      console.error("⚠️ LS Webhook: Missing signature or secret.");
      return NextResponse.json(
        { error: "Missing security credentials" },
        { status: 401 },
      );
    }

    // 3. Verify HMAC SHA256 — Lemon Squeezy uses SHA256 (Paystack uses SHA512)
    const hash = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.error(
        "⚠️ LS Webhook: Signature mismatch — unauthorized attempt.",
      );
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 4. Safe to parse
    const event = JSON.parse(rawBody);
    const eventName: string = event.meta?.event_name ?? "";

    // Only process paid orders
    if (eventName === "order_created") {
      const orderData = event.data?.attributes;
      const orderStatus: string = orderData?.status ?? "";

      // Only fulfill paid orders (not refunded, failed, etc.)
      if (orderStatus !== "paid") {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Read user_id and course_id from custom_data embedded at checkout creation
      const customData = event.meta?.custom_data ?? {};
      const userId: string | undefined = customData.user_id;
      const courseId: string | undefined = customData.course_id;
      const orderId: string = String(event.data?.id ?? "");
      const amountTotal: number = Number(orderData?.total ?? 0) / 100; // LS sends cents
      const currency: string = orderData?.currency ?? "USD";

      if (!userId || !courseId) {
        console.error(
          "❌ LS Webhook: Missing custom_data. Raw meta:",
          JSON.stringify(event.meta),
        );
        return NextResponse.json(
          { error: "Incomplete order metadata" },
          { status: 400 },
        );
      }

      const adminClient = createAdminClient();

      // 5. Fulfill enrollment (upsert — idempotent if webhook fires twice)
      try {
        await fulfillPaidEnrollment(
          {
            userId,
            courseId,
            amountPaid: amountTotal,
            payment_gateway: "lemonsqueezy",
          },
          adminClient,
        );
      } catch (fulfillError) {
        const message =
          fulfillError instanceof Error
            ? fulfillError.message
            : "Enrollment provisioning failed";
        console.error("❌ LS Webhook: Enrollment error:", message);
        return NextResponse.json(
          { error: "Enrollment provisioning failed" },
          { status: 500 },
        );
      }

      // 6. Record in lemonsqueezy_orders for audit/reconciliation
      if (orderId) {
        await adminClient.from("lemonsqueezy_orders").upsert(
          {
            order_id: orderId,
            user_id: userId,
            course_id: courseId,
            amount_total: amountTotal,
            currency,
            status: "paid",
          },
          { onConflict: "order_id" },
        );
      }

      console.log(
        `✅ LS Webhook: Course ${courseId} fulfilled for student ${userId} (order ${orderId})`,
      );
    }

    // Always return 200 — LS retries on non-2xx responses
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ LS Webhook: Runtime error:", message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
