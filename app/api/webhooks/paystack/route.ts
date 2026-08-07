import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  fulfillPaidEnrollment,
  parsePaystackMetadata,
} from "@/lib/services/payments/enrollment-fulfillment";

/**
 * POST /api/webhooks/paystack
 * Secure background endpoint handling automatic course access delivery upon payment confirmation.
 *
 * Idempotency: each paystack_ref is recorded in paystack_transactions with a UNIQUE constraint.
 * If Paystack retries the same webhook, the duplicate ref insert fails gracefully and we return 200.
 */
export async function POST(request: Request) {
  try {
    // 1. Read the raw request body as text (crucial for signature verification)
    const rawBody = await request.text();

    // 2. Extract the Paystack signature from headers
    const signature = request.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!signature || !secret) {
      return NextResponse.json(
        { error: "Missing security credentials" },
        { status: 401 },
      );
    }

    // 3. Re-hash the raw body using HMAC SHA512 to verify authenticity
    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.error("⚠️ Unauthorized webhook attempt: Signature mismatch.");
      return NextResponse.json(
        { error: "Invalid signature token" },
        { status: 401 },
      );
    }

    // 4. Safe to parse the verified payload
    const event = JSON.parse(rawBody);

    // We only care about successful payment operations
    if (event.event === "charge.success") {
      const transactionData = event.data;

      const parsed = parsePaystackMetadata(transactionData.metadata);
      const userId = parsed.userId;
      const courseId = parsed.courseId;
      const amountPaid = transactionData.amount / 100;
      const paystackRef = transactionData.reference as string | undefined;

      if (!userId || !courseId) {
        console.error(
          "❌ Webhook missing metadata. Raw metadata:",
          JSON.stringify(transactionData.metadata),
        );
        return NextResponse.json(
          { error: "Incomplete transaction metadata" },
          { status: 400 },
        );
      }

      if (!paystackRef) {
        console.error("❌ Webhook missing payment reference.");
        return NextResponse.json(
          { error: "Missing payment reference" },
          { status: 400 },
        );
      }

      const adminClient = createAdminClient();

      // CRITICAL-02 FIX: Validate payment amount against catalog price.
      // Prevents underpayment attacks where attacker initiates a ₦1 payment
      // with a real course_id in metadata to unlock premium content.
      const { data: course } = await adminClient
        .from("courses")
        .select("price")
        .eq("id", courseId)
        .maybeSingle();

      if (course && Number(course.price) > 0) {
        // Use a conservative floor rate to account for exchange rate fluctuation.
        // This ensures we don't reject legitimate payments due to rate changes.
        // Minimum rate: 1 USD = 1400 NGN (very conservative floor)
        const EXCHANGE_RATE_FLOOR = Number(
          process.env.EXCHANGE_RATE_FLOOR ?? 1400,
        );
        const minExpectedKobo = Math.floor(
          Number(course.price) * EXCHANGE_RATE_FLOOR * 100,
        );

        if (transactionData.amount < minExpectedKobo) {
          console.error(
            `⚠️ Underpayment attempt detected! Received ${transactionData.amount} kobo for course priced at $${course.price} (minimum expected: ${minExpectedKobo} kobo).`,
          );
          return NextResponse.json(
            { error: "Insufficient payment amount" },
            { status: 400 },
          );
        }
      }

      // 5. Idempotency check — if this ref was already processed, skip silently.
      //    This handles Paystack retries (same webhook fired 2× due to network issues).
      const { data: existingTx } = await adminClient
        .from("paystack_transactions")
        .select("id")
        .eq("paystack_ref", paystackRef)
        .maybeSingle();

      if (existingTx) {
        console.log(
          `⏭️ Duplicate webhook for ref ${paystackRef} — already processed, skipping.`,
        );
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // 6. Record this transaction (UNIQUE on paystack_ref guards against race conditions)
      const { error: txError } = await adminClient
        .from("paystack_transactions")
        .insert({
          paystack_ref: paystackRef,
          user_id: userId,
          course_id: courseId,
          amount: amountPaid,
          status: "paid",
        });

      if (txError) {
        // If the insert fails due to UNIQUE violation (race condition on concurrent delivery),
        // it means another request already processed this ref — return 200.
        if (txError.code === "23505") {
          console.log(
            `⏭️ Race-condition duplicate for ref ${paystackRef} — skipping.`,
          );
          return NextResponse.json({ received: true }, { status: 200 });
        }
        console.error("❌ Failed to record transaction:", txError.message);
        return NextResponse.json(
          { error: "Transaction recording failed" },
          { status: 500 },
        );
      }

      // 7. Fulfill the enrollment (upsert — idempotent on user_id + course_id)
      try {
        await fulfillPaidEnrollment(
          {
            userId,
            courseId,
            amountPaid,
            paystack_ref: paystackRef,
            payment_gateway: "paystack",
          },
          adminClient,
        );
      } catch (fulfillError) {
        const message =
          fulfillError instanceof Error
            ? fulfillError.message
            : "Enrollment provisioning failed";
        console.error("❌ Database error writing fulfillment record:", message);
        return NextResponse.json(
          { error: "Database provisioning failed" },
          { status: 500 },
        );
      }

      console.log(
        `✅ Course ${courseId} unlocked for Student ${userId} (ref: ${paystackRef})`,
      );
    }

    // Paystack expects a clean 200 OK within 5 seconds to acknowledge delivery
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Webhook runtime crash:", message);
    return NextResponse.json(
      { error: "Internal pipeline error" },
      { status: 500 },
    );
  }
}
