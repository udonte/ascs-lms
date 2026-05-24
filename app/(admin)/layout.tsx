import Link from "next/link";
import { redirect } from "next/navigation";
import {
  HiOutlineChartBar,
  HiOutlineCollection,
  HiOutlineUsers,
  HiOutlineClipboardList,
} from "react-icons/hi";

import { SignOutButton } from "@/app/(dashboard)/_components/SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { getProfileRole } from "@/src/lib/services/profile-service";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = await getProfileRole(supabase, user.id);

  if (role !== "admin" && role !== "instructor") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-full flex-1 bg-[#F9FAFB]">
      <aside className="hidden w-72 shrink-0 border-r border-neutral-200 bg-[#003366] md:flex md:flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-4">
          <span className="text-sm font-semibold text-white">ASCS Admin</span>
          <SignOutButton variant="dark" />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3 text-sm">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-white hover:bg-white/10"
          >
            <HiOutlineChartBar className="h-5 w-5" />
            Performance Insights
          </Link>
          <Link
            href="/admin/courses"
            className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-white hover:bg-white/10"
          >
            <HiOutlineCollection className="h-5 w-5" />
            Content Manager
          </Link>
          <Link
            href="/admin/students"
            className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-white hover:bg-white/10"
          >
            <HiOutlineUsers className="h-5 w-5" />
            Student Ledger
          </Link>
          <Link
            href="/admin/quizzes"
            className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-white hover:bg-white/10"
          >
            <HiOutlineClipboardList className="h-5 w-5" />
            Quiz Builder
          </Link>
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-2 border-b border-neutral-200 bg-[#003366] px-4 md:hidden">
          <span className="text-sm font-semibold text-white">ASCS Admin</span>
          <SignOutButton variant="dark" />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
