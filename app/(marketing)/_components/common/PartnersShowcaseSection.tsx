"use client";

import Image from "next/image";
import { Easing, motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { FiExternalLink } from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";

import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";

const partnerLogos = [
  "/assets/partners/dangote.png",
  "/assets/partners/edo.png",
  "/assets/partners/glo.png",
  "/assets/partners/imf.png",
  "/assets/partners/lagos.png",
  "/assets/partners/arise.jpeg",
  "/assets/partners/bua.png",
  "/assets/partners/dstv.png",
  "/assets/partners/hiptv.jpeg",
  "/assets/partners/mavin.jpeg",
  "/assets/partners/samsung.png",
  "/assets/partners/spotify.png",
  "/assets/partners/usaid.png",
];

export default function PartnersShowcaseSection() {
  const dynamicEase = "easeOut";
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: dynamicEase as Easing },
    },
  };

  const featuredPartners = [
    "SuccessCOACHING (US)",
    "PracticalCSM (UK)",
    "The Success League (US)",
    "Customer Success Institute (Israel)",
    "African Leadership University",
    "Fintech Association",
    "SaaS Community Africa",
    "Global CS Network",
  ];

  return (
    <section
      className="py-20 bg-linear-to-br from-white to-customer-cream relative overflow-hidden"
      id="partners-showcase"
    >
      <div className="absolute top-0 left-0 w-72 h-72 bg-customer-purple/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-customer-gold/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionHeader
            title="Trusted by Leading Organizations"
            subtitle="Our Global Network & Partners"
            description="Aside collaborating with top institutions worldwide to deliver world-class Customer Success education, some of our past learners and alumni work with big organizations"
            alignment="center"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Marquee speed={50} pauseOnHover>
            {partnerLogos.map((logo, index) => (
              <div
                key={logo}
                className="mx-8 w-32 h-32 flex items-center justify-center"
              >
                <div className="w-28 h-28 rounded-xl p-4 shadow-lg border border-customer-purple/10 flex items-center justify-center hover:shadow-xl transition-all duration-300 bg-white">
                  <Image
                    src={logo}
                    alt={`Partner ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
          </Marquee>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-linear-to-r from-customer-purple/10 to-customer-gold/5 p-8 border border-customer-purple/20">
            <h3 className="font-playfair text-2xl font-bold text-customer-charcoal mb-6 text-center">
              Featured Collaborations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredPartners.map((partner) => (
                <div
                  key={partner}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/30"
                >
                  <span className="text-customer-charcoal font-medium">
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-playfair text-3xl font-bold text-customer-charcoal mb-6">
                Why Partner With ASCS™?
              </h3>
              <div className="space-y-4">
                {[
                  "Access to Africa's top Customer Success talent pipeline",
                  "Collaborate on curriculum development and research",
                  "Early access to trained professionals for recruitment",
                  "Co-host workshops, webinars, and industry events",
                  "Brand visibility among Africa's Customer Success community",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-customer-gold/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <div className="w-2 h-2 bg-customer-gold rounded-full" />
                    </div>
                    <p className="text-customer-charcoal/80">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-linear-to-br from-customer-purple to-customer-gold rounded-2xl p-8 text-customer-cream">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaHandshake className="text-3xl text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Become a Partner</h4>
                <p className="mb-6">
                  Join our network of organizations shaping the future of
                  Customer Success in Africa
                </p>
                <Button
                  href="/contact"
                  variant="primary"
                  className="bg-white text-customer-purple hover:bg-white/90 w-full"
                  icon={<FiExternalLink />}
                >
                  Explore Partnership
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center gap-6">
            <p className="text-lg text-customer-charcoal/80 max-w-2xl">
              Want to join our growing network of organizations committed to
              developing Africa's Customer Success talent?
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                icon={<FaHandshake />}
              >
                Become a Partner
              </Button>
              <Button
                href="/about"
                variant="outline"
                size="lg"
                className="border-customer-purple text-customer-purple hover:bg-customer-purple hover:text-white"
              >
                Learn About Us
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

