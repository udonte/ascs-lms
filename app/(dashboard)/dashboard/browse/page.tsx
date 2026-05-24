import Header from "@/app/_components/Header";

export default async function Page() {
  return (
    <div>
      <Header title="Course Catalog" />
      <section className="rounded-lg border bg-white p-6">
        <p className="text-neutral-700">Browse available courses and start learning.</p>
      </section>
    </div>
  );
}
