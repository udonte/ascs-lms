import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import {
  ensureUserProfile,
  getProfileRole,
  resolvePostAuthPath,
  sanitizeNextPath,
} from "@/src/lib/services/profile-service";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = sanitizeNextPath(requestUrl.searchParams.get("next"));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(
      new URL("/login?error=missing_env", request.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", request.url),
    );
  }

  let redirectTo = new URL("/dashboard", requestUrl.origin);
  let response = NextResponse.redirect(redirectTo);

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.redirect(redirectTo);
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const login = new URL("/login", request.url);
    login.searchParams.set("error", "auth_callback");
    login.searchParams.set(
      "message",
      "We could not verify that link. It may have expired—request a new one.",
    );
    login.searchParams.set("next", next);
    return NextResponse.redirect(login);
  }

  const profile = await ensureUserProfile(supabase);
  if (profile.error) {
    console.error("[profile-service]", profile.error);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user ? await getProfileRole(supabase, user.id) : "student";
  redirectTo = new URL(resolvePostAuthPath(role, next), requestUrl.origin);
  redirectTo.searchParams.set("toast", "welcome");

  const finalResponse = NextResponse.redirect(redirectTo);
  response.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie);
  });

  return finalResponse;
}
