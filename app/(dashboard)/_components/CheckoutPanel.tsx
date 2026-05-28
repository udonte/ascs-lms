"use client";

import { startTransition, useActionState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineLockClosed } from "react-icons/hi";

import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  grantFreeEnrollmentAction,
  initiatePaystackCheckoutAction,
  type CheckoutActionState,
} from "@/lib/services/payments/checkout-actions";
import type { CheckoutPreview } from "@/lib/services/payments/checkout-service";

const initialState: CheckoutActionState = {};

type CheckoutPanelProps = {
  preview: CheckoutPreview;
};

export function CheckoutPanel({ preview }: CheckoutPanelProps) {
  const [state, formAction, pending] = useActionState(
    initiatePaystackCheckoutAction,
    initialState,
  );

  useActionStateToast({ error: state.error });

  useEffect(() => {
    if (state.authorizationUrl) {
      window.location.href = state.authorizationUrl;
    }
  }, [state.authorizationUrl]);

  const handlePaystackSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

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

  return (
    <form action={handlePaystackSubmit} className="space-y-4">
      <input type="hidden" name="courseId" value={preview.courseId} />

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        <p>
          You will be redirected to Paystack to complete payment securely. Access
          is granted automatically after confirmation.
        </p>
        <p className="mt-2 text-xs text-neutral-500">
          Charging: <span className="font-medium">{preview.studentEmail}</span>
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-customer-teal py-3.5 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <HiOutlineLockClosed className="h-5 w-5" aria-hidden />
        {pending ? "Redirecting to Paystack…" : "Proceed to Secure Checkout"}
      </button>
    </form>
  );
}
