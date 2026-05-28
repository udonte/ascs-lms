import Link from "next/link";

export default function ClassroomLessonNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-2xl font-bold text-customer-teal">Lesson not found</h1>
      <p className="mt-2 text-sm text-neutral-600">
        This lesson is unavailable or you do not have access to it.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex rounded-lg bg-customer-gold px-5 py-2.5 text-sm font-semibold text-customer-charcoal"
      >
        Back to My Courses
      </Link>
    </div>
  );
}
