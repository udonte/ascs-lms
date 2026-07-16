import { createClient } from "@/lib/supabase/server";
import {
  canAccessAdminRoute,
  getProfileRole,
} from "@/lib/services/profile-service";

type LedgerCourseJoin = { title: string };
type LedgerProfileJoin = { full_name: string | null; email: string | null };

export type StudentLedgerRow = {
  id: string;
  status: string;
  amount_paid: number | string | null;
  created_at: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
};

function embedOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function parseAmount(value: number | string | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatLedgerAmount(amount: number | string | null): string {
  const value = parseAmount(amount);
  if (value <= 0) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatLedgerDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

function normalizeLedgerRow(row: {
  id: string;
  status: string;
  amount_paid: number | string | null;
  created_at: string;
  course: LedgerCourseJoin | LedgerCourseJoin[] | null;
  profile: LedgerProfileJoin | LedgerProfileJoin[] | null;
}): StudentLedgerRow {
  const course = embedOne(row.course);
  const profile = embedOne(row.profile);

  return {
    id: row.id,
    status: row.status,
    amount_paid: row.amount_paid,
    created_at: row.created_at,
    studentName: profile?.full_name?.trim() || "Unknown student",
    studentEmail: profile?.email?.trim() || "—",
    courseTitle: course?.title?.trim() || "Unknown course",
  };
}

async function assertStaff(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const role = await getProfileRole(supabase, user.id);
  if (!canAccessAdminRoute(role)) {
    throw new Error(
      "Only admins and instructors can manage the student ledger.",
    );
  }

  return user;
}

/**
 * LEDGER SERVICE
 * Manages administrative auditing, manual student enrollment overrides,
 * and tracking overall platform progress.
 */
export const LedgerService = {
  /**
   * Fetches a clean ledger of all students and their current course access.
   */
  async getStudentLedger(): Promise<StudentLedgerRow[]> {
    const supabase = await createClient();

    try {
      await assertStaff(supabase);
    } catch {
      return [];
    }

    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        id,
        status,
        amount_paid,
        created_at,
        course:courses(title),
        profile:profiles!user_id(full_name, email)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching ledger data:", error.message);
      return [];
    }

    return (data ?? []).map(normalizeLedgerRow);
  },

  /**
   * Fetches the 5 most recent enrollments for the admin dashboard overview.
   */
  async getRecentTransactions(): Promise<StudentLedgerRow[]> {
    const supabase = await createClient();

    try {
      await assertStaff(supabase);
    } catch {
      return [];
    }

    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        id,
        status,
        amount_paid,
        created_at,
        course:courses(title),
        profile:profiles!user_id(full_name, email)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching recent transactions:", error.message);
      return [];
    }

    return (data ?? []).map(normalizeLedgerRow);
  },

  /**
   * Admin Manual Override: Grants a student instant access to a course.
   * Useful for direct bank transfers or physical cash sales.
   * Uses upsert so re-granting the same course to the same student is
   * idempotent — updates amount_paid rather than throwing a unique constraint error.
   */
  async grantManualAccess(
    studentEmail: string,
    courseId: string,
    amountPaid: number,
  ) {
    const supabase = await createClient();
    await assertStaff(supabase);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", studentEmail)
      .maybeSingle();

    if (profileError || !profile) {
      throw new Error("No user profile found with that email address.");
    }

    const { data, error } = await supabase
      .from("enrollments")
      .upsert(
        {
          user_id: profile.id,
          course_id: courseId,
          status: "paid",
          amount_paid: amountPaid,
          payment_gateway: "manual",
        },
        { onConflict: "user_id,course_id" },
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
