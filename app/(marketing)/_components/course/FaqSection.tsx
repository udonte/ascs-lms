"use client";

import { motion, AnimatePresence, Easing } from "framer-motion";
import { useState } from "react";
import {
  FaChevronDown,
  FaUserGraduate,
  FaCertificate,
  FaBriefcase,
  FaLaptop,
  FaUsers,
  FaQuestionCircle,
} from "react-icons/fa";

import SectionHeader from "../ui/SectionHeader";

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqCategories = [
    {
      id: "general",
      title: "General Questions",
      icon: <FaQuestionCircle className="text-xl" color="#6a1b9a" />,
      questions: [
        {
          q: "Who is ASCS™ for?",
          a: "ASCS™ is for anyone who wants to build a global tech career, whether you're coming from customer service, banking, sales, HR, teaching, or any non-tech background. We train beginners, professionals, and leaders who want strong Customer Success skills and global job readiness.",
        },
        {
          q: "Do I need a tech background to start?",
          a: "No. You don't need coding, engineering, or product experience to begin your Customer Success journey. ASCS™ teaches you everything from the basics to advanced CS skills, using simple, practical, real-world examples that make learning easy.",
        },
        {
          q: "How are your courses delivered?",
          a: "All courses are fully online, self-paced, or instructor-led (depending on the program). You can learn from anywhere in the world and revisit the content as often as you need. We include videos, simulations, assignments, case studies, and community support.",
        },
      ],
    },
    {
      id: "certificates",
      title: "Certificates & Recognition",
      icon: <FaCertificate className="text-xl" color="#6a1b9a" />,
      questions: [
        {
          q: "Are your certificates globally recognized?",
          a: "Yes. ASCS™ certifications are designed using global Customer Success standards, practical industry requirements, and employer expectations. Our programs are recognized by employers across Africa, Europe, and the US because we teach real skills that companies need.",
        },
        {
          q: "What certifications will I receive?",
          a: "Depending on your program, you'll receive industry-recognized certifications like FCSM–Africa™ (Fundamentals) or CCSM–Africa™ (Advanced). All certificates include digital badges that can be shared on LinkedIn and other professional platforms.",
        },
        {
          q: "Can I use your certification for job applications internationally?",
          a: "Absolutely. Our certifications are designed to meet global standards and are recognized by employers worldwide. Many of our graduates have successfully secured roles in international companies using our certifications.",
        },
      ],
    },
    {
      id: "job",
      title: "Job Preparation & Support",
      icon: <FaBriefcase className="text-xl" color="#6a1b9a" />,
      questions: [
        {
          q: "Will ASCS™ help me get a job?",
          a: "Yes; we prepare you to be job-ready, not just 'course-complete.' You'll receive: Resume and LinkedIn optimization, interview coaching, hands-on tool training, job simulations, portfolio-building assignments, and access to our career community. We don't promise jobs; we prepare you to compete confidently and stand out anywhere in the world.",
        },
        {
          q: "What kind of job support do you provide?",
          a: "We provide comprehensive career support including: CV/LinkedIn optimization, interview coaching, portfolio building, job search strategy, reference preparation, and access to our employer partner network. Our career accelerator program ensures you're fully prepared for the job market.",
        },
        {
          q: "How long does it take to get a job after completion?",
          a: "Most students secure roles within 1-3 months of completing their program. We've seen students land jobs in as little as 6 weeks, depending on their background, effort, and the job market conditions.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical & Learning",
      icon: <FaLaptop className="text-xl" color="#6a1b9a" />,
      questions: [
        {
          q: "What tools will I learn?",
          a: "You'll gain hands-on experience with industry-standard tools including Zendesk, HubSpot, Intercom, Jira, and various CS platforms. We focus on tool-agnostic principles so you can adapt to any software used by your future employer.",
        },
        {
          q: "Is the training practical or theoretical?",
          a: "Our training is highly practical. You'll work on real-world case studies, participate in simulations, complete hands-on projects, and build a portfolio that demonstrates your skills to potential employers.",
        },
        {
          q: "What if I need help during the course?",
          a: "You'll have access to our instructors through live Q&A sessions, community forums, and direct messaging. We also provide peer support through study groups and our active alumni community.",
        },
      ],
    },
    {
      id: "community",
      title: "Community & Support",
      icon: <FaUsers className="text-xl" color="#6a1b9a" />,
      questions: [
        {
          q: "Do I get community access?",
          a: "Yes, you'll get lifetime access to our exclusive Linkedin community where you can network with fellow students, alumni, and industry professionals from across Africa and the world.",
        },
        {
          q: "Is there mentorship available?",
          a: "Yes, all our programs include access to mentors who are experienced Customer Success professionals. Our Elevate Mentorship Program provides intensive 1:1 guidance for those who want personalized support.",
        },
        {
          q: "What happens after I graduate?",
          a: "Graduation is just the beginning. You'll maintain lifetime access to course updates, the community, and career support. Many alumni stay engaged as mentors, guest speakers, or even instructors.",
        },
      ],
    },
    {
      id: "pricing",
      title: "Pricing & Payment",
      icon: <FaUserGraduate className="text-xl" color="#6a1b9a" />,
      questions: [
        {
          q: "What payment options do you offer?",
          a: "We offer flexible payment options including one-time payments, installment plans, and in some cases, scholarships. We also work with partners to provide financing options for eligible students.",
        },
        {
          q: "Do you offer refunds?",
          a: "No, we do not offer refunds.",
        },
        {
          q: "Are there any hidden fees?",
          a: "No hidden fees. The price you see includes all course materials, certification, and community access. Any optional additional services (like premium mentorship) are clearly marked and optional.",
        },
      ],
    },
  ];

  const toggleFaq = (index: number, categoryIndex: number) => {
    const faqIndex = categoryIndex * 3 + index;
    setOpenFaq(openFaq === faqIndex ? null : faqIndex);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const dynamicEase = "easeOut";
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: dynamicEase as Easing,
      },
    },
  };

  return (
    <section className="py-20 bg-customer-purple/5" id="faq">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Answers to Common Questions"
          subtitle="Frequently Asked Questions"
          alignment="center"
          description="Get all the information you need about our courses, certifications, and career support."
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {faqCategories.map((category, catIndex) => (
              <div
                key={category.id}
                className="p-6 rounded-2xl bg-linear-to-br from-customer-cream to-white border border-customer-purple/10 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-customer-gold/60 rounded-lg">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-customer-charcoal text-lg">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {category.questions.map((faq, index) => {
                    const faqIndex = catIndex * 3 + index;
                    return (
                      <div
                        key={index}
                        className="border-b border-customer-purple/10 last:border-0"
                      >
                        <button
                          onClick={() => toggleFaq(index, catIndex)}
                          className="w-full text-left py-3 flex items-center justify-between gap-4 hover:text-customer-purple transition-colors duration-200 cursor-pointer"
                        >
                          <span className="font-medium text-sm text-customer-charcoal">
                            {faq.q}
                          </span>
                          <FaChevronDown
                            className={`text-customer-purple transition-transform duration-300 shrink-0 ${
                              openFaq === faqIndex ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {openFaq === faqIndex && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pb-4">
                                <p className="text-customer-charcoal/70 text-sm leading-relaxed">
                                  {faq.a}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-linear-to-r from-customer-purple to-customer-gold rounded-2xl p-8 text-customer-cream"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-playfair text-3xl font-bold mb-4">
                  Still Have Questions?
                </h3>
                <p className="text-lg leading-relaxed mb-6">
                  Our team is here to help you make the right decision for your
                  career. Schedule a free consultation call with one of our
                  advisors.
                </p>
                <div className="space-y-3">
                  {[
                    "Personalized program recommendations",
                    "Career path guidance",
                    "Payment plan options",
                    "Flexible start dates",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-customer-cream rounded-full" />
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="text-3xl text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">
                    Free Consultation
                  </h4>
                  <p className="text-customer-cream/80 text-sm mb-4">
                    Speak directly with our career advisors
                  </p>
                  <a
                    href="https://calendly.com/ascs-consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full bg-white text-customer-purple font-semibold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors duration-200"
                  >
                    Book a Call
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

