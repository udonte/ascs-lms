import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import {
  FaStar,
  FaGraduationCap,
  FaHandsHelping,
  FaGlobe,
  FaUserFriends,
  FaAward,
  FaRocket,
} from "react-icons/fa";

import WhyStudentsLove from "@/assets/home/WhyStudentsLove.png";

const WhyStudentsLoveSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const lovePoints = [
    {
      icon: <FaGraduationCap className="text-2xl" />,
      title: "African-led, globally relevant",
      description:
        "Curriculum designed for African professionals with global career aspirations",
    },
    {
      icon: <FaGlobe className="text-2xl" />,
      title: "Real-world SaaS & fintech examples",
      description:
        "Learn with case studies from actual African and global tech companies",
    },
    {
      icon: <FaHandsHelping className="text-2xl" />,
      title: "Hands-on practical assignments",
      description:
        "Apply your learning immediately with projects that build your portfolio",
    },
    {
      icon: <FaUserFriends className="text-2xl" />,
      title: "Simple, friendly, human-centered teaching",
      description:
        "Complex concepts explained in ways that make sense to everyone",
    },
    {
      icon: <FaAward className="text-2xl" />,
      title: "Global-ready portfolio creation",
      description:
        "Graduate with work samples that impress international employers",
    },
    {
      icon: <FaRocket className="text-2xl" />,
      title: "Lifetime access to community",
      description:
        "Join a growing network of Customer Success professionals worldwide",
    },
  ];

  const testimonials = [
    {
      quote:
        "I moved from customer support to Customer Success in 6 weeks. ASCS made the impossible possible!",
      initial: "A",
      bgColor: "bg-customer-purple",
    },
    {
      quote:
        "This program changed my confidence completely. I now lead customer conversations with authority.",
      initial: "K",
      bgColor: "bg-customer-gold",
    },
    {
      quote:
        "I now earn in dollars after taking the course. The global preparation was exceptional.",
      initial: "M",
      bgColor: "bg-customer-charcoal",
    },
    {
      quote:
        "ASCS feels like a university. It transformed my mindset and career trajectory.",
      initial: "S",
      bgColor: "bg-customer-purple",
    },
  ];

  return (
    <section
      className="py-20 bg-linear-to-br from-customer-cream to-white"
      id="why-students-love"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <SectionHeader
          title="Join Thousands of Successful Graduates"
          subtitle="Why Students Love ASCS™"
          alignment="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Visual Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden">
              {/* Glass Background */}
              <div className="absolute inset-0 bg-linear-to-br from-customer-gold/20 to-customer-purple/10 backdrop-blur-sm border border-white/20 rounded-2xl"></div>

              {/* Image Placeholder */}
              <div className="relative z-10 h-96 lg:h-[500px] bg-linear-to-br from-customer-gold/10 to-customer-charcoal/10 rounded-2xl flex items-center justify-center">
                <img
                  src={WhyStudentsLove}
                  alt="Why Students Love ASCS Illustration"
                  className="relative z-10 w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Testimonials Overlay */}
              <div className="absolute top-6 left-6 right-6 z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <h4 className="font-semibold text-customer-charcoal mb-4 flex items-center gap-2">
                    <FaStar className="text-customer-gold" />
                    What Our Students Say:
                  </h4>
                  <div className="space-y-3">
                    {testimonials.map((testimonial, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + 0.5 }}
                        viewport={{ once: true }}
                      >
                        <div
                          className={`w-8 h-8 ${testimonial.bgColor} rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0`}
                        >
                          {testimonial.initial}
                        </div>
                        <p className="text-sm text-customer-charcoal/80 italic">
                          "{testimonial.quote}"
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -bottom-4 -left-4 bg-customer-purple text-customer-cream px-4 py-2 rounded-lg font-semibold shadow-lg backdrop-blur-sm z-20"
                animate={{
                  y: [0, 10, 0],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ⭐ 95% Satisfaction
              </motion.div>

              <motion.div
                className="absolute -top-4 -right-4 bg-customer-gold text-customer-charcoal px-4 py-2 rounded-lg font-semibold shadow-lg backdrop-blur-sm z-20"
                animate={{
                  y: [0, -10, 0],
                  rotate: [2, -2, 2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                🎓 500+ Graduates
              </motion.div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -z-10 top-8 -left-8 w-72 h-72 bg-customer-purple/10 rounded-full blur-2xl"></div>
            <div className="absolute -z-10 bottom-8 -right-8 w-96 h-96 bg-customer-gold/10 rounded-full blur-2xl"></div>

            {/* Certification Recognition */}
            <motion.div
              variants={itemVariants}
              className="bg-linear-to-r from-customer-purple/10 to-customer-gold/5 p-6 rounded-2xl border-l-4 border-customer-gold mt-12"
            >
              <div className="flex items-center gap-4">
                <FaAward className="text-3xl text-customer-gold" />
                <div>
                  <h4 className="font-semibold text-customer-charcoal text-lg mb-1">
                    Certification Recognized Worldwide
                  </h4>
                  <p className="text-customer-charcoal/70">
                    Our credentials are trusted by employers across Africa,
                    Europe, and the US
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Love Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {lovePoints.map((point) => (
                <motion.div
                  key={point.title}
                  variants={itemVariants}
                  className="p-6 rounded-2xl bg-white border border-customer-purple/10 hover:shadow-lg transition-all duration-300 group"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 p-3 bg-customer-gold/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      {point.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-customer-charcoal mb-2">
                        {point.title}
                      </h3>
                      <p className="text-customer-charcoal/70 text-sm leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyStudentsLoveSection;
