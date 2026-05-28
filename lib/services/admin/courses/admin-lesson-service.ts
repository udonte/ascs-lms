import { createClient } from "@/lib/supabase/server";
import {
  assertCanManageCourse,
  type AdminLesson,
} from "./admin-course-service";

export type CreateLessonInput = {
  title: string;
  video_url: string | null;
  content_body: string | null;
};

export type UpdateLessonInput = CreateLessonInput;

export const AdminLessonService = {
  async createLesson(courseId: string, input: CreateLessonInput) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await assertCanManageCourse(supabase, user.id, courseId);

    const { data: existing } = await supabase
      .from("lessons")
      .select("order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: false })
      .limit(1);

    const nextIndex =
      existing && existing.length > 0 ? (existing[0]?.order_index ?? 0) + 1 : 0;

    const { data, error } = await supabase
      .from("lessons")
      .insert([
        {
          course_id: courseId,
          title: input.title,
          video_url: input.video_url,
          content_body: input.content_body,
          order_index: nextIndex,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as AdminLesson;
  },

  async updateLesson(
    courseId: string,
    lessonId: string,
    input: UpdateLessonInput,
  ) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await assertCanManageCourse(supabase, user.id, courseId);

    const { data, error } = await supabase
      .from("lessons")
      .update({
        title: input.title,
        video_url: input.video_url,
        content_body: input.content_body,
      })
      .eq("id", lessonId)
      .eq("course_id", courseId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as AdminLesson;
  },

  async deleteLesson(courseId: string, lessonId: string) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await assertCanManageCourse(supabase, user.id, courseId);

    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", lessonId)
      .eq("course_id", courseId);

    if (error) throw new Error(error.message);
  },

  async reorderLesson(
    courseId: string,
    lessonId: string,
    direction: "up" | "down",
  ) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await assertCanManageCourse(supabase, user.id, courseId);

    const { data: lessons, error } = await supabase
      .from("lessons")
      .select("id, order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (error || !lessons?.length) {
      throw new Error(error?.message ?? "No lessons to reorder");
    }

    const index = lessons.findIndex((row) => row.id === lessonId);
    if (index === -1) throw new Error("Lesson not found");

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= lessons.length) return;

    const current = lessons[index];
    const neighbor = lessons[swapIndex];

    const { error: firstError } = await supabase
      .from("lessons")
      .update({ order_index: neighbor.order_index })
      .eq("id", current.id);

    if (firstError) throw new Error(firstError.message);

    const { error: secondError } = await supabase
      .from("lessons")
      .update({ order_index: current.order_index })
      .eq("id", neighbor.id);

    if (secondError) throw new Error(secondError.message);
  },
};
