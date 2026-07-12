import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  FaCheckCircle,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaPlayCircle,
  FaLock,
  FaUsers,
  FaGlobe,
  FaCertificate,
  FaStar,
} from "react-icons/fa";
import { HiArrowRight, HiShieldCheck } from "react-icons/hi";
import {
  MarketingCourseService,
  type CourseDetail,
} from "@/lib/services/marketing/marketing-course-service";
import { getCourseThumbnailUrl } from "@/lib/services/dashboard/overview/student-dashboard-service";

/* ─── Types ────────────────────────────────────────────────────────────────── */

type Props = {
  params: Promise<{ slug: string }>;
};

/* ─── Dynamic Metadata ─────────────────────────────────────────────────────── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await MarketingCourseService.getCourseBySlug(slug);

  if (!course) {
    return { title: "Course Not Found | ASCS™" };
  }

  const description =
    course.description?.slice(0, 160) ??
    `Enroll in ${course.title} — a world-class Customer Success course from the African School of Customer Success.`;

  return {
    title: `${course.title} | ASCS™`,
    description,
    openGraph: {
      type: "website",
      title: `${course.title} | ASCS™`,
      description,
      siteName: "African School of Customer Success",
      images: course.thumbnailUrl
        ? [{ url: course.thumbnailUrl, width: 1200, height: 630, alt: course.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | ASCS™`,
      description,
    },
    alternates: {
      canonical: `https://africancustomersuccess.com/courses/${slug}`,
    },
  };
}

/* ─── Price Formatter ───────────────────────────────────────────────────────── */

function formatPrice(price: number): string {
  if (price <= 0) return "FREE";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

/* ─── What You'll Learn items (derived from lesson count) ───────────────────── */

const OUTCOMES = [
  "Build a strong foundation in Customer Success fundamentals",
  "Learn real-world frameworks used by global CS professionals",
  "Develop communication, empathy, and conflict resolution skills",
  "Gain practical tool experience: Zendesk, HubSpot, Intercom",
  "Earn an industry-recognised ASCS™ certificate on completion",
  "Access a global community of Customer Success professionals",
];

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await MarketingCourseService.getCourseBySlug(slug);

  if (!course) notFound();

  const thumbnailSrc = getCourseThumbnailUrl(course.id, course.thumbnailUrl);
  const priceLabel = formatPrice(course.price);
  const isFree = course.price <= 0;
  const lessonCount = course.lessons.length;

  const fromParam = encodeURIComponent(`/courses/${slug}`);
  const checkoutHref = `/dashboard/checkout/${course.id}?from=${fromParam}`;

  return (
    <>
      {/* Course structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: course.title,
            description: course.description ?? "",
            provider: {
              "@type": "EducationalOrganization",
              name: "African School of Customer Success",
              url: "https://africancustomersuccess.com",
            },
            url: `https://africancustomersuccess.com/courses/${slug}`,
            ...(course.thumbnailUrl
              ? { image: course.thumbnailUrl }
              : {}),
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#003366] via-[#004080] to-[#002244] py-20 lg:py-28">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#FFCC00]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              {/* Left — copy */}
              <div>
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-6">
                  <ol className="flex items-center gap-2 text-sm text-white/60">
                    <li>
                      <Link href="/" className="transition hover:text-white">
                        Home
                      </Link>
                    </li>
                    <li className="text-white/40">/</li>
                    <li>
                      <Link
                        href="/courses"
                        className="transition hover:text-white"
                      >
                        Courses
                      </Link>
                    </li>
                    <li className="text-white/40">/</li>
                    <li className="text-white/80 line-clamp-1">{course.title}</li>
                  </ol>
                </nav>

                {/* Badge */}
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFCC00]/30 bg-[#FFCC00]/10 px-4 py-1.5">
                  <FaCertificate className="text-[#FFCC00]" />
                  <span className="text-sm font-semibold text-[#FFCC00]">
                    ASCS™ Certified Program
                  </span>
                </div>

                <h1 className="mb-6 font-bold text-white text-3xl leading-tight sm:text-4xl lg:text-5xl">
                  {course.title}
                </h1>

                {course.description && (
                  <p className="mb-8 text-lg leading-relaxed text-white/80">
                    {course.description}
                  </p>
                )}

                {/* Stats row */}
                <div className="mb-8 flex flex-wrap items-center gap-5 text-sm text-white/70">
                  <span className="flex items-center gap-2">
                    <FaPlayCircle className="text-[#FFCC00]" />
                    {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaGlobe className="text-[#FFCC00]" />
                    Global certificate
                  </span>
                  <span className="flex items-center gap-2">
                    <FaUsers className="text-[#FFCC00]" />
                    500+ graduates
                  </span>
                  <span className="flex items-center gap-2">
                    <FaStar className="text-[#FFCC00]" />
                    4.9 rating
                  </span>
                </div>

                {/* Instructor line */}
                {course.instructorName && (
                  <p className="mb-8 flex items-center gap-2 text-sm text-white/70">
                    <FaChalkboardTeacher className="text-[#FFCC00]" />
                    Taught by{" "}
                    <span className="font-semibold text-white">
                      {course.instructorName}
                    </span>
                  </p>
                )}

                {/* CTA group */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href={checkoutHref}
                    id="hero-enroll-cta"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFCC00] px-8 py-4 text-base font-bold text-[#003366] shadow-lg shadow-[#FFCC00]/30 transition hover:bg-yellow-300 hover:shadow-[#FFCC00]/50 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isFree ? "Enroll for Free" : `Enroll Now — ${priceLabel}`}
                    <HiArrowRight className="text-lg" />
                  </Link>
                  <span className="flex items-center gap-2 text-sm text-white/60">
                    <HiShieldCheck className="text-green-400 text-base" />
                    30-day money-back guarantee
                  </span>
                </div>
              </div>

              {/* Right — course card preview */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                  <div className="relative h-56 w-full sm:h-72">
                    <Image
                      src={thumbnailSrc}
                      alt={`${course.title} course thumbnail`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30">
                        <FaPlayCircle className="text-4xl text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Price tag */}
                  <div className="bg-white p-6">
                    <div className="mb-4 flex items-baseline justify-between">
                      <span className="text-3xl font-extrabold text-[#003366]">
                        {priceLabel}
                      </span>
                      {!isFree && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Lifetime access
                        </span>
                      )}
                    </div>

                    <Link
                      href={checkoutHref}
                      id="card-enroll-cta"
                      className="mb-4 block w-full rounded-xl bg-[#003366] py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#004080]"
                    >
                      {isFree ? "Enroll for Free" : "Enroll Now"}
                    </Link>

                    <ul className="space-y-2 text-sm text-gray-600">
                      {[
                        `${lessonCount} on-demand video lessons`,
                        "Certificate of completion",
                        "Full lifetime access",
                        "Access on desktop & mobile",
                        "ASCS™ global community",
                      ].map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <FaCheckCircle className="shrink-0 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT YOU'LL LEARN ────────────────────────────────────────────── */}
        <section className="border-b border-gray-100 bg-[#F9FAFB] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-[#003366] sm:text-3xl">
              What you'll learn
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {OUTCOMES.map((outcome) => (
                <div
                  key={outcome}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <FaCheckCircle className="mt-0.5 shrink-0 text-[#003366]" />
                  <p className="text-sm leading-relaxed text-gray-700">
                    {outcome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CURRICULUM ──────────────────────────────────────────────────── */}
        {lessonCount > 0 && (
          <section className="border-b border-gray-100 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-baseline justify-between gap-4">
                <h2 className="text-2xl font-bold text-[#003366] sm:text-3xl">
                  Course curriculum
                </h2>
                <span className="shrink-0 text-sm text-gray-500">
                  {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {course.lessons.map((lesson, index) => {
                  const isFirst = index === 0;
                  return (
                    <div
                      key={lesson.id}
                      className={`flex items-center gap-4 px-5 py-4 transition hover:bg-[#F9FAFB] ${
                        index !== 0 ? "border-t border-gray-100" : ""
                      }`}
                    >
                      {/* Index pill */}
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003366]/10 text-xs font-bold text-[#003366]">
                        {lesson.orderIndex + 1}
                      </span>

                      {/* Icon */}
                      {isFirst ? (
                        <FaPlayCircle className="shrink-0 text-[#003366]" />
                      ) : (
                        <FaLock className="shrink-0 text-gray-300" />
                      )}

                      {/* Title */}
                      <span
                        className={`flex-1 text-sm font-medium ${
                          isFirst ? "text-[#003366]" : "text-gray-600"
                        }`}
                      >
                        {lesson.title}
                      </span>

                      {/* Preview badge on first lesson */}
                      {isFirst && (
                        <span className="rounded-full bg-[#003366]/10 px-3 py-0.5 text-xs font-semibold text-[#003366]">
                          Preview
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── INSTRUCTOR ──────────────────────────────────────────────────── */}
        {course.instructorName && (
          <section className="border-b border-gray-100 bg-[#F9FAFB] py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 text-2xl font-bold text-[#003366] sm:text-3xl">
                Your instructor
              </h2>
              <div className="flex items-start gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#003366] to-[#004080]">
                  <FaGraduationCap className="text-2xl text-[#FFCC00]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#003366]">
                    {course.instructorName}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-[#FFCC00]">
                    ASCS™ Lead Instructor
                  </p>
                  <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
                    A seasoned Customer Success professional with over a decade
                    of experience training global CS teams. Certified by
                    industry-leading bodies and committed to producing
                    world-class Customer Success talent from Africa.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#003366] via-[#004080] to-[#002244] py-20">
          <div className="pointer-events-none absolute inset-0" aria-hidden />
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFCC00]/30 bg-[#FFCC00]/10 px-4 py-1.5">
              <FaCertificate className="text-[#FFCC00]" />
              <span className="text-sm font-semibold text-[#FFCC00]">
                Join 500+ certified professionals
              </span>
            </div>

            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Ready to transform your career?
            </h2>
            <p className="mb-10 text-lg text-white/75">
              {priceLabel === "FREE"
                ? "This course is completely free. Enroll today and start learning immediately."
                : `Enroll in ${course.title} for ${priceLabel} and start your Customer Success journey.`}
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href={checkoutHref}
                id="bottom-enroll-cta"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFCC00] px-10 py-4 text-base font-bold text-[#003366] shadow-lg shadow-[#FFCC00]/30 transition hover:bg-yellow-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isFree ? "Enroll for Free" : "Enroll Now"}
                <HiArrowRight className="text-lg" />
              </Link>
              <Link
                href="/courses"
                className="text-sm font-medium text-white/70 underline underline-offset-4 transition hover:text-white"
              >
                Browse all courses
              </Link>
            </div>

            <p className="mt-8 flex items-center justify-center gap-2 text-sm text-white/50">
              <HiShieldCheck className="text-green-400" />
              30-day money-back guarantee · Secure payment
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
