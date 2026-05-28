"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { SignOutButton } from "@/app/(dashboard)/_components/SignOutButton";
import { createClient } from "@/lib/supabase/client";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview / My Courses",
  "/dashboard/browse": "Course Catalog",
  "/dashboard/certificates": "My Certificates",
  "/dashboard/settings": "Account Settings",
  "/admin": "Performance Insights",
  "/admin/courses": "Content Manager",
  "/admin/students": "Student Ledger",
  "/admin/quizzes": "Quiz Builder",
};

export function MobileHeader() {
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState("Guest");

  const title = useMemo(() => {
    if (!pathname) return "ASCS LMS";
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
    if (pathname.startsWith("/admin/courses/")) return "Course Editor";
    if (pathname.includes("/dashboard/courses/") && pathname.includes("/lessons/")) {
      return "Classroom";
    }
    if (pathname.startsWith("/dashboard/checkout")) return "Checkout";
    return pathname.startsWith("/admin") ? "ASCS Admin" : "ASCS LMS";
  }, [pathname]);

  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setDisplayName("Guest");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      setDisplayName(profile?.full_name ?? user.email?.split("@")[0] ?? "User");
    }

    loadUser();
  }, []);

  return (
    <div
      className={`flex h-16 items-center justify-between gap-2 border-b px-4 md:hidden ${isAdmin ? "bg-customer-purple" : "bg-white"}`}
    >
      <div className="min-w-0">
        <p
          className={`truncate text-sm font-semibold ${isAdmin ? "text-white" : "text-customer-purple"}`}
        >
          {title}
        </p>
        <p
          className={`flex items-center gap-2 truncate text-xs ${isAdmin ? "text-white/80" : "text-neutral-500 "}`}
        >
          <span className="flex items-center justify-center font-medium w-fit bg-customer-teal text-white px-1.5 py-0.5 rounded ">
            {isAdmin ? "Admin" : "Student"}
          </span>
          Signed in as {displayName}
        </p>
      </div>
      <SignOutButton variant={isAdmin ? "dark" : "light"} />
    </div>
  );
}
