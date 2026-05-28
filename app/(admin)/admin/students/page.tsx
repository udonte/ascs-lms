import Header from "@/app/_components/Header";
import { GrantManualAccessDialog } from "@/app/(admin)/_components/GrantManualAccessDialog";
import { StudentLedgerTable } from "@/app/(admin)/_components/StudentLedgerTable";
import { AdminCourseService } from "@/lib/services/admin/courses/admin-course-service";
import { LedgerService } from "@/lib/services/admin/students/ledger-services";

function parseCoursePrice(price: number | string | null): number {
  if (price == null) return 0;
  if (typeof price === "number") return price;
  const n = Number(price);
  return Number.isFinite(n) ? n : 0;
}

export default async function StudentLedgerPage() {
  const [ledger, courses] = await Promise.all([
    LedgerService.getStudentLedger(),
    AdminCourseService.getAdminCourses(),
  ]);

  const courseOptions = courses.map((course) => ({
    id: course.id,
    title: course.title,
    price: parseCoursePrice(course.price),
  }));

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Header title="Student Ledger" />

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <p className="max-w-2xl text-sm text-customer-charcoal">
          Audit student access records, verify incoming transactions, or
          manually grant offline course enrollments.
        </p>
        <GrantManualAccessDialog courses={courseOptions} />
      </div>

      <StudentLedgerTable rows={ledger} />
    </div>
  );
}
