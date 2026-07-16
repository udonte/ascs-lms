import Link from "next/link";
import { redirect } from "next/navigation";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { FaGlobe } from "react-icons/fa";

/**
 * /dashboard/checkout/callback/lemonsqueezy
 *
 * Lemon Squeezy redirects here after a successful payment.
 * Query params: ?courseId=xxx (set in the redirect_url at checkout creation)
 *
 * Unlike the Paystack callback, we do NOT re-verify or re-fulfill here.
 * The webhook at /api/webhooks/lemonsqueezy is the primary fulfillment path
 * and fires server-to-server before the user even lands on this page.
 *
 * This page is purely a confirmation screen — show success and redirect
 * to the dashboard where the course will already be accessible.
 */

type LemonSqueezyCallbackProps = {
  searchParams: Promise<{
    courseId?: string;
  }>;
};

export default async function LemonSqueezyCallbackPage({
  searchParams,
}: LemonSqueezyCallbackProps) {
  const params = await searchParams;
  const courseId = params.courseId?.trim();

  // If we have a courseId, redirect to dashboard after a brief confirmation.
  // Using redirect() here would skip the confirmation screen — we want to
  // show it so the student knows payment went through.
  if (!courseId) {
    redirect("/dashboard?toast=payment-success");
  }

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      {/* Success icon */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <HiOutlineCheckCircle
          className="h-10 w-10 text-emerald-600"
          aria-hidden
        />
      </div>

      {/* Gateway badge */}
      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 shadow-sm">
        <FaGlobe className="text-customer-teal" />
        <span className="text-xs font-semibold text-customer-charcoal">
          International Payment · Lemon Squeezy
        </span>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-customer-teal">
        Payment successful!
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        Your payment was processed successfully. Your course access is being
        confirmed — this usually takes a few seconds.
      </p>

      <p className="mt-2 text-xs text-neutral-400">
        If your course doesn't appear immediately, wait 30 seconds and refresh
        your dashboard. Still not there? Contact{" "}
        <a
          href="mailto:support@africancustomersuccess.com"
          className="underline hover:text-customer-teal"
        >
          support
        </a>
        .
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-customer-teal px-6 py-2.5 text-sm font-semibold text-customer-cream transition hover:bg-customer-teal/90"
        >
          Go to My Courses
        </Link>
        <Link
          href="/dashboard/browse"
          className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          Browse more courses
        </Link>
      </div>
    </div>
  );
}
