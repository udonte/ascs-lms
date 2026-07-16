import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  canAccessAdminRoute,
  getProfileRole,
} from "@/lib/services/profile-service";

export type AdminCourseLessonCount = { count: number };

export type AdminLesson = {
  id: string;
  course_id: string;
  title: string;
  video_url: string | null;
  order_index: number;
  content_body: string | null;
};

export type AdminCourse = {
  id: string;
  instructor_id: string;
  title: string;
  description: string | null;
  price: number | string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;
  lessons: AdminCourseLessonCount | AdminCourseLessonCount[];
};

export type AdminCourseDetail = Omit<AdminCourse, "lessons"> & {
  lessons: AdminLesson[];
};

export type UpdateCourseInput = {
  title: string;
  description: string;
  price: number;
  thumbnail_url: string | null;
  is_published: boolean;
};

function parsePrice(value: number | string | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function getLessonCount(
  lessons: AdminCourse["lessons"] | undefined,
): number {
  if (!lessons) return 0;
  const row = Array.isArray(lessons) ? lessons[0] : lessons;
  return row?.count ?? 0;
}

function sortLessons(lessons: AdminLesson[]): AdminLesson[] {
  return [...lessons].sort((a, b) => a.order_index - b.order_index);
}

export async function assertCanManageCourse(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  courseId: string,
): Promise<void> {
  const role = await getProfileRole(supabase, userId);
  if (!canAccessAdminRoute(role)) {
    throw new Error("Unauthorized");
  }

  const { data: course, error } = await supabase
    .from("courses")
    .select("instructor_id")
    .eq("id", courseId)
    .maybeSingle();

  if (error || !course) {
    throw new Error("Course not found");
  }

  if (role !== "admin" && course.instructor_id !== userId) {
    throw new Error("You do not have permission to manage this course.");
  }
}

export function formatCoursePrice(price: number | string | null): string {
  const amount = parsePrice(price);
  if (amount <= 0) return "Free";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * ADMIN COURSE SERVICE
 * Handles business logic for instructors/admins creating and managing courses.
 * Enforces instructor isolation for future multi-tenancy.
 */
export const AdminCourseService = {
  /**
   * Fetches all courses managed by the logged-in admin/instructor.
   */
  async getAdminCourses() {
    const supabase = await createClient();

    // Get the authenticated user's session
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const role = await getProfileRole(supabase, user.id);

    let query = supabase
      .from("courses")
      .select(
        `
        *,
        lessons(count)
      `,
      )
      .order("created_at", { ascending: false });

    // Instructors see only their courses; master admin sees the full catalog.
    if (role !== "admin") {
      query = query.eq("instructor_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching admin courses:", error.message);
      return [];
    }

    return (data ?? []) as AdminCourse[];
  },

  /**
   * Creates a new empty draft course.
   */
  async createCourse(title: string, description: string, price: number) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const role = await getProfileRole(supabase, user.id);
    if (!canAccessAdminRoute(role)) {
      throw new Error(
        "Your account must have the admin or instructor role to create courses. Update profiles.role in Supabase.",
      );
    }

    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          title,
          description,
          price,
          instructor_id: user.id,
          is_published: false, // Starts as a draft
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Fetches a single course with ordered lessons for the editor.
   */
  async getAdminCourseById(
    courseId: string,
  ): Promise<AdminCourseDetail | null> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      await assertCanManageCourse(supabase, user.id, courseId);
    } catch {
      return null;
    }

    const { data, error } = await supabase
      .from("courses")
      .select(
        `
        *,
        lessons (
          id,
          course_id,
          title,
          video_url,
          order_index,
          content_body
        )
      `,
      )
      .eq("id", courseId)
      .maybeSingle();

    if (error || !data) {
      console.error("Error fetching admin course:", error?.message);
      return null;
    }

    const { lessons: rawLessons, ...course } = data as AdminCourseDetail;
    const lessons = sortLessons(
      Array.isArray(rawLessons) ? rawLessons : rawLessons ? [rawLessons] : [],
    );

    return { ...course, lessons };
  },

  /**
   * Updates course metadata and publish state.
   */
  async updateCourse(courseId: string, input: UpdateCourseInput) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await assertCanManageCourse(supabase, user.id, courseId);

    const { data, error } = await supabase
      .from("courses")
      .update({
        title: input.title,
        description: input.description,
        price: input.price,
        thumbnail_url: input.thumbnail_url,
        is_published: input.is_published,
      })
      .eq("id", courseId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Permanently deletes a course and all its dependent data.
   * Cascades manually because FK constraints don't all have ON DELETE CASCADE.
   * Only admins can delete courses.
   */
  async deleteCourse(courseId: string) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const role = await getProfileRole(supabase, user.id);
    if (role !== "admin") {
      throw new Error("Only admins can delete courses.");
    }

    const admin = createAdminClient();

    // If this course is a prerequisite for another, clear that reference first
    await admin
      .from("courses")
      .update({ prerequisite_course_id: null })
      .eq("prerequisite_course_id", courseId);

    // Get lesson IDs so we can delete user_progress
    const { data: lessons } = await admin
      .from("lessons")
      .select("id")
      .eq("course_id", courseId);

    const lessonIds = (lessons ?? []).map((l) => l.id);

    // Delete in dependency order
    if (lessonIds.length > 0) {
      await admin.from("user_progress").delete().in("lesson_id", lessonIds);
    }

    await admin.from("certificates").delete().eq("course_id", courseId);
    await admin
      .from("certificate_sequences")
      .delete()
      .eq("course_id", courseId);
    await admin.from("quiz_attempts").delete().eq("course_id", courseId);
    await admin.from("quizzes").delete().eq("course_id", courseId);
    await admin.from("enrollments").delete().eq("course_id", courseId);
    await admin.from("lemonsqueezy_orders").delete().eq("course_id", courseId);

    // Delete the course itself — lessons cascade automatically
    const { error } = await admin.from("courses").delete().eq("id", courseId);

    if (error) throw new Error(`Failed to delete course: ${error.message}`);
  },
};
