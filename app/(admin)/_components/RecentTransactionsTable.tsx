import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi";

import {
  formatLedgerAmount,
  formatLedgerDate,
  type StudentLedgerRow,
} from "@/lib/services/admin/students/ledger-services";
import { LedgerStatusBadge } from "./LedgerStatusBadge";

type RecentTransactionsTableProps = {
  rows: StudentLedgerRow[];
};

export default function RecentTransactionsTable({
  rows,
}: RecentTransactionsTableProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-customer-teal">
            Recent Transactions
          </h2>
          <p className="mt-1 text-sm text-customer-charcoal">
            The 5 most recent enrollment activities.
          </p>
        </div>
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          View all
          <HiOutlineArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-neutral-500">
          No transactions yet. Enrollment records will appear here once students
          purchase or are granted access.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-customer-gold/10 text-left text-sm text-customer-charcoal">
              <tr>
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">Course</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm text-neutral-700">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-neutral-100 hover:bg-neutral-50/80"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-customer-charcoal">
                      {row.studentName}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {row.studentEmail}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-medium text-customer-charcoal">
                    {row.courseTitle}
                  </td>
                  <td className="px-6 py-4 font-semibold text-customer-purple">
                    {formatLedgerAmount(row.amount_paid)}
                  </td>
                  <td className="px-6 py-4">
                    <LedgerStatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {formatLedgerDate(row.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
