import { createClient } from "@/lib/supabase/server";

export type MarketingCourse = {
  id: string;
  title: string;
  slug: string | null;
  price: number;
};

export type CourseLesson = {
  id: string;
  title: string;
  orderIndex: number;
};

export type CourseDetail = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  price: number;
  thumbnailUrl: string | null;
  instructorName: string | null;
  lessons: CourseLesson[];
};

/**
 * Fetches published courses for the public-facing marketing site.
 * Works for anonymous (unauthenticated) visitors — requires the
 * `courses_anon_select_published` RLS policy to be in place.
 */
export const MarketingCourseService = {
  async getPublishedCourses(): Promise<MarketingCourse[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("courses")
      .select("id, title, slug, price")
      .eq("is_published", true)
      .order("created_at", { ascending: true });

    if (error) {
      // Non-fatal on the marketing page — fall back to hardcoded content
      console.error(
        "[marketing] Failed to fetch published courses:",
        error.message,
      );
      return [];
    }

    return (data ?? []).map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug ?? null,
      price: Number(course.price) || 0,
    }));
  },

  /**
   * Fetches a single published course by its slug for the public detail page.
   * Includes lesson titles (ordered) and the instructor's display name.
   * Returns null if the slug doesn't match any published course.
   */
  async getCourseBySlug(slug: string): Promise<CourseDetail | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("courses")
      .select(
        `
        id,
        slug,
        title,
        description,
        price,
        thumbnail_url,
        instructor:profiles!instructor_id (
          full_name
        ),
        lessons (
          id,
          title,
          order_index
        )
      `,
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("[marketing] getCourseBySlug error:", error.message);
      return null;
    }

    if (!data) return null;

    const instructor = Array.isArray(data.instructor)
      ? (data.instructor[0] ?? null)
      : (data.instructor ?? null);

    const lessons: CourseLesson[] = ((data.lessons as any[]) ?? [])
      .map((l) => ({
        id: l.id,
        title: l.title,
        orderIndex: l.order_index as number,
      }))
      .sort((a, b) => a.orderIndex - b.orderIndex);

    return {
      id: data.id,
      slug: data.slug ?? null,
      title: data.title,
      description: data.description ?? null,
      price: Number(data.price) || 0,
      thumbnailUrl: data.thumbnail_url ?? null,
      instructorName: (instructor as any)?.full_name ?? null,
      lessons,
    };
  },
};
