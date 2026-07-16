"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebook,
} from "react-icons/fa";

import { NAV_LINKS } from "../../_constants/nav";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      icon: FaFacebook,
      url: "https://www.facebook.com/share/17hov6HLpC/",
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      url: "https://www.linkedin.com/company/elevateyour-career/",
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://www.instagram.com/africanschoolofcs?igsh=MWdpNXlxMGR5MTFvaQ==",
      color: "hover:text-pink-500",
    },
  ];

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      text: "Africa · Global Reach",
      description: "Serving learners worldwide",
    },
    {
      icon: FaPhone,
      text: "+234 703 224 5842",
      description: "Mon - Fri, 9AM - 5PM",
    },
    {
      icon: FaEnvelope,
      text: "hello@theafricanschoolofcustomersuccess.com",
      description: "We'll respond within 24 hours",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-customer-purple text-customer-cream">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
          <motion.div
            className="lg:flex-1 lg:max-w-md mr-0 lg:mr-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/assets/ascs-logo.png"
                alt="African School of Customer Success"
                width={180}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-lg font-playfair font-semibold mb-4">
              Africa's Home for World-Class Customer Success Education
            </p>
            <p className="text-customer-cream/80 mb-6 leading-relaxed">
              Building the largest pipeline of Customer Success talent in
              Africa: trained with empathy, ethics, and excellence for global
              impact.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-customer-purple/80 rounded-lg text-customer-cream transition-all duration-300 ${social.color} hover:bg-white/20`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="text-xl" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lg:flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div variants={itemVariants}>
              <h3 className="font-playfair text-xl font-semibold mb-6 text-customer-gold">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.name} className="w-fit">
                    <Link
                      href={link.path}
                      className="text-customer-cream/80 hover:text-customer-gold transition-colors duration-200 hover:underline underline-offset-4 block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-playfair text-xl font-semibold mb-6 text-customer-gold">
                Our Programs
              </h3>
              <div className="space-y-3 text-customer-cream/80">
                <Link href="/courses" className="block py-1 w-fit">
                  Switch to Tech as a CSM
                </Link>
                <Link href="/courses" className="block py-1 w-fit">
                  CS Fundamentals
                </Link>
                <Link href="/courses" className="block py-1 w-fit">
                  Certified CSM
                </Link>
                <Link href="/courses" className="block py-1 w-fit">
                  Train-the-Trainer
                </Link>
                <Link href="/courses" className="block py-1 w-fit">
                  CS for Businesses
                </Link>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-playfair text-xl font-semibold mb-6 text-customer-gold">
                Get In Touch
              </h3>
              <div className="space-y-4">
                {contactInfo.map((contact) => (
                  <div
                    key={contact.text}
                    className="flex items-start space-x-3 w-full"
                  >
                    <div className="mt-1 text-customer-gold">
                      <contact.icon className="text-lg" />
                    </div>
                    <div>
                      <p className="font-medium text-customer-cream text-sm sm:text-xs">
                        {contact.text}
                      </p>
                      <p className="text-sm text-customer-cream/70">
                        {contact.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <motion.div
                className="mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/verify/"
                  className="inline-flex items-center gap-2 bg-customer-gold text-customer-charcoal px-6 py-3 rounded-lg font-semibold hover:bg-customer-gold/90 transition-colors duration-200"
                >
                  <FaEnvelope className="text-lg" />
                  Verify Certificate
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="border-t border-customer-cream/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <motion.div
              className="flex items-center space-x-2 text-customer-cream/70 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span>
                © {currentYear} African School of Customer Success. All rights
                reserved.
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
