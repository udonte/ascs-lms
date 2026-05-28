import type { SupabaseClient } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/supabase/admin";

export type FulfillEnrollmentInput = {
  userId: string;
  courseId: string;
  amountPaid: number;
  paymentReference?: string | null;
};

/**
 * Paystack may return flat metadata or custom_fields depending on channel.
 */
export function parsePaystackMetadata(
  metadata: unknown,
): { userId?: string; courseId?: string } {
  if (!metadata || typeof metadata !== "object") return {};

  const record = metadata as Record<string, unknown>;

  if (typeof record.user_id === "string" && typeof record.course_id === "string") {
    return { userId: record.user_id, courseId: record.course_id };
  }

  const customFields = record.custom_fields;
  if (!Array.isArray(customFields)) return {};

  let userId: string | undefined;
  let courseId: string | undefined;

  for (const field of customFields) {
    if (!field || typeof field !== "object") continue;
    const row = field as Record<string, unknown>;
    const key = String(row.variable_name ?? row.display_name ?? "");
    const value = row.value != null ? String(row.value) : "";

    if (key === "user_id") userId = value;
    if (key === "course_id") courseId = value;
  }

  return { userId, courseId };
}

/**
 * Writes a paid enrollment using the service role.
 * Uses update-or-insert (no upsert onConflict) so it works without a composite unique index.
 */
export async function fulfillPaidEnrollment(
  input: FulfillEnrollmentInput,
  client?: SupabaseClient,
): Promise<void> {
  const supabase = client ?? createAdminClient();

  const baseRow = {
    user_id: input.userId,
    course_id: input.courseId,
    status: "paid" as const,
    amount_paid: input.amountPaid,
  };

  const { data: existing, error: selectError } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", input.userId)
    .eq("course_id", input.courseId)
    .maybeSingle();

  if (selectError) {
    throw new Error(`Enrollment lookup failed: ${selectError.message}`);
  }

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from("enrollments")
      .update(baseRow)
      .eq("id", existing.id);

    if (updateError) {
      throw new Error(`Enrollment update failed: ${updateError.message}`);
    }
    return;
  }

  const { error: insertError } = await supabase
    .from("enrollments")
    .insert(baseRow);

  if (insertError) {
    throw new Error(`Enrollment insert failed: ${insertError.message}`);
  }
}
