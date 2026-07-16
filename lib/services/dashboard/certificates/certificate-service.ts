import { createClient } from "@/lib/supabase/server";

/**
 * Fetches all certificates the student has earned.
 * Certificate numbers and issue dates are read from the `certificates` table
 * (populated by generate_certificate() Postgres function on course completion).
 * Falls back gracefully for courses completed before the certificates table existed.
 */
export const CertificateService = {
  async getEarnedCertificates() {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    // 1. Paid enrollments with course + lessons
    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select(
        `
        course_id,
        completed_at,
        course:courses (
          id,
          title,
          lessons (id)
        )
      `,
      )
      .eq("user_id", user.id)
      .eq("status", "paid");

    if (enrollError || !enrollments || enrollments.length === 0) return [];

    // 2. Completed lesson IDs
    const { data: progress } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id);

    const completedLessonIds = new Set(
      (progress ?? []).map((p) => p.lesson_id),
    );

    // 3. Passed quiz attempts
    const courseIds = enrollments.map((e: any) => e.course_id);

    const { data: attempts } = await supabase
      .from("quiz_attempts")
      .select("course_id, passed")
      .eq("user_id", user.id)
      .in("course_id", courseIds);

    const passedQuizCourseIds = new Set(
      (attempts ?? []).filter((a) => a.passed).map((a) => a.course_id),
    );

    // 4. Which courses have a quiz
    const { data: quizzes } = await supabase
      .from("quizzes")
      .select("course_id")
      .in("course_id", courseIds);

    const coursesWithQuiz = new Set((quizzes ?? []).map((q) => q.course_id));

    // 5. Issued certificates (the source of truth for cert numbers + dates)
    const { data: issuedCerts } = await supabase
      .from("certificates")
      .select("course_id, certificate_number, issued_at")
      .eq("user_id", user.id);

    const certByCourse = new Map(
      (issuedCerts ?? []).map((c) => [c.course_id, c]),
    );

    const earned = [];

    for (const enrollment of enrollments) {
      const course = enrollment.course as any;
      if (!course?.lessons?.length) continue;

      const allLessonsComplete = course.lessons.every((l: any) =>
        completedLessonIds.has(l.id),
      );

      const hasQuiz = coursesWithQuiz.has(enrollment.course_id);
      const quizPassed =
        !hasQuiz || passedQuizCourseIds.has(enrollment.course_id);

      if (!allLessonsComplete || !quizPassed) continue;

      // Prefer real certificate record; fall back for legacy completions
      const issued = certByCourse.get(enrollment.course_id);

      const certificateId =
        issued?.certificate_number ??
        `ASCS-${enrollment.course_id.slice(0, 8).toUpperCase()}`;

      const rawDate =
        issued?.issued_at ?? (enrollment as any).completed_at ?? null;

      const completedAt = rawDate
        ? new Date(rawDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Date unavailable";

      earned.push({
        id: enrollment.course_id,
        courseTitle: course.title,
        completedAt,
        certificateId,
      });
    }

    return earned;
  },
};
