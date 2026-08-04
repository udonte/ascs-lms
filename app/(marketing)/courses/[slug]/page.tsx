import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  FaChalkboardTeacher,
  FaPlayCircle,
  FaUsers,
  FaGlobe,
  FaCertificate,
  FaStar,
} from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import {
  MarketingCourseService,
  type CourseDetail,
} from "@/lib/services/marketing/marketing-course-service";
import { ShareCourseButton } from "@/app/_components/ShareCourseButton";
import { getCourseThumbnailUrl } from "@/lib/services/dashboard/overview/student-dashboard-service";
import { COURSES_BY_ID } from "@/app/(marketing)/_constants/courses";
import {
  HiOutlineLightBulb,
  HiOutlineAcademicCap,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { FaArrowRight } from "react-icons/fa";
import Button from "../../_components/ui/Button";

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
        ? [
            {
              url: course.thumbnailUrl,
              width: 1200,
              height: 630,
              alt: course.title,
            },
          ]
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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

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

  // Static course-catalogue data (overview, benefits, competencies, standards)
  const courseData = COURSES_BY_ID[slug] ?? null;

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
            ...(course.thumbnailUrl ? { image: course.thumbnailUrl } : {}),
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-customer-purple via-customer-purple to-customer-purple py-4 lg:py-28">
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
                    <li className="text-white/80 line-clamp-1">
                      {course.title}
                    </li>
                  </ol>
                </nav>
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-1 lg:gap-4 mb-4">
                  {/* Badge */}
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFCC00]/30 bg-[#FFCC00]/10 px-4 py-1.5">
                    <FaCertificate className="text-[#FFCC00]" />
                    <span className="text-sm font-semibold text-[#FFCC00]">
                      ASCS™ Certified Program
                    </span>
                  </div>

                  <ShareCourseButton
                    courseTitle={course.title}
                    slug={course.slug ?? slug}
                    className="border-white/20 text-white/70 hover:border-white/40 hover:text-white bg-blue-400 text-center"
                  />
                </div>

                <h1 className="mb-6 font-playfair font-bold text-white text-2xl md:text-3xl leading-tight sm:text-4xl lg:text-5xl text-center lg:text-left">
                  {course.title}
                </h1>

                {course.description && (
                  <p className="mb-6 text-base md:text-lg leading-relaxed text-white/80 text-center lg:text-left">
                    {course.description}
                  </p>
                )}

                {/* CTA group */}

                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-2">
                  <Button variant="primary" size="lg" href={checkoutHref}>
                    {isFree
                      ? "Enroll for Free"
                      : `Enroll Now for ${priceLabel}`}
                  </Button>
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
                    {/* Stats row */}
                    <div className="absolute bottom-0 left-4 mb-4 flex flex-wrap items-center gap-5 text-sm text-white/70">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── COURSE OVERVIEW + BENEFITS ─────────────────────────────────── */}
        {courseData && (
          <section className="relative overflow-hidden border-b border-gray-100 bg-white py-8 md:py-20">
            {/* Subtle background accent */}
            <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-customer-purple/[0.03] blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-60 w-60 rounded-full bg-customer-gold/[0.06] blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Section label */}
              <div className="mb-3 inline-flex items-center justify-center lg:justify-start  gap-2 rounded-full border border-customer-purple/20 bg-customer-purple/5 px-3 py-1">
                <HiOutlineLightBulb className="h-3.5 w-3.5 text-customer-purple" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-customer-purple">
                  About this programme
                </span>
              </div>

              <div className="grid gap-14 lg:grid-cols-[1fr_420px]">
                {/* Left — overview paragraphs */}
                <div>
                  <h2 className="mb-6  text-3xl font-bold leading-snug text-[#003366] sm:text-4xl">
                    {courseData.title}
                  </h2>
                  <div className="space-y-4">
                    {courseData.overview.map((para, i) => (
                      <p
                        key={i}
                        className="text-base leading-relaxed text-gray-600"
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* ── CURRICULUM ──────────────────────────────────────────────────── */}
                  {lessonCount > 0 && (
                    <section className="border-b border-gray-100 mt-8">
                      <div className="">
                        <div className="mb-8 flex flex-col md:flex-row items-center md:items-baseline justify-between gap-4">
                          <h2 className="text-2xl font-bold text-[#003366] sm:text-3xl">
                            Course curriculum
                          </h2>
                          <span className="shrink-0 text-sm text-gray-500">
                            {lessonCount}{" "}
                            {lessonCount === 1 ? "lesson" : "lessons"}
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

                                {/* Title */}
                                <span
                                  className={`flex-1 text-sm font-medium ${
                                    isFirst ? "text-[#003366]" : "text-gray-600"
                                  }`}
                                >
                                  {lesson.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  )}
                </div>

                {/* Right — "What you will gain" benefit cards */}
                <div>
                  <p className="mb-5 text-xs font-bold uppercase tracking-widest text-customer-gold">
                    What you will gain
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {courseData.benefits.map((benefit) => (
                      <div
                        key={benefit.title}
                        className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-[#F9FAFB] p-5 transition-all duration-300 hover:border-customer-purple/20 hover:bg-white hover:shadow-lg hover:shadow-customer-purple/5"
                      >
                        {/* Gold accent bar */}
                        <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-customer-gold to-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <p className="mb-1 text-sm font-bold text-[#003366]">
                          {benefit.title}
                        </p>
                        <p className="text-sm leading-relaxed text-gray-500">
                          {benefit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── COMPETENCIES ─────────────────────────────────────────────────── */}
        {courseData && courseData.competencies.length > 0 && (
          <section className="border-b border-gray-100 bg-[#F9FAFB] py-8 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-customer-teal/20 bg-customer-teal/5 px-3 py-1">
                <HiOutlineAcademicCap className="h-3.5 w-3.5 text-customer-teal" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-customer-teal">
                  Skills & competencies
                </span>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-[#003366] sm:text-3xl">
                Competencies learners will master
              </h2>
              <p className="mb-10 text-sm text-gray-500">
                By completing this certification, you will be able to:
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {courseData.competencies.map((comp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#003366] text-[10px] font-extrabold text-white">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {comp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── STANDARD OF MASTERY ──────────────────────────────────────────── */}
        {courseData && courseData.standards.length > 0 && (
          <section className="relative border-b border-gray-100 bg-white py-8 lg:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(205,163,73,0.06),transparent_60%)]" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                {/* Left — text */}
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-customer-gold/30 bg-customer-gold/10 px-3 py-1">
                    <HiOutlineSparkles className="h-3.5 w-3.5 text-customer-gold" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-customer-gold">
                      Standard of mastery
                    </span>
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-[#003366] sm:text-3xl">
                    What you must demonstrate to earn certification
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Certification is awarded only when every requirement below
                    is met — ensuring graduates carry real, demonstrable skill.
                  </p>
                </div>

                {/* Right — checklist */}
                <div className="overflow-hidden rounded-2xl border border-customer-gold/20 bg-gradient-to-br from-[#fffbeb] to-white shadow-sm">
                  <div className="border-b border-customer-gold/20 px-6 py-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-customer-gold">
                      Certification requirements
                    </p>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {courseData.standards.map((std, i) => (
                      <li key={i} className="flex items-start gap-4 px-6 py-4">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-customer-gold/15 text-xs font-bold text-customer-gold">
                          ✓
                        </span>
                        <p className="text-sm leading-relaxed text-gray-700">
                          {std}
                        </p>
                      </li>
                    ))}
                  </ul>
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
          </div>
        </section>
      </div>
    </>
  );
}
