"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { CheckoutService } from "./checkout-service";

export type CheckoutActionState = {
  error?: string;
  authorizationUrl?: string;
};

export async function initiatePaystackCheckoutAction(
  _prevState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const courseId = String(formData.get("courseId") ?? "").trim();
  if (!courseId) return { error: "Course not found." };

  try {
    const { authorizationUrl } =
      await CheckoutService.initiatePaystackCheckout(courseId);
    return { authorizationUrl };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not start checkout. Please try again.",
    };
  }
}

export async function grantFreeEnrollmentAction(courseId: string) {
  const id = courseId.trim();
  if (!id) throw new Error("Course not found.");

  const result = await CheckoutService.grantFreeEnrollment(id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/browse");
  revalidatePath(`/dashboard/checkout/${id}`);

  redirect(
    result.alreadyEnrolled
      ? "/dashboard?toast=already-enrolled"
      : "/dashboard?toast=enrollment-success",
  );
}
