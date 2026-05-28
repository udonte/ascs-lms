"use server";

import { revalidatePath } from "next/cache";

import { SettingsService } from "./settings-service";

export async function updateProfileSettingsAction(fullName: string) {
  const trimmed = fullName.trim();
  await SettingsService.updateProfileSettings(trimmed);
  revalidatePath("/dashboard/settings");
  return { success: true as const };
}

