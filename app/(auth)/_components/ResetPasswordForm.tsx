"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";

import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  updatePasswordAction,
  type AuthActionState,
} from "@/src/lib/services/auth-service";

const initialState: AuthActionState = {};

const inputClassName =
  "mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-[#003366] focus:outline-none focus:ring-1 focus:ring-[#003366]";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePasswordAction,
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
          Choose a new password
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Enter and confirm your new password below.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700"
          >
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={inputClassName}
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-neutral-700"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={inputClassName}
            placeholder="Repeat your password"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-[#FFCC00] px-4 py-2.5 text-sm font-semibold text-[#003366] shadow-sm transition hover:bg-[#e6b800] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Updating…" : "Update password"}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-6 block text-center text-sm font-medium text-[#003366] underline-offset-4 hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  );
}
