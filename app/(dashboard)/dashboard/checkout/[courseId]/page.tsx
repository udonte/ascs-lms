import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlineLockClosed,
  HiArrowRight,
} from "react-icons/hi";
import { FaExclamationTriangle } from "react-icons/fa";

import { CheckoutPanel } from "@/app/(dashboard)/_components/CheckoutPanel";
import { CheckoutService } from "@/lib/services/payments/checkout-service";

type CheckoutPageProps = {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ from?: string }>;
};

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const { courseId } = await params;
  const { from } = await searchParams;

  const preview = await CheckoutService.getCheckoutPreview(courseId);

  // Not authenticated — redirect to login, preserving where to land after.
  // Middleware normally handles this for /dashboard/* routes, but this is a
  // fallback for SSR edge cases (e.g., session expiry mid-page).
  if (preview === "unauthenticated") {
    const next = encodeURIComponent(`/dashboard/checkout/${courseId}`);
    redirect(`/login?next=${next}`);
  }

  if (!preview) {
    notFound();
  }

  if (preview.isEnrolled) {
    redirect("/dashboard?toast=already-enrolled");
  }

  // Determine where "back" goes: honour the ?from= param (public detail page)
  // or fall back to the course catalogue.
  const backHref = from && from.startsWith("/") ? from : "/dashboard/browse";
  const backLabel =
    from && from.startsWith("/courses")
      ? "Back to course details"
      : "Back to catalog";

  return (
    <div className="mx-auto w-full max-w-lg">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-customer-teal transition hover:text-customer-purple"
      >
        <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
        {backLabel}
      </Link>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-customer-purple">
          Secure checkout
        </p>
        <h1 className="mt-2 text-2xl font-bold text-customer-teal">
          {preview.title}
        </h1>
        {preview.description ? (
          <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
            {preview.description}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-between rounded-xl bg-customer-purple/5 px-4 py-3">
          <span className="text-sm font-medium text-customer-charcoal">
            Total due
          </span>
          {preview.isFree ? (
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-bold text-white">
              FREE
            </span>
          ) : (
            <span className="text-lg font-bold text-customer-purple">
              {preview.priceLabel}
            </span>
          )}
        </div>

        {/* ── Prerequisite gate ──────────────────────────────────────────────
            Shown instead of the payment panel when the student hasn't completed
            the required prerequisite course. */}
        {preview.prerequisite.required ? (
          <div className="mt-6">
            <PrerequisiteGate
              lockedCourseTitle={preview.title}
              prereqCourseId={preview.prerequisite.courseId}
              prereqCourseTitle={preview.prerequisite.courseTitle}
            />
          </div>
        ) : (
          <div className="mt-6">
            <CheckoutPanel preview={preview} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Prerequisite Gate Notice ─────────────────────────────────────────────── */

function PrerequisiteGate({
  lockedCourseTitle,
  prereqCourseId,
  prereqCourseTitle,
}: {
  lockedCourseTitle: string;
  prereqCourseId: string | null;
  prereqCourseTitle: string | null;
}) {
  const prereqName = prereqCourseTitle ?? "the prerequisite course";

  return (
    <div
      role="alert"
      className="overflow-hidden rounded-xl border border-amber-200 bg-amber-50"
    >
      {/* Header bar */}
      <div className="flex items-center gap-3 border-b border-amber-200 bg-amber-100 px-5 py-3">
        <HiOutlineLockClosed className="h-5 w-5 shrink-0 text-amber-700" />
        <p className="text-sm font-semibold text-amber-800">
          Course locked — prerequisite required
        </p>
      </div>

      <div className="px-5 py-5">
        {/* Notice body — fully dynamic, works for any course with a prerequisite */}
        <div className="mb-5 flex items-start gap-3">
          <FaExclamationTriangle className="mt-0.5 shrink-0 text-amber-500" />
          <p className="text-sm leading-relaxed text-amber-900">
            <strong>&ldquo;{lockedCourseTitle}&rdquo;</strong> is only available
            after you complete <strong>&ldquo;{prereqName}&rdquo;</strong>.
            Please purchase and complete that course first, then return here to
            unlock this one.
          </p>
        </div>

        {/* CTA — link to the required course's checkout */}
        {prereqCourseId ? (
          <Link
            href={`/dashboard/checkout/${prereqCourseId}`}
            id="prerequisite-checkout-cta"
            className="inline-flex items-center gap-2 rounded-lg bg-[#003366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004080]"
          >
            Go to &ldquo;{prereqName}&rdquo;
            <HiArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href="/dashboard/browse"
            className="inline-flex items-center gap-2 rounded-lg bg-[#003366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004080]"
          >
            Browse courses
            <HiArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
