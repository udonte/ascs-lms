import Link from "next/link";
import { notFound } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { HiOutlineAcademicCap, HiOutlineLockClosed } from "react-icons/hi";

import { getCourseThumbnailUrl } from "@/lib/services/student-dashboard-service";
import { StudentCourseService } from "@/lib/services/student-course-service";
import Header from "@/app/_components/Header";

type CourseEntryPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseEntryPage({
  params,
}: CourseEntryPageProps) {
  const { courseId } = await params;
  const resumeContext =
    await StudentCourseService.getCourseResumeContext(courseId);

  if (!resumeContext) {
    notFound();
  }

  const {
    course,
    progressPercent,
    resumeLessonId,
    completedLessonIds,
    isCourseFullyViewed,
    quiz,
    quizAttempt,
  } = resumeContext;

  const resumeHref = `/dashboard/courses/${courseId}/lessons/${resumeLessonId}`;
  const hasStarted = completedLessonIds.length > 0;
  const heroImageUrl = getCourseThumbnailUrl(courseId, course.thumbnail_url);
  const hasQuiz = Boolean(quiz);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Header title="Welcome to the Course" />
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-customer-teal transition hover:text-customer-purple cursor-pointer"
      >
        <HiOutlineArrowLeft className="h-4 w-4" aria-hidden /> Back to my
        courses
      </Link>
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-start gap-4 px-4 py-6">
          <div className="relative aspect-video w-full lg:w-1/2 bg-linear-to-br from-customer-purple via-customer-teal to-customer-gold rounded-2xl">
            <img
              src={heroImageUrl}
              alt={course.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-customer-charcoal/20" />
          </div>

          <div className="space-y-6 flex-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-customer-purple">
                Your course
              </p>
              <h1 className="mt-2 text-3xl font-bold text-customer-teal">
                {course.title}
              </h1>
              {course.description ? (
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-neutral-600">
                  {course.description}
                </p>
              ) : (
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-neutral-500">
                  No description provided for this course yet.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-customer-charcoal">
                  Progress
                </p>
                <p className="text-sm font-semibold text-neutral-600">
                  {progressPercent}% complete
                </p>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-neutral-100">
                <div
                  className="h-2 rounded-full bg-customer-teal"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                Your next lesson will be highlighted in the classroom syllabus.
              </p>
            </div>

            {hasQuiz ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <HiOutlineAcademicCap
                      className="mt-0.5 h-5 w-5 text-customer-gold"
                      aria-hidden
                    />
                    <div>
                      <p className="text-sm font-semibold text-customer-charcoal">
                        Final Assessment
                      </p>
                      {!isCourseFullyViewed ? (
                        <p className="mt-1 text-xs text-neutral-500">
                          Complete all lessons to unlock the final assessment.
                        </p>
                      ) : quizAttempt ? (
                        <p className="mt-1 text-xs text-neutral-500">
                          Attempted • Score {quizAttempt.score}%
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-neutral-500">
                          Unlocked • Not taken yet
                        </p>
                      )}
                    </div>
                  </div>

                  {!isCourseFullyViewed ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500">
                      <HiOutlineLockClosed className="h-4 w-4" aria-hidden />
                      Locked
                    </span>
                  ) : quizAttempt?.passed ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <HiOutlineCheckCircle className="h-4 w-4" aria-hidden />
                      Passed
                    </span>
                  ) : quizAttempt ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      <HiOutlineExclamationCircle
                        className="h-4 w-4"
                        aria-hidden
                      />
                      Not passed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                      Ready
                    </span>
                  )}
                </div>
              </div>
            ) : null}

            <Link
              href={resumeHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-customer-teal px-6 py-4 text-base font-semibold text-customer-cream shadow-md transition hover:bg-customer-teal/90 sm:w-auto"
            >
              {hasStarted ? "Continue Learning" : "Start Learning"}
              <HiOutlineArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
