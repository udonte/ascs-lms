"use client";

import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

type PasswordInputProps = {
  id: string;
  name: string;
  label: string;
  /** Optional element rendered on the right side of the label row (e.g. "Forgot password?" link) */
  labelExtra?: React.ReactNode;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
  className?: string;
};

const baseInputClassName =
  "mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-base sm:text-sm shadow-sm focus:border-[#003366] focus:outline-none focus:ring-1 focus:ring-[#003366]";

export function PasswordInput({
  id,
  name,
  label,
  labelExtra,
  placeholder = "••••••••",
  autoComplete = "current-password",
  minLength = 8,
  required = true,
  className,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
        {labelExtra}
      </div>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          className={className ?? baseInputClassName}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 transition hover:text-neutral-600 focus:outline-none cursor-pointer"
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? (
            <HiOutlineEyeOff className="h-4.5 w-4.5" />
          ) : (
            <HiOutlineEye className="h-4.5 w-4.5" />
          )}
        </button>
      </div>
    </div>
  );
}
