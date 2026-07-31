"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/**
 * Records that the authenticated student has agreed to the course contract.
 * Sets contract_agreed_at = NOW() on their enrollment row.
 * Idempotent — safe to call if already agreed (does nothing).
 */
export async function agreeToContract(courseId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to agree to the course contract.");
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("enrollments")
    .update({ contract_agreed_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .eq("status", "paid")
    .is("contract_agreed_at", null); // idempotent — only updates if not already set

  if (error) {
    throw new Error(`Failed to record contract agreement: ${error.message}`);
  }

  revalidatePath(`/dashboard/courses/${courseId}`);
}
