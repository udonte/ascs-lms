import type { ReactNode } from "react";

import Header from "./_components/common/Header";
import Footer from "./_components/common/Footer";

const siteUrl = "https://africancustomersuccess.com";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "African School of Customer Success",
  alternateName: ["ASCS", "ASCS™"],
  url: siteUrl,
  logo: `${siteUrl}/assets/ascs-logo.png`,
  description:
    "Africa's premier Customer Success school — training and certification for global careers.",
  sameAs: ["https://www.linkedin.com/company/elevateyour-career/"],
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

