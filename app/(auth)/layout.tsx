import { Suspense } from "react";

import { AuthQueryToasts } from "./_components/AuthQueryToasts";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#F9FAFB] px-4 py-12">
      <Suspense fallback={null}>
        <AuthQueryToasts />
      </Suspense>
      {children}
    </div>
  );
}
