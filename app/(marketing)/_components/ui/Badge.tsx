"use client";

import { ReactNode } from "react";

type BadgeVariant = "default" | "secondary";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default:
      "bg-white/10 text-customer-cream border border-white/20 backdrop-blur-sm",
    secondary:
      "bg-customer-purple/10 text-customer-purple border border-customer-purple/20",
  };

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

