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
   */
  async updateProfileSettings(fullName: string) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);

    if (error) throw new Error(error.message);
    return { success: true };
  },
};
