import type { ReactNode } from "react";

import { createClient } from "@/lib/supabase/server";

export default async function Header({
  title,
  description,
  actions,
}: Readonly<{
  title: string;
  description?: string;
  actions?: ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "Guest";
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    displayName = profile?.full_name ?? user.email?.split("@")[0] ?? "User";
    isAdmin = profile?.role === "admin";
  }

  return (
    <header className="sticky -top-8 z-30 mb-6 hidden items-start justify-between gap-6 border-b border-neutral-200/80 bg-[#F9FAFB] py-3 backdrop-blur-xs md:flex h-full">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold text-customer-teal lg:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-3xl text-sm text-neutral-600">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-6">
        {actions ? <div className="flex items-center">{actions}</div> : null}
        <div className="flex flex-col items-end gap-1 text-sm text-neutral-600">
          <p className="rounded bg-customer-purple px-2 py-0.5 text-xs font-semibold text-customer-cream shadow-xs">
            {isAdmin ? "Admin" : "Student"}
          </p>
          <p className="text-xs">
            Signed in as{" "}
            <span className="font-semibold text-customer-gold">
              {displayName}
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}
