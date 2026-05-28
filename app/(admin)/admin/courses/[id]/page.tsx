import Link from "next/link";
import { notFound } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi";

import Header from "@/app/_components/Header";
import { CourseLessonsPanel } from "@/app/(admin)/_components/CourseLessonsPanel";
import { CourseSettingsForm } from "@/app/(admin)/_components/CourseSettingsForm";
import {
  AdminCourseService,
  formatCoursePrice,
} from "@/lib/services/admin/courses/admin-course-service";

type CourseEditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CourseEditorPage({
  params,
}: CourseEditorPageProps) {
  const { id } = await params;
  const course = await AdminCourseService.getAdminCourseById(id);

  if (!course) {
    notFound();
  }

  const priceLabel = formatCoursePrice(course.price);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Header title="Course Editor" />

      <Link
        href="/admin/courses"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-customer-teal transition hover:text-customer-purple"
      >
        <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
        Back to Content Manager
      </Link>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-customer-charcoal">
          {course.title}
        </h2>
        <span className="rounded-full bg-customer-purple/10 px-3 py-1 text-xs font-semibold text-customer-purple">
          {priceLabel}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            course.is_published
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
              : "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-300/60"
          }`}
        >
          {course.is_published ? "Published" : "Draft"}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <CourseSettingsForm course={course} />
        <CourseLessonsPanel courseId={course.id} lessons={course.lessons} />
      </div>
    </div>
  );
}
