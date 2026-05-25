import { createClient } from "@/lib/supabase/server";

export default async function Header({
  title,
}: Readonly<{
  title: string;
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
    <div className="mb-6 hidden md:flex items-center justify-between ">
      <h1 className="text-2xl font-semibold text-[#003366]">{title}</h1>
      <div className="flex flex-col items-end gap-1 text-sm text-neutral-600">
        <p className="font-medium bg-customer-teal text-white px-1.5 py-0.5 rounded">
          {isAdmin ? "Admin" : "Student"}
        </p>
        <p>
          Signed in as{" "}
          <span className="font-medium text-[#003366]">{displayName}</span>
        </p>
      </div>
    </div>
  );
}
