"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";

import { useActionStateToast } from "@/app/_components/useActionStateToast";
import {
  signInAction,
  signUpAction,
  type AuthActionState,
} from "@/src/lib/services/auth-service";

type AuthMode = "login" | "signup";

type PasswordAuthFormProps = {
  mode: AuthMode;
  nextPath: string;
};

const initialState: AuthActionState = {};

const inputClassName =
  "mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-[#003366] focus:outline-none focus:ring-1 focus:ring-[#003366]";

export function PasswordAuthForm({ mode, nextPath }: PasswordAuthFormProps) {
  const action = mode === "signup" ? signUpAction : signInAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  useActionStateToast(state);

  const heading = mode === "signup" ? "Create your account" : "Welcome back";
  const subheading =
    mode === "signup"
      ? "Join ASCS and start your Customer Success journey."
      : "Sign in to access your courses and progress.";

  return (
    <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-[#FBF8EE] p-8 shadow-sm">
      <AuthHeader heading={heading} subheading={subheading} />

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={nextPath} />

        {mode === "signup" ? (
          <AuthField
            id="fullName"
            label="Full name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="Ada Lovelace"
          />
        ) : null}

        <AuthField
          id="email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700"
            >
              Password
            </label>
            {mode === "login" ? (
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#003366] underline-offset-2 hover:underline"
              >
                Forgot password?
              </Link>
            ) : null}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            required
            minLength={8}
            className={inputClassName}
            placeholder={
              mode === "signup" ? "At least 8 characters" : "••••••••"
            }
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-[#FFCC00] px-4 py-2.5 text-sm font-semibold text-[#003366] shadow-sm transition hover:bg-[#e6b800] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {pending
            ? mode === "signup"
              ? "Creating account…"
              : "Signing in…"
            : mode === "signup"
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link
              href={`/signup?next=${encodeURIComponent(nextPath)}`}
              className="font-medium text-[#003366] underline-offset-2 hover:underline"
            >
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(nextPath)}`}
              className="font-medium text-[#003366] underline-offset-2 hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </p>

      <Link
        href="/"
        className="mt-4 block text-center text-sm font-medium text-[#003366] underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}

function AuthHeader({
  heading,
  subheading,
}: {
  heading: string;
  subheading: string;
}) {
  return (
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
      <h1 className="text-2xl font-semibold text-[#003366]">{heading}</h1>
      <p className="mt-2 text-sm text-neutral-600">{subheading}</p>
    </div>
  );
}

function AuthField({
  id,
  label,
  name,
  type,
  autoComplete,
  required,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-neutral-700"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className={inputClassName}
        placeholder={placeholder}
      />
    </div>
  );
}
