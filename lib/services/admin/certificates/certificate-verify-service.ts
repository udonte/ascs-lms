import { createAdminClient } from "@/lib/supabase/admin";

export type CertificateVerifyResult =
  | {
      found: true;
      certificateNumber: string;
      studentName: string;
      studentEmail: string;
      courseTitle: string;
      issuedAt: string;
    }
  | { found: false };

/**
 * Looks up a certificate by its number.
 * Uses the admin client so it works for both:
 *  - The admin verification modal (authenticated admin)
 *  - The public /verify/[certificateNumber] page (unauthenticated visitors)
 *
 * Certificate numbers are opaque serials — public read-only is safe.
 */
export async function verifyCertificate(
  rawNumber: string,
): Promise<CertificateVerifyResult> {
  const certificateNumber = rawNumber.toUpperCase().trim();
  if (!certificateNumber) return { found: false };

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("certificates")
    .select(
      `
      certificate_number,
      issued_at,
      profile:profiles!user_id (full_name, email),
      course:courses!course_id (title)
    `,
    )
    .eq("certificate_number", certificateNumber)
    .maybeSingle();

  if (error || !data) return { found: false };

  // PostgREST may return joins as array or object depending on cardinality
  const profile = Array.isArray(data.profile) ? data.profile[0] : data.profile;
  const course = Array.isArray(data.course) ? data.course[0] : data.course;

  return {
    found: true,
    certificateNumber: data.certificate_number,
    studentName: (profile as any)?.full_name?.trim() || "Unknown",
    studentEmail: (profile as any)?.email?.trim() || "Unknown",
    courseTitle: (course as any)?.title?.trim() || "Unknown course",
    issuedAt: new Date(data.issued_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}
