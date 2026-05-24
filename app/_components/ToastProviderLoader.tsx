"use client";

import dynamic from "next/dynamic";

export const ToastProvider = dynamic(
  () =>
    import("@/app/_components/ToastProvider").then((mod) => mod.ToastProvider),
  { ssr: false },
);
