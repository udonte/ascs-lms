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

      try {
        await fulfillPaidEnrollment(
          {
            userId,
            courseId,
            amountPaid,
            paystack_ref: paystackRef,
          },
          createAdminClient(),
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
        `✅ Course ${courseId} unlocked successfully for Student ${userId}`,
      );
    }

    // Paystack expects a clean 200 OK statement within 2 seconds to close out hooks
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Webhook runtime crash exception handler:", error.message);
    return NextResponse.json(
      { error: "Internal pipeline error" },
      { status: 500 },
    );
  }
}
