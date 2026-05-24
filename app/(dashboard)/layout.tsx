import Link from "next/link";
import { Suspense } from "react";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineBadgeCheck,
  HiOutlineCog,
} from "react-icons/hi";

import { DashboardQueryToasts } from "./_components/DashboardQueryToasts";
import { SignOutButton } from "./_components/SignOutButton";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 bg-[#F9FAFB]">
      <aside className="hidden w-72 shrink-0 border-r border-neutral-200 bg-white md:flex md:flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-4">
          <span className="text-sm font-semibold text-[#003366]">ASCS LMS</span>
          <SignOutButton />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3 text-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-[#003366] hover:bg-[#E8EFF8]"
          >
            <HiOutlineHome className="h-5 w-5" />
            Overview / My Courses
          </Link>
          <Link
            href="/dashboard/browse"
            className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-[#003366] hover:bg-[#E8EFF8]"
          >
            <HiOutlineBookOpen className="h-5 w-5" />
            Course Catalog
          </Link>
          <Link
            href="/dashboard/certificates"
            className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-[#003366] hover:bg-[#E8EFF8]"
          >
            <HiOutlineBadgeCheck className="h-5 w-5" />
            My Certificates
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-[#003366] hover:bg-[#E8EFF8]"
          >
            <HiOutlineCog className="h-5 w-5" />
            Account Settings
          </Link>
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-2 border-b border-neutral-200 bg-white px-4 md:hidden">
          <span className="text-sm font-semibold text-[#003366]">ASCS LMS</span>
          <SignOutButton />
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Suspense fallback={null}>
            <DashboardQueryToasts />
          </Suspense>
          {children}
        </main>
      </div>
    </div>
  );
}
