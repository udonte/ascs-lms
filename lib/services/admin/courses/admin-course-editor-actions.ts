"use server";

import { revalidatePath } from "next/cache";

import { AdminCourseService } from "./admin-course-service";
import { AdminLessonService } from "./admin-lesson-service";
import { redirect } from "next/navigation";

export type EditorActionState = {
  error?: string;
  success?: string;
};

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function revalidateCourseEditor(courseId: string) {
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin/courses");
}

export async function updateCourseAction(
  _prevState: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  const courseId = readField(formData, "courseId");
  const title = readField(formData, "title");
  const description = readField(formData, "description");
  const priceRaw = readField(formData, "price");
  const thumbnailUrl = readField(formData, "thumbnail_url") || null;
  const isPublished = formData.get("is_published") === "on";

  if (!courseId) return { error: "Course not found." };
  if (!title) return { error: "Course title is required." };

  const price = priceRaw === "" ? 0 : Number(priceRaw);
  if (Number.isNaN(price) || price < 0) {
    return { error: "Enter a valid price in Naira." };
  }

  try {
    await AdminCourseService.updateCourse(courseId, {
      title,
      description,
      price,
      thumbnail_url: thumbnailUrl,
      is_published: isPublished,
    });
    revalidateCourseEditor(courseId);
    return { success: "Course settings saved." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save course.",
    };
  }
}

export async function createLessonAction(
  _prevState: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  const courseId = readField(formData, "courseId");
  const title = readField(formData, "title");
  const videoUrl = readField(formData, "video_url") || null;
  const contentBody = readField(formData, "content_body") || null;

  if (!courseId) return { error: "Course not found." };
  if (!title) return { error: "Lesson title is required." };

  try {
    await AdminLessonService.createLesson(courseId, {
      title,
      video_url: videoUrl,
      content_body: contentBody,
    });
    revalidateCourseEditor(courseId);
    return { success: "Lesson added." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to add lesson.",
    };
  }
}

export async function updateLessonAction(
  _prevState: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  const courseId = readField(formData, "courseId");
  const lessonId = readField(formData, "lessonId");
  const title = readField(formData, "title");
  const videoUrl = readField(formData, "video_url") || null;
  const contentBody = readField(formData, "content_body") || null;

  if (!courseId || !lessonId) return { error: "Lesson not found." };
  if (!title) return { error: "Lesson title is required." };

  try {
    await AdminLessonService.updateLesson(courseId, lessonId, {
      title,
      video_url: videoUrl,
      content_body: contentBody,
    });
    revalidateCourseEditor(courseId);
    return { success: "Lesson updated." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update lesson.",
    };
  }
}

export async function deleteLessonAction(
  _prevState: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  const courseId = readField(formData, "courseId");
  const lessonId = readField(formData, "lessonId");

  if (!courseId || !lessonId) return { error: "Lesson not found." };

  try {
    await AdminLessonService.deleteLesson(courseId, lessonId);
    revalidateCourseEditor(courseId);
    return { success: "Lesson removed." };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete lesson.",
    };
  }
}


/** For native `<form action={…}>` without useActionState */
export async function reorderLessonFormAction(formData: FormData) {
  const courseId = readField(formData, "courseId");
  const lessonId = readField(formData, "lessonId");
  const direction = readField(formData, "direction");

  if (!courseId || !lessonId) return;
  if (direction !== "up" && direction !== "down") return;

  try {
    await AdminLessonService.reorderLesson(courseId, lessonId, direction);
    revalidateCourseEditor(courseId);
  } catch (error) {
    console.error("Failed to reorder lesson:", error);
  }
}
