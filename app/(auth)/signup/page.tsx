import { sanitizeNextPath } from "@/lib/services/profile-service";
import { PasswordAuthForm } from "../_components/PasswordAuthForm";
import { CheckoutCourseBanner } from "../_components/CheckoutCourseBanner";

type SignupPageProps = {
  searchParams: Promise<{ next?: string }>;
};

function extractCheckoutCourseId(path: string): string | null {
  const match = path.match(/^\/dashboard\/checkout\/([^/?#]+)/);
  return match?.[1] ?? null;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { next } = await searchParams;
  const nextPath = sanitizeNextPath(next);
  const courseId = extractCheckoutCourseId(nextPath);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {courseId && <CheckoutCourseBanner courseId={courseId} />}
      <PasswordAuthForm mode="signup" nextPath={nextPath} />
    </div>
  );
}
