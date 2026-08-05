"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineClipboardList, HiOutlineCreditCard, HiOutlineUsers } from "react-icons/hi";

const tabs = [
  {
    href: "/admin/students",
    label: "Enrollment Ledger",
    icon: HiOutlineClipboardList,
    exact: true,
  },
  {
    href: "/admin/students/list",
    label: "All Students",
    icon: HiOutlineUsers,
    exact: false,
  },
  {
    href: "/admin/students/transactions",
    label: "Transactions",
    icon: HiOutlineCreditCard,
    exact: false,
  },
];

export function StudentsSubNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-1">
      {tabs.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-customer-purple text-white shadow-sm"
                : "text-neutral-500 hover:text-customer-purple hover:bg-customer-purple/10"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className="hidden md:block">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
