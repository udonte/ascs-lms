"use client";

import Image from "next/image";
import { Easing, motion } from "framer-motion";
import { FaCheck, FaUsers, FaGlobe, FaRocket, FaHeart } from "react-icons/fa";

import SectionHeader from "../ui/SectionHeader";

export default function WhyDifferentSection() {
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

  const differentiators = [
    {
      icon: <FaUsers className="text-2xl" />,
      title: "We teach people, not just tools",
      description:
        "While others focus on software, we focus on developing leaders with emotional intelligence and problem-solving skills.",
    },
    {
      icon: <FaGlobe className="text-2xl" />,
      title: "Global employability focus",
      description:
        "Our curriculum prepares you for international opportunities with cultural sensitivity and global best practices.",
    },
    {
      icon: <FaRocket className="text-2xl" />,
      title: "Real-world experience",
      description:
        "Learn through simulations, case studies, and hands-on projects that mirror actual workplace scenarios.",
    },
    {
      icon: <FaHeart className="text-2xl" />,
      title: "Mindset development",
      description:
        "Build confidence, resilience, and the professional mindset needed to thrive in global tech environments.",
    },
  ];

  const benefits = [
    "Real-world CS experience through simulations",
    "Hands-on tool mastery (Zendesk, HubSpot, Intercom, Jira)",
    "Global interview preparation",
    "Confidence and mindset development",
    "Ethics, communication & emotional intelligence training",
    "Access to mentors across Africa, Europe & the US",
    "Lifetime community support",
    "A global-ready portfolio",
  ];

  return (
    <section className="py-20 bg-customer-purple/5" id="why-different">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="We Don't Just Teach Customer Success. We Teach Transformation."
          subtitle="Why ASCS™ Is Different"
          alignment="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div variants={itemVariants} className="space-y-6 mb-8">
              <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                Most programs teach tools.{" "}
                <span className="font-semibold text-customer-purple">
                  We teach global employability.
                </span>
              </p>
              <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                Most courses teach tasks.{" "}
                <span className="font-semibold text-customer-purple">
                  We teach judgment, problem-solving, empathy, and leadership.
                </span>
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-6 mb-8"
              variants={containerVariants}
            >
              {differentiators.map((item) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-linear-to-r from-customer-cream to-white border border-customer-purple/10 hover:shadow-lg transition-all duration-300"
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  <div className="shrink-0 p-3 bg-customer-gold/20 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-customer-charcoal text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-customer-charcoal/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-customer-purple/20 to-customer-gold/10 backdrop-blur-sm border border-white/20 rounded-2xl" />

              <div className="relative z-10 h-96 lg:h-[500px] bg-linear-to-br from-customer-charcoal/10 to-customer-purple/10 rounded-2xl flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/home/why-different.png"
                    alt="Why Different Illustration"
                    fill
                    className="relative z-10 object-cover rounded-2xl"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <h4 className="font-semibold text-customer-charcoal mb-4 flex items-center gap-2">
                    <FaCheck className="text-customer-gold" />
                    What You Gain at ASCS™:
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        className="flex items-center gap-2 text-sm text-customer-charcoal/80"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        viewport={{ once: true }}
                      >
                        <FaCheck className="text-customer-gold text-xs shrink-0" />
                        <span>{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                className="absolute -top-4 -right-4 bg-customer-gold text-customer-charcoal px-4 py-2 rounded-lg font-semibold shadow-lg backdrop-blur-sm z-20"
                animate={{ y: [0, -10, 0], rotate: [2, -2, 2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                Beyond Tools
              </motion.div>

              <motion.div
                className="absolute top-1/2 -left-4 bg-customer-purple text-customer-cream px-4 py-2 rounded-lg font-semibold shadow-lg backdrop-blur-sm z-20"
                animate={{ y: [0, 10, 0], rotate: [-2, 2, -2] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                Mindset First
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="bg-linear-to-r from-customer-purple/10 to-customer-gold/5 p-6 rounded-2xl border-l-4 border-customer-gold mt-12"
            >
              <p className="text-xl font-playfair font-semibold text-customer-charcoal text-center">
                "Our students don't just finish a course. They become
                world-class professionals."
              </p>
            </motion.div>

            <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-customer-gold/10 rounded-full blur-2xl" />
            <div className="absolute -z-10 bottom-8 -left-8 w-96 h-96 bg-customer-purple/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

