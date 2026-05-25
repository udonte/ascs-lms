"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { notifyError, notifySuccess } from "@/lib/toast";
import { AiOutlineLogout } from "react-icons/ai";

type SignOutButtonProps = {
  variant?: "light" | "dark";
};

export function SignOutButton({ variant = "light" }: SignOutButtonProps) {
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        notifyError(error.message);
        setPending(false);
        return;
      }
      notifySuccess("Signed out successfully.");
      window.location.assign("/login");
    } catch {
      notifyError("Could not sign out. Please try again.");
      setPending(false);
    }
  }

  const className =
    variant === "dark"
      ? "rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50 cursor-pointer"
      : "rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-50 cursor-pointer";

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className={className}
    >
      <span className="hidden md:block">
        {pending ? "Signing out…" : "Sign out"}
      </span>
      <AiOutlineLogout className="block md:hidden ml-2 -mr-1 h-4 w-4" />
    </button>
  );
}
