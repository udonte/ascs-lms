import { HiOutlineUsers } from "react-icons/hi";

import Header from "@/app/_components/Header";
import { Pagination } from "@/app/_components/Pagination";
import { StudentsSubNav } from "@/app/(admin)/_components/StudentsSubNav";
import {
  StudentListService,
  formatStudentJoinDate,
  formatStudentTotalPaid,
} from "@/lib/services/admin/students/student-list-service";

const PAGE_SIZE = 15;

export default async function StudentListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const students = await StudentListService.getStudentList();

  const totalEnrolled = students.filter((s) => s.enrollmentCount > 0).length;
  const totalRevenue = students.reduce((sum, s) => sum + s.totalPaid, 0);

  const totalPages = Math.ceil(students.length / PAGE_SIZE);
  const safePage = Math.max(1, Math.min(page, totalPages));
  const pageStudents = students.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Header
        title="Student List"
        description="View all registered student accounts, their enrollment counts, and total spent."
      />
      <StudentsSubNav />

      {/* Summary stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Total Registered
          </p>
          <p className="mt-1 text-2xl font-bold text-customer-teal">
            {students.length}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            With Enrollments
          </p>
          <p className="mt-1 text-2xl font-bold text-customer-purple">
            {totalEnrolled}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Total Revenue
          </p>
          <p className="mt-1 text-2xl font-bold text-customer-charcoal">
            {formatStudentTotalPaid(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Student table */}
      {students.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
            <HiOutlineUsers className="h-7 w-7" aria-hidden />
          </div>
          <h2 className="mt-4 text-lg font-bold text-customer-teal">
            No students yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
            Student accounts will appear here once people sign up for ASCS.
          </p>
        </section>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                    Student
                  </th>
                  <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                    Joined
                  </th>
                  <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                    Courses
                  </th>
                  <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                    Total Paid
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pageStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-neutral-50/80">
                    <td className="px-4 py-4 sm:px-6">
                      <p className="font-semibold text-customer-charcoal">
                        {student.fullName}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {student.email}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-neutral-600 sm:px-6">
                      {formatStudentJoinDate(student.joinedAt)}
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      {student.enrollmentCount > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-customer-teal/10 px-2.5 py-1 text-xs font-semibold text-customer-teal">
                          {student.enrollmentCount}{" "}
                          {student.enrollmentCount === 1 ? "course" : "courses"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                          Not enrolled
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 font-semibold text-customer-purple sm:px-6">
                      {formatStudentTotalPaid(student.totalPaid)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={safePage}
            totalPages={totalPages}
            basePath="/admin/students/list"
          />
        </div>
      )}
    </div>
  );
}
