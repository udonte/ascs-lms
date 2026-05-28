import {
  formatLedgerAmount,
  formatLedgerDate,
  type StudentLedgerRow,
} from "@/lib/services/admin/students/ledger-services";
import { LedgerStatusBadge } from "./LedgerStatusBadge";

type StudentLedgerTableProps = {
  rows: StudentLedgerRow[];
};

export function StudentLedgerTable({ rows }: StudentLedgerTableProps) {
  if (rows.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center shadow-sm">
        <h2 className="text-lg font-bold text-customer-teal">
          No enrollments yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
          When students purchase courses or you grant manual access, their
          enrollment records will appear here for auditing.
        </p>
      </section>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                Student
              </th>
              <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                Course
              </th>
              <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                Date
              </th>
              <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                Status
              </th>
              <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-50/80">
                <td className="px-4 py-4 sm:px-6">
                  <p className="font-semibold text-customer-charcoal">
                    {row.studentName}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {row.studentEmail}
                  </p>
                </td>
                <td className="px-4 py-4 font-medium text-customer-charcoal sm:px-6">
                  {row.courseTitle}
                </td>
                <td className="px-4 py-4 text-neutral-600 sm:px-6">
                  {formatLedgerDate(row.created_at)}
                </td>
                <td className="px-4 py-4 sm:px-6">
                  <LedgerStatusBadge status={row.status} />
                </td>
                <td className="px-4 py-4 font-semibold text-customer-purple sm:px-6">
                  {formatLedgerAmount(row.amount_paid)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
