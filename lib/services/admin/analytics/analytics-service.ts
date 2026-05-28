import { createClient } from "@/lib/supabase/server";

/**
 * ANALYTICS SERVICE
 * Handles high-level aggregations for the Admin Performance Insights.
 */
export const AnalyticsService = {
  async getPerformanceStats() {
    const supabase = await createClient();

    // 1. Fetch total paid revenue and total enrollments
    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select("amount_paid, status")
      .eq("status", "paid");

    // 2. Fetch total registered students
    const { count: totalStudents, error: studentError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");

    // 3. Fetch total active courses
    const { count: totalCourses, error: courseError } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true });

    if (enrollError || studentError || courseError) {
      console.error("Error fetching analytics metrics");
      return {
        totalRevenue: 0,
        salesCount: 0,
        totalStudents: 0,
        totalCourses: 0,
      };
    }

    const totalRevenue =
      enrollments?.reduce(
        (sum, item) => sum + Number(item.amount_paid || 0),
        0,
      ) || 0;
    const salesCount = enrollments?.length || 0;

    return {
      totalRevenue,
      salesCount,
      totalStudents: totalStudents || 0,
      totalCourses: totalCourses || 0,
    };
  },
};
