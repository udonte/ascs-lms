"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  ensureUserProfile,
  getProfileRole,
  resolvePostAuthPath,
  sanitizeNextPath,
} from "@/lib/services/profile-service";

export type AuthActionState = {
  error?: string;
  success?: string;
};

const MIN_PASSWORD_LENGTH = 8;

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateEmail(email: string): string | null {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export async function signUpAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = readField(formData, "fullName");
  const email = readField(formData, "email").toLowerCase();
  const password = readField(formData, "password");
  const next = sanitizeNextPath(readField(formData, "next"));

  if (!fullName) return { error: "Full name is required." };

  const emailError = validateEmail(email);
  if (emailError) return { error: emailError };

  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  const emailRedirectTo = await buildAuthCallbackUrl(next);
  if (!emailRedirectTo) {
    return {
      error:
        "Site URL is not configured. Set NEXT_PUBLIC_SITE_URL in .env.local.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user && data.session) {
    const profile = await ensureUserProfile(supabase);
    if (profile.error) {
      console.error("[auth-service] signUp ensureUserProfile:", profile.error);
    }

    const role = await getProfileRole(supabase, data.user.id);
    redirect(resolvePostAuthPath(role, next));
  }

  return {
    success:
      "Account created. Check your email to confirm your address, then sign in.",
  };
}

export async function signInAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readField(formData, "email").toLowerCase();
  const password = readField(formData, "password");
  const next = sanitizeNextPath(readField(formData, "next"));

  const emailError = validateEmail(email);
  if (emailError) return { error: emailError };

  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message =
      error.message === "Invalid login credentials"
        ? "Incorrect email or password."
        : error.message;
    return { error: message };
  }

  if (!data.user) {
    return { error: "Sign-in failed. Please try again." };
  }

  const profile = await ensureUserProfile(supabase);
  if (profile.error) {
    console.error("[auth-service] signIn ensureUserProfile:", profile.error);
  }

  const role = await getProfileRole(supabase, data.user.id);
  redirect(resolvePostAuthPath(role, next));
}

export async function requestPasswordResetAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readField(formData, "email").toLowerCase();

  const emailError = validateEmail(email);
  if (emailError) return { error: emailError };

  const siteUrl = await resolveSiteUrl();
  if (!siteUrl) {
    return {
      error:
        "Site URL is not configured. Set NEXT_PUBLIC_SITE_URL in .env.local.",
    };
  }

  const supabase = await createClient();

  // redirectTo is where Supabase sends the user AFTER they click
  // {{ .ConfirmationURL }} in the email. With the token-based flow,
  // Supabase validates the token server-side and then redirects here.
  const redirectTo = `${siteUrl}/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "If an account exists for that email, you will receive a password reset link shortly.",
  };
}

export async function updatePasswordAction(
  _prevState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const password = readField(formData, "password");
  const confirmPassword = readField(formData, "confirmPassword");

  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Your reset session expired. Request a new link." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  const role = await getProfileRole(supabase, user.id);
  redirect(resolvePostAuthPath(role, "/dashboard"));
}

export async function resolveSiteUrl(): Promise<string | null> {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (!host) return null;

  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function buildAuthCallbackUrl(
  next: string,
): Promise<string | null> {
  const siteUrl = await resolveSiteUrl();
  if (!siteUrl) return null;

  const safeNext = encodeURIComponent(sanitizeNextPath(next));
  return `${siteUrl}/auth/callback?next=${safeNext}`;
}
