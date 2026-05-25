import Header from "@/app/_components/Header";

export default async function Page() {
  return (
    <div>
      <Header title="Student Ledger" />
      <section className="rounded-lg border bg-white p-6">
        <p className="text-neutral-700">
          A table of students, enrollments, and payments will appear here.
        </p>
      </section>
    </div>
  );
}
