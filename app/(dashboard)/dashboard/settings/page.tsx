import Header from "@/app/_components/Header";

export default async function Page() {
  return (
    <div>
      <Header title="Account Settings" />
      <section className="rounded-lg border bg-white p-6">
        <p className="text-neutral-700">
          Update profile picture, display name, and security settings.
        </p>
      </section>
    </div>
  );
}
