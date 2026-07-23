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
      <Header
        title={`Welcome back to your courses, ${displayName}!`}
        description="Pick up where you left off and keep building the skills that move your Customer Success career forward."
      />

      <section>
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
