"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { notifyError, notifySuccess } from "@/lib/toast";
import { updateProfileSettingsAction } from "@/lib/services/dashboard/settings/settings-actions";

type StudentSettingsFormProps = {
  initialFullName: string;
  email: string;
};

export function StudentSettingsForm({
  initialFullName,
  email,
}: StudentSettingsFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [fullName, setFullName] = useState(initialFullName);

  const isDirty = useMemo(
    () => fullName.trim() !== initialFullName.trim(),
    [fullName, initialFullName],
  );

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          try {
            await updateProfileSettingsAction(fullName);
            notifySuccess("Profile updated successfully.");
            router.refresh();
          } catch (error) {
            notifyError(
              error instanceof Error ? error.message : "Failed to update profile.",
            );
          }
        });
      }}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-1">
          <label
            htmlFor="fullName"
            className="text-sm font-semibold text-neutral-800"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-customer-teal focus:ring-4 focus:ring-customer-teal/15"
            placeholder="Your full name"
            autoComplete="name"
          />
        </div>

        <div className="md:col-span-1">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-neutral-800"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            value={email}
            disabled
            className="mt-2 w-full cursor-not-allowed rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 shadow-sm"
            autoComplete="email"
          />
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            Your login email cannot be modified directly. Please contact support
            to request an email update.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={pending || !isDirty}
          className="inline-flex w-full items-center justify-center rounded-xl bg-customer-teal px-6 py-3 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Saving…" : "Save Profile Changes"}
        </button>
      </div>
    </form>
  );
}

