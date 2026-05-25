"use client";

import { useEffect, useRef } from "react";

import { notifyError, notifySuccess } from "@/lib/toast";

type ToastableState = {
  error?: string;
  success?: string;
};

export function useActionStateToast(state: ToastableState) {
  const lastFingerprint = useRef<string | null>(null);

  useEffect(() => {
    if (state.error) {
      const fingerprint = `error:${state.error}`;
      if (lastFingerprint.current === fingerprint) return;
      lastFingerprint.current = fingerprint;
      notifyError(state.error);
      return;
    }

    if (state.success) {
      const fingerprint = `success:${state.success}`;
      if (lastFingerprint.current === fingerprint) return;
      lastFingerprint.current = fingerprint;
      notifySuccess(state.success);
    }
  }, [state.error, state.success]);
}
