"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";
import { FaChevronCircleRight } from "react-icons/fa";

type UserState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "logged-in"; firstName: string; href: string };

// Single shared client — must be outside the component to avoid
// re-creating on every render, which breaks onAuthStateChange
const supabase = createClient();

type UserGreetingProps = {
  mobile?: boolean;
};

export function UserGreeting({ mobile = false }: UserGreetingProps) {
  const [userState, setUserState] = useState<UserState>({ status: "loading" });

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserState({ status: "guest" });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .maybeSingle();

      const firstName =
        profile?.full_name?.trim().split(" ")[0] ??
        user.email?.split("@")[0] ??
        "there";

      // Route admins to /admin, everyone else to /dashboard
      const href = profile?.role === "admin" ? "/admin" : "/dashboard";

      setUserState({ status: "logged-in", firstName, href });
    }

    loadUser();

    // Stay in sync across tabs (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => loadUser());

    return () => subscription.unsubscribe();
  }, []);

  if (userState.status === "loading" || userState.status === "guest") {
    return null;
  }

  const label = userState.href === "/admin" ? "Admin Panel" : "My Dashboard";

  return (
    <Link
      href={userState.href}
      className={`items-center gap-2  border-l border-customer-gold/30  px-3 py-2 text-sm transition  ${
        mobile ? "flex w-full justify-between" : "inline-flex"
      }`}
    >
      <span className="text-neutral-600">
        Hi, <span className="">{userState.firstName}</span> 👋
      </span>
      <span className="flex items-center gap-1 text-xs font-semibold bg-customer-gold/80 hover:bg-customer-gold text-customer-charcoal px-2 py-1 rounded-lg transition">
        Go to {label}
        <FaChevronCircleRight className="h-3.5 w-3.5" />
        <FaChevronCircleRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
