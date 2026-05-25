import { Suspense } from "react";

import { AuthQueryToasts } from "./_components/AuthQueryToasts";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background image with purple fade overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/home/WhyStudentsLove.png')",
        }}
      />

      {/* Purple fade overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-customer-purple/90 via-customer-purple/85 to-customer-purple/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
        <Suspense fallback={null}>
          <AuthQueryToasts />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
