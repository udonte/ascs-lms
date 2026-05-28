import { HiOutlineSparkles } from "react-icons/hi";

export function CatalogEmptyState() {
  return (
    <section className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-customer-purple/10 text-customer-purple">
        <HiOutlineSparkles className="h-8 w-8" aria-hidden />
      </div>
      <h2 className="mt-6 text-xl font-bold text-customer-teal">
        New courses are landing soon!
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-neutral-600">
        Our team is preparing the next wave of ASCS mastercourses. Check back
        shortly for new programs designed to accelerate your Customer Success
        career.
      </p>
    </section>
  );
}
