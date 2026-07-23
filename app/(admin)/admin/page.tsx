import { AnalyticsService } from "@/lib/services/admin/analytics/analytics-service";
import { LedgerService } from "@/lib/services/admin/students/ledger-services";
import { VerifyCertificateModal } from "../_components/VerifyCertificateModal";
import StatCard from "../_components/StatCard";
import RecentTransactionsTable from "../_components/RecentTransactionsTable";
import { LuUsers } from "react-icons/lu";
import { HiOutlineCreditCard } from "react-icons/hi";
import { BiTrendingUp } from "react-icons/bi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import Header from "@/app/_components/Header";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminPerformancePage() {
  const [stats, recentTransactions] = await Promise.all([
    AnalyticsService.getPerformanceStats(),
    LedgerService.getRecentTransactions(),
  ]);

  return (
    <div>
      <Header
        title="Performance Insights"
        description="A snapshot of key performance metrics for the ASCS LMS."
      />
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={<BiTrendingUp className="h-6 w-6" />}
            accentClass="bg-[#DCE5F2] text-[#003366]"
          />
          <StatCard
            label="Active Students"
            value={stats.totalStudents}
            icon={<LuUsers className="h-6 w-6" />}
          />
          <StatCard
            label="Course Sales"
            value={stats.salesCount}
            icon={<HiOutlineCreditCard className="h-6 w-6" />}
          />
          <StatCard
            label="Active Courses"
            value={stats.totalCourses}
            icon={<HiOutlineAcademicCap className="h-6 w-6" />}
          />
        </div>

        <RecentTransactionsTable rows={recentTransactions} />
      </section>
    </div>
  );
}
