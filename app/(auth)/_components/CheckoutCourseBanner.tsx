import { FaShoppingCart, FaLock } from "react-icons/fa";
import { MarketingCourseService } from "@/lib/services/marketing/marketing-course-service";

type Props = {
  courseId: string;
};

/**
 * Shown above the login/signup form when the user arrives via an enrollment CTA.
 * Fetches the course title + price anonymously (using the `courses_anon_select_published`
 * RLS policy) and renders a friendly "you're signing in to enroll in X" banner.
 * Renders nothing if the course can't be found — the auth form still works.
 */
export async function CheckoutCourseBanner({ courseId }: Props) {
  // Use published courses list to find the matching course without needing auth.
  // This is deliberately lightweight — title and price only.
  const courses = await MarketingCourseService.getPublishedCourses();
  const course = courses.find((c) => c.id === courseId);

  if (!course) return null;

  const priceLabel =
    course.price <= 0
      ? "FREE"
      : new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          maximumFractionDigits: 0,
        }).format(course.price);

  return (
    <div
      className="w-full max-w-md rounded-xl border border-[#003366]/20 bg-gradient-to-r from-[#003366]/5 to-[#FFCC00]/10 px-5 py-4"
      role="status"
      aria-label={`You are enrolling in ${course.title}`}
    >
      <div className="flex items-start gap-3">
        {/* Cart icon */}
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#003366]">
          <FaShoppingCart className="text-sm text-[#FFCC00]" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#003366]/60">
            You&rsquo;re enrolling in
          </p>
          <p className="mt-0.5 truncate text-sm font-bold text-[#003366]">
            {course.title}
          </p>
          <p className="mt-1 text-xs text-[#003366]/70">
            Sign in or create an account to complete your enrollment.
          </p>
        </div>

        {/* Price pill */}
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            priceLabel === "FREE"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-[#FFCC00] text-[#003366]"
          }`}
        >
          {priceLabel}
        </span>
      </div>

      {/* Trust signal */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#003366]/50">
        <FaLock className="text-[10px]" />
        <span>Secure checkout · 30-day money-back guarantee</span>
      </div>
    </div>
  );
}
