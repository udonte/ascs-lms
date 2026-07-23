import { CatalogCourseCard } from "@/app/(dashboard)/_components/CatalogCourseCard";
import { CatalogEmptyState } from "@/app/(dashboard)/_components/CatalogEmptyState";
import Header from "@/app/_components/Header";
import { StudentDashboardService } from "@/lib/services/dashboard/overview/student-dashboard-service";

export default async function CourseCatalogPage() {
  const catalog = await StudentDashboardService.getCourseCatalog();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Header
        title="Course Catalog"
        description="Invest in your professional growth. Explore our premium training programs and unlock lifetime access."
      />

      {catalog.length === 0 ? (
        <CatalogEmptyState />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {catalog.map((course) => (
            <li key={course.id}>
              <CatalogCourseCard course={course} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
