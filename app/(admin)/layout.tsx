import { redirect } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getProfileRole } from "@/lib/services/profile-service";
import { AdminSidebar } from "./Sidebar";
import { MobileHeader } from "@/app/_components/MobileHeader";

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
    <div className="flex h-screen w-full overflow-hidden bg-[#F9FAFB]">
      <aside className="hidden md:flex md:w-72 shrink-0 md:flex-col border-r border-neutral-200 bg-customer-purple overflow-y-auto">
        <div className="border-b border-white/10 px-4 py-4 mb-4 bg-customer-purple shrink-0">
          <div className="flex items-center justify-between gap-2 bg-customer-cream w-fit rounded p-1">
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
        </div>
        <AdminSidebar />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
