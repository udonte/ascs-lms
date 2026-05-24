import { sanitizeNextPath } from "@/src/lib/services/profile-service";

import { PasswordAuthForm } from "../_components/PasswordAuthForm";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = sanitizeNextPath(next);

  return (
    <div className="flex w-full flex-col items-center">
      <PasswordAuthForm mode="login" nextPath={nextPath} />
      <p className="mt-6 max-w-md text-center text-xs text-neutral-500">
        ASCS staff with an admin account use the same sign-in. You will be
        routed to the admin console automatically.
      </p>
    </div>
  );
}
