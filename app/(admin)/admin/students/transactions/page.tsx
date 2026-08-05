import { HiOutlineCreditCard } from "react-icons/hi";
import Header from "@/app/_components/Header";
import { Pagination } from "@/app/_components/Pagination";
import { StudentsSubNav } from "@/app/(admin)/_components/StudentsSubNav";
import {
  PaymentTransactionService,
  formatTxAmount,
  formatTxDate,
} from "@/lib/services/admin/students/payment-transaction-service";

const PAGE_SIZE = 20;

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  refunded: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-600",
};

export default async function PaymentTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const transactions = await PaymentTransactionService.getAll();

  const totalRevenue = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter((t) => t.status === "refunded")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const safePage = Math.max(1, Math.min(page, totalPages));
  const pageRows = transactions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function formatCurrency(value: number) {
    if (value <= 0) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Header
        title="Payment Transactions"
        description="Full history of every individual Paystack payment, including refunds."
      />
      <StudentsSubNav />

      {/* Summary stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Total Transactions
          </p>
          <p className="mt-1 text-2xl font-bold text-customer-teal">
            {transactions.length}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Total Collected
          </p>
          <p className="mt-1 text-2xl font-bold text-customer-charcoal">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Total Refunded
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {formatCurrency(totalRefunded) || "—"}
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
            <HiOutlineCreditCard className="h-7 w-7" aria-hidden />
          </div>
          <h2 className="mt-4 text-lg font-bold text-customer-teal">
            No transactions yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
            Paystack payment transactions will appear here as students enroll.
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
                    Course
                  </th>
                  <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                    Reference
                  </th>
                  <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-customer-charcoal sm:px-6">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pageRows.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50/80">
                    <td className="px-4 py-4 sm:px-6">
                      <p className="font-semibold text-customer-charcoal">
                        {tx.studentName}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {tx.studentEmail}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-neutral-600 sm:px-6">
                      {tx.courseTitle}
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <span className="font-mono text-xs text-neutral-500">
                        {tx.paystackRef}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-customer-purple sm:px-6">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[tx.status] ?? "bg-neutral-100 text-neutral-600"}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-neutral-500 sm:px-6">
                      {formatTxDate(tx.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={safePage}
            totalPages={totalPages}
            basePath="/admin/students/transactions"
          />
        </div>
      )}
    </div>
  );
}
