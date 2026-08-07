import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  canAccessAdminRoute,
  getProfileRole,
} from "@/lib/services/profile-service";

/**
 * Verifies the caller is admin or instructor before running sensitive queries.
 * Throws for non-staff callers so the error bubbles up cleanly rather than
 * silently returning zeros.
 */
async function assertStaff(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const role = await getProfileRole(supabase, user.id);
  if (!canAccessAdminRoute(role)) {
    throw new Error("Only admins and instructors can view analytics.");
  }

  return user;
}

/**
 * ANALYTICS SERVICE
 * Handles high-level aggregations for the Admin Performance Insights.
 */
export const AnalyticsService = {
  async getPerformanceStats(
    _supabase?: Awaited<ReturnType<typeof createClient>>,
  ) {
    const supabase = _supabase ?? (await createClient());

    if (!_supabase) {
      try {
        await assertStaff(supabase);
      } catch {
        return {
          totalRevenue: 0,
          salesCount: 0,
          totalStudents: 0,
          totalCourses: 0,
        };
      }
    }

    // 1. Fetch revenue from paystack_transactions using the admin client (bypasses RLS).
    const adminClient = createAdminClient();
    const { data: paystackTxs, error: txError } = await adminClient
      .from("paystack_transactions")
      .select("amount, status")
      .eq("status", "paid");

    // 2. Fetch enrollment count and LemonSqueezy revenue
    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select("amount_paid, payment_gateway")
      .eq("status", "paid")
      .neq("payment_gateway", "paystack"); // exclude paystack — already counted above

    // 3. Fetch total registered students
    const { count: totalStudents, error: studentError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");

    // 4. Fetch total active courses
    const { count: totalCourses, error: courseError } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true });

    if (txError || enrollError || studentError || courseError) {
      console.error("Error fetching analytics metrics");
      return {
        totalRevenue: 0,
        salesCount: 0,
        totalStudents: 0,
        totalCourses: 0,
      };
    }

    // Revenue = Paystack transactions + non-Paystack enrollments (LS, manual, free)
    const paystackRevenue =
      paystackTxs?.reduce((sum, tx) => sum + Number(tx.amount || 0), 0) || 0;
    const otherRevenue =
      enrollments?.reduce(
        (sum, item) => sum + Number(item.amount_paid || 0),
        0,
      ) || 0;

    const totalRevenue = paystackRevenue + otherRevenue;

    // salesCount = total paid enrollments (paystack count + non-paystack count)
    const salesCount =
      (paystackTxs?.length || 0) + (enrollments?.length || 0);

    return {
      totalRevenue,
      salesCount,
      totalStudents: totalStudents || 0,
      totalCourses: totalCourses || 0,
    };
  },

  /**
   * Returns weekly enrollment counts for the last 12 weeks.
   * Used to render the Enrollment Trend chart on Performance Insights.
   */
  async getEnrollmentTrend(
    _supabase?: Awaited<ReturnType<typeof createClient>>,
  ): Promise<{ weekLabel: string; enrollments: number }[]> {
    const supabase = _supabase ?? (await createClient());

    if (!_supabase) {
      try {
        await assertStaff(supabase);
      } catch {
        return [];
      }
    }

    // Build 12 week buckets ending at current week
    const now = new Date();
    const weeks: { start: Date; end: Date; label: string }[] = [];

    for (let i = 11; i >= 0; i--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);
      weekEnd.setHours(23, 59, 59, 999);

      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);

      const label = weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      weeks.push({ start: weekStart, end: weekEnd, label });
    }

    // Fetch all paid enrollments within the 12-week window
    const windowStart = weeks[0].start.toISOString();
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("created_at")
      .eq("status", "paid")
      .gte("created_at", windowStart);

    const records = enrollments ?? [];

    return weeks.map((week) => {
      const count = records.filter((e) => {
        const d = new Date(e.created_at);
        return d >= week.start && d <= week.end;
      }).length;

      return { weekLabel: week.label, enrollments: count };
    });
  },

  /**
   * Returns per-course completion metrics.
   * Used to render Course Completion Rate bars on Performance Insights.
   */
  async getCourseCompletionRates(
    _supabase?: Awaited<ReturnType<typeof createClient>>,
  ): Promise<
    {
      courseId: string;
      courseTitle: string;
      enrolled: number;
      completed: number;
      completionPercent: number;
    }[]
  > {
    const supabase = _supabase ?? (await createClient());

    if (!_supabase) {
      try {
        await assertStaff(supabase);
      } catch {
        return [];
      }
    }

    // Fetch all courses
    const { data: courses } = await supabase
      .from("courses")
      .select("id, title")
      .order("created_at", { ascending: false });

    if (!courses || courses.length === 0) return [];

    // Fetch all paid enrollments with completion status
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id, completed_at")
      .eq("status", "paid");

    const records = enrollments ?? [];

    return courses.map((course) => {
      const courseEnrollments = records.filter(
        (e) => e.course_id === course.id,
      );
      const enrolled = courseEnrollments.length;
      const completed = courseEnrollments.filter(
        (e) => e.completed_at != null,
      ).length;
      const completionPercent =
        enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0;

      return {
        courseId: course.id,
        courseTitle: course.title,
        enrolled,
        completed,
        completionPercent,
      };
    });
  },

  /**
   * Single entry point for the Performance Insights page.
   * Creates one Supabase client, runs one auth check, then fetches
   * all three datasets in parallel — saving ~8 redundant DB round trips.
   */
  async getAllInsights() {
    const supabase = await createClient();

    try {
      await assertStaff(supabase);
    } catch {
      return {
        stats: {
          totalRevenue: 0,
          salesCount: 0,
          totalStudents: 0,
          totalCourses: 0,
        },
        enrollmentTrend: [] as { weekLabel: string; enrollments: number }[],
        courseCompletionRates: [] as {
          courseId: string;
          courseTitle: string;
          enrolled: number;
          completed: number;
          completionPercent: number;
        }[],
      };
    }

    const [stats, enrollmentTrend, courseCompletionRates] = await Promise.all([
      this.getPerformanceStats(supabase),
      this.getEnrollmentTrend(supabase),
      this.getCourseCompletionRates(supabase),
    ]);

    return { stats, enrollmentTrend, courseCompletionRates };
  },
};
