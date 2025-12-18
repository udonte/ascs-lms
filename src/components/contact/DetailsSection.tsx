import { Easing, motion } from "framer-motion";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import {
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaGlobeAfrica,
  FaFacebook,
} from "react-icons/fa";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";

const DetailsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const dynamicEast = "easeOut";
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: dynamicEast as Easing,
      },
    },
  };

  const contactInfo = [
    {
      icon: <FiPhone className="text-2xl" />,
      title: "Phone Support",
      details: ["+234 703 224 5842"],
      description: "Mon - Fri, 9AM - 5PM WAT",
      color: "bg-customer-gold/10",
    },
    {
      icon: <FiMail className="text-2xl" />,
      title: "Email Contact",
      details: ["hello@theafricanschoolofcustomersuccess.com"],
      description: "Response within 24 hours",
      color: "bg-customer-charcoal/10",
    },
  ];

  const socialLinks = [
    {
      icon: <FaFacebook className="text-xl" />,
      label: "Facebook",
      link: "https://www.facebook.com/share/17hov6HLpC/",
      color: "bg-blue-400 hover:bg-blue-500",
      aria: "Follow us on Facebook",
    },
    {
      icon: <FaTwitter className="text-xl" />,
      label: "Twitter",
      link: "https://twitter.com/your-handle",
      color: "bg-blue-400 hover:bg-blue-500",
      aria: "Follow us on Twitter",
    },
    {
      icon: <FaLinkedin className="text-xl" />,
      label: "LinkedIn",
      link: "https://www.linkedin.com/company/elevateyour-career/",
      color: "bg-blue-600 hover:bg-blue-700",
      aria: "Connect on LinkedIn",
    },
    {
      icon: <FaInstagram className="text-xl" />,
      label: "Instagram",
      link: "https://instagram.com/your-handle",
      color: "bg-pink-500 hover:bg-pink-600",
      aria: "Follow us on Instagram",
    },
    {
      icon: <FaYoutube className="text-xl" />,
      label: "YouTube",
      link: "http://youtube.com/@theafricanschoolofcs",
      color: "bg-red-500 hover:bg-red-600",
      aria: "Subscribe on YouTube",
    },
  ];

  return (
    <section
      className="py-20 bg-linear-to-br from-white to-customer-cream"
      id="contact-details"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionHeader
            title="Connect with Us Directly"
            subtitle="Contact Details & Location"
            description="Reach out through any of these channels. We're here to support your Customer Success journey."
            alignment="center"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-customer-purple/10 p-8 lg:p-10">
              {/* Decorative Header */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-customer-purple to-customer-gold rounded-t-2xl"></div>

              <motion.h3
                variants={itemVariants}
                className="font-playfair text-2xl font-bold text-customer-charcoal mb-8"
              >
                Get in Touch
              </motion.h3>

              {/* Contact Info Grid */}
              <div className="flex flex-wrap gap-4 mb-8 w-full">
                {contactInfo.map((info) => (
                  <motion.div
                    key={info.title}
                    variants={itemVariants}
                    className={`p-5 rounded-xl ${info.color} border border-customer-purple/10 hover:shadow-md transition-all duration-300 w-full`}
                    whileHover={{ y: -3 }}
                  >
                    <div className="flex items-start gap-4 w-full">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-customer-charcoal mb-1">
                          {info.title}
                        </h4>
                        {/* make sure text doesnt overflow out of the container */}
                        <div className="space-y-1 mb-2 w-full  ">
                          {info.details.map((detail, i) => (
                            <p
                              key={i}
                              className="text-customer-charcoal/80 font-medium text-[8px] md:text-sm wrap-break-word whitespace-normal "
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm text-customer-charcoal/60">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Media */}
              <motion.div variants={itemVariants} className="mb-8">
                <h4 className="font-semibold text-customer-charcoal text-lg mb-4">
                  Follow & Connect With Us
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.color} text-white p-3 rounded-full flex items-center justify-center transition-all duration-300`}
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.aria}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Quick Action */}
              <motion.div variants={itemVariants}>
                <div className="bg-linear-to-r from-customer-purple/5 to-customer-gold/5 rounded-xl p-5 border border-customer-purple/10">
                  <h4 className="font-semibold text-customer-charcoal mb-3">
                    Need Immediate Assistance?
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="primary" className="flex-1">
                      <a
                        href="https://calendly.com/elevateyourcscareerteam/30min"
                        target="_blank"
                      >
                        Book Consultation
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-6 -right-6 w-64 h-64 bg-customer-gold/10 rounded-full blur-2xl"></div>
            <div className="absolute -z-10 bottom-6 -left-6 w-80 h-80 bg-customer-purple/10 rounded-full blur-2xl"></div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="h-full rounded-2xl overflow-hidden shadow-xl border border-customer-purple/10">
              {/* Map Header */}
              <div className="bg-linear-to-r from-customer-purple to-customer-gold p-4 text-customer-cream">
                <div className="flex items-center gap-3">
                  <FaGlobeAfrica className="text-xl" />
                  <h3 className="font-semibold text-lg">Our Global Presence</h3>
                </div>
              </div>

              {/* Map Container */}
              <div className="relative h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d65347923.32993394!2d-26.255929654137848!3d1.4613182697904932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10a06c0a948cf5d5%3A0x108270c99e90f0b3!2sAfrica!5e0!3m2!1sen!2sng!4v1764767947591!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ASCS Global Presence Map"
                  className="absolute inset-0"
                />

                {/* Map Overlay Content */}
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <h4 className="font-semibold text-customer-charcoal mb-2 flex items-center gap-2">
                      <FiMapPin className="text-customer-purple" />
                      Africa's Customer Success Hub
                    </h4>
                    <p className="text-sm text-customer-charcoal/70">
                      Serving professionals across Africa with global Customer
                      Success education. Our virtual campus reaches learners in
                      15+ countries.
                    </p>
                  </div>
                </div>

                {/* Floating Marker */}
                <motion.div
                  className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-customer-gold/20 rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 bg-customer-purple rounded-full flex items-center justify-center">
                        <FaGlobeAfrica className="text-white text-lg" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-customer-purple"></div>
                  </div>
                </motion.div>
              </div>

              {/* Map Footer */}
              <div className="bg-customer-cream p-4 border-t border-customer-purple/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-customer-charcoal/70">
                    <FiClock className="text-customer-gold" />
                    <span>Virtual campus available 24/7</span>
                  </div>
                  <Button
                    href="/courses"
                    variant="ghost"
                    size="sm"
                    className="text-customer-purple hover:text-customer-purple/80"
                  >
                    Explore Courses →
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Global Network */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-linear-to-r from-customer-purple/10 to-customer-gold/5 rounded-2xl p-8 border border-customer-purple/20"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="font-playfair text-2xl font-bold text-customer-charcoal mb-4">
              Building Africa's Customer Success Network
            </h3>
            <p className="text-lg text-customer-charcoal/80 mb-6">
              While we're headquartered virtually across Africa, our impact
              spans continents. Join our growing community of Customer Success
              professionals transforming careers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary">
                Join Our Community
              </Button>
              <Button
                variant="outline"
                className="border-customer-purple text-customer-purple hover:bg-customer-purple hover:text-white"
              >
                <a
                  href="https://www.linkedin.com/company/elevateyour-career/"
                  target="_blank"
                >
                  Join Linkedin Group
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DetailsSection;
