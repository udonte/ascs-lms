"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineBadgeCheck,
  HiOutlineCog,
  HiOutlineChartBar,
  HiOutlineCollection,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiX,
} from "react-icons/hi";
import { SignOutButton } from "@/app/(dashboard)/_components/SignOutButton";

const STUDENT_LINKS = [
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

const ADMIN_LINKS = [
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

type MobileNavDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  displayName: string;
  isAdmin: boolean;
};

export function MobileNavDrawer({
  isOpen,
  onClose,
  displayName,
  isAdmin,
}: MobileNavDrawerProps) {
  const pathname = usePathname();

  // Close drawer on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navLinks = isAdmin ? ADMIN_LINKS : STUDENT_LINKS;

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        pathname === "/dashboard" || pathname.startsWith("/dashboard/courses")
      );
    }
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col border-r border-neutral-200 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 bg-customer-purple">
          <Link href="/" onClick={onClose} className="inline-block bg-customer-cream rounded p-1">
            <Image
              src="/assets/ascs-logo.png"
              alt="African School of Customer Success"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white transition"
            aria-label="Close menu"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* User Info Bar */}
        <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-customer-purple text-sm font-bold text-white uppercase shrink-0">
            {displayName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-customer-charcoal">
              {displayName}
            </p>
            <span className="inline-block text-xs text-neutral-500 font-medium">
              {isAdmin ? "Admin Workspace" : "Student LMS"}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isLinkActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-customer-purple text-white shadow-xs"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-customer-purple"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer with Sign Out */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
