import { createClient } from "@/lib/supabase/server";

type CourseLessonRow = { id: string; order_index: number };

type EnrolledCourseJoin = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  lessons: CourseLessonRow | CourseLessonRow[] | null;
};

type EnrollmentRow = {
  id: string;
  status: string;
  course: EnrolledCourseJoin | EnrolledCourseJoin[] | null;
};

export type EnrolledCourse = {
  enrollmentId: string;
  courseId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  firstLessonId: string | null;
  progressPercent: number; // 0..100
  totalLessons: number;
  completedLessons: number;
  hasQuiz: boolean;
  quizAttempt: null | { score: number; passed: boolean };
};

export type CatalogCourse = {
  id: string;
  instructorId: string;
  title: string;
  description: string | null;
  price: number;
  thumbnailUrl: string | null;
  isEnrolled: boolean;
  /** Null when the course has no slug set yet — View Details link is hidden. */
  slug: string | null;
};

function parsePrice(value: number | string | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatCatalogPrice(price: number): string {
  if (price <= 0) return "FREE";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function embedOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function getFirstLessonId(
  lessons: CourseLessonRow | CourseLessonRow[] | null | undefined,
): string | null {
  if (!lessons) return null;
  const rows = Array.isArray(lessons) ? lessons : [lessons];
  if (rows.length === 0) return null;

  const sorted = [...rows].sort((a, b) => a.order_index - b.order_index);
  return sorted[0]?.id ?? null;
}

/** Curated Unsplash images when a course has no thumbnail (stable per course id). */
const UNSPLASH_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=500&fit=crop",
] as const;

export function getCourseThumbnailUrl(
  courseId: string,
  thumbnailUrl: string | null,
): string {
  if (thumbnailUrl?.trim()) return thumbnailUrl.trim();

  const index =
    courseId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    UNSPLASH_PLACEHOLDERS.length;

  return UNSPLASH_PLACEHOLDERS[index];
}

export function truncateDescription(
  description: string | null,
  maxLength = 120,
): string {
  if (!description?.trim()) {
    return "Continue your Customer Success journey with this mastercourse.";
  }

  const text = description.trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/**
 * STUDENT DASHBOARD SERVICE
 * Fetches data specifically for the logged-in student's portal view.
 */
export const StudentDashboardService = {
  async getStudentDisplayName(): Promise<string> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return "Student";

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    const name = profile?.full_name?.trim();
    if (name) return name.split(" ")[0] ?? name;

    return user.email?.split("@")[0] ?? "Student";
  },

  /**
   * Fetches all courses where the student has a 'paid' status in enrollments.
   */
  async getEnrolledCourses(): Promise<EnrolledCourse[]> {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        id,
        status,
        course:courses (
          id,
          title,
          description,
          thumbnail_url
        )
      `,
      )
      .eq("user_id", user.id)
      .eq("status", "paid")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching enrolled courses:", error.message);
      return [];
    }

    const courseIds = (data ?? [])
      .map((row: any) => embedOne(row.course)?.id)
      .filter((id: unknown): id is string => typeof id === "string" && Boolean(id));

    const [lessonsRes, progressRes, quizzesRes, attemptsRes] = await Promise.all([
      supabase
        .from("lessons")
        .select("id, course_id")
        .in("course_id", courseIds),
      supabase.from("user_progress").select("lesson_id").eq("user_id", user.id),
      supabase.from("quizzes").select("course_id").in("course_id", courseIds),
      supabase
        .from("quiz_attempts")
        .select("course_id, score, passed")
        .eq("user_id", user.id)
        .in("course_id", courseIds),
    ]);

    const lessons = (lessonsRes.data ?? []) as Array<{ id: string; course_id: string }>;
    const progressLessonIds = new Set(
      (progressRes.data ?? []).map((p: any) => p.lesson_id),
    );

    const totalLessonsByCourse = new Map<string, number>();
    const completedLessonsByCourse = new Map<string, number>();
    const lessonToCourse = new Map<string, string>();

    for (const lesson of lessons) {
      lessonToCourse.set(lesson.id, lesson.course_id);
      totalLessonsByCourse.set(
        lesson.course_id,
        (totalLessonsByCourse.get(lesson.course_id) ?? 0) + 1,
      );
    }

    for (const lessonId of progressLessonIds) {
      const courseId = lessonToCourse.get(lessonId);
      if (!courseId) continue;
      completedLessonsByCourse.set(
        courseId,
        (completedLessonsByCourse.get(courseId) ?? 0) + 1,
      );
    }

    const coursesWithQuiz = new Set((quizzesRes.data ?? []).map((q: any) => q.course_id));
    const attemptByCourse = new Map<string, { score: number; passed: boolean }>();
    for (const attempt of attemptsRes.data ?? []) {
      attemptByCourse.set(attempt.course_id, {
        score: attempt.score,
        passed: attempt.passed,
      });
    }

    const enrolled: EnrolledCourse[] = [];

    for (const enrollment of data as EnrollmentRow[]) {
      const course = embedOne(enrollment.course);
      if (!course) continue;

      const totalLessons = totalLessonsByCourse.get(course.id) ?? 0;
      const completedLessons = completedLessonsByCourse.get(course.id) ?? 0;
      const progressPercent =
        totalLessons > 0
          ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
          : 0;

      const hasQuiz = coursesWithQuiz.has(course.id);
      const quizAttempt = attemptByCourse.get(course.id) ?? null;

      enrolled.push({
        enrollmentId: enrollment.id,
        courseId: course.id,
        title: course.title,
        description: course.description,
        thumbnailUrl: course.thumbnail_url,
        firstLessonId: null,
        progressPercent,
        totalLessons,
        completedLessons,
        hasQuiz,
        quizAttempt,
      });
    }

    return enrolled;
  },

  /**
   * Fetches all published courses with an enrollment flag for the signed-in student.
   */
  async getCourseCatalog(): Promise<CatalogCourse[]> {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: courses, error: courseError } = await supabase
      .from("courses")
      .select(
        "id, instructor_id, title, description, price, thumbnail_url, is_published, slug",
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (courseError) {
      console.error("Error fetching catalog:", courseError.message);
      return [];
    }

    let enrolledCourseIds = new Set<string>();

    if (user) {
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user.id)
        .eq("status", "paid");

      enrolledCourseIds = new Set(
        enrollments?.map((enrollment) => enrollment.course_id) ?? [],
      );
    }

    return (courses ?? []).map((course) => ({
      id: course.id,
      instructorId: course.instructor_id,
      title: course.title,
      description: course.description,
      price: parsePrice(course.price),
      thumbnailUrl: course.thumbnail_url,
      isEnrolled: enrolledCourseIds.has(course.id),
      slug: (course as any).slug ?? null,
    }));
  },

  /**
   * Checks whether a course has a quiz configured (Final Assessment).
   */
  async hasCourseQuiz(courseId: string): Promise<boolean> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("quizzes")
      .select("course_id")
      .eq("course_id", courseId)
      .maybeSingle();

    if (error || !data) return false;
    return true;
  },

  /**
   * Submits student quiz selections for grading + persistence.
   * The server grades using stored correct answers and logs into quiz_attempts.
   */
  async submitCourseQuiz(courseId: string, selections: Record<string, number>) {
    const { StudentCourseService } = await import("../../student-course-service");
    return await StudentCourseService.submitQuizScore(courseId, selections);
  },
};
