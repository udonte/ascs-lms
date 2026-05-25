import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileRole = "student" | "admin" | "instructor";

const ADMIN_ROLES: ProfileRole[] = ["admin", "instructor"];

/**
 * Ensures a `profiles` row exists for the current auth user (id = auth.users.id).
 * New users get role `student`; existing rows are not overwritten.
 */
export async function ensureUserProfile(
  supabase: SupabaseClient,
): Promise<{ error: string | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No authenticated user" };
  }

  const fullName =
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ??
    user.email?.split("@")[0] ??
    "Student";

  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    return { error: selectError.message };
  }

  if (!existing) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email ?? undefined,
      full_name: fullName,
      role: "student",
      school_id: "ascs",
    });

    if (insertError) {
      return { error: insertError.message };
    }

    return { error: null };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      email: user.email ?? undefined,
    })
    .eq("id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  return { error: null };
}

export async function getProfileRole(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileRole> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data?.role) {
    return "student";
  }

  const role = data.role as string;
  if (role === "admin" || role === "instructor" || role === "student") {
    return role;
  }

  return "student";
}

const AUTH_ROUTE_PREFIXES = [
  "/login",
  "/signup",
  "/signUp",
  "/forgot-password",
  "/reset-password",
  "/auth/",
] as const;

function isSafeNextPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

/** Prevents redirect loops through login/signup and other auth-only URLs. */
export function sanitizeNextPath(next: string | null | undefined): string {
  if (!next || !isSafeNextPath(next)) {
    return "/dashboard";
  }

  const pathOnly = next.split("?")[0].toLowerCase();

  if (
    AUTH_ROUTE_PREFIXES.some(
      (authPath) =>
        pathOnly === authPath.toLowerCase() ||
        pathOnly.startsWith(`${authPath.toLowerCase()}/`),
    )
  ) {
    return "/dashboard";
  }

  return next.split("?")[0];
}

export function resolvePostAuthPath(role: ProfileRole, next: string): string {
  const safeNext = sanitizeNextPath(next);

  if (ADMIN_ROLES.includes(role)) {
    if (safeNext.startsWith("/admin")) {
      return safeNext;
    }
    return "/admin";
  }

  if (safeNext.startsWith("/admin")) {
    return "/dashboard";
  }

  return safeNext;
}

export function defaultHomeForRole(role: ProfileRole): string {
  return ADMIN_ROLES.includes(role) ? "/admin" : "/dashboard";
}

export function canAccessAdminRoute(role: ProfileRole): boolean {
  return ADMIN_ROLES.includes(role);
}
