import Header from "@/app/_components/Header";
import { GrantManualAccessDialog } from "@/app/(admin)/_components/GrantManualAccessDialog";
import { StudentLedgerTable } from "@/app/(admin)/_components/StudentLedgerTable";
import { StudentsSubNav } from "@/app/(admin)/_components/StudentsSubNav";
import { AdminCourseService } from "@/lib/services/admin/courses/admin-course-service";
import { LedgerService } from "@/lib/services/admin/students/ledger-services";
import { VerifyCertificateModal } from "../../_components/VerifyCertificateModal";

function parseCoursePrice(price: number | string | null): number {
  if (price == null) return 0;
  if (typeof price === "number") return price;
  const n = Number(price);
  return Number.isFinite(n) ? n : 0;
}

export default async function StudentLedgerPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
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
      <Header
        title="Students"
        description="Audit student access records, verify incoming transactions, or manually grant offline course enrollments."
      />
      <div className="mb-8 flex flex-col md:flex-row items-center justify-center lg:justify-between gap-4 w-full">
        <VerifyCertificateModal />
        <GrantManualAccessDialog courses={courseOptions} />
      </div>
      <StudentsSubNav />
      <StudentLedgerTable rows={ledger} page={page} />
    </div>
  );
}
