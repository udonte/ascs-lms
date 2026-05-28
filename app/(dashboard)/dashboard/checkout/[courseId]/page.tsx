import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi";

import { CheckoutPanel } from "@/app/(dashboard)/_components/CheckoutPanel";
import { CheckoutService } from "@/lib/services/payments/checkout-service";

type CheckoutPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { courseId } = await params;
  const preview = await CheckoutService.getCheckoutPreview(courseId);

  if (!preview) {
    notFound();
  }

  if (preview.isEnrolled) {
    redirect("/dashboard?toast=already-enrolled");
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <Link
        href="/dashboard/browse"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-customer-teal transition hover:text-customer-purple"
      >
        <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
        Back to catalog
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

        <div className="mt-6">
          <CheckoutPanel preview={preview} />
        </div>
      </div>
    </div>
  );
}
