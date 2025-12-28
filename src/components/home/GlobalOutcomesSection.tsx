import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
import { useState, useEffect } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

import Olajumoke from "@/assets/students/Olajumoke-Akinmade..jpeg";
import Lilian from "@/assets/students/Lilian-testimony.png";
import Sonia from "@/assets/students/Sonia-Weli.jpeg";

// Placeholder images for demo
const PlaceholderImages = [
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
];

const GlobalOutcomesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with middle card active

  const studentStories = [
    {
      id: 1,
      name: "Inemesit Johnson",
      image: PlaceholderImages[1],
      quote:
        "This program was exactly what I needed as someone new to customer success. Each session addressed the questions I had, covering roles and responsibilities and providing valuable insights on how to excel in the field. If an opportunity in customer success arises, I'm confident that I have the knowledge and skills to hit the ground running.",
    },
    {
      id: 2,
      name: "Olajumoke Akinmade",
      image: Olajumoke,
      quote:
        "I'm aspiring to thrive as a Customer Success Manager and eventually become a though-leader at championing Customer-Centric Practices. Yesterday's session was super loaded. My biggest takeaway was the emphasis on the differences between Customer Journey Map and Customer Success Journey Map and the points where the CSMs come in. In addition to that, / learnt that beyond the core functions and day-to-day responsibilities of a CSM, there is an ease that effective collaborations with cross-functional teams, brings to our overall success.  The mentorship Program has been mind-blowing and very impactful. This platform has simplified Customer Success to me and I'm very thankful for the privilege to be a part it. Thank you very very much for all that you're doing. You're very much loved and appreciated.",
    },
    {
      id: 3,
      name: "Weli Sonia",
      image: Sonia,
      quote:
        "The Elevate Your Career Mentorship Class has been truly inspiring and an absolute eye opener into the world of Customer Success. As a Customer Service Representative transitioning into Customer Success, I've gained deep insights into who a Customer Success Manager (CSM) is, their core values, and the proven strategies that will help me stand out in this field. A huge thank you to Gloria Michael and the Elevate Your Career Mentorship Class for this incredible opportunity.",
    },
    {
      id: 4,
      name: "Lilian Uma",
      image: Lilian,
      quote:
        "Hi Gloria, I wanted to sincerely thank you for putting together such an insightful and well-structured mentorship program. Throughout the mentorship, I gained so much knowledge on key aspects of Customer Success, from onboarding best practices to customer retention strategies and personal branding. Each session was packed with valuable insights, and I truly appreciate the effort you put into making the experience so enriching. Your guidance has given me a clearer perspective on how to excel in a Customer Success role, and I'm excited to apply everything I've learned.Thank you again for your time, dedication, and generosity in sharing your expertise. I look forward to staying connected and continuing to learn from you! Best, Lilian",
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

  // Auto-rotate stories every 9 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 9000);
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

  const dynamicEase = "easeOut";

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: dynamicEase as Easing,
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
          {/* Three Card Grid */}
          <motion.div variants={itemVariants} className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center max-w-6xl mx-auto">
              {/* Left Card (Faint) */}
              <motion.div
                className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-customer-purple/10 opacity-60 scale-90 cursor-pointer group hidden md:block"
                whileHover={{ opacity: 0.8 }}
                onClick={prevSlide}
              >
                <div className="text-center">
                  {/* Round Image Container */}
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-customer-purple/30 group-hover:border-customer-purple/50 transition-all duration-300">
                      <img
                        src={visibleStories[0].image}
                        alt={visibleStories[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h3 className="font-semibold text-customer-charcoal text-sm mb-2">
                    {visibleStories[0].name}
                  </h3>

                  <p className="text-customer-charcoal/50 text-xs italic line-clamp-3">
                    "{visibleStories[0].quote}"
                  </p>
                </div>
              </motion.div>

              {/* Middle Card (Prominent) */}
              <motion.div
                className="p-4 rounded-2xl bg-white shadow-2xl border border-customer-gold/30 relative z-10 scale-105 group"
                whileHover={{ y: -5 }}
              >
                <div className="text-center">
                  {/* Round Image Container with Border */}
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-customer-gold/30 group-hover:border-customer-gold/50 transition-all duration-300">
                      <img
                        src={visibleStories[1].image}
                        alt={visibleStories[1].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h3 className="font-playfair text-2xl font-semibold text-customer-charcoal mb-2">
                    {visibleStories[1].name}
                  </h3>

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
                className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-customer-purple/10 opacity-60 scale-90 cursor-pointer group hidden md:block"
                whileHover={{ opacity: 0.8 }}
                onClick={nextSlide}
              >
                <div className="text-center">
                  {/* Round Image Container */}
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-customer-purple/30 group-hover:border-customer-purple/50 transition-all duration-300">
                      <img
                        src={visibleStories[2].image}
                        alt={visibleStories[2].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h3 className="font-semibold text-customer-charcoal text-sm mb-2">
                    {visibleStories[2].name}
                  </h3>

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
              className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group border border-customer-purple/10 cursor-pointer z-20"
              aria-label="Previous story"
            >
              <GoChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-customer-purple group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group border border-customer-purple/10 cursor-pointer z-20"
              aria-label="Next story"
            >
              <GoChevronRight className="w-5 h-5 md:w-6 md:h-6 text-customer-purple group-hover:scale-110 transition-transform" />
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
