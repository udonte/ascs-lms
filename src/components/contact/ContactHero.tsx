import { Easing, motion } from "framer-motion";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

import African from "@/assets/about/hero.png";

import {
  FaPlayCircle,
  FaArrowRight,
  FaStar,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";

const ContactHero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const dynamicEase = "spring";
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: dynamicEase as Easing,
      },
    },
  };

  const floatingEase = "easeInOut";
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: floatingEase as Easing,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-customer-purple via-purple-800 to-customer-teal">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-customer-gold rounded-full mix-blend-soft-light filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-customer-teal rounded-full mix-blend-soft-light filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-customer-cream rounded-full mix-blend-soft-light filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          className="text-customer-cream"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <Badge
            variant="default"
            icon={<FaStar className="text-customer-gold" />}
            className="mb-6 backdrop-blur-sm border-customer-cream/20"
          >
            Contact Us
          </Badge>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            Get in touch with the{" "}
            <span className="text-customer-gold">ASCS™</span> Team for inquiries
            or support.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-customer-cream/90 leading-relaxed mb-8 font-light"
          >
            At ASCS™, we are dedicated to empowering the next generation of
            Customer Success leaders across Africa.
          </motion.p>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-customer-cream/80 mb-10 leading-relaxed"
          >
            Our mission is to provide world-class education, practical skills,
            and industry insights that enable our students to excel in the
            dynamic field of Customer Success.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-8 mb-12"
          >
            <Button
              href="/courses"
              variant="primary"
              size="md"
              icon={<FaArrowRight />}
            >
              Start Your CS Journey
            </Button>

            <Button
              href="/courses"
              variant="outline"
              size="md"
              icon={<FaPlayCircle />}
              iconPosition="left"
            >
              Explore Our Certifications
            </Button>
          </motion.div>

          {/* Social Media */}
          <div className="flex justify-center space-x-4">
            <a
              href="https://wa.me/your-number"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
              aria-label="Contact us on WhatsApp"
            >
              <FaWhatsapp className="text-xl" />
            </a>
            <a
              href="https://t.me/your-community-link"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
              aria-label="Join our Telegram community"
            >
              <FaTelegramPlane className="text-xl" />
            </a>
          </div>
        </motion.div>

        {/* Visual Content */}
        <motion.div
          className="relative"
          variants={floatingVariants}
          animate="animate"
        >
          {/* Main Image Container */}
          <div className="relative">
            {/* Gradient Overlay Container */}
            <div className="relative bg-linear-to-br from-customer-purple/80 to-customer-teal/60 rounded-2xl p-8 backdrop-blur-sm border border-customer-cream/10">
              {/* Professional Image Placeholder */}
              <div className="bg-customer-charcoal/30 rounded-xl h-96 lg:h-[500px] flex items-center justify-center border-2 border-customer-gold/20">
                <img
                  src={African}
                  alt="Professional working on a laptop"
                  className="rounded-xl h-full object-cover"
                />
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -left-4 bg-customer-gold text-customer-charcoal px-4 py-2 rounded-lg font-semibold shadow-lg"
                animate={{
                  y: [0, -10, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Quality Training
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-customer-teal text-customer-cream px-4 py-2 rounded-lg font-semibold shadow-lg"
                animate={{
                  y: [0, 10, 0],
                  rotate: [5, -5, 5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                Global Opportunities
              </motion.div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-customer-gold/10 rounded-full blur-2xl"></div>
            <div className="absolute -z-10 bottom-8 -left-8 w-96 h-96 bg-customer-teal/10 rounded-full blur-2xl"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactHero;
