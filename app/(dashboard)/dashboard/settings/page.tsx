import { StudentSettingsForm } from "@/app/(dashboard)/_components/StudentSettingsForm";
import { SettingsService } from "@/lib/services/dashboard/settings/settings-service";

export default async function SettingsPage() {
  const profile = await SettingsService.getStudentProfile();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-customer-teal md:text-3xl">
          Account Settings
        </h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          Manage your personal profile details, contact settings, and account
          preferences.
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-neutral-900">
            Profile Details
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Keep your learner profile up to date for certificates and course
            records.
          </p>
        </div>

        <StudentSettingsForm
          initialFullName={profile.full_name ?? ""}
          email={profile.email ?? ""}
        />
      </section>
    </div>
  );
}
