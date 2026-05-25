import Header from "@/app/_components/Header";

export default async function Page() {
  return (
    <div>
      <Header title="Content Manager" />
      <section className="rounded-lg border bg-white p-6">
        <p className="text-neutral-700">Create, edit, and reorder courses, modules, and lessons.</p>
      </section>
    </div>
  );
}
