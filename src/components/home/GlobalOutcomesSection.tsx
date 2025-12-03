import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
import { useState, useEffect } from "react";
import { FaQuoteLeft, FaMapMarkerAlt } from "react-icons/fa";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

const GlobalOutcomesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with middle card active

  const studentStories = [
    {
      id: 1,
      name: "Amina B.",
      role: "Senior CSM",
      location: "Lagos → Global",
      quote:
        "I moved from customer support to Customer Success in 6 weeks. ASCS made the impossible possible!",
    },
    {
      id: 2,
      name: "Kwame T.",
      role: "Customer Success Lead",
      location: "Accra → Berlin",
      quote:
        "This program changed my confidence completely. I now lead customer conversations with authority.",
    },
    {
      id: 3,
      name: "Maria S.",
      role: "CS Manager",
      location: "Nairobi → Global",
      quote:
        "I now earn in dollars after taking the course. The global preparation was exceptional.",
    },
    {
      id: 4,
      name: "Samuel J.",
      role: "Head of Customer Success",
      location: "Kampala → Pan-Africa",
      quote:
        "ASCS feels like a university. It transformed my mindset and career trajectory completely.",
    },
    {
      id: 5,
      name: "Chiamaka N.",
      role: "CS Operations Specialist",
      location: "Abuja → International",
      quote:
        "The mentorship and community support helped me negotiate a 300% salary increase with confidence.",
    },
  ];

  // Get the three stories to display (previous, current, next)
  const getVisibleStories = () => {
    const stories: typeof studentStories = [];
    for (let i = -1; i <= 1; i++) {
      let index = currentIndex + i;
      if (index < 0) index = studentStories.length - 1;
      if (index >= studentStories.length) index = 0;
      stories.push(studentStories[index]);
    }
    return stories;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === studentStories.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? studentStories.length - 1 : prev - 1
    );
  };

  // Auto-rotate stories every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dynamicEase = "easeOut"; // Example dynamic string

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        // Assert the type using 'as Easing'
        ease: dynamicEase as Easing, // <-- Use with caution
      },
    },
  };

  const visibleStories = getVisibleStories();

  return (
    <section
      className="py-20 bg-linear-to-br from-white to-customer-cream"
      id="global-outcomes"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <SectionHeader
          title="Real Stories, Real Transformations"
          subtitle="Global Outcomes & Student Stories"
          alignment="center"
          className="mb-16"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Stats Overview */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { number: "500+", label: "Students Transformed" },
              { number: "95%", label: "Career Success Rate" },
              { number: "15+", label: "Countries Reached" },
              { number: "$2M+", label: "Total Salary Impact" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white shadow-lg border border-customer-purple/10"
              >
                <div className="text-2xl md:text-3xl font-bold text-customer-purple mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-customer-charcoal/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Three Card Grid */}
          <motion.div variants={itemVariants} className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-6xl mx-auto">
              {/* Left Card (Faint) */}
              <motion.div
                className="p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-customer-purple/10 opacity-60 scale-90 cursor-pointer"
                whileHover={{ opacity: 0.8 }}
                onClick={prevSlide}
              >
                <div className="text-center">
                  <h3 className="font-semibold text-customer-charcoal text-sm mb-2">
                    {visibleStories[0].name}
                  </h3>
                  <p className="text-customer-charcoal/60 text-xs mb-2">
                    {visibleStories[0].role}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-customer-purple/70 mb-3">
                    <FaMapMarkerAlt className="text-xs" />
                    <span className="text-xs">
                      {visibleStories[0].location}
                    </span>
                  </div>
                  <p className="text-customer-charcoal/50 text-xs italic line-clamp-3">
                    "{visibleStories[0].quote}"
                  </p>
                </div>
              </motion.div>

              {/* Middle Card (Prominent) */}
              <motion.div
                className="p-8 rounded-2xl bg-white shadow-2xl border border-customer-gold/30 relative z-10 scale-105"
                whileHover={{ y: -5 }}
              >
                <div className="text-center">
                  {/* Profile */}

                  <h3 className="font-playfair text-2xl font-semibold text-customer-charcoal mb-2">
                    {visibleStories[1].name}
                  </h3>

                  <p className="text-customer-purple font-medium mb-2">
                    {visibleStories[1].role}
                  </p>

                  <div className="flex items-center justify-center gap-2 text-customer-charcoal/70 mb-4">
                    <FaMapMarkerAlt className="text-sm" />
                    <span className="text-sm font-medium">
                      {visibleStories[1].location}
                    </span>
                  </div>

                  <div className="bg-customer-cream/50 rounded-xl p-4 mb-4">
                    <FaQuoteLeft className="text-customer-gold text-lg mb-2 mx-auto" />
                    <p className="text-customer-charcoal/80 italic leading-relaxed text-sm">
                      "{visibleStories[1].quote}"
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Right Card (Faint) */}
              <motion.div
                className="p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-customer-purple/10 opacity-60 scale-90 cursor-pointer"
                whileHover={{ opacity: 0.8 }}
                onClick={nextSlide}
              >
                <div className="text-center">
                  <h3 className="font-semibold text-customer-charcoal text-sm mb-2">
                    {visibleStories[2].name}
                  </h3>
                  <p className="text-customer-charcoal/60 text-xs mb-2">
                    {visibleStories[2].role}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-customer-purple/70 mb-3">
                    <FaMapMarkerAlt className="text-xs" />
                    <span className="text-xs">
                      {visibleStories[2].location}
                    </span>
                  </div>
                  <p className="text-customer-charcoal/50 text-xs italic line-clamp-3">
                    "{visibleStories[2].quote}"
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {studentStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-customer-purple w-8"
                      : "bg-customer-purple/30 hover:bg-customer-purple/50"
                  }`}
                  aria-label={`Go to story ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-8 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group md:block border border-customer-purple/10 cursor-pointer"
              aria-label="Previous story"
            >
              <GoChevronLeft className="w-6 h-6 text-customer-purple group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group md:block border border-customer-purple/10 cursor-pointer"
              aria-label="Next story"
            >
              <GoChevronRight className="w-6 h-6 text-customer-purple group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <Button
              href="/courses"
              variant="primary"
              size="lg"
              className="mx-auto"
            >
              Start Your Success Story
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalOutcomesSection;
