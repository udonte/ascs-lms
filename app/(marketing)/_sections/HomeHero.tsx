"use client";

import Image from "next/image";
import { Easing, motion } from "framer-motion";
import { FaPlayCircle, FaArrowRight } from "react-icons/fa";

import Button from "../_components/ui/Button";
import Badge from "../_components/ui/Badge";

export default function HomeHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const dynamicEase = "easeOut";
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: dynamicEase as Easing },
    },
  };

  const floatingEase = "easeInOut";
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 6, repeat: Infinity, ease: floatingEase as Easing },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-customer-purple via-purple-800 to-customer-teal">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-customer-gold rounded-full mix-blend-soft-light filter blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-customer-teal rounded-full mix-blend-soft-light filter blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-customer-cream rounded-full mix-blend-soft-light filter blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          className="text-customer-cream"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Badge
            variant="default"
            className="mb-6 backdrop-blur-sm border-customer-cream/20"
          >
            Africa's Premier Customer Success School
          </Badge>

          <motion.h1
            variants={itemVariants}
            className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            Africa's Home for{" "}
            <span className="text-customer-gold">World-Class</span> Customer
            Success Education
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-customer-cream/90 leading-relaxed mb-8 font-light"
          >
            Where global Customer Success careers begin - for learners
            everywhere.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-customer-cream/80 mb-10 leading-relaxed"
          >
            At <span className="font-semibold text-customer-gold">ASCS™</span>,
            we equip individuals with the skills, mindset, and human-centered
            capabilities required to thrive in today's rapidly evolving Customer
            Success industry.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-8 mb-12">
            <Button variant="primary" size="md" icon={<FaArrowRight />}>
              <a href="https://selar.com/369z0u1736" target="_blank" rel="noreferrer">
                Download CSM Starter Kits
              </a>
            </Button>

            <Button
              href="/courses"
              variant="outline"
              size="md"
              icon={<FaPlayCircle />}
              iconPosition="left"
            >
              Explore Our Courses
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "500+", label: "Students Trained" },
              { value: "95%", label: "Success Rate" },
              { value: "15+", label: "Countries" },
            ].map((stat) => (
              <div key={stat.label} className="text-customer-cream">
                <div className="text-2xl md:text-3xl font-bold text-customer-gold">
                  {stat.value}
                </div>
                <div className="text-sm text-customer-cream/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="relative" variants={floatingVariants} animate="animate">
          <div className="relative">
            <div className="relative bg-linear-to-br from-customer-purple/80 to-customer-teal/60 rounded-2xl p-8 backdrop-blur-sm border border-customer-cream/10">
              <div className="bg-customer-charcoal/30 rounded-xl h-96 lg:h-[500px] flex items-center justify-center border-2 border-customer-gold/20 overflow-hidden">
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/home/confident-african.png"
                    alt="Professional working on a laptop"
                    fill
                    className="rounded-xl object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>

              <motion.div
                className="absolute -top-4 -left-4 bg-customer-gold text-customer-charcoal px-4 py-2 rounded-lg font-semibold shadow-lg"
                animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                Global Careers
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-customer-teal text-customer-cream px-4 py-2 rounded-lg font-semibold shadow-lg"
                animate={{ y: [0, 10, 0], rotate: [5, -5, 5] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                Job Ready
              </motion.div>
            </div>

            <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-customer-gold/10 rounded-full blur-2xl" />
            <div className="absolute -z-10 bottom-8 -left-8 w-96 h-96 bg-customer-teal/10 rounded-full blur-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

