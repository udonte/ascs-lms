"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { notifySuccess } from "@/lib/toast";

export function DashboardQueryToasts() {
  const searchParams = useSearchParams();
  const shown = useRef<string | null>(null);

  useEffect(() => {
    const toast = searchParams.get("toast");
    if (!toast) return;

    const messages: Record<string, string> = {
      welcome: "Welcome! Your account is ready.",
    };

    const text = messages[toast];
    if (!text) return;

    const fingerprint = `toast:${toast}`;
    if (shown.current === fingerprint) return;
    shown.current = fingerprint;

    notifySuccess(text);
  }, [searchParams]);

  return null;
}
