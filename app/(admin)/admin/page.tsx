import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile, getProfileRole } from "@/src/lib/services/profile-service";

export default async function AdminHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await ensureUserProfile(supabase);
  }

  const role = user ? await getProfileRole(supabase, user.id) : "student";
  const fullName =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-[#003366]">Admin console</h1>
      <p className="mt-2 text-neutral-600">
        Signed in as{" "}
        <span className="font-medium text-neutral-900">
          {fullName ?? user?.email ?? "Unknown"}
        </span>{" "}
        <span className="rounded-full bg-[#003366]/10 px-2 py-0.5 text-xs font-medium text-[#003366]">
          {role}
        </span>
      </p>

      <section className="mt-10 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#003366]">Content management</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Course and lesson management will be added in the next milestone. For
          now, promote staff by setting{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">
            profiles.role
          </code>{" "}
          to{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">
            admin
          </code>{" "}
          in Supabase for their user id.
        </p>
      </section>
    </div>
  );
}
