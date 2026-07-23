import { createClient } from "@/lib/supabase/server";
import { formatCatalogPrice } from "@/lib/services/dashboard/overview/student-dashboard-service";
import {
  fulfillPaidEnrollment,
  parsePaystackMetadata,
} from "./enrollment-fulfillment";

export type PrerequisiteStatus = {
  /** True when a prerequisite exists AND the student hasn't completed it yet. */
  required: boolean;
  /** DB id of the required course (used to build the checkout link). */
  courseId: string | null;
  /** Human-readable title of the required course, for display in the UI. */
  courseTitle: string | null;
};

export type CheckoutPreview = {
  courseId: string;
  title: string;
  description: string | null;
  price: number;
  priceLabel: string;
  /** NGN equivalent shown on the Paystack button e.g. "₦240,000" */
  ngnPriceLabel: string;
  isFree: boolean;
  isEnrolled: boolean;
  studentEmail: string;
  /** Prerequisite gate — required: true means student must complete another course first. */
  prerequisite: PrerequisiteStatus;
};

/**
 * Fetches the live USD → NGN exchange rate.
 * Uses open.er-api.com (free, no API key needed).
 * Falls back to FALLBACK_USD_NGN_RATE env var or 1600 if the API is down.
 */
async function fetchUsdToNgnRate(): Promise<number> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 }, // cache rate for 1 hour
    });
    if (!res.ok) throw new Error("Rate API returned non-200");
    const data = await res.json();
    const rate = data?.rates?.NGN;
    if (typeof rate === "number" && rate > 0) return rate;
    throw new Error("Invalid rate in response");
  } catch {
    const fallback = Number(process.env.FALLBACK_USD_NGN_RATE ?? 1600);
    return Number.isFinite(fallback) && fallback > 0 ? fallback : 1600;
  }
}

function formatNgn(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

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

async function getAuthenticatedStudent(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: { id: string; email: string };
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  return { supabase, user: { id: user.id, email: user.email } };
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
  /**
   * Returns null when unauthenticated — the page should redirect to /login?next=...
   * rather than showing a 404. Also returns null for unpublished / non-existent courses.
   */
  async getCheckoutPreview(
    courseId: string,
  ): Promise<CheckoutPreview | null | "unauthenticated"> {
    const student = await getAuthenticatedStudent();

    // Caller should redirect to /login?next=/dashboard/checkout/[courseId]
    if (!student) return "unauthenticated";

    const { supabase, user } = student;

    // Fetch course without a self-join — PostgREST self-joins on the same table
    // are unreliable and can silently return null for the joined relation even
    // when prerequisite_course_id is set. We resolve the prerequisite title in
    // a separate query below instead.
    const { data: course, error } = await supabase
      .from("courses")
      .select(
        "id, title, description, price, is_published, prerequisite_course_id",
      )
      .eq("id", courseId)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !course) return null;

    const price = parsePrice(course.price);
    const isEnrolled = await hasPaidEnrollment(supabase, user.id, courseId);

    // ── Prerequisite check ───────────────────────────────────────────────────
    // Use the foreign key column directly — never rely on the joined relation.
    const prereqId: string | null = course.prerequisite_course_id ?? null;
    let prereqTitle: string | null = null;
    let prerequisiteRequired = false;

    if (prereqId) {
      // Fetch prerequisite course title for display in the UI
      const { data: prereqCourse } = await supabase
        .from("courses")
        .select("title")
        .eq("id", prereqId)
        .maybeSingle();

      prereqTitle = prereqCourse?.title ?? null;

      // Gate: student must have a paid enrollment in the prerequisite course
      const prereqCompleted = await hasPaidEnrollment(
        supabase,
        user.id,
        prereqId,
      );
      prerequisiteRequired = !prereqCompleted;
    }

    return {
      courseId: course.id,
      title: course.title,
      description: course.description,
      price,
      priceLabel: formatCatalogPrice(price),
      ngnPriceLabel:
        price <= 0
          ? "Free"
          : formatNgn(Math.round(price * (await fetchUsdToNgnRate()))),
      isFree: price <= 0,
      isEnrolled,
      studentEmail: user.email,
      prerequisite: {
        required: prerequisiteRequired,
        courseId: prereqId,
        courseTitle: prereqTitle,
      },
    };
  },

  async grantFreeEnrollment(courseId: string) {
    const student = await getAuthenticatedStudent();
    if (!student) throw new Error("You must be signed in to enroll.");
    const { supabase, user } = student;

    const { data: course } = await supabase
      .from("courses")
      .select("id, price, is_published, prerequisite_course_id")
      .eq("id", courseId)
      .eq("is_published", true)
      .maybeSingle();

    if (!course) throw new Error("Course not found or unavailable.");
    if (parsePrice(course.price) > 0) {
      throw new Error("This course requires payment.");
    }

    // ── Prerequisite enforcement (write-time gate) ────────────────────────────
    // Prevents bypass via direct server-action calls, Postman, etc.
    if (course.prerequisite_course_id) {
      const prereqMet = await hasPaidEnrollment(
        supabase,
        user.id,
        course.prerequisite_course_id,
      );
      if (!prereqMet) {
        throw new Error(
          "You must complete the prerequisite course before enrolling here.",
        );
      }
    }

    if (await hasPaidEnrollment(supabase, user.id, courseId)) {
      return { alreadyEnrolled: true };
    }

    await fulfillPaidEnrollment({
      userId: user.id,
      courseId,
      amountPaid: 0,
      paystack_ref: `free-${courseId}-${user.id}`,
      payment_gateway: "free",
    });

    return { alreadyEnrolled: false };
  },

  async initiatePaystackCheckout(courseId: string) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      throw new Error("Paystack is not configured on the server.");
    }

    const student = await getAuthenticatedStudent();
    if (!student) throw new Error("You must be signed in to checkout.");
    const { supabase, user } = student;

    const { data: course } = await supabase
      .from("courses")
      .select("id, title, price, is_published, prerequisite_course_id")
      .eq("id", courseId)
      .eq("is_published", true)
      .maybeSingle();

    if (!course) throw new Error("Course not found or unavailable.");

    const price = parsePrice(course.price);
    if (price <= 0) {
      throw new Error("Use free enrollment for complimentary courses.");
    }

    // ── Prerequisite enforcement (server-side gate) ───────────────────────────
    // Prevents bypassing the UI prerequisite gate via direct action calls.
    if (course.prerequisite_course_id) {
      const prereqMet = await hasPaidEnrollment(
        supabase,
        user.id,
        course.prerequisite_course_id,
      );
      if (!prereqMet) {
        throw new Error(
          "You must complete the prerequisite course before purchasing this one.",
        );
      }
    }

    if (await hasPaidEnrollment(supabase, user.id, courseId)) {
      throw new Error("You are already enrolled in this course.");
    }

    // Convert USD price → NGN → kobo (Paystack's smallest unit)
    const usdToNgn = await fetchUsdToNgnRate();
    const ngnAmount = Math.round(price * usdToNgn);
    const amountKobo = ngnAmount * 100;
    const callbackUrl = `${getSiteUrl()}/dashboard/checkout/callback?courseId=${encodeURIComponent(courseId)}`;

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
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
      },
    );

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

    const student = await getAuthenticatedStudent();
    if (!student) throw new Error("You must be signed in to verify payment.");
    const { user } = student;

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
      payment_gateway: "paystack",
    });

    return { success: true as const, courseId: resolvedCourseId };
  },
};
