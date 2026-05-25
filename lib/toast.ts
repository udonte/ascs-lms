"use client";

import { toast, type ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/** Run toast after mount — avoids hydration / router init races. */
function scheduleToast(fn: () => void) {
  if (typeof window === "undefined") return;
  window.setTimeout(fn, 0);
}

export function notifySuccess(message: string, options?: ToastOptions) {
  scheduleToast(() => toast.success(message, { ...defaultOptions, ...options }));
}

export function notifyError(message: string, options?: ToastOptions) {
  scheduleToast(() => toast.error(message, { ...defaultOptions, ...options }));
}

export function notifyInfo(message: string, options?: ToastOptions) {
  scheduleToast(() => toast.info(message, { ...defaultOptions, ...options }));
}

export function notifyWarning(message: string, options?: ToastOptions) {
  scheduleToast(() => toast.warning(message, { ...defaultOptions, ...options }));
}
