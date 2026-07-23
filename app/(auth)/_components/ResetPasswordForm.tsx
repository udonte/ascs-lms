"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";

import { useActionStateToast } from "@/app/_components/useActionStateToast";
import { PasswordInput } from "./PasswordInput";
import {
  updatePasswordAction,
  type AuthActionState,
} from "@/lib/services/auth-service";

const initialState: AuthActionState = {};

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
        <PasswordInput
          id="password"
          name="password"
          label="New password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your password"
        />

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
