import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineLockClosed,
} from "react-icons/hi";

import {
  getCourseThumbnailUrl,
  truncateDescription,
  type EnrolledCourse,
} from "@/lib/services/student-dashboard-service";

type EnrolledCourseCardProps = {
  course: EnrolledCourse;
};

export function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  const imageUrl = getCourseThumbnailUrl(course.courseId, course.thumbnailUrl);
  const resumeHref = `/dashboard/courses/${course.courseId}`;
  const hasLessons = course.totalLessons > 0;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:border-customer-teal/40 hover:shadow-md">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-customer-purple via-customer-teal to-customer-gold">
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-customer-charcoal/20" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-customer-charcoal line-clamp-2">
          {course.title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
            <span className="h-2 w-2 rounded-full bg-customer-teal" aria-hidden />
            {course.progressPercent}% complete
          </span>

          {course.hasQuiz ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
              {course.progressPercent < 100 ? (
                <>
                  <HiOutlineLockClosed className="h-4 w-4 text-neutral-500" aria-hidden />
                  Assessment locked
                </>
              ) : course.quizAttempt?.passed ? (
                <>
                  <HiOutlineCheckCircle className="h-4 w-4 text-emerald-600" aria-hidden />
                  Passed
                </>
              ) : course.quizAttempt ? (
                <>
                  <HiOutlineExclamationCircle className="h-4 w-4 text-amber-600" aria-hidden />
                  Not passed
                </>
              ) : (
                <>
                  <HiOutlineAcademicCap className="h-4 w-4 text-customer-gold" aria-hidden />
                  Assessment ready
                </>
              )}
            </span>
          ) : null}
        </div>

        <p className="mt-2 flex-1 text-sm text-neutral-600 line-clamp-3">
          {truncateDescription(course.description)}
        </p>

        {hasLessons ? (
          <Link
            href={resumeHref}
            className="mt-5 block w-full rounded-lg bg-customer-gold py-3 text-center text-sm font-semibold text-customer-charcoal shadow-sm transition hover:bg-customer-gold/90"
          >
            Resume Learning
          </Link>
        ) : (
          <div className="mt-5 w-full rounded-lg bg-neutral-100 py-3 text-center text-sm font-semibold text-neutral-500">
            Content coming soon
          </div>
        )}
      </div>
    </article>
  );
}
