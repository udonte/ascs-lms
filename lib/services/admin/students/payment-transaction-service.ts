import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  canAccessAdminRoute,
  getProfileRole,
} from "@/lib/services/profile-service";

export type PaymentTransactionRow = {
  id: string;
  paystackRef: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  status: "paid" | "refunded" | "failed";
  createdAt: string;
};

async function assertStaff(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const role = await getProfileRole(supabase, user.id);
  if (!canAccessAdminRoute(role)) throw new Error("Forbidden");
}

export function formatTxAmount(amount: number): string {
  if (amount <= 0) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTxDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export const PaymentTransactionService = {
  async getAll(): Promise<PaymentTransactionRow[]> {
    const supabase = await createClient();

    try {
      await assertStaff(supabase);
    } catch {
      return [];
    }

    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("paystack_transactions")
      .select(
        `
        id,
        paystack_ref,
        amount,
        status,
        created_at,
        course:courses!course_id(title),
        profile:profiles!user_id(full_name, email)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payment transactions:", error.message);
      return [];
    }

    return (data ?? []).map((row) => {
      const course = Array.isArray(row.course) ? row.course[0] : row.course;
      const profile = Array.isArray(row.profile) ? row.profile[0] : row.profile;

      return {
        id: row.id,
        paystackRef: row.paystack_ref,
        studentName: (profile as any)?.full_name?.trim() || "Unknown",
        studentEmail: (profile as any)?.email?.trim() || "—",
        courseTitle: (course as any)?.title?.trim() || "Unknown course",
        amount: Number(row.amount || 0),
        status: row.status as PaymentTransactionRow["status"],
        createdAt: row.created_at,
      };
    });
  },
};
