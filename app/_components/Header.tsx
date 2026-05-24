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

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    displayName = profile?.full_name ?? user.email?.split("@")[0] ?? "User";
  }

  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-[#003366]">{title}</h1>
      <div className="text-sm text-neutral-600">
        Signed in as{" "}
        <span className="font-medium text-[#003366]">{displayName}</span>
      </div>
    </div>
  );
}
