import type { SupabaseClient } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/supabase/admin";

export type FulfillEnrollmentInput = {
  userId: string;
  courseId: string;
  amountPaid: number;
  paystack_ref?: string | null;
};

/**
 * Paystack may return flat metadata or custom_fields depending on channel.
 */
export function parsePaystackMetadata(metadata: unknown): {
  userId?: string;
  courseId?: string;
} {
  if (!metadata || typeof metadata !== "object") return {};

  const record = metadata as Record<string, unknown>;

  if (
    typeof record.user_id === "string" &&
    typeof record.course_id === "string"
  ) {
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
 * Writes a paid enrollment using the service role client (bypasses RLS).
 * The upsert is atomic — safe against duplicate webhook deliveries firing concurrently.
 * Relies on the UNIQUE(user_id, course_id) constraint added in migration
 * 20260701000000_enrollments_unique_constraint.sql
 */
export async function fulfillPaidEnrollment(
  input: FulfillEnrollmentInput,
  client?: SupabaseClient,
): Promise<void> {
  const supabase = client ?? createAdminClient();

  const { error } = await supabase.from("enrollments").upsert(
    {
      user_id: input.userId,
      course_id: input.courseId,
      status: "paid" as const,
      amount_paid: input.amountPaid,
      paystack_ref: input.paystack_ref,
    },
    { onConflict: "user_id,course_id" },
  );

  if (error) {
    throw new Error(`Enrollment failed: ${error.message}`);
  }

  console.log(
    `Enrollment fulfilled: user=${input.userId} course=${input.courseId} amount=${input.amountPaid}`,
  );
}
