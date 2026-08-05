"use client";

import { FaChevronLeft } from "react-icons/fa";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({
  label = "Back",
  className = "",
}: BackButtonProps) {
  return (
    <button
      onClick={() => window.history.back()}
      className={`inline-flex py-2 px-2 items-center gap-1 text-xs md:text-sm font-medium text-customer-gold hover:text-customer-gold/60 transition-colors duration-200 group cursor-pointer bg-black/15 rounded-lg  ${className}`}
      aria-label="Go back to previous page"
    >
      <FaChevronLeft
        size={10}
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
      />
      {label}
    </button>
  );
}
