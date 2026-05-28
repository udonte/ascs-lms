"use server";

import { revalidatePath } from "next/cache";

import { LedgerService } from "./ledger-services";

export type GrantManualAccessActionState = {
  error?: string;
  success?: string;
};

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function grantManualAccessAction(
  _prevState: GrantManualAccessActionState,
  formData: FormData,
): Promise<GrantManualAccessActionState> {
  const studentEmail = readField(formData, "studentEmail").toLowerCase();
  const courseId = readField(formData, "courseId");
  const amountRaw = readField(formData, "amountPaid");

  if (!studentEmail) {
    return { error: "Student email is required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
    return { error: "Enter a valid email address." };
  }
  if (!courseId) {
    return { error: "Select a course." };
  }

  const amountPaid = amountRaw === "" ? 0 : Number(amountRaw);
  if (Number.isNaN(amountPaid) || amountPaid < 0) {
    return { error: "Enter a valid amount received." };
  }

  try {
    await LedgerService.grantManualAccess(studentEmail, courseId, amountPaid);
    revalidatePath("/admin/students");
    return { success: "Manual access granted successfully." };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to grant manual access.",
    };
  }
}
