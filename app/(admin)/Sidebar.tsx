"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineChartBar,
  HiOutlineCollection,
  HiOutlineUsers,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { SignOutButton } from "../(dashboard)/_components/SignOutButton";

const links = [
  {
    href: "/admin",
    label: "Performance Insights",
    icon: HiOutlineChartBar,
  },
  {
    href: "/admin/courses",
    label: "Content Manager",
    icon: HiOutlineCollection,
  },
  {
    href: "/admin/students",
    label: "Students",
    icon: HiOutlineUsers,
  },
  {
    href: "/admin/quizzes",
    label: "Quiz Builder",
    icon: HiOutlineClipboardList,
  },
];

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3 text-sm">
      {links.map(({ href, label, icon: Icon }) => {
        const active = isNavLinkActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-md px-3 py-2 font-medium transition ${
              active
                ? "bg-customer-cream text-customer-purple shadow-inner font-bold"
                : "text-customer-cream hover:bg-customer-cream/10 hover:text-customer-cream/80"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="hidden md:block">{label}</span>
          </Link>
        );
      })}
      <div className="mt-auto hidden md:block">
        <SignOutButton variant="dark" />
      </div>
    </nav>
  );
}
