import { Easing, motion } from "framer-motion";
import Button from "../ui/Button";
import { FaArrowRight, FaGlobeAfrica, FaRocket, FaStar } from "react-icons/fa";

const CallToActionSection = () => {
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

  const dynamicEase = "easeOut";
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: dynamicEase as Easing,
      },
    },
  };

  return (
    <section className="relative py-20 overflow-hidden bg-customer-charcoal">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-customer-gold rounded-full mix-blend-soft-light filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-customer-cream/20 rounded-full mix-blend-soft-light filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-customer-gold/20 rounded-full mix-blend-soft-light filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-customer-cream/10 backdrop-blur-sm border border-customer-cream/20 rounded-full px-6 py-3 mb-8"
          >
            <FaStar className="text-customer-gold text-lg" />
            <span className="text-customer-cream font-semibold text-lg">
              Your Moment Is Now
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            variants={itemVariants}
            className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-customer-cream leading-tight mb-6"
          >
            Your Global Customer Success Career{" "}
            <span className="text-customer-gold">Starts Here.</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.div
            variants={itemVariants}
            className="text-xl md:text-2xl text-customer-cream/90 leading-relaxed mb-8 font-light space-y-2"
          >
            <p>Africa is rising.</p>
            <p>Customer Success is booming.</p>
            <p className="text-customer-gold font-semibold">
              Your moment is now.
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-customer-cream/80 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            Join <span className="font-semibold text-customer-gold">ASCS™</span>{" "}
            - where African talent becomes global leaders. Transform your career
            with world-class education, mentorship, and a community that
            supports your growth every step of the way.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-8 justify-center mb-12"
          >
            <Button
              href="/courses"
              variant="primary"
              size="lg"
              icon={<FaRocket />}
              className="text-lg px-8 py-4"
            >
              Enroll Today
            </Button>

            <Button
              href="/contact"
              variant="outline"
              size="lg"
              icon={<FaArrowRight />}
              className="text-lg px-8 py-4 border-2 border-customer-cream text-customer-cream hover:bg-customer-cream hover:text-customer-purple"
            >
              Speak With an Advisor
            </Button>
          </motion.div>

          {/* Features */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: <FaGlobeAfrica className="text-2xl" />,
                title: "Global Recognition",
                description: "Certifications trusted worldwide",
              },
              {
                icon: <FaRocket className="text-2xl" />,
                title: "Rapid Transformation",
                description: "Career growth in weeks, not years",
              },
              {
                icon: <FaStar className="text-2xl" />,
                title: "Proven Success",
                description: "95% career success rate",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-customer-cream hover:bg-white/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-customer-gold/20 rounded-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-customer-cream/80 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Final Encouragement */}
          <motion.div
            variants={itemVariants}
            className="bg-customer-gold/20 backdrop-blur-sm rounded-2xl p-8 border border-customer-gold/30"
          >
            <p className="text-xl font-playfair font-semibold text-customer-cream italic">
              "Don't just watch the future of Customer Success unfold - be part
              of it. Your journey to becoming a world-class professional starts
              with one bold decision."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
