"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { notifyError, notifySuccess } from "@/lib/toast";

const errorCopy: Record<string, string> = {
  missing_code: "That sign-in link is incomplete. Request a new link below.",
  missing_env: "Server configuration error. Please contact support.",
  auth_callback: "We could not complete sign-in. Try again or request a new link.",
};

export function AuthQueryToasts() {
  const searchParams = useSearchParams();
  const shown = useRef<string | null>(null);

  useEffect(() => {
    const message = searchParams.get("message");
    const error = searchParams.get("error");
    const confirmed = searchParams.get("confirmed");

    let text: string | null = null;
    let type: "error" | "success" = "error";

    if (message) {
      text = message;
      type = "error";
    } else if (error) {
      text = errorCopy[error] ?? "Something went wrong. Please try again.";
      type = "error";
    } else if (confirmed === "1") {
      text = "Email confirmed. You can sign in now.";
      type = "success";
    }

    if (!text) return;

    const fingerprint = `${type}:${text}`;
    if (shown.current === fingerprint) return;
    shown.current = fingerprint;

    if (type === "success") {
      notifySuccess(text);
    } else {
      notifyError(text);
    }
  }, [searchParams]);

  return null;
}
