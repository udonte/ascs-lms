type CourseCompletionRow = {
  courseId: string;
  courseTitle: string;
  enrolled: number;
  completed: number;
  completionPercent: number;
};

type CourseCompletionRatesProps = {
  courses: CourseCompletionRow[];
};

/**
 * Per-course horizontal bar chart showing enrolled vs completed students.
 */
export default function CourseCompletionRates({
  courses,
}: CourseCompletionRatesProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-4 py-3 md:px-6 md:py-5">
        <h2 className="text-lg font-semibold text-customer-teal">
          Course Completion Rates
        </h2>
        <p className="mt-1 text-sm text-customer-charcoal">
          How many enrolled students have completed each course
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-neutral-500">
          No courses yet. Completion metrics will appear once courses are
          created and students enroll.
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {courses.map((course) => (
            <div
              key={course.courseId}
              className="flex flex-col gap-3 px-4 py-4 md:px-6"
            >
              {/* Course title + stats */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-4">
                <h3 className="text-sm font-semibold text-customer-charcoal truncate">
                  {course.courseTitle}
                </h3>
                <div className="flex shrink-0 items-center gap-3 text-xs text-neutral-500">
                  <span>
                    <span className="font-semibold text-customer-charcoal">
                      {course.completed}
                    </span>
                    /{course.enrolled} completed
                  </span>
                  <span
                    className={`min-w-[3rem] rounded-full px-2 py-0.5 text-center text-xs font-bold ${
                      course.completionPercent >= 75
                        ? "bg-emerald-100 text-emerald-700"
                        : course.completionPercent >= 40
                          ? "bg-amber-100 text-amber-700"
                          : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {course.completionPercent}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    course.completionPercent >= 75
                      ? "bg-emerald-500"
                      : course.completionPercent >= 40
                        ? "bg-amber-400"
                        : "bg-neutral-300"
                  }`}
                  style={{
                    width: `${course.enrolled > 0 ? course.completionPercent : 0}%`,
                  }}
                />
              </div>

              {/* No enrollments hint */}
              {course.enrolled === 0 && (
                <p className="text-xs text-neutral-400">
                  No students enrolled yet
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
