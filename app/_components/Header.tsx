import type { ReactNode } from "react";

import { createClient } from "@/lib/supabase/server";

export default async function Header({
  title,
  actions,
}: Readonly<{
  title: string;
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
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    displayName = profile?.full_name ?? user.email?.split("@")[0] ?? "User";
    isAdmin =
      (
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()
      ).data?.role === "admin";
  }

  return (
    <div className="mb-6 hidden items-center justify-between gap-6 md:flex">
      <h1 className="text-3xl font-bold text-customer-teal">{title}</h1>
      <div className="flex flex-1 items-center justify-end gap-6">
        {actions ? <div className="flex items-center">{actions}</div> : null}
        <div className="flex flex-col items-end gap-1 text-sm text-neutral-600">
          <p className="font-medium bg-customer-purple text-customer-cream px-1.5 py-0.5 rounded">
            {isAdmin ? "Admin" : "Student"}
          </p>
          <p>
            Signed in as{" "}
            <span className="font-medium text-customer-gold">
              {displayName}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
