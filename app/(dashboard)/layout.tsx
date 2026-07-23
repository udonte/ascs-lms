import { Suspense } from "react";

import { DashboardQueryToasts } from "./_components/DashboardQueryToasts";
import { SignOutButton } from "./_components/SignOutButton";
import { DashboardSidebar } from "./Sidebar";
import { MobileHeader } from "@/app/_components/MobileHeader";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      <aside className="hidden md:flex md:w-72 shrink-0 md:flex-col border-r border-neutral-200 bg-[#FBF8EE] overflow-y-auto">
        <div className="border-b border-neutral-200 px-4 py-4 mb-4 shrink-0">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/ascs-logo.png"
              alt="African School of Customer Success"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
        </div>
        <DashboardSidebar />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Suspense fallback={null}>
            <DashboardQueryToasts />
          </Suspense>
          {children}
        </main>
      </div>
    </div>
  );
}
