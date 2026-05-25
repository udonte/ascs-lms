"use client";

import Image from "next/image";
import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
import {
  FaHandshake,
  FaChartLine,
  FaUsers,
  FaShieldAlt,
  FaRocket,
  FaHeart,
  FaBullseye,
  FaLightbulb,
} from "react-icons/fa";

export default function WhatIsCustomerSuccessSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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

  const keyPrinciples = [
    {
      icon: <FaHandshake className="text-2xl" />,
      title: "Proactive Relationship Building",
      description: "Anticipating customer needs before they arise",
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Value Realization",
      description: "Ensuring customers achieve their desired outcomes",
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Customer Journey Management",
      description: "Guiding customers through every stage of their experience",
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Risk Mitigation",
      description: "Identifying and addressing potential challenges early",
    },
  ];

  const csComponents = [
    {
      title: "Customer Onboarding",
      description: "Setting customers up for success from day one",
      color: "bg-customer-purple/10",
      icon: <FaRocket className="text-customer-purple" />,
    },
    {
      title: "Health Monitoring",
      description: "Tracking customer usage and satisfaction metrics",
      color: "bg-customer-gold/10",
      icon: <FaChartLine className="text-customer-gold" />,
    },
    {
      title: "Success Planning",
      description: "Creating roadmaps for customer achievement",
      color: "bg-customer-charcoal/10",
      icon: <FaBullseye className="text-customer-charcoal" />,
    },
    {
      title: "Advocacy Development",
      description: "Turning satisfied customers into brand promoters",
      color: "bg-customer-purple/10",
      icon: <FaHeart className="text-customer-purple" />,
    },
  ];

  const whyImportant = [
    {
      stat: "80%",
      label: "Future revenue comes from 20% of existing customers",
      icon: <FaChartLine className="text-customer-gold" />,
    },
    {
      stat: "5x",
      label: "Cost to acquire a new customer vs retaining an existing one",
      icon: <FaUsers className="text-customer-purple" />,
    },
    {
      stat: "92%",
      label: "Customers trust recommendations from friends over advertising",
      icon: <FaHeart className="text-customer-gold" />,
    },
  ];

  return (
    <section
      className="py-20 bg-linear-to-br from-customer-cream to-white"
      id="what-is-cs"
    >
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Understanding the Heart of Modern Business"
          subtitle="What is Customer Success?"
          alignment="center"
          description="Customer Success is not just a department - it's a business philosophy that puts customer outcomes at the center of everything you do."
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
            className="relative rounded-2xl overflow-hidden mb-16"
          >
            <div className="absolute inset-0 bg-linear-to-r from-customer-purple to-customer-purple/90 opacity-90" />
            <div className="relative z-10 p-8 lg:p-12 text-customer-cream">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <FaLightbulb className="text-customer-gold" />
                  <span className="font-semibold">Simple Definition</span>
                </div>

                <h3 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                  Customer Success makes sure customers{" "}
                  <span className="text-customer-gold">win</span>,{" "}
                  <span className="text-customer-gold">stay</span>, and{" "}
                  <span className="text-customer-gold">grow</span>.
                </h3>

                <div className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
                  <p className="mb-4">
                    Customer Success is a proactive, relationship-focused
                    discipline that helps customers achieve the results they
                    expected when they bought a product or service.
                  </p>
                  <p>
                    It's about guiding customers, understanding their goals,
                    supporting them through challenges, and ensuring they get
                    long-term value - not just at purchase, but throughout their
                    entire journey.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-customer-gold">
                  <p className="text-xl font-playfair font-semibold italic">
                    "It's the heart of customer experience and the engine of
                    sustainable business growth."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="font-playfair text-3xl font-bold text-customer-charcoal text-center mb-8">
              The Core Principles of Customer Success
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyPrinciples.map((principle) => (
                <motion.div
                  key={principle.title}
                  variants={itemVariants}
                  className="p-6 rounded-2xl bg-white border border-customer-purple/10 shadow-sm hover:shadow-lg transition-all duration-300 group"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-customer-gold/20 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {principle.icon}
                    </div>
                    <h4 className="font-semibold text-customer-charcoal text-lg mb-2">
                      {principle.title}
                    </h4>
                    <p className="text-customer-charcoal/70">
                      {principle.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div variants={itemVariants}>
              <h3 className="font-playfair text-3xl font-bold text-customer-charcoal mb-6">
                Key Components of Customer Success
              </h3>

              <div className="space-y-4 md:space-y-6">
                {csComponents.map((component) => (
                  <motion.div
                    key={component.title}
                    variants={itemVariants}
                    className={`p-6 rounded-2xl ${component.color} border border-customer-purple/10`}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="shrink-0">{component.icon}</div>
                      <div>
                        <h4 className="font-semibold text-customer-charcoal text-lg mb-1">
                          {component.title}
                        </h4>
                        <p className="text-customer-charcoal/70">
                          {component.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="relative rounded-2xl overflow-hidden mb-8">
                <div className="absolute inset-0 bg-linear-to-br from-customer-purple/20 to-customer-gold/10 backdrop-blur-sm border border-white/20 rounded-2xl" />

                <div className="relative z-10 p-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-customer-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-customer-gold/30">
                      <FaHandshake className="text-4xl text-customer-gold/60" />
                    </div>
                    <h3 className="font-playfair text-2xl font-bold text-customer-charcoal mb-4">
                      The Business Impact
                    </h3>
                    <p className="text-customer-charcoal/80 mb-6">
                      Customer Success isn't just nice to have - it's a strategic
                      necessity for modern businesses
                    </p>
                  </div>

                  <div className="space-y-6">
                    {whyImportant.map((item, index) => (
                      <motion.div
                        key={item.stat}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50"
                      >
                        <div className="shrink-0">{item.icon}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold text-customer-purple mb-1">
                            {item.stat}
                          </div>
                          <p className="text-sm text-customer-charcoal/70">
                            {item.label}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="relative mb-16">
            <div className="relative w-full aspect-16/10 md:aspect-2/1 max-h-[560px] mx-auto rounded-2xl overflow-hidden">
              <Image
                src="/assets/about/customers.png"
                alt="What is Customer Success Illustration"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
            <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-customer-teal/50 backdrop-blur-sm rounded-xl p-6 max-w-3xl w-full mx-4 border border-customer-purple/10 shadow-lg">
              <p className="text-center text-customer-cream md:text-xl font-medium">
                Customer Success is one of the fastest-growing careers in tech,
                with high demand for skilled professionals worldwide. It combines
                technical knowledge with human skills - making it perfect for
                those who love helping others.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-customer-purple/10"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: "For Businesses",
                    description:
                      "Customer Success drives retention, growth, and sustainable revenue through happy, successful customers.",
                  },
                  {
                    title: "For Customers",
                    description:
                      "Customer Success ensures you get maximum value from your investment and achieve your desired outcomes.",
                  },
                  {
                    title: "For Professionals",
                    description:
                      "Customer Success offers a rewarding career path combining technical skills with human connection and impact.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-6 rounded-xl bg-customer-cream/50"
                  >
                    <h4 className="font-semibold text-customer-charcoal text-lg mb-3">
                      {item.title}
                    </h4>
                    <p className="text-customer-charcoal/70">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-linear-to-r from-customer-purple/10 to-customer-gold/5 rounded-xl p-6">
                <p className="text-xl font-playfair font-semibold text-customer-charcoal italic">
                  "Customer Success transforms transactions into relationships,
                  customers into advocates, and business goals into shared
                  successes."
                </p>
              </div>

              <Button
                href="/courses"
                variant="primary"
                size="lg"
                className="text-customer-purple mt-8"
              >
                Start Your CS Career
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

