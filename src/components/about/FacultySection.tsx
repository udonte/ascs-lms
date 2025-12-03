import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import { FaCheck } from "react-icons/fa";

const FacultySection = () => {
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

  const facultyStrengths = [
    "Real-world Customer Success leaders",
    "Fintech innovators with African market experience",
    "Communication experts with global training",
    "Behavioural scientists and psychologists",
    "Soft skills & ethics trainers",
    "Industry-certified tool specialists",
  ];

  return (
    <section className="py-20 bg-linear-to-br from-customer-cream to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <SectionHeader
          title="Learn From Industry Leaders & Experts"
          subtitle="Our Faculty"
          alignment="center"
          description="ASCS™ instructors are seasoned professionals who bring real-world experience, cutting-edge knowledge, and a passion for teaching to every class."
          className="mb-16"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Faculty Strengths */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
          >
            {facultyStrengths.map((strength, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-customer-purple/10 shadow-sm"
              >
                <div className="shrink-0 w-8 h-8 bg-customer-gold/20 rounded-full flex items-center justify-center">
                  <FaCheck className="text-customer-gold" />
                </div>
                <span className="text-customer-charcoal font-medium">
                  {strength}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FacultySection;
