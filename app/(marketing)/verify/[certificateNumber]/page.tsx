import type { Metadata } from "next";
import Link from "next/link";
import {
  HiOutlineBadgeCheck,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

import { verifyCertificate } from "@/lib/services/admin/certificates/certificate-verify-service";

type VerifyPageProps = {
  params: Promise<{ certificateNumber: string }>;
};

export async function generateMetadata({
  params,
}: VerifyPageProps): Promise<Metadata> {
  const { certificateNumber } = await params;
  return {
    title: `Verify Certificate ${certificateNumber.toUpperCase()} · ASCS`,
    description:
      "Verify the authenticity of an African School of Customer Success certificate.",
  };
}

/**
 * /verify/[certificateNumber]
 *
 * Public page — no login required.
 * Anyone can verify an ASCS certificate by visiting this URL.
 * Designed to be linked from QR codes on printed/PDF certificates.
 */
export default async function VerifyCertificatePage({
  params,
}: VerifyPageProps) {
  const { certificateNumber } = await params;
  const result = await verifyCertificate(certificateNumber);

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <Link href="/" className="inline-block">
          <span className="text-lg font-black tracking-tight text-customer-teal">
            ASCS
          </span>
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-customer-charcoal">
          Certificate Verification
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          African School of Customer Success · Official Credential Check
        </p>
      </div>

      {/* Certificate number being verified */}
      <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          Verifying
        </p>
        <p className="mt-1 font-mono text-lg font-bold tracking-wider text-customer-charcoal">
          {certificateNumber.toUpperCase()}
        </p>
      </div>

      {/* Result */}
      {result.found ? (
        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
          {/* Success header */}
          <div className="flex items-center gap-3 bg-emerald-600 px-6 py-4">
            <HiOutlineBadgeCheck className="h-7 w-7 shrink-0 text-white" />
            <div>
              <p className="font-bold text-white">Certificate Verified ✓</p>
              <p className="text-sm text-emerald-100">
                This is an authentic ASCS credential
              </p>
            </div>
          </div>

          {/* Certificate details */}
          <dl className="divide-y divide-neutral-100">
            <Row
              label="Certificate Number"
              value={result.certificateNumber}
              mono
            />
            <Row label="Student Name" value={result.studentName} />
            <Row label="Course Completed" value={result.courseTitle} />
            <Row label="Date Issued" value={result.issuedAt} />
            <Row
              label="Issued by"
              value="African School of Customer Success (ASCS)"
            />
          </dl>

          {/* Footer note */}
          <div className="bg-emerald-50 px-6 py-4 text-center text-xs text-emerald-700">
            This certificate was issued upon successful completion of all course
            requirements including lessons and assessments.
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
          {/* Not found header */}
          <div className="flex items-center gap-3 bg-red-600 px-6 py-4">
            <HiOutlineExclamationCircle className="h-7 w-7 shrink-0 text-white" />
            <div>
              <p className="font-bold text-white">Certificate Not Found</p>
              <p className="text-sm text-red-100">
                No record matches this certificate number
              </p>
            </div>
          </div>
          <div className="px-6 py-6 text-sm text-neutral-600">
            <p>
              We could not find an ASCS certificate matching{" "}
              <span className="font-mono font-semibold">
                {certificateNumber.toUpperCase()}
              </span>
              . This could mean:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 text-neutral-500">
              <li>The certificate number was entered incorrectly</li>
              <li>The certificate does not exist</li>
              <li>The credential may not be authentic</li>
            </ul>
            <p className="mt-4">
              If you believe this is an error, contact{" "}
              <a
                href="mailto:support@africancustomersuccess.com"
                className="font-medium text-customer-teal underline"
              >
                support@africancustomersuccess.com
              </a>
            </p>
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-neutral-400">
        African School of Customer Success ·{" "}
        <Link href="/" className="underline hover:text-customer-teal">
          africancustomersuccess.com
        </Link>
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
        {label}
      </dt>
      <dd
        className={`text-sm font-medium text-customer-charcoal ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
