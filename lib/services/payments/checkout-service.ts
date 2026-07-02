import { createClient } from "@/lib/supabase/server";
import { formatCatalogPrice } from "@/lib/services/student-dashboard-service";
import {
  fulfillPaidEnrollment,
  parsePaystackMetadata,
} from "./enrollment-fulfillment";

export type CheckoutPreview = {
  courseId: string;
  title: string;
  description: string | null;
  price: number;
  priceLabel: string;
  isFree: boolean;
  isEnrolled: boolean;
  studentEmail: string;
};

type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    amount: number;
    reference: string;
    metadata?: {
      user_id?: string;
      course_id?: string;
    };
  };
};

function parsePrice(value: number | string | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

async function getAuthenticatedStudent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error("You must be signed in to checkout.");
  }

  return { supabase, user };
}

async function hasPaidEnrollment(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  courseId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("status", "paid")
    .maybeSingle();

  return Boolean(data);
}

export const CheckoutService = {
  async getCheckoutPreview(courseId: string): Promise<CheckoutPreview | null> {
    const { supabase, user } = await getAuthenticatedStudent();

    const { data: course, error } = await supabase
      .from("courses")
      .select("id, title, description, price, is_published")
      .eq("id", courseId)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !course) return null;

    const price = parsePrice(course.price);
    const isEnrolled = await hasPaidEnrollment(supabase, user.id, courseId);

    return {
      courseId: course.id,
      title: course.title,
      description: course.description,
      price,
      priceLabel: formatCatalogPrice(price),
      isFree: price <= 0,
      isEnrolled,
      studentEmail: user.email!,
    };
  },

  async grantFreeEnrollment(courseId: string) {
    const { supabase, user } = await getAuthenticatedStudent();

    const { data: course } = await supabase
      .from("courses")
      .select("id, price, is_published")
      .eq("id", courseId)
      .eq("is_published", true)
      .maybeSingle();

    if (!course) throw new Error("Course not found or unavailable.");
    if (parsePrice(course.price) > 0) {
      throw new Error("This course requires payment.");
    }

    if (await hasPaidEnrollment(supabase, user.id, courseId)) {
      return { alreadyEnrolled: true };
    }

    await fulfillPaidEnrollment({
      userId: user.id,
      courseId,
      amountPaid: 0,
      paystack_ref: `free-${courseId}-${user.id}`,
    });

    return { alreadyEnrolled: false };
  },

  async initiatePaystackCheckout(courseId: string) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      throw new Error("Paystack is not configured on the server.");
    }

    const { supabase, user } = await getAuthenticatedStudent();

    const { data: course } = await supabase
      .from("courses")
      .select("id, title, price, is_published")
      .eq("id", courseId)
      .eq("is_published", true)
      .maybeSingle();

    if (!course) throw new Error("Course not found or unavailable.");

    const price = parsePrice(course.price);
    if (price <= 0) {
      throw new Error("Use free enrollment for complimentary courses.");
    }

    if (await hasPaidEnrollment(supabase, user.id, courseId)) {
      throw new Error("You are already enrolled in this course.");
    }

    const amountKobo = Math.round(price * 100);
    const callbackUrl = `${getSiteUrl()}/dashboard/checkout/callback?courseId=${encodeURIComponent(courseId)}`;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountKobo,
        currency: "NGN",
        callback_url: callbackUrl,
        metadata: {
          user_id: user.id,
          course_id: courseId,
          course_title: course.title,
        },
      }),
    });

    const payload = (await response.json()) as PaystackInitializeResponse;

    if (!response.ok || !payload.status || !payload.data?.authorization_url) {
      throw new Error(payload.message || "Could not start Paystack checkout.");
    }

    return {
      authorizationUrl: payload.data.authorization_url,
      reference: payload.data.reference,
    };
  },

  /**
   * Verifies a Paystack transaction and fulfills enrollment (backup to webhook).
   */
  async verifyAndFulfillPayment(reference: string, courseId: string) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      throw new Error("Paystack is not configured on the server.");
    }

    const { user } = await getAuthenticatedStudent();

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
      },
    );

    const payload = (await response.json()) as PaystackVerifyResponse;

    if (!response.ok || !payload.status || !payload.data) {
      throw new Error(payload.message || "Payment verification failed.");
    }

    if (payload.data.status !== "success") {
      throw new Error("Payment was not completed successfully.");
    }

    const parsedMetadata = parsePaystackMetadata(payload.data.metadata);
    const resolvedCourseId = courseId || parsedMetadata.courseId;

    if (!resolvedCourseId) {
      throw new Error("Could not determine which course was purchased.");
    }

    if (
      parsedMetadata.courseId &&
      courseId &&
      parsedMetadata.courseId !== courseId
    ) {
      throw new Error("Payment does not match this course.");
    }

    const amountPaid = payload.data.amount / 100;

    await fulfillPaidEnrollment({
      userId: user.id,
      courseId: resolvedCourseId,
      amountPaid,
      paystack_ref: payload.data.reference,
    });

    console.log("payload", payload);

    return { success: true as const, courseId: resolvedCourseId };
  },
};
