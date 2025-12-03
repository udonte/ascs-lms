import { Link } from "react-router-dom";
import { NAV_LINKS } from "@/constants";
import Logo from "@/assets/ascs-logo.png";
import { motion } from "framer-motion";
import {
  FaTelegramPlane,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Telegram",
      icon: FaTelegramPlane,
      url: "https://t.me/your-community-link",
      color: "hover:text-blue-400",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      url: "https://twitter.com/your-handle",
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      url: "https://linkedin.com/company/your-company",
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://instagram.com/your-handle",
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
      text: "+XXX XXX XXXX",
      description: "Mon - Fri, 9AM - 5PM",
    },
    {
      icon: FaEnvelope,
      text: "hello@ascs.africa",
      description: "We'll respond within 24 hours",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <footer className="bg-customer-purple text-customer-cream">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
          {/* Brand Column - Outside the grid */}
          <motion.div
            className="lg:flex-1 lg:max-w-md mr-0 lg:mr-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <Link to="/" className="inline-block mb-4">
              <img
                src={Logo}
                alt="African School of Customer Success"
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

            {/* Social Links */}
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

          {/* Links Grid */}
          <motion.div
            className="lg:flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="font-playfair text-xl font-semibold mb-6 text-customer-gold">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-customer-cream/80 hover:text-customer-gold transition-colors duration-200 hover:underline underline-offset-4 block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Programs */}
            <motion.div variants={itemVariants}>
              <h3 className="font-playfair text-xl font-semibold mb-6 text-customer-gold">
                Our Programs
              </h3>
              <ul className="space-y-3 text-customer-cream/80">
                <li>
                  <span className="hover:text-customer-gold transition-colors duration-200 cursor-pointer block py-1">
                    Switch to Tech as a CSM
                  </span>
                </li>
                <li>
                  <span className="hover:text-customer-gold transition-colors duration-200 cursor-pointer block py-1">
                    CS Fundamentals
                  </span>
                </li>
                <li>
                  <span className="hover:text-customer-gold transition-colors duration-200 cursor-pointer block py-1">
                    Certified CSM
                  </span>
                </li>
                <li>
                  <span className="hover:text-customer-gold transition-colors duration-200 cursor-pointer block py-1">
                    Train-the-Trainer
                  </span>
                </li>
                <li>
                  <span className="hover:text-customer-gold transition-colors duration-200 cursor-pointer block py-1">
                    CS for Businesses
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h3 className="font-playfair text-xl font-semibold mb-6 text-customer-gold">
                Get In Touch
              </h3>
              <div className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="mt-1 text-customer-gold">
                      <contact.icon className="text-lg" />
                    </div>
                    <div>
                      <p className="font-medium text-customer-cream">
                        {contact.text}
                      </p>
                      <p className="text-sm text-customer-cream/70">
                        {contact.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                className="mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-customer-gold text-customer-charcoal px-6 py-3 rounded-lg font-semibold hover:bg-customer-gold/90 transition-colors duration-200"
                >
                  <FaEnvelope className="text-lg" />
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-customer-cream/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
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

            {/* Legal Links */}
            <motion.div
              className="flex space-x-6 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <a
                href="/privacy"
                className="text-customer-cream/70 hover:text-customer-gold transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-customer-cream/70 hover:text-customer-gold transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-customer-cream/70 hover:text-customer-gold transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
