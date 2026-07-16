import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type LemonSqueezyCheckoutResponse = {
  data?: {
    attributes?: {
      url?: string;
    };
  };
  errors?: { detail: string }[];
};

type LemonSqueezyOrderAttributes = {
  status: string;
  total: number; // in cents
  currency: string;
  first_order_item?: {
    variant_id?: number;
  };
};

function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

function parsePrice(value: number | string | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

async function getAuthenticatedStudent() {
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

export const LemonSqueezyCheckoutService = {
  /**
   * Creates a Lemon Squeezy hosted checkout session for a course.
   * Embeds user_id and course_id in custom_data so the webhook can
   * identify which student bought which course.
   *
   * Requires on the course: lemonsqueezy_variant_id must be set.
   * Requires env vars: LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID
   */
  async initiateCheckout(courseId: string): Promise<{ checkoutUrl: string }> {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;

    if (!apiKey || !storeId) {
      throw new Error("Lemon Squeezy is not configured on the server.");
    }

    const student = await getAuthenticatedStudent();
    if (!student) throw new Error("You must be signed in to checkout.");
    const { supabase, user } = student;

    // Fetch course with variant ID
    const { data: course } = await supabase
      .from("courses")
      .select(
        "id, title, price, is_published, lemonsqueezy_variant_id, prerequisite_course_id",
      )
      .eq("id", courseId)
      .eq("is_published", true)
      .maybeSingle();

    if (!course) throw new Error("Course not found or unavailable.");

    const price = parsePrice(course.price);
    if (price <= 0) {
      throw new Error("Use free enrollment for complimentary courses.");
    }

    // ── Prerequisite enforcement (server-side gate) ───────────────────────────
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

    if (!course.lemonsqueezy_variant_id) {
      throw new Error(
        "This course is not yet configured for international payment. Please contact support.",
      );
    }

    if (await hasPaidEnrollment(supabase, user.id, courseId)) {
      throw new Error("You are already enrolled in this course.");
    }

    const successUrl = `${getSiteUrl()}/dashboard/checkout/callback/lemonsqueezy?courseId=${encodeURIComponent(courseId)}`;
    const cancelUrl = `${getSiteUrl()}/dashboard/checkout/${courseId}`;

    // Build the Lemon Squeezy checkout via their REST API
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: user.email,
              custom: {
                user_id: user.id,
                course_id: courseId,
              },
            },
            checkout_options: {
              embed: false,
            },
            product_options: {
              redirect_url: successUrl,
            },
            preview: false,
          },
          relationships: {
            store: {
              data: { type: "stores", id: storeId },
            },
            variant: {
              data: {
                type: "variants",
                id: String(course.lemonsqueezy_variant_id),
              },
            },
          },
        },
      }),
    });

    const payload = (await response.json()) as LemonSqueezyCheckoutResponse;

    if (!response.ok || payload.errors) {
      const detail =
        payload.errors?.[0]?.detail ??
        "Could not start Lemon Squeezy checkout.";
      throw new Error(detail);
    }

    const checkoutUrl = payload.data?.attributes?.url;
    if (!checkoutUrl) {
      throw new Error("Lemon Squeezy did not return a checkout URL.");
    }

    return { checkoutUrl };
  },

  /**
   * Verifies a Lemon Squeezy order and records it in lemonsqueezy_orders.
   * Called by the success callback page as a backup to the webhook.
   * The webhook is the primary fulfillment path — this just ensures the
   * order is recorded even if the webhook fires after the user lands back.
   */
  async recordOrder({
    orderId,
    userId,
    courseId,
    amountTotal,
    currency,
  }: {
    orderId: string;
    userId: string;
    courseId: string;
    amountTotal: number;
    currency: string;
  }): Promise<void> {
    const supabase = createAdminClient();

    await supabase.from("lemonsqueezy_orders").upsert(
      {
        order_id: orderId,
        user_id: userId,
        course_id: courseId,
        amount_total: amountTotal,
        currency,
        status: "paid",
      },
      { onConflict: "order_id" },
    );
  },
};
