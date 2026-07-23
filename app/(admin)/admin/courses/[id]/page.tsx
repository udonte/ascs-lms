import Link from "next/link";
import { notFound } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi";

import Header from "@/app/_components/Header";
import { CourseLessonsPanel } from "@/app/(admin)/_components/CourseLessonsPanel";
import { CourseSettingsForm } from "@/app/(admin)/_components/CourseSettingsForm";
import { DeleteCourseButton } from "@/app/(admin)/_components/DeleteCourseButton";
import {
  AdminCourseService,
  formatCoursePrice,
} from "@/lib/services/admin/courses/admin-course-service";
import { QuizService } from "@/lib/services/admin/quizzes/quiz-service";

type CourseEditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CourseEditorPage({
  params,
}: CourseEditorPageProps) {
  const { id } = await params;
  const [course, hasQuiz] = await Promise.all([
    AdminCourseService.getAdminCourseById(id),
    QuizService.courseHasQuiz(id),
  ]);

  if (!course) {
    notFound();
  }

  const priceLabel = formatCoursePrice(course.price);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Header
        title={`Course Editor — ${course.title}`}
        description="Manage curriculum lessons, pricing, publishing status, and quiz settings for this course."
      />

      <Link
        href="/admin/courses"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-customer-teal transition hover:text-customer-purple"
      >
        <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
        Back to Content Manager
      </Link>

      {/* Course header */}
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

      {/* Main editor grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        <CourseSettingsForm course={course} hasQuiz={hasQuiz} />
        <CourseLessonsPanel courseId={course.id} lessons={course.lessons} />
      </div>

      {/* ── Danger Zone ──────────────────────────────────────────────────────── */}
      <section className="mt-12 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-100 bg-red-50 px-6 py-4">
          <h2 className="text-base font-bold text-red-700">Danger Zone</h2>
          <p className="mt-1 text-sm text-red-600">
            These actions are permanent and cannot be undone.
          </p>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-800">
              Delete this course
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">
              Permanently removes the course, all its lessons, enrollments,
              quizzes, certificates, and progress records. This cannot be
              reversed.
            </p>
          </div>

          <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
        </div>
      </section>
    </div>
  );
}
