import Header from "@/app/_components/Header";

export default async function Page() {
  return (
    <div>
      <Header title="My Certificates" />
      <section className="rounded-lg border bg-white p-6">
        <p className="text-neutral-700">Completed courses and downloadable certificates will be listed here.</p>
      </section>
    </div>
  );
}
