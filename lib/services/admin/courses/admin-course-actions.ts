"use server";

import { revalidatePath } from "next/cache";

import { AdminCourseService } from "./admin-course-service";

export type CreateCourseActionState = {
  error?: string;
  success?: string;
};

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createCourseAction(
  _prevState: CreateCourseActionState,
  formData: FormData,
): Promise<CreateCourseActionState> {
  const title = readField(formData, "title");
  const description = readField(formData, "description");
  const priceRaw = readField(formData, "price");

  if (!title) {
    return { error: "Course title is required." };
  }

  const price = priceRaw === "" ? 0 : Number(priceRaw);
  if (Number.isNaN(price) || price < 0) {
    return { error: "Enter a valid price in Naira (0 for free courses)." };
  }

  try {
    await AdminCourseService.createCourse(title, description, price);
    revalidatePath("/admin/courses");
    return { success: "Course created as a draft." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create course.";
    return { error: message };
  }
}
