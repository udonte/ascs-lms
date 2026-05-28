import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaStar } from "react-icons/fa";

import { CertificateService } from "@/lib/services/dashboard/certificates/certificate-service";
import { createClient } from "@/lib/supabase/server";
import { PrintCertificateButton } from "./PrintCertificateButton";

type CertificateDownloadPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CertificateDownloadPage({
  params,
}: CertificateDownloadPageProps) {
  const { courseId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const learnerName =
    profile?.full_name?.trim() || user.email?.split("@")[0] || "Learner";

  const earned = await CertificateService.getEarnedCertificates();
  const certificate = earned.find((item) => item.id === courseId);

  if (!certificate) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-customer-purple">
            Certificate Preview
          </p>
          <h1 className="mt-1 text-2xl font-bold text-customer-teal">
            {certificate.courseTitle}
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Credential serial{" "}
            <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-700">
              {certificate.certificateId}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <PrintCertificateButton />
          <Link
            href="/dashboard/certificates"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          >
            Back
          </Link>
        </div>
      </div>

      <section
        id="certificate"
        className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm print:border-none print:p-0 print:shadow-none"
      >
        <div className="relative rounded-2xl border-2 border-customer-gold p-8">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/ascs-logo.png"
                alt="African School of Customer Success"
                width={140}
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                <FaStar className="h-3.5 w-3.5 text-customer-gold" aria-hidden />
                Verified Credential
              </span>
            </div>

            <span className="rounded bg-neutral-100 px-3 py-1 font-mono text-[11px] font-semibold text-neutral-700">
              {certificate.certificateId}
            </span>
          </div>

          <h2 className="mt-8 text-center text-3xl font-extrabold text-customer-purple">
            Certificate of Completion
          </h2>

          <p className="mx-auto mt-6 max-w-prose text-center text-sm leading-relaxed text-neutral-700">
            This is to certify that{" "}
            <span className="font-semibold text-neutral-900">{learnerName}</span>{" "}
            has successfully completed the course requirements for
            <span className="font-semibold"> {certificate.courseTitle}</span>.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Completion date
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-800">
                {certificate.completedAt}
              </p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Verification serial
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-neutral-800">
                {certificate.certificateId}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:items-end">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Signed by
              </p>
              <p className="text-2xl font-semibold italic text-neutral-800">
                Gloria Michael
              </p>
              <div className="h-px w-56 bg-neutral-300" />
              <p className="text-xs font-medium text-neutral-600">
                CEO, African School of Customer Success
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Issued by
              </p>
              <p className="mt-1 text-sm font-semibold text-neutral-800">
                African School of Customer Success
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                ASCS Digital LMS • Verified credential
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

