import Link from "next/link";
import { FiAward } from "react-icons/fi";

import { CertificateService } from "@/lib/services/dashboard/certificates/certificate-service";

export default async function CertificatesPage() {
  const earned = await CertificateService.getEarnedCertificates();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-customer-teal md:text-3xl">
          My Certificates & Credentials
        </h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          Your achievements and professional credentials. Download and share your
          verified honors.
        </p>
      </header>

      {earned.length === 0 ? (
        <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="px-6 py-14">
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                <FiAward className="h-7 w-7" aria-hidden />
              </div>
              <p className="mt-6 text-sm font-semibold text-neutral-800">
                No certificates earned yet.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Complete 100% of your course syllabus lessons and assessments to
                unlock your official credential!
              </p>
              <Link
                href="/dashboard"
                className="mt-8 inline-flex rounded-xl bg-customer-teal px-5 py-2.5 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90"
              >
                Go to My Courses
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2">
          {earned.map((certificate) => (
            <article
              key={certificate.id}
              className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="absolute left-0 top-0 h-full w-1.5 bg-customer-gold" />

              <div className="p-6 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                    Credential{" "}
                    <span className="ml-2 font-mono text-[11px] text-neutral-700">
                      {certificate.certificateId}
                    </span>
                  </span>
                  <span className="text-xs font-medium text-neutral-500">
                    Completed {certificate.completedAt}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-customer-purple">
                  {certificate.courseTitle}
                </h2>
              </div>

              <div className="px-6 pb-6 pt-0">
                <p className="text-sm text-neutral-600">
                  This credential verifies you completed the full ASCS syllabus
                  requirements for this course.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-neutral-100 px-6 py-5">
                <Link
                  href={`/dashboard/certificates/${certificate.id}/download`}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-customer-teal px-4 py-2.5 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90 sm:w-auto"
                >
                  Download PDF Certificate
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
