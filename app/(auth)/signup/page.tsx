import { sanitizeNextPath } from "@/src/lib/services/profile-service";

import { PasswordAuthForm } from "../_components/PasswordAuthForm";

type SignupPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { next } = await searchParams;
  const nextPath = sanitizeNextPath(next);

  return <PasswordAuthForm mode="signup" nextPath={nextPath} />;
}
