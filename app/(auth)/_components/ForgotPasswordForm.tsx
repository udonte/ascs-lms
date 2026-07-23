"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";

import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  requestPasswordResetAction,
  type AuthActionState,
} from "@/lib/services/auth-service";

const initialState: AuthActionState = {};

const inputClassName =
  "mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-base sm:text-sm shadow-sm focus:border-[#003366] focus:outline-none focus:ring-1 focus:ring-[#003366]";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );
  useActionStateToast(state);

  return (
    <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-[#FBF8EE] p-8 shadow-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <Link href="/" className="mb-4 inline-block">
          <Image
            src="/assets/ascs-logo.png"
            alt="African School of Customer Success"
            width={140}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <h1 className="text-2xl font-semibold text-[#003366]">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          {state.success
            ? "Check your email for a reset link."
            : "Enter your email and we will send you a link to choose a new password."}
        </p>
      </div>

      {/* ── Success state — show confirmation, hide form ──────────────────── */}
      {state.success ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
            <p className="text-sm font-medium text-emerald-800">
              ✉️ Reset link sent!
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              If an account exists for that email, you'll receive a password
              reset link shortly. Check your spam folder if you don't see it
              within a few minutes.
            </p>
          </div>

          <Link
            href="/login"
            className="block w-full rounded-md bg-[#003366] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#004080]"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        /* ── Email form ──────────────────────────────────────────────────── */
        <>
          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClassName}
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-md bg-[#FFCC00] px-4 py-2.5 text-sm font-semibold text-[#003366] shadow-sm transition hover:bg-[#e6b800] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {pending ? "Sending…" : "Send reset link"}
            </button>
          </form>

          <Link
            href="/login"
            className="mt-6 block text-center text-sm font-medium text-[#003366] underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </>
      )}
    </div>
  );
}
