"use client";

import { Modal } from "./Modal";

export type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  /** Danger styles the confirm button for destructive actions (e.g. delete). */
  variant?: "danger" | "default";
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  pending = false,
  variant = "danger",
}: ConfirmDialogProps) {
  const confirmButtonClassName =
    variant === "danger"
      ? "rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      : "rounded-lg bg-customer-teal px-4 py-2 text-sm font-semibold text-customer-cream transition hover:bg-customer-teal/90 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-60 cursor-pointer"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className={confirmButtonClassName}
        >
          {pending ? "Please wait…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
