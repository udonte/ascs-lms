"use client";

import Image from "next/image";
import Link from "next/link";
import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
import {
  FaLeaf,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaBuilding,
  FaUserFriends,
  FaRocket,
  FaCheck,
  FaClock,
  FaGlobe,
  FaDollarSign,
  FaCertificate,
} from "react-icons/fa";
import type { MarketingCourse } from "@/lib/services/marketing/marketing-course-service";

type ProgramsSectionsProps = {
  /** Published courses fetched from the DB by the parent Server Component.
   *  Used to resolve real checkout links for LMS-managed programs.
   *  Non-LMS programs (inquiry-based) keep their original external links. */
  dbCourses?: MarketingCourse[];
};

/** Normalise titles for matching: lowercase, collapse whitespace */
function normalise(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function ProgramsSections({
  dbCourses = [],
}: ProgramsSectionsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const dynamicEase = "easeOut";
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: dynamicEase as Easing },
    },
  };

  // Build a lookup map: normalised title → DB course
  // This lets us swap external links for real checkout routes on matched programs
  const dbCourseByTitle = new Map(
    dbCourses.map((course) => [normalise(course.title), course]),
  );

  const programs = [
    {
      id: 1,
      title: "Switch to Tech as a CSM",
      subtitle: "Beginner Program",
      icon: <FaLeaf className="text-3xl" />,
      color: "from-green-500 to-emerald-600",
      badgeColor: "bg-green-100 text-green-800",
      duration: "6-8 weeks",
      level: "Beginner",
      price: "$150",
      description:
        "For career changers moving from customer service, banking, sales, HR, or non-tech roles into Customer Success.",
      features: [
        "Foundations of Customer Success",
        "Communication, empathy, and conflict resolution",
        "Job simulations and case studies",
        "Tool training: Zendesk, HubSpot, Intercom",
        "Resume + LinkedIn optimization",
        "Interview preparation",
        "How to land global CS roles",
      ],
      ctaText: "Enroll Now",
      // Fallback external link — overridden below if course exists in DB
      link: "https://tinyurl.com/gloriacustomersuccess",
      popular: true,
    },
    {
      id: 2,
      title: "Customer Success Fundamentals Course",
      subtitle: "FCSM–Africa™ Certification",
      icon: <FaGraduationCap className="text-3xl" />,
      color: "from-customer-purple to-purple-600",
      badgeColor: "bg-purple-100 text-purple-800",
      duration: "4 weeks",
      level: "Intermediate",
      price: "Free",
      description:
        "A premium industry certification uniquely designed for African and global professionals.",
      features: [
        "What Customer Success Really Is",
        "Customer Journey & Lifecycle Skills",
        "Communication & Empathy Skills",
        "Handling Difficult Customer Situations",
      ],
      ctaText: "Become Certified",
      // Fallback external link — overridden below if course exists in DB
      link: "https://www.notion.so/CUSTOMER-SUCCESS-FUNDAMENTAL-COURSE-2cb2a6e54ee3803c8d29cd92f52e5a0c?source=copy_link",
      popular: false,
    },
    {
      id: 3,
      title: "Certified Customer Success Manager",
      subtitle: "CCSM–Africa™",
      icon: <FaCertificate className="text-3xl" />,
      color: "from-customer-gold to-amber-600",
      badgeColor: "bg-amber-100 text-amber-800",
      duration: "8-10 weeks",
      level: "Advanced",
      price: "In View",
      description:
        "Comprehensive certification for professionals ready to lead Customer Success teams.",
      features: [
        "Customer retention & churn mitigation",
        "Journey mapping & onboarding optimization",
        "Stakeholder communication & leadership",
        "Data-driven CS",
        "Revenue influence & forecasting",
        "Portfolio + capstone development",
        "Confidence, mindset & ethical decision-making",
      ],
      ctaText: "Make Inquiries",
      link: "tel:07032245842",
      popular: true,
    },
    {
      id: 4,
      title: "Train-the-Trainer",
      subtitle: "CS Instructor Certification",
      icon: <FaChalkboardTeacher className="text-3xl" />,
      color: "from-blue-500 to-blue-600",
      badgeColor: "bg-blue-100 text-blue-800",
      duration: "6 weeks",
      level: "Expert",
      price: "$200",
      description:
        "For Customer Success professionals who want to teach, coach, or build internal training within organizations.",
      features: [
        "Teach CS methods with clarity",
        "Create learning frameworks & assessments",
        "Facilitate workshops",
        "Coach teams & clients",
        "Build CS academies internally",
      ],
      ctaText: "Make Inquiries",
      link: "tel:07032245842",
      popular: false,
    },
    {
      id: 5,
      title: "Customer Service for Businesses",
      subtitle: "SMB Program",
      icon: <FaBuilding className="text-3xl" />,
      color: "from-teal-500 to-teal-600",
      badgeColor: "bg-teal-100 text-teal-800",
      duration: "Custom",
      level: "Team",
      price: "Custom Pricing",
      description:
        "Build a Customer-Centric Team. Strengthen Your Brand. Scale With Confidence.",
      features: [
        "Customer Service Essentials",
        "Conflict Resolution & De-escalation",
        "Empathy & Human-Centered Support",
        "Ethics & Professional Conduct",
        "Problem-Solving & Critical Thinking",
        "Cultural Sensitivity & Inclusiveness",
        "Customer Communication Excellence",
      ],
      ctaText: "Make Inquiries",
      link: "tel:07032245842",
      popular: true,
    },
    {
      id: 6,
      title: "Elevate Mentorship Program",
      subtitle: "Intensive Mentorship",
      icon: <FaUserFriends className="text-3xl" />,
      color: "from-indigo-500 to-indigo-600",
      badgeColor: "bg-indigo-100 text-indigo-800",
      duration: "10 days",
      level: "All Levels",
      price: "$25",
      description:
        "A 10-day intensive mentorship helping aspiring tech professionals gain clarity, structure, confidence, and direction.",
      features: [
        "Personalized career coaching",
        "Skill gap assessment",
        "Industry insights & trends",
        "Networking strategies",
        "Confidence building",
        "Action plan development",
      ],
      ctaText: "Join Mentorship",
      link: "tel:07032245842",
      popular: false,
    },
  ];

  // Resolve each program: if a matching DB course exists, replace the external
  // fallback link with the real LMS checkout route and add a detail page link.
  const resolvedPrograms = programs.map((program) => {
    const dbCourse = dbCourseByTitle.get(normalise(program.title));
    if (!dbCourse)
      return {
        ...program,
        isInternal: false,
        detailHref: null as string | null,
      };

    // Use real DB price for display — overrides the hardcoded placeholder
    const dbPrice =
      dbCourse.price <= 0
        ? "Free"
        : new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(dbCourse.price);

    return {
      ...program,
      price: dbPrice,
      link: `/dashboard/checkout/${dbCourse.id}`,
      ctaText: "Enroll Now",
      isInternal: true,
      detailHref: dbCourse.slug ? `/courses/${dbCourse.slug}` : null,
    };
  });

  const programTypes = [
    {
      icon: <FaRocket className="text-2xl" />,
      title: "Career Changers",
      description: "Transition from non-tech roles into Customer Success",
    },
    {
      icon: <FaGraduationCap className="text-2xl" />,
      title: "Skill Builders",
      description: "Enhance existing Customer Success capabilities",
    },
    {
      icon: <FaChalkboardTeacher className="text-2xl" />,
      title: "Trainers & Coaches",
      description: "Learn to teach Customer Success effectively",
    },
    {
      icon: <FaBuilding className="text-2xl" />,
      title: "Business Teams",
      description: "Build customer-centric cultures in your organization",
    },
  ];

  return (
    <section
      id="programs"
      className="py-20 bg-linear-to-br from-customer-cream to-white"
    >
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Transform Your Career with Our Programs"
          subtitle="Our Programs"
          alignment="center"
          description="Choose from our comprehensive range of Customer Success programs, each designed to meet specific career goals and skill levels."
          className="mb-16"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          >
            {programTypes.map((type) => (
              <div
                key={type.title}
                className="p-6 rounded-2xl bg-white border border-customer-purple/10 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-customer-gold/20 rounded-xl mb-4">
                    {type.icon}
                  </div>
                  <h3 className="font-semibold text-customer-charcoal text-lg mb-2">
                    {type.title}
                  </h3>
                  <p className="text-customer-charcoal/70 text-sm">
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {resolvedPrograms.map((program) => (
              <motion.div
                key={program.id}
                variants={itemVariants}
                className="group"
                whileHover={{ y: -5 }}
              >
                <div
                  className={`h-full rounded-2xl overflow-hidden bg-white shadow-lg border border-customer-purple/10 transition-all duration-300 group-hover:shadow-2xl relative ${
                    program.popular ? "ring-2 ring-customer-gold" : ""
                  }`}
                >
                  {program.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-customer-gold text-customer-charcoal px-3 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div
                    className={`h-40 bg-linear-to-r ${program.color} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 p-6 flex items-start justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-2">
                          {program.icon}
                          <span className="text-white font-medium text-sm">
                            {program.level}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {program.detailHref ? (
                            <Link
                              href={program.detailHref}
                              className="hover:underline underline-offset-2 decoration-white/50"
                            >
                              {program.title}
                            </Link>
                          ) : (
                            program.title
                          )}
                        </h3>
                        <p className="text-white/90 text-sm">
                          {program.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-customer-charcoal/70">
                        <FaClock className="text-sm" />
                        <span className="text-sm font-medium">
                          {program.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-customer-charcoal/70">
                        <FaDollarSign className="text-sm" />
                        <span className="text-sm font-medium">
                          {program.price}
                        </span>
                      </div>
                    </div>

                    <p className="text-customer-charcoal/80 mb-4 leading-relaxed">
                      {program.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <h4 className="font-semibold text-customer-charcoal text-sm flex items-center gap-2">
                        <FaCheck className="text-customer-gold" />
                        You'll Learn:
                      </h4>
                      <ul className="space-y-2">
                        {program.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <FaCheck className="text-green-500 text-xs mt-1 shrink-0" />
                            <span className="text-sm text-customer-charcoal/70">
                              {feature}
                            </span>
                          </li>
                        ))}
                        {program.features.length > 3 && (
                          <li className="text-sm text-customer-charcoal/60">
                            +{program.features.length - 3} more topics
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* CTA buttons — LMS courses get Enroll + View Details.
                        Inquiry-based programs keep their single external link. */}
                    {program.isInternal ? (
                      <div className="space-y-2">
                        <Link
                          href={program.link}
                          className="block w-full rounded-xl bg-customer-gold py-3 text-center text-sm font-bold text-customer-charcoal shadow-sm transition hover:bg-customer-gold/90"
                        >
                          {program.ctaText}
                        </Link>
                        {program.detailHref && (
                          <Link
                            href={program.detailHref}
                            className="block w-full rounded-xl border border-customer-charcoal/20 py-2.5 text-center text-sm font-semibold text-customer-charcoal transition hover:border-customer-gold hover:text-customer-gold"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    ) : (
                      <Button variant="primary" className="w-full">
                        <a href={program.link} target="_blank" rel="noreferrer">
                          {program.ctaText}
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="border-t border-customer-cream p-4 bg-customer-cream/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-customer-charcoal/70">
                        <FaGlobe className="text-xs" />
                        <span>Global Certification</span>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${program.badgeColor}`}
                      >
                        {program.level}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="bg-customer-purple rounded-2xl p-8 text-customer-cream mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h3 className="font-playfair text-3xl font-bold mb-4">
                  Not Sure Which Program Is Right For You?
                </h3>
                <p className="text-lg leading-relaxed mb-6">
                  Our career advisors can help you choose the perfect program
                  based on your background, goals, and learning preferences.
                </p>
                <div className="space-y-3">
                  {[
                    "Free career assessment",
                    "Personalized program recommendations",
                    "Flexible payment options",
                    "Money-back guarantee",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <FaCheck className="text-customer-gold" />
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div
                    className="w-30 h-30 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
                    style={{ width: 120, height: 120 }}
                  >
                    <Image
                      src="/assets/course/advisor.png"
                      alt="Advisor Icon"
                      fill
                      className="object-cover rounded-full"
                      sizes="120px"
                    />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">
                    Free Consultation
                  </h4>
                  <Button variant="primary" className="w-full">
                    <a
                      href="https://calendly.com/elevateyourcscareerteam/30min"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Speak With an Advisor
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <FaGlobe className="text-2xl" />,
                title: "Globally Recognized",
                description: "Certifications accepted by employers worldwide",
              },
              {
                icon: <FaUserFriends className="text-2xl" />,
                title: "Community Access",
                description: "Join 500+ Customer Success professionals",
              },
              {
                icon: <FaCertificate className="text-2xl" />,
                title: "Career Support",
                description: "Job placement assistance and interview prep",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-white border border-customer-purple/10 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-customer-gold/20 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-customer-charcoal text-lg mb-1">
                      {item.title}
                    </h4>
                    <p className="text-customer-charcoal/70 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
