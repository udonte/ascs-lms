import Image from "next/image";
import Link from "next/link";

import {
  formatCatalogPrice,
  getCourseThumbnailUrl,
  truncateDescription,
  type CatalogCourse,
} from "@/lib/services/dashboard/overview/student-dashboard-service";
import { ShareCourseButton } from "@/app/_components/ShareCourseButton";

type CatalogCourseCardProps = {
  course: CatalogCourse;
};

export function CatalogCourseCard({ course }: CatalogCourseCardProps) {
  const imageUrl = getCourseThumbnailUrl(course.id, course.thumbnailUrl);
  const isFree = course.price <= 0;
  const priceLabel = formatCatalogPrice(course.price);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:border-customer-teal/40 hover:shadow-md">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-customer-purple via-customer-teal to-customer-gold">
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-customer-charcoal/20" />
        <div className="absolute left-4 top-4">
          {isFree ? (
            <span className="inline-flex rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
              FREE
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-customer-gold px-3 py-1 text-xs font-bold text-customer-charcoal shadow-sm">
              {priceLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-customer-charcoal line-clamp-2">
          {course.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-neutral-600 line-clamp-4">
          {truncateDescription(course.description, 160)}
        </p>

        {course.isEnrolled ? (
          <Link
            href="/dashboard"
            className="mt-5 block w-full rounded-lg border-2 border-customer-teal py-3 text-center text-sm font-semibold text-customer-teal transition hover:bg-customer-teal/5"
          >
            Already Enrolled →
          </Link>
        ) : (
          <Link
            href={`/dashboard/checkout/${course.id}`}
            className="mt-5 block w-full rounded-lg bg-customer-teal py-3 text-center text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90"
          >
            Buy Now / Unlock Access
          </Link>
        )}

        {/* FEAT-09: View Details + FEAT-08: Share — only shown when slug is set */}
        {course.slug && (
          <div className="mt-2 flex gap-2">
            <Link
              href={`/courses/${course.slug}`}
              className="flex-1 rounded-lg border border-neutral-200 py-2.5 text-center text-xs font-medium text-neutral-500 transition hover:border-customer-teal/40 hover:text-customer-teal"
            >
              View Details
            </Link>
            <ShareCourseButton courseTitle={course.title} slug={course.slug} />
          </div>
        )}
      </div>
    </article>
  );
}
