import { createClient } from "@/lib/supabase/server";

export const SettingsService = {
  /**
   * Fetches the logged-in student's current profile data.
   */
  async getStudentProfile() {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching student profile:", error.message);
      return { full_name: "", email: user.email || "" };
    }

    return data;
  },

  /**
   * Server Action Target: Updates the student's personal display name.
   * Writes to both the profiles table AND Supabase Auth user_metadata so they
   * stay in sync. This prevents any future ensureUserProfile() calls from
   * reading stale metadata and resetting the name.
   */
  async updateProfileSettings(fullName: string) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 1. Update the profiles table (source of truth for the LMS)
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);

    if (profileError) throw new Error(profileError.message);

    // 2. Sync to Supabase Auth user_metadata so it stays consistent
    const { error: metaError } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    // Non-fatal: log but don't surface the metadata sync error to the user
    if (metaError) {
      console.error("[settings] Failed to sync name to auth metadata:", metaError.message);
    }

    return { success: true };
  },
};
