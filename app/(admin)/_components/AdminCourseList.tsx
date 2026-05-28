import Link from "next/link";
import { HiOutlineAcademicCap, HiOutlinePencil } from "react-icons/hi";

import {
  formatCoursePrice,
  getLessonCount,
  type AdminCourse,
} from "@/lib/services/admin/courses/admin-course-service";
import { CreateCourseDialog } from "./CreateCourseDialog";

type AdminCourseListProps = {
  courses: AdminCourse[];
};

function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
      Published
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 ring-1 ring-neutral-300/60">
      Draft
    </span>
  );
}

export function AdminCourseList({ courses }: AdminCourseListProps) {
  if (courses.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center shadow-sm mx-auto w-full max-w-5xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-customer-purple/10 text-customer-purple">
          <HiOutlineAcademicCap className="h-8 w-8" aria-hidden />
        </div>
        <h2 className="mt-6 text-xl font-bold text-customer-teal">
          No mastercourses yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-customer-charcoal">
          Create your first ASCS mastercourse to start building lessons,
          quizzes, and enrollments. New courses begin as drafts until you
          publish them.
        </p>
        <div className="mt-8 flex justify-center">
          <CreateCourseDialog
            triggerLabel="Create your first course"
            triggerVariant="empty"
          />
        </div>
      </section>
    );
  }

  return (
    <ul className="space-y-3">
      {courses.map((course) => {
        const lessonCount = getLessonCount(course.lessons);
        const priceLabel = formatCoursePrice(course.price);

        return (
          <li
            key={course.id}
            className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-customer-teal/30 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-customer-charcoal">
                  {course.title}
                </h3>
                <StatusBadge published={course.is_published} />
              </div>
              {course.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                  {course.description}
                </p>
              ) : (
                <p className="mt-1 text-sm italic text-neutral-400">
                  No description yet
                </p>
              )}
              <p className="mt-2 text-xs text-neutral-500">
                {lessonCount === 1 ? "1 lesson" : `${lessonCount} lessons`}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
              <span className="inline-flex rounded-full bg-customer-purple/10 px-3 py-1 text-sm font-semibold text-customer-purple">
                {priceLabel}
              </span>
              <Link
                href={`/admin/courses/${course.id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-customer-teal px-4 py-2 text-sm font-semibold text-customer-teal transition hover:bg-customer-teal hover:text-customer-cream"
              >
                <HiOutlinePencil className="h-4 w-4" aria-hidden />
                Edit Content
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
