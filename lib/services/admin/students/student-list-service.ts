import { createClient } from "@/lib/supabase/server";
import {
  canAccessAdminRoute,
  getProfileRole,
} from "@/lib/services/profile-service";

export type StudentListRow = {
  id: string;
  fullName: string;
  email: string;
  joinedAt: string;
  enrollmentCount: number;
  totalPaid: number;
};

async function assertStaff(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const role = await getProfileRole(supabase, user.id);
  if (!canAccessAdminRoute(role)) throw new Error("Forbidden");
}

export function formatStudentJoinDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(isoDate));
}

export function formatStudentTotalPaid(amount: number): string {
  if (amount <= 0) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const StudentListService = {
  /**
   * Returns all student accounts with their enrollment summary.
   * Ordered by most recently registered first.
   */
  async getStudentList(): Promise<StudentListRow[]> {
    const supabase = await createClient();

    try {
      await assertStaff(supabase);
    } catch {
      return [];
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        email,
        updated_at,
        enrollments (
          status,
          amount_paid
        )
      `,
      )
      .eq("role", "student")
      .order("updated_at", { ascending: false });

    if (error || !data) return [];

    return data.map((profile) => {
      const enrollments = Array.isArray(profile.enrollments)
        ? profile.enrollments
        : [];
      const paidEnrollments = enrollments.filter(
        (e: any) => e.status === "paid",
      );
      const totalPaid = paidEnrollments.reduce(
        (sum: number, e: any) => sum + (Number(e.amount_paid) || 0),
        0,
      );

      return {
        id: profile.id,
        fullName: profile.full_name?.trim() || "Unknown student",
        email: profile.email?.trim() || "—",
        joinedAt: profile.updated_at,
        enrollmentCount: paidEnrollments.length,
        totalPaid,
      };
    });
  },
};
