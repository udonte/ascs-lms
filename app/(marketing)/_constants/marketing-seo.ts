import type { Metadata } from "next";

/** Resolved with `metadataBase` from root `app/layout.tsx`. */
const canonical = (path: string) =>
  path === "/" ? "https://africancustomersuccess.com" : `https://africancustomersuccess.com${path}`;

const og = (imagePath: string, alt: string) => [
  { url: imagePath, width: 1200, height: 630, alt },
];

const sharedKeywords = [
  "Customer Success",
  "ASCS",
  "African School of Customer Success",
  "CSM training",
  "Customer Success certification",
  "Africa tech careers",
  "FCSM Africa",
  "CCSM Africa",
];

export const marketingHomeMetadata: Metadata = {
  title: "Africa's Home for World-Class Customer Success Education",
  description:
    "ASCS™ is Africa's premier Customer Success school. Join 500+ graduates from 15+ countries and launch your global Customer Success career today.",
  keywords: [...sharedKeywords, "Customer Success school Africa", "CS career"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "African School of Customer Success — ASCS™",
    description:
      "Join 500+ graduates who have launched global Customer Success careers with ASCS™ — Africa's leading CS school.",
    url: canonical("/"),
    siteName: "African School of Customer Success",
    locale: "en_US",
    images: og(
      "/assets/home/confident-african.png",
      "ASCS — African professionals in Customer Success",
    ),
  },
  twitter: {
    card: "summary_large_image",
    title: "African School of Customer Success — ASCS™",
    description:
      "Africa's premier Customer Success school. World-class training for global careers.",
    images: ["/assets/home/confident-african.png"],
  },
  alternates: { canonical: canonical("/") },
};

export const marketingAboutMetadata: Metadata = {
  title: "About Us — Our Story, Mission & Vision",
  description:
    "Learn how ASCS™ was founded to bridge the gap between African talent and global Customer Success opportunities. Meet our founder Gloria Michael and discover our mission.",
  keywords: [...sharedKeywords, "Gloria Michael", "ASCS story", "Customer Success movement Africa"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "About ASCS™ — Africa's Customer Success Movement",
    description:
      "Discover the story behind ASCS™, Africa's premier Customer Success school, and our mission to empower African professionals worldwide.",
    url: canonical("/about"),
    siteName: "African School of Customer Success",
    locale: "en_US",
    images: og("/assets/about/hero.png", "About ASCS — training Africa's Customer Success leaders"),
  },
  twitter: {
    card: "summary_large_image",
    title: "About ASCS™",
    description:
      "Our story, mission, and vision — building Africa's largest pipeline of Customer Success talent.",
    images: ["/assets/about/hero.png"],
  },
  alternates: { canonical: canonical("/about") },
};

export const marketingCoursesMetadata: Metadata = {
  title: "Courses & Certification Programs",
  description:
    "Explore ASCS™ Customer Success courses — from beginner career-switch programs (FCSM–Africa™) to advanced CCSM–Africa™ certifications. Globally recognised, practically focused.",
  keywords: [
    ...sharedKeywords,
    "FCSM Africa",
    "CCSM Africa",
    "Switch to tech CSM",
    "Customer Success fundamentals",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Customer Success Courses & Certifications | ASCS™",
    description:
      "Browse our full range of Customer Success programs designed for career changers, skill builders, business teams, and trainers across Africa and beyond.",
    url: canonical("/courses"),
    siteName: "African School of Customer Success",
    locale: "en_US",
    images: og(
      "/assets/course/course-hero.png",
      "ASCS Customer Success courses and certifications",
    ),
  },
  twitter: {
    card: "summary_large_image",
    title: "ASCS™ Courses & Certifications",
    description:
      "Industry-recognised Customer Success programs — beginner to advanced.",
    images: ["/assets/course/course-hero.png"],
  },
  alternates: { canonical: canonical("/courses") },
};

export const marketingContactMetadata: Metadata = {
  title: "Contact Us & Community",
  description:
    "Get in touch with the ASCS™ team for course inquiries, support, or partnership opportunities. Join our LinkedIn community and stay connected.",
  keywords: [...sharedKeywords, "contact ASCS", "Customer Success consultation", "ASCS partnership"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Contact ASCS™ | Get in Touch",
    description:
      "Reach out to the African School of Customer Success for course inquiries, support, or partnership discussions. We'd love to hear from you.",
    url: canonical("/contact"),
    siteName: "African School of Customer Success",
    locale: "en_US",
    images: og("/assets/contact/contact.png", "Contact the African School of Customer Success"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact ASCS™",
    description:
      "Course inquiries, support, and partnership — connect with our team.",
    images: ["/assets/contact/contact.png"],
  },
  alternates: { canonical: canonical("/contact") },
};
