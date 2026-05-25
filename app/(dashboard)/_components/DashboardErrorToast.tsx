"use client";

import { useEffect, useRef } from "react";

import { notifyError } from "@/lib/toast";

type DashboardErrorToastProps = {
  message: string | null;
};

export function DashboardErrorToast({ message }: DashboardErrorToastProps) {
  const lastMessage = useRef<string | null>(null);

  useEffect(() => {
    if (!message || lastMessage.current === message) return;
    if (message.includes("infinite recursion")) return;
    lastMessage.current = message;
    notifyError(message);
  }, [message]);

  return null;
}
