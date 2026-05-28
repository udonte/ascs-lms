import Link from "next/link";
import { redirect } from "next/navigation";
import { HiOutlineCheckCircle } from "react-icons/hi";

import { CheckoutService } from "@/lib/services/payments/checkout-service";

type CheckoutCallbackPageProps = {
  searchParams: Promise<{
    courseId?: string;
    reference?: string;
    trxref?: string;
  }>;
};

export default async function CheckoutCallbackPage({
  searchParams,
}: CheckoutCallbackPageProps) {
  const params = await searchParams;
  const courseId = params.courseId?.trim();
  const reference = (params.reference ?? params.trxref)?.trim();

  if (!courseId || !reference) {
    redirect("/dashboard/browse?toast=payment-incomplete");
  }

  try {
    await CheckoutService.verifyAndFulfillPayment(reference, courseId);
    redirect("/dashboard?toast=payment-success");
  } catch (error) {
    console.error(
      "Checkout fulfillment failed:",
      error instanceof Error ? error.message : error,
    );
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <HiOutlineCheckCircle className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-customer-teal">
          Payment received
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          We are confirming your enrollment. If your course does not appear within
          a few minutes, contact support with reference{" "}
          <span className="font-mono text-xs">{reference}</span>.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex rounded-lg bg-customer-teal px-5 py-2.5 text-sm font-semibold text-customer-cream"
          >
            Go to My Courses
          </Link>
          <Link
            href="/dashboard/browse"
            className="inline-flex rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700"
          >
            Browse courses
          </Link>
        </div>
      </div>
    );
  }
}
