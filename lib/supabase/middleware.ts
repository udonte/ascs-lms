import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  canAccessAdminRoute,
  defaultHomeForRole,
  getProfileRole,
} from "@/lib/services/profile-service";

function isAuthPage(pathname: string): boolean {
  const path = pathname.toLowerCase();
  return (
    path === "/login" ||
    path === "/signup" ||
    path === "/forgot-password"
  );
}

/** Preserve refreshed session cookies when middleware issues a redirect. */
function redirectWithSession(
  request: NextRequest,
  sessionResponse: NextResponse,
  pathname: string,
  options?: { clearSearch?: boolean; searchParams?: Record<string, string> },
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;

  if (options?.clearSearch !== false) {
    url.search = "";
  }

  if (options?.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const redirectResponse = NextResponse.redirect(url);

  sessionResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
    }
    console.warn(
      "[supabase] URL or anon key missing; set them in .env.local. Protected routes stay login-gated without a session.",
    );
    if (
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/admin")
    ) {
      return redirectWithSession(request, supabaseResponse, "/login", {
        clearSearch: false,
        searchParams: { next: request.nextUrl.pathname },
      });
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const authCode = request.nextUrl.searchParams.get("code");

  if (authCode && !pathname.startsWith("/auth/callback")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    if (!url.searchParams.has("next")) {
      url.searchParams.set("next", "/dashboard");
    }
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  if (user && isAuthPage(pathname)) {
    const role = await getProfileRole(supabase, user.id);
    return redirectWithSession(
      request,
      supabaseResponse,
      defaultHomeForRole(role),
    );
  }

  if (!user) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      return redirectWithSession(request, supabaseResponse, "/login", {
        clearSearch: false,
        searchParams: { next: request.nextUrl.pathname },
      });
    }

    if (pathname === "/reset-password") {
      return redirectWithSession(
        request,
        supabaseResponse,
        "/forgot-password",
      );
    }

    return supabaseResponse;
  }

  const role = await getProfileRole(supabase, user.id);

  if (pathname.startsWith("/admin") && !canAccessAdminRoute(role)) {
    return redirectWithSession(request, supabaseResponse, "/dashboard");
  }

  return supabaseResponse;
}
