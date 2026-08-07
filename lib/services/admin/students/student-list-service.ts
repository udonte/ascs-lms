import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const StudentListService = {
  /**
   * Returns all student accounts with their enrollment summary.
   * totalPaid = sum of paystack_transactions (per-payment accuracy)
   *           + non-Paystack enrollments (manual, free, lemonsqueezy)
   * Ordered by most recently registered first.
   */
  async getStudentList(): Promise<StudentListRow[]> {
    const supabase = await createClient();

    try {
      await assertStaff(supabase);
    } catch {
      return [];
    }

    const adminClient = createAdminClient();

    // Fetch profiles + enrollments in one query
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
          amount_paid,
          payment_gateway
        )
      `,
      )
      .eq("role", "student")
      .order("updated_at", { ascending: false });

    if (error || !data) return [];

    // Fetch all Paystack transactions in one query, grouped by user_id
    const { data: paystackTxs } = await adminClient
      .from("paystack_transactions")
      .select("user_id, amount")
      .eq("status", "paid");

    // Build a map: user_id → total Paystack amount paid
    const paystackTotalByUser = new Map<string, number>();
    for (const tx of paystackTxs ?? []) {
      paystackTotalByUser.set(
        tx.user_id,
        (paystackTotalByUser.get(tx.user_id) ?? 0) + Number(tx.amount || 0),
      );
    }

    return data.map((profile) => {
      const enrollments = Array.isArray(profile.enrollments)
        ? profile.enrollments
        : [];
      const paidEnrollments = enrollments.filter(
        (e: any) => e.status === "paid",
      );

      // Sum non-Paystack enrollments (manual / LS / free)
      const nonPaystackTotal = paidEnrollments
        .filter((e: any) => e.payment_gateway !== "paystack")
        .reduce((sum: number, e: any) => sum + (Number(e.amount_paid) || 0), 0);

      // Paystack total from transactions table (accurate per-payment count)
      const paystackTotal = paystackTotalByUser.get(profile.id) ?? 0;

      return {
        id: profile.id,
        fullName: profile.full_name?.trim() || "Unknown student",
        email: profile.email?.trim() || "—",
        joinedAt: profile.updated_at,
        enrollmentCount: paidEnrollments.length,
        totalPaid: paystackTotal + nonPaystackTotal,
      };
    });
  },
};
