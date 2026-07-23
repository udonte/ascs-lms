"use client";

import { useActionState, useEffect, useState } from "react";
import {
  HiOutlineBadgeCheck,
  HiOutlineSearch,
  HiOutlineXCircle,
  HiX,
} from "react-icons/hi";

import { Modal } from "@/app/_components/Modal";
import {
  verifyCertificateAction,
  type VerifyActionState,
} from "@/lib/services/admin/certificates/certificate-verify-actions";

const initialState: VerifyActionState = {};

export function VerifyCertificateModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    verifyCertificateAction,
    initialState,
  );

  // Reset state when modal closes
  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-customer-teal bg-white px-4 py-2.5 text-sm font-semibold text-customer-teal shadow-sm transition hover:bg-customer-teal/5"
      >
        <HiOutlineBadgeCheck className="h-4 w-4" aria-hidden />
        Verify Student Certificate
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        title="Verify Certificate"
        description="Enter an ASCS certificate number to confirm its authenticity."
        size="lg"
      >
        <div className="space-y-5">
          {/* Input form */}
          <form action={formAction} className="space-y-3">
            <div>
              <label
                htmlFor="cert-number"
                className="block text-sm font-medium text-customer-charcoal"
              >
                Certificate Number
              </label>
              <input
                id="cert-number"
                name="certificateNumber"
                type="text"
                required
                placeholder="e.g. ASCS-STC-0001"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 font-mono text-sm uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal focus:border-customer-teal focus:outline-none focus:ring-1 focus:ring-customer-teal"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Format: ASCS-[COURSE INITIALS]-[NUMBER] · e.g. ASCS-STC-0001
              </p>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-customer-teal px-4 py-2.5 text-sm font-semibold text-customer-cream transition hover:bg-customer-teal/90 disabled:opacity-60"
            >
              <HiOutlineSearch className="h-4 w-4" aria-hidden />
              {pending ? "Verifying…" : "Verify"}
            </button>
          </form>

          {/* Error */}
          {state.error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <HiOutlineXCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          {/* Result */}
          {state.result && (
            <>
              {state.result.found ? (
                <div className="overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50">
                  <div className="flex items-center gap-3 border-b border-emerald-200 bg-emerald-100 px-4 py-3">
                    <HiOutlineBadgeCheck className="h-5 w-5 text-emerald-700" />
                    <p className="text-sm font-semibold text-emerald-800">
                      ✅ Certificate verified — authentic
                    </p>
                  </div>
                  <dl className="divide-y divide-emerald-100 px-4 py-3 text-sm">
                    <div className="flex justify-between py-2">
                      <dt className="font-medium text-neutral-600">
                        Certificate No.
                      </dt>
                      <dd className="font-mono font-semibold text-customer-charcoal">
                        {state.result.certificateNumber}
                      </dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="font-medium text-neutral-600">Student</dt>
                      <dd className="text-customer-charcoal">
                        {state.result.studentName}
                      </dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="font-medium text-neutral-600">Email</dt>
                      <dd className="text-customer-charcoal">
                        {state.result.studentEmail}
                      </dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="font-medium text-neutral-600">Course</dt>
                      <dd className="text-customer-charcoal">
                        {state.result.courseTitle}
                      </dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="font-medium text-neutral-600">
                        Issued on
                      </dt>
                      <dd className="text-customer-charcoal">
                        {state.result.issuedAt}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                  <HiX className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <div>
                    <p className="font-semibold">Certificate not found</p>
                    <p className="mt-1 text-amber-700">
                      No ASCS certificate matches that number. Check for typos
                      or contact support if you believe this is an error.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
