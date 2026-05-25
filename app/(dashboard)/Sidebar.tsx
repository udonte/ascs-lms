"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineBadgeCheck,
  HiOutlineCog,
} from "react-icons/hi";
import { SignOutButton } from "./_components/SignOutButton";

const links = [
  {
    href: "/dashboard",
    label: "Overview / My Courses",
    icon: HiOutlineHome,
  },
  {
    href: "/dashboard/browse",
    label: "Course Catalog",
    icon: HiOutlineBookOpen,
  },
  {
    href: "/dashboard/certificates",
    label: "My Certificates",
    icon: HiOutlineBadgeCheck,
  },
  {
    href: "/dashboard/settings",
    label: "Account Settings",
    icon: HiOutlineCog,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-2 p-3 text-sm">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-md px-3 py-2 font-medium transition ${
              active
                ? "bg-customer-purple text-white shadow-inner"
                : "text-customer-purple hover:bg-customer-purple/10 hover:text-customer-purple"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="hidden md:block">{label}</span>
          </Link>
        );
      })}
      <div className="mt-auto hidden md:block">
        <SignOutButton />
      </div>
    </nav>
  );
}
