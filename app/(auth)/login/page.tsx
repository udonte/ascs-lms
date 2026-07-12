import { sanitizeNextPath } from "@/lib/services/profile-service";
import { PasswordAuthForm } from "../_components/PasswordAuthForm";
import { CheckoutCourseBanner } from "../_components/CheckoutCourseBanner";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

/**
 * Extracts the courseId from a checkout next-path, e.g.
 *   /dashboard/checkout/abc-123  →  "abc-123"
 *   /dashboard/checkout/abc-123?from=...  →  "abc-123"
 */
function extractCheckoutCourseId(path: string): string | null {
  const match = path.match(/^\/dashboard\/checkout\/([^/?#]+)/);
  return match?.[1] ?? null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = sanitizeNextPath(next);
  const courseId = extractCheckoutCourseId(nextPath);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Context banner — only shown when the user is mid-enrollment */}
      {courseId && <CheckoutCourseBanner courseId={courseId} />}

      <PasswordAuthForm mode="login" nextPath={nextPath} />

      <p className="max-w-md text-center text-xs text-neutral-500">
        ASCS staff with an admin account use the same sign-in. You will be
        routed to the admin console automatically.
      </p>
    </div>
  );
}
