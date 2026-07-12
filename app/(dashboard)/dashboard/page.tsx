import { EnrolledCourseCard } from "@/app/(dashboard)/_components/EnrolledCourseCard";
import { EnrolledCoursesEmptyState } from "@/app/(dashboard)/_components/EnrolledCoursesEmptyState";
import Header from "@/app/_components/Header";
import { StudentDashboardService } from "@/lib/services/dashboard/overview/student-dashboard-service";

export default async function DashboardHomePage() {
  const [displayName, courses] = await Promise.all([
    StudentDashboardService.getStudentDisplayName(),
    StudentDashboardService.getEnrolledCourses(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Header title="My Courses" />
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-customer-teal">
          Welcome back, {displayName}!
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Pick up where you left off and keep building the skills that move your
          Customer Success career forward.
        </p>
      </header>

      <section>
        <h2 className="mb-6 text-lg font-semibold text-customer-charcoal">
          My Courses
        </h2>

        {courses.length === 0 ? (
          <EnrolledCoursesEmptyState />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <li key={course.enrollmentId}>
                <EnrolledCourseCard course={course} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
