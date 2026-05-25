import { createClient } from "@/lib/supabase/server";

/**
 * Course fields aligned with your Supabase `courses` table
 * (no `school_id` on courses — school is on `profiles.school_id`).
 */
export type DashboardCourse = {
  /** Present when row comes from `listCoursesForDashboardUser`; otherwise null. */
  enrollmentId: string | null;
  courseId: string;
  instructorId: string;
  title: string;
  description: string | null;
  /** Parsed from Postgres `numeric`; Supabase may return string. */
  price: number;
  thumbnailUrl: string | null;
  isPublished: boolean;
};

type CourseJoinRow = {
  id: string;
  instructor_id: string;
  title: string;
  description: string | null;
  price: number | string | null;
  thumbnail_url: string | null;
  is_published: boolean;
};

/** Supabase may type embedded `courses` as an object or a one-element array. */
type EnrollmentCourseRow = {
  id: string;
  status: string;
  courses: CourseJoinRow | CourseJoinRow[] | null;
};

function parsePrice(value: number | string | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function embeddedCourse(
  courses: EnrollmentCourseRow["courses"]
): CourseJoinRow | null {
  if (!courses) return null;
  return Array.isArray(courses) ? (courses[0] ?? null) : courses;
}

function mapRow(row: EnrollmentCourseRow): DashboardCourse | null {
  const c = embeddedCourse(row.courses);
  if (!c) return null;
  return {
    enrollmentId: row.id,
    courseId: c.id,
    instructorId: c.instructor_id,
    title: c.title,
    description: c.description,
    price: parsePrice(c.price),
    thumbnailUrl: c.thumbnail_url,
    isPublished: c.is_published,
  };
}

/**
 * Paid enrollments for the signed-in student, with course metadata.
 * Uses the server Supabase client (RLS applies under the user session).
 */
export async function listCoursesForDashboardUser(userId: string): Promise<{
  courses: DashboardCourse[];
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      status,
      courses (
        id,
        instructor_id,
        title,
        description,
        price,
        thumbnail_url,
        is_published
      )
    `
    )
    .eq("user_id", userId)
    .eq("status", "paid");

  if (error) {
    return { courses: [], error: error.message };
  }

  const rows = (data ?? []) as unknown as EnrollmentCourseRow[];

  const courses = rows
    .map(mapRow)
    .filter((c): c is DashboardCourse => c !== null);

  return { courses, error: null };
}

/**
 * Single published course by id.
 * Use from server code when building course detail / classroom routes.
 */
export async function getPublishedCourseById(
  courseId: string
): Promise<{ course: DashboardCourse | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      instructor_id,
      title,
      description,
      price,
      thumbnail_url,
      is_published
    `
    )
    .eq("id", courseId)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    return { course: null, error: error.message };
  }

  if (!data) {
    return { course: null, error: null };
  }

  const course: DashboardCourse = {
    enrollmentId: null,
    courseId: data.id,
    instructorId: data.instructor_id,
    title: data.title,
    description: data.description,
    price: parsePrice(data.price),
    thumbnailUrl: data.thumbnail_url,
    isPublished: data.is_published,
  };

  return { course, error: null };
}
