"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { StudentCourseService } from "./student-course-service";

export async function completeLessonAction(
  courseId: string,
  lessonId: string,
) {
  const result = await StudentCourseService.completeLesson(lessonId, courseId);

  revalidatePath(`/dashboard/courses/${courseId}`);
  revalidatePath(`/dashboard/courses/${courseId}/lessons/${lessonId}`);

  if (result.nextLessonId) {
    redirect(
      `/dashboard/courses/${courseId}/lessons/${result.nextLessonId}`,
    );
  }

  redirect("/dashboard?toast=lesson-complete");
}

export async function submitQuizScoreAction(
  courseId: string,
  selections: Record<string, number>,
) {
  const result = await StudentCourseService.submitQuizScore(courseId, selections);

  revalidatePath(`/dashboard/courses/${courseId}`);
  revalidatePath(`/dashboard/certificates`);
  revalidatePath(`/dashboard/certificates/${courseId}/download`);

  return result;
}
