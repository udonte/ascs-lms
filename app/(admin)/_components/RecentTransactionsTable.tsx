const recentTransactions = [
  {
    student: "Ada Okafor",
    course: "Customer Success Essentials",
    amount: "₦75,000",
    status: "Paid",
    date: "May 22, 2026",
  },
  {
    student: "Chinedu Nnaji",
    course: "Enterprise CS Strategy",
    amount: "₦120,000",
    status: "Paid",
    date: "May 21, 2026",
  },
  {
    student: "Ifunanya Bello",
    course: "CS Leadership Bootcamp",
    amount: "₦95,000",
    status: "Paid",
    date: "May 20, 2026",
  },
];

export default function RecentTransactionsTable() {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-6 py-5">
        <h2 className="text-lg font-semibold text-customer-teal">
          Recent Transactions
        </h2>
        <p className="mt-1 text-sm text-customer-charcoal">
          Recent successful enrollment activities.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="bg-customer-gold/10 text-left text-sm text-customer-charcoal">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-neutral-700">
            {recentTransactions.map((transaction) => (
              <tr
                key={`${transaction.student}-${transaction.date}`}
                className="border-t border-neutral-100"
              >
                <td className="px-6 py-4 font-medium">{transaction.student}</td>
                <td className="px-6 py-4">{transaction.course}</td>
                <td className="px-6 py-4">{transaction.amount}</td>
                <td className="px-6 py-4 text-[#0f766e]">
                  {transaction.status}
                </td>
                <td className="px-6 py-4">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
