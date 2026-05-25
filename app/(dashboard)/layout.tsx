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
    <div className="flex min-h-full flex-1 bg-[#F9FAFB]">
      <aside className="w-16 md:w-72 shrink-0 border-r border-neutral-200 bg-[#FBF8EE] md:flex md:flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-4 mb-4">
          <Link href="/" className="hidden md:inline-block">
            <Image
              src="/assets/ascs-logo.png"
              alt="African School of Customer Success"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <Link href="/" className="inline-block md:hidden">
            <Image
              src="/assets/ascs-flag-logo.png"
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
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
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
