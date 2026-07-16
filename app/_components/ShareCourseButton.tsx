"use client";

import { useState } from "react";
import { HiOutlineShare, HiOutlineClipboardCheck } from "react-icons/hi";

type ShareCourseButtonProps = {
  courseTitle: string;
  slug: string;
  /** Optional extra classes for the button */
  className?: string;
};

/**
 * Shares a course link using the Web Share API on mobile (native share sheet),
 * falling back to clipboard copy on desktop.
 * Shows a brief "Copied!" confirmation after copying.
 */
export function ShareCourseButton({
  courseTitle,
  slug,
  className = "",
}: ShareCourseButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/courses/${slug}`;

    // Try native share sheet first (works great on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: courseTitle,
          text: `Check out "${courseTitle}" on ASCS — African School of Customer Success`,
          url,
        });
        return;
      } catch {
        // User cancelled native share — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Last resort: prompt with the URL
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${courseTitle}`}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-500 transition hover:border-customer-teal/40 hover:text-customer-teal ${className}`}
    >
      {copied ? (
        <>
          <HiOutlineClipboardCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-emerald-600">Link copied!</span>
        </>
      ) : (
        <>
          <HiOutlineShare className="h-3.5 w-3.5" />
          Share
        </>
      )}
    </button>
  );
}
