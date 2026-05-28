import Link from "next/link";
import { HiOutlineAcademicCap } from "react-icons/hi";

export function EnrolledCoursesEmptyState() {
  return (
    <section className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-customer-purple/10 text-customer-purple">
        <HiOutlineAcademicCap className="h-8 w-8" aria-hidden />
      </div>
      <h2 className="mt-6 text-xl font-bold text-customer-teal">
        Your learning journey starts here
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-neutral-600">
        You have not enrolled in a mastercourse yet. Explore ASCS programs built
        for real-world Customer Success careers and unlock your next chapter.
      </p>
      <Link
        href="/dashboard/browse"
        className="mt-8 inline-flex rounded-lg bg-customer-gold px-6 py-3 text-sm font-semibold text-customer-charcoal shadow-md transition hover:bg-customer-gold/90"
      >
        Browse Available Courses
      </Link>
    </section>
  );
}
