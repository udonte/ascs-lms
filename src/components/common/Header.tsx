import { useState } from "react";
import { NAV_LINKS, type NavLink } from "@/constants";

import Logo from "@/assets/ascs-logo.png";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaLinkedin } from "react-icons/fa";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const dynamicEase = "easeInOut";
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: dynamicEase as Easing,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: dynamicEase as Easing,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-customer-cream shadow-sm border-b border-customer-purple/10">
      <nav className=" text-customer-charcoal flex items-center justify-between p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" onClick={closeMobileMenu}>
            <img
              src={Logo}
              alt="African School of Customer Success"
              className="h-8 md:h-10 w-auto"
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link: NavLink) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={link.path}
                className={`relative px-3 py-2 transition-colors duration-200  ${
                  isActiveLink(link.path)
                    ? "text-customer-purple font-semibold"
                    : "text-customer-charcoal hover:text-customer-purple font-medium"
                }`}
              >
                {link.name}
                {isActiveLink(link.path) && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-customer-purple"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop CTA Button */}
        <motion.div
          className="hidden md:flex"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a
            href="https://www.linkedin.com/company/elevateyour-career/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-customer-purple text-white px-6 py-2 rounded-lg hover:bg-customer-purple/90 transition-colors duration-200 font-medium"
          >
            <FaLinkedin className="text-lg" />
            Join Community
          </a>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 text-customer-charcoal hover:text-customer-purple transition-colors duration-200"
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <HiX className="text-2xl" />
          ) : (
            <HiMenuAlt3 className="text-2xl" />
          )}
        </motion.button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 md:hidden z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobileMenu}
              />

              {/* Mobile Menu Panel */}
              <motion.div
                className="fixed top-0 right-0 h-full w-80 bg-customer-cream shadow-2xl md:hidden z-50"
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="flex flex-col h-full p-6">
                  {/* Header with Logo and Close Button */}
                  <div className="flex items-center justify-between mb-8">
                    <img
                      src={Logo}
                      alt="African School of Customer Success"
                      className="h-8"
                    />
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 text-customer-charcoal hover:text-customer-purple transition-colors duration-200"
                    >
                      <HiX className="text-2xl" />
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex flex-col space-y-4 flex-1">
                    {NAV_LINKS.map((link: NavLink, index: number) => (
                      <motion.div
                        key={link.name}
                        variants={itemVariants}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.path}
                          onClick={closeMobileMenu}
                          className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                            isActiveLink(link.path)
                              ? "bg-customer-purple text-white"
                              : "text-customer-charcoal hover:bg-customer-cream"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mobile CTA Button */}
                  <motion.div
                    variants={itemVariants}
                    transition={{ delay: NAV_LINKS.length * 0.1 }}
                    className="pt-6 border-t border-gray-200"
                  >
                    <a
                      href="https://www.linkedin.com/company/elevateyour-career/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 w-full bg-customer-purple text-white px-6 py-3 rounded-lg hover:bg-customer-purple/90 transition-colors duration-200 font-medium"
                    >
                      <FaLinkedin className="text-lg" />
                      Join Linkedin Community
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
