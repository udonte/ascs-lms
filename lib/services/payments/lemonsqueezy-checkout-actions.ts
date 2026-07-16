"use server";

import { LemonSqueezyCheckoutService } from "./lemonsqueezy-checkout-service";

export type LemonSqueezyActionState = {
  error?: string;
  checkoutUrl?: string;
};

export async function initiateLemonSqueezyCheckoutAction(
  _prevState: LemonSqueezyActionState,
  formData: FormData,
): Promise<LemonSqueezyActionState> {
  const courseId = String(formData.get("courseId") ?? "").trim();
  if (!courseId) return { error: "Course not found." };

  try {
    const { checkoutUrl } =
      await LemonSqueezyCheckoutService.initiateCheckout(courseId);
    return { checkoutUrl };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not start checkout. Please try again.",
    };
  }
}
