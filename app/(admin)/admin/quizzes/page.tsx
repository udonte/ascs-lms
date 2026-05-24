import Header from "@/app/_components/Header";

export default async function Page() {
  return (
    <div>
      <Header title="Quiz Builder" />
      <section className="rounded-lg border bg-white p-6">
        <p className="text-neutral-700">Create JSON-structured quizzes and set passing scores here.</p>
      </section>
    </div>
  );
}
