import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Generates and issues a certificate for a student who completed a course.
 *
 * Delegates to the `generate_certificate` Postgres function which:
 *  - Uses SELECT...FOR UPDATE to atomically claim the next sequence number
 *  - Inserts into the certificates table
 *  - Is idempotent (calling twice returns the same certificate number)
 *
 * @returns Certificate number e.g. "ASCS-STC-0001", or null on failure.
 */
export async function generateAndIssueCertificate(
  userId: string,
  courseId: string,
): Promise<string | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("generate_certificate", {
    p_user_id: userId,
    p_course_id: courseId,
  });

  if (error) {
    console.error(
      `Certificate generation failed — user=${userId} course=${courseId}: ${error.message}`,
    );
    return null;
  }

  const certNumber = data as string;
  console.log(`✅ Certificate issued: ${certNumber} for user=${userId}`);
  return certNumber;
}
