"use client";

import { startTransition, useActionState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineLockClosed } from "react-icons/hi";
import { FaCreditCard } from "react-icons/fa";

import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  grantFreeEnrollmentAction,
  initiatePaystackCheckoutAction,
  // initiateLemonSqueezyCheckoutAction, // ── Paused: LS account pending verification
  type CheckoutActionState,
} from "@/lib/services/payments/checkout-actions";
import type { CheckoutPreview } from "@/lib/services/payments/checkout-service";

const initialState: CheckoutActionState = {};

type CheckoutPanelProps = {
  preview: CheckoutPreview;
};

export function CheckoutPanel({ preview }: CheckoutPanelProps) {
  const [paystackState, paystackFormAction, paystackPending] = useActionState(
    initiatePaystackCheckoutAction,
    initialState,
  );

  // ── Lemon Squeezy (paused — account pending verification) ──────────────────
  // const [lsState, lsFormAction, lsPending] = useActionState(
  //   initiateLemonSqueezyCheckoutAction,
  //   initialState,
  // );
  // useEffect(() => {
  //   if (lsState.checkoutUrl) window.location.href = lsState.checkoutUrl;
  // }, [lsState.checkoutUrl]);

  useActionStateToast({ error: paystackState.error });

  useEffect(() => {
    if (paystackState.authorizationUrl) {
      window.location.href = paystackState.authorizationUrl;
    }
  }, [paystackState.authorizationUrl]);

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

  // ── Paid course ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Student info strip */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        <p className="text-xs text-neutral-500">
          Charging:{" "}
          <span className="font-medium text-neutral-700">
            {preview.studentEmail}
          </span>
        </p>
      </div>

      {/* ── Paystack (NGN) ──────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
          <FaCreditCard className="text-[#00C3F7] text-lg" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-customer-charcoal">
              Pay with Paystack
            </p>
            <p className="text-xs text-neutral-500">
              Nigerian cards · Bank transfer · USSD
            </p>
          </div>
          <span className="ml-auto rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            🇳🇬 NGN
          </span>
        </div>
        <div className="px-4 py-4">
          {/* Price display — USD listed price + NGN equivalent */}
          <div className="mb-3 flex items-baseline justify-between rounded-lg bg-neutral-50 px-3 py-2.5">
            <span className="text-xs text-neutral-500">Amount</span>
            <div className="text-right">
              <span className="text-base font-bold text-customer-charcoal">
                {preview.ngnPriceLabel}
              </span>
              <span className="ml-2 text-xs text-neutral-400">
                ≈ {preview.priceLabel}
              </span>
            </div>
          </div>

          <form
            action={(formData) =>
              startTransition(() => paystackFormAction(formData))
            }
          >
            <input type="hidden" name="courseId" value={preview.courseId} />
            <button
              type="submit"
              disabled={paystackPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-customer-teal py-3 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HiOutlineLockClosed className="h-4 w-4" aria-hidden />
              {paystackPending
                ? "Redirecting to Paystack…"
                : `Pay ${preview.ngnPriceLabel}`}
            </button>
          </form>
        </div>
      </div>

      {/* ── Lemon Squeezy — commented out until account is verified ────────── */}
      {/*
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-neutral-200" />
        <span className="text-xs font-medium text-neutral-400">or</span>
        <div className="flex-1 border-t border-neutral-200" />
      </div>
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        ...Lemon Squeezy USD option goes here when account is verified...
      </div>
      */}

      <p className="text-center text-xs text-neutral-400">
        🔒 Secure payment · Access granted immediately after payment
      </p>
    </div>
  );
}
