"use client";

import { startTransition, useActionState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineLockClosed } from "react-icons/hi";
import { FaGlobe, FaCreditCard } from "react-icons/fa";

import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  grantFreeEnrollmentAction,
  initiatePaystackCheckoutAction,
  initiateLemonSqueezyCheckoutAction,
  type CheckoutActionState,
} from "@/lib/services/payments/checkout-actions";
import type { CheckoutPreview } from "@/lib/services/payments/checkout-service";

const initialState: CheckoutActionState = {};

type CheckoutPanelProps = {
  preview: CheckoutPreview;
};

export function CheckoutPanel({ preview }: CheckoutPanelProps) {
  // Paystack action state
  const [paystackState, paystackFormAction, paystackPending] = useActionState(
    initiatePaystackCheckoutAction,
    initialState,
  );

  // Lemon Squeezy action state
  const [lsState, lsFormAction, lsPending] = useActionState(
    initiateLemonSqueezyCheckoutAction,
    initialState,
  );

  // Show errors from either gateway as a toast
  useActionStateToast({ error: paystackState.error ?? lsState.error });

  // Redirect to Paystack hosted page
  useEffect(() => {
    if (paystackState.authorizationUrl) {
      window.location.href = paystackState.authorizationUrl;
    }
  }, [paystackState.authorizationUrl]);

  // Redirect to Lemon Squeezy hosted checkout
  useEffect(() => {
    if (lsState.checkoutUrl) {
      window.location.href = lsState.checkoutUrl;
    }
  }, [lsState.checkoutUrl]);

  const isPending = paystackPending || lsPending;

  // ── Already enrolled ────────────────────────────────────────────────────────
  if (preview.isEnrolled) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-semibold text-emerald-800">
          You already have access to this course.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex rounded-lg bg-customer-teal px-5 py-2.5 text-sm font-semibold text-customer-cream"
        >
          Go to My Courses
        </Link>
      </div>
    );
  }

  // ── Free course ─────────────────────────────────────────────────────────────
  if (preview.isFree) {
    return (
      <form action={grantFreeEnrollmentAction.bind(null, preview.courseId)}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-customer-teal py-3.5 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90"
        >
          Unlock Free Access
        </button>
      </form>
    );
  }

  // ── Paid course — dual gateway ───────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Info strip */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        <p className="font-medium text-neutral-700">
          Choose your payment method
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Charging: <span className="font-medium">{preview.studentEmail}</span>
        </p>
      </div>

      {/* ── Option 1: Paystack (NGN) ─────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
          <FaCreditCard className="text-[#00C3F7] text-lg" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-customer-charcoal">
              Pay in Naira · Paystack
            </p>
            <p className="text-xs text-neutral-500">
              Nigerian cards, bank transfer, USSD
            </p>
          </div>
          <span className="ml-auto rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            🇳🇬 NGN
          </span>
        </div>
        <div className="px-4 py-3">
          <form
            action={(formData) =>
              startTransition(() => paystackFormAction(formData))
            }
          >
            <input type="hidden" name="courseId" value={preview.courseId} />
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-customer-teal py-3 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HiOutlineLockClosed className="h-4 w-4" aria-hidden />
              {paystackPending
                ? "Redirecting to Paystack…"
                : `Pay ${preview.priceLabel} with Paystack`}
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-neutral-200" />
        <span className="text-xs font-medium text-neutral-400">or</span>
        <div className="flex-1 border-t border-neutral-200" />
      </div>

      {/* ── Option 2: Lemon Squeezy (USD / International) ───────────────────── */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
          <FaGlobe className="text-[#FFC107] text-lg" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-customer-charcoal">
              Pay in USD · International
            </p>
            <p className="text-xs text-neutral-500">
              Credit/debit cards · Global payments
            </p>
          </div>
          <span className="ml-auto rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            🌍 USD
          </span>
        </div>
        <div className="px-4 py-3">
          <form
            action={(formData) => startTransition(() => lsFormAction(formData))}
          >
            <input type="hidden" name="courseId" value={preview.courseId} />
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-customer-teal bg-white py-3 text-sm font-semibold text-customer-teal shadow-sm transition hover:bg-customer-teal/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HiOutlineLockClosed className="h-4 w-4" aria-hidden />
              {lsPending
                ? "Redirecting to checkout…"
                : "Pay in USD · International Card"}
            </button>
          </form>
        </div>
      </div>

      <p className="text-center text-xs text-neutral-400">
        🔒 Secure payment · Access granted immediately after payment
      </p>
    </div>
  );
}
