import { createClient } from "@/lib/supabase/server";

/**
 * Fetches all completed courses where the student has viewed 100% of the lessons.
 */

export const CertificateService = {
  async getEarnedCertificates() {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    // 1. Get all the student's paid courses
    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select(
        `
      course_id,
      course:courses (
        id,
        title,
        lessons (id)
      )
    `,
      )
      .eq("user_id", user.id)
      .eq("status", "paid");

    if (enrollError || !enrollments) return [];

    // 2. Get all completed lessons for this user
    const { data: progress } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id);

    const completedLessonIds = new Set(progress?.map((p) => p.lesson_id) || []);

    // 2b. Get any passed quiz attempts for this user (one per course)
    const { data: attempts } = await supabase
      .from("quiz_attempts")
      .select("course_id, passed")
      .eq("user_id", user.id);

    const passedQuizCourseIds = new Set(
      (attempts ?? []).filter((a) => a.passed).map((a) => a.course_id),
    );

    // 2c. Identify which courses have a quiz configured
    const courseIds = (enrollments ?? []).map((e: any) => e.course_id);
    const { data: quizzes } = await supabase
      .from("quizzes")
      .select("course_id")
      .in("course_id", courseIds);

    const coursesWithQuiz = new Set((quizzes ?? []).map((q) => q.course_id));
    const earnedCertificates = [];

    // 3. Loop through courses and check if every single lesson ID is marked complete
    for (const enrollment of enrollments) {
      const course = enrollment.course as any;
      if (!course || !course.lessons || course.lessons.length === 0) continue;

      const totalLessons = course.lessons.length;
      const completedCount = course.lessons.filter((lesson: any) =>
        completedLessonIds.has(lesson.id),
      ).length;

      const hasQuiz = coursesWithQuiz.has(enrollment.course_id);
      const quizPassed = !hasQuiz || passedQuizCourseIds.has(enrollment.course_id);

      // If completion rate is 100% AND (quiz passed if applicable), they earned the certificate
      if (completedCount === totalLessons && quizPassed) {
        earnedCertificates.push({
          id: enrollment.course_id,
          courseTitle: course.title,
          completedAt: new Date().toLocaleDateString("en-NG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          certificateId: `ASCS-${enrollment.course_id.slice(0, 8).toUpperCase()}`,
        });
      }
    }

    return earnedCertificates;
  },
};
