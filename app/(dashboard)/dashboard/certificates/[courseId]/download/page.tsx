import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

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
    <div className="mx-auto w-full max-w-4xl py-10">
      {/* Page header — hidden when printing / capturing */}
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

      {/* ── Certificate card ─────────────────────────────────────── */}
      <section
        id="certificate"
        style={{
          background:
            "linear-gradient(145deg, #cda349 0%, #f0d080 40%, #cda349 60%, #a07830 100%)",
          padding: "2px",
          borderRadius: "16px",
          boxShadow:
            "0 20px 50px rgba(205,163,73,0.18), 0 4px 16px rgba(0,0,0,0.08)",
        }}
        className="print:rounded-none print:shadow-none print:p-0"
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            padding: "48px 56px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle diamond-grid watermark */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(205,163,73,0.04) 0px, rgba(205,163,73,0.04) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(-45deg, rgba(205,163,73,0.04) 0px, rgba(205,163,73,0.04) 1px, transparent 1px, transparent 40px)",
              pointerEvents: "none",
            }}
          />

          {/* Corner flourish — top-left */}
          <svg
            aria-hidden
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            style={{ position: "absolute", top: 20, left: 20, opacity: 0.6 }}
          >
            <path
              d="M4 76 L4 4 L76 4"
              stroke="#cda349"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M4 60 L4 4 L60 4"
              stroke="#cda349"
              strokeWidth="0.6"
              fill="none"
              opacity="0.5"
            />
            <circle cx="4" cy="4" r="3" fill="#cda349" />
          </svg>

          {/* Corner flourish — top-right */}
          <svg
            aria-hidden
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            style={{ position: "absolute", top: 20, right: 20, opacity: 0.6 }}
          >
            <path
              d="M76 76 L76 4 L4 4"
              stroke="#cda349"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M76 60 L76 4 L20 4"
              stroke="#cda349"
              strokeWidth="0.6"
              fill="none"
              opacity="0.5"
            />
            <circle cx="76" cy="4" r="3" fill="#cda349" />
          </svg>

          {/* Corner flourish — bottom-left */}
          <svg
            aria-hidden
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              opacity: 0.6,
            }}
          >
            <path
              d="M4 4 L4 76 L76 76"
              stroke="#cda349"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M4 20 L4 76 L60 76"
              stroke="#cda349"
              strokeWidth="0.6"
              fill="none"
              opacity="0.5"
            />
            <circle cx="4" cy="76" r="3" fill="#cda349" />
          </svg>

          {/* Corner flourish — bottom-right */}
          <svg
            aria-hidden
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              opacity: 0.6,
            }}
          >
            <path
              d="M76 4 L76 76 L4 76"
              stroke="#cda349"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M76 20 L76 76 L20 76"
              stroke="#cda349"
              strokeWidth="0.6"
              fill="none"
              opacity="0.5"
            />
            <circle cx="76" cy="76" r="3" fill="#cda349" />
          </svg>

          {/* ── HEADER: logo + credential ID ── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <Image
              src="/assets/ascs-logo.png"
              alt="African School of Customer Success"
              width={160}
              height={56}
              style={{ height: "48px", width: "auto", objectFit: "contain" }}
              priority
            />
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#cda349",
                  marginBottom: "3px",
                }}
              >
                Credential ID
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6a1b9a",
                  background: "rgba(205,163,73,0.1)",
                  padding: "3px 10px",
                  borderRadius: "4px",
                  border: "1px solid rgba(205,163,73,0.25)",
                }}
              >
                {certificate.certificateId}
              </p>
            </div>
          </div>

          {/* Gold divider */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, #cda349, #f0d080, #cda349, transparent)",
              margin: "20px 0",
              opacity: 0.65,
            }}
          />

          {/* ── Heading block ── */}
          <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "5px",
                textTransform: "uppercase",
                color: "#cda349",
                marginBottom: "12px",
              }}
            >
              ✦ &nbsp; African School of Customer Success &nbsp; ✦
            </p>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "42px",
                fontWeight: 800,
                color: "#6a1b9a",
                lineHeight: 1.15,
                marginBottom: "6px",
                letterSpacing: "-0.5px",
              }}
            >
              Certificate of Completion
            </h2>

            {/* Decorative swash */}
            <svg
              aria-hidden
              width="220"
              height="18"
              viewBox="0 0 220 18"
              fill="none"
              style={{ margin: "0 auto 28px", display: "block" }}
            >
              <path
                d="M0 9 Q55 1 110 9 Q165 17 220 9"
                stroke="url(#goldSwash)"
                strokeWidth="1.2"
                fill="none"
              />
              <circle cx="110" cy="9" r="3" fill="#cda349" />
              <defs>
                <linearGradient
                  id="goldSwash"
                  x1="0"
                  y1="0"
                  x2="220"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#cda349" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* ── Recipient block ── */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#9ca3af",
                marginBottom: "10px",
              }}
            >
              Proudly presented to
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "34px",
                fontWeight: 700,
                fontStyle: "italic",
                background:
                  "linear-gradient(135deg, #f0d080 0%, #cda349 50%, #f0d080 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "12px",
                lineHeight: 1.2,
              }}
            >
              {learnerName}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#4b5563",
                lineHeight: 1.8,
                maxWidth: "560px",
                margin: "0 auto",
              }}
            >
              has successfully completed all course requirements for{" "}
              <span style={{ color: "#6a1b9a", fontWeight: 700 }}>
                {certificate.courseTitle}
              </span>{" "}
              and is hereby awarded this certificate in recognition of their
              dedication and achievement.
            </p>
          </div>

          {/* Thin divider */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(205,163,73,0.35), transparent)",
              margin: "0 40px 28px",
            }}
          />

          {/* ── Meta detail tiles ── */}

          <div
            style={{
              background: "rgba(205,163,73,0.07)",
              border: "1px solid rgba(205,163,73,0.2)",
              borderRadius: "10px",
              padding: "14px 18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#cda349",
                marginBottom: "6px",
                textAlign: "center",
              }}
            >
              Completion Date
            </p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#6a1b9a",
                textAlign: "center",
              }}
            >
              {certificate.completedAt}
            </p>
          </div>

          {/* ── Footer: signature + seal ── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "24px",
              flexWrap: "wrap",
              marginTop: "36px",
            }}
          >
            {/* Signature */}
            <div style={{ minWidth: "200px" }}>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "26px",
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: "#6a1b9a",
                  marginBottom: "4px",
                }}
              >
                Gloria Michael
              </p>
              <div
                style={{
                  height: "1px",
                  width: "200px",
                  background: "linear-gradient(90deg, #cda349, transparent)",
                  marginBottom: "8px",
                }}
              />
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                CEO — African School of Customer Success
              </p>
            </div>

            {/* ASCS official seal */}
            <div style={{ textAlign: "center", minWidth: "140px" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  border: "2px solid rgba(205,163,73,0.5)",
                  background: "rgba(205,163,73,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                  boxShadow: "0 0 24px rgba(106, 27, 154,0.2)",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 900,
                    color: "#cda349",
                    letterSpacing: "1px",
                    lineHeight: 1.2,
                    textAlign: "center",
                  }}
                >
                  ASCS
                </p>
                <div
                  style={{
                    width: "28px",
                    height: "1px",
                    background: "#cda349",
                    opacity: 0.5,
                    margin: "3px 0",
                  }}
                />
                <p
                  style={{
                    fontSize: "7px",
                    color: "rgba(205,163,73,0.7)",
                    letterSpacing: "0.5px",
                  }}
                >
                  OFFICIAL SEAL
                </p>
              </div>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#9ca3af",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                ASCS Digital LMS
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
