"use client";

import Image from "next/image";
import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import {
  FaGlobeAmericas,
  FaHandshake,
  FaChartLine,
  FaLightbulb,
  FaAward,
} from "react-icons/fa";

export default function InternationalRecognitionSection() {
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

  const partners = [
    {
      name: "SuccessCOACHING",
      country: "United States",
      description: "Global Customer Success training pioneer",
      logo: "/assets/about/success-coaching.png",
    },
    {
      name: "PracticalCSM",
      country: "United Kingdom",
      description: "Practical Customer Success methodologies",
      logo: "/assets/about/practical-csm.png",
    },
    {
      name: "The Success League",
      country: "United States",
      description: "Customer Success leadership training",
      logo: "/assets/about/success-league.png",
    },
    {
      name: "Customer Success Institute",
      country: "Israel",
      description: "Innovative CS research & development",
      logo: "/assets/about/csi.png",
    },
    {
      name: "African Leadership University",
      country: "Africa",
      description: "Pan-African leadership education",
      logo: "/assets/about/alu.png",
    },
  ];

  const standards = [
    {
      icon: <FaAward className="text-customer-gold" />,
      title: "Global Best Practices",
      description: "Curriculum meets international Customer Success standards",
    },
    {
      icon: <FaLightbulb className="text-customer-gold" />,
      title: "Emotional Intelligence",
      description: "Embraced by top business schools worldwide",
    },
    {
      icon: <FaHandshake className="text-customer-gold" />,
      title: "Communication Excellence",
      description: "Professional communication standards for global teams",
    },
    {
      icon: <FaChartLine className="text-customer-gold" />,
      title: "Ethical Standards",
      description: "Business ethics and professional conduct",
    },
  ];

  return (
    <section className="py-20 bg-white" id="international-recognition">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="Global Recognition, African Excellence"
          subtitle="International Recognition & Partnerships"
          alignment="center"
          description="We draw inspiration from global CS institutions while preserving our African identity. Our curriculum meets emotional intelligence, communication, and ethical standards embraced by top business schools."
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16"
          >
            {partners.map((partner) => (
              <motion.div
                key={partner.name}
                variants={itemVariants}
                className="group"
                whileHover={{ y: -5 }}
              >
                <div className="h-full rounded-2xl p-6 bg-linear-to-br border border-gray-200/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl bg-white">
                  <div className="text-center">
                    <div className="flex items-center justify-center p-2">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={120}
                        height={48}
                        className="max-h-12 w-auto object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-customer-charcoal text-lg mb-2">
                      {partner.name}
                    </h3>
                    <div className="inline-flex items-center gap-1 text-sm text-customer-charcoal/70 mb-2">
                      <FaGlobeAmericas className="text-xs" />
                      <span>{partner.country}</span>
                    </div>
                    <p className="text-customer-charcoal/70 text-sm leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="font-playfair text-3xl font-bold text-customer-charcoal">
                Research-Based, Globally Informed
              </h3>

              <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                At{" "}
                <span className="font-semibold text-customer-purple">ASCS™</span>,
                we don't just follow trends - we study global best practices,
                adapt them to the African context, and create learning
                experiences that are both globally competitive and culturally
                relevant.
              </p>

              <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                Our curriculum is built on extensive research and collaboration
                with industry leaders worldwide, ensuring our students receive
                education that prepares them for success in any market.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {standards.map((standard) => (
                  <motion.div
                    key={standard.title}
                    variants={itemVariants}
                    className="flex items-start gap-3 p-4 rounded-xl bg-customer-cream/50 border border-customer-purple/10"
                    whileHover={{ x: 5 }}
                  >
                    <div className="shrink-0 p-2 bg-customer-gold/20 rounded-lg">
                      {standard.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-customer-charcoal mb-1">
                        {standard.title}
                      </h4>
                      <p className="text-sm text-customer-charcoal/70">
                        {standard.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="relative" variants={itemVariants}>
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-customer-purple/20 to-customer-gold/10 backdrop-blur-sm border border-white/20 rounded-2xl" />

                <div className="relative z-10 p-4 lg:p-8">
                  <div className="relative w-full h-64 lg:h-80">
                    <Image
                      src="/assets/about/class.png"
                      alt="Global Recognition"
                      fill
                      className="object-cover rounded-2xl relative z-10"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>

                <motion.div
                  className="absolute -top-4 -left-4 bg-customer-purple text-customer-cream px-4 py-2 rounded-lg font-semibold shadow-lg backdrop-blur-sm"
                  animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  🌍 Global Network
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -right-4 bg-customer-gold text-customer-charcoal px-4 py-2 rounded-lg font-semibold shadow-lg backdrop-blur-sm"
                  animate={{ y: [0, 10, 0], rotate: [2, -2, 2] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  🤝 Partnerships
                </motion.div>
              </div>

              <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-customer-purple/10 rounded-full blur-2xl" />
              <div className="absolute -z-10 bottom-8 -left-8 w-96 h-96 bg-customer-gold/10 rounded-full blur-2xl" />
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-16 bg-linear-to-r from-customer-purple/10 to-customer-gold/5 rounded-2xl p-8 border-l-4 border-customer-gold"
          >
            <div className="max-w-3xl mx-auto text-center">
              <FaAward className="text-4xl text-customer-gold mx-auto mb-4" />
              <h3 className="font-playfair text-2xl font-bold text-customer-charcoal mb-4">
                Recognized for Excellence Worldwide
              </h3>
              <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                ASCS™ certifications are designed using global Customer Success
                standards, practical industry requirements, and employer
                expectations. Our programs are recognized by companies across
                Africa, Europe, and the US because we teach real skills that the
                global market demands.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

