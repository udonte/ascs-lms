import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import {
  FaCheck,
  FaBullseye,
  FaEye,
  FaHandshake,
  FaRocket,
  FaHeart,
} from "react-icons/fa";

const MissionVisionSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const missionPoints = [
    "Global excellence",
    "Leadership & innovation",
    "Soft skills mastery",
    "Ethical customer experiences",
    "Human-centered communication",
    "Real-world, job-ready training",
  ];

  return (
    <section className="py-20 bg-white" id="mission-vision">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <SectionHeader
          title="Our Guiding Principles"
          subtitle="Mission & Vision"
          alignment="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mission Card */}
          <motion.div
            className="relative bg-linear-to-br 
            // make the card transparent
            
            from-customer-purple to-purple-800 rounded-2xl p-8 text-customer-cream"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-customer-gold/20 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-customer-teal/20 rounded-full translate-y-16 -translate-x-16 blur-2xl"></div>

            {/* Header */}
            <motion.div variants={itemVariants} className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-customer-gold/20 rounded-lg">
                  <FaBullseye className="text-2xl text-customer-gold" />
                </div>
                <h3 className="font-playfair text-3xl font-bold">
                  Our Mission
                </h3>
              </div>

              <p className="text-lg mb-8 leading-relaxed">
                To build the most trusted Customer Success learning institution
                in Africa by delivering education that blends:
              </p>
            </motion.div>

            {/* Mission Points */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10"
              variants={containerVariants}
            >
              {missionPoints.map((point) => (
                <motion.div
                  key={point}
                  variants={itemVariants}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaCheck className="text-customer-gold shrink-0" />
                  <span className="text-customer-cream font-medium">
                    {point}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom Accent */}
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-customer-gold rounded-full"
              variants={itemVariants}
            ></motion.div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            className="relative bg-linear-to-br from-customer-teal to-teal-800 rounded-2xl p-8 text-customer-cream"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-customer-gold/20 rounded-full -translate-y-16 -translate-x-16 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-customer-purple/20 rounded-full translate-y-16 translate-x-16 blur-2xl"></div>

            {/* Header */}
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-customer-gold/20 rounded-lg">
                  <FaEye className="text-2xl text-customer-gold" />
                </div>
                <h3 className="font-playfair text-3xl font-bold">Our Vision</h3>
              </div>

              <p className="text-lg mb-6 leading-relaxed">
                To become a globally recognized institution for Customer Success
                and Human Behaviour - and the #1 destination for companies
                seeking:
              </p>
            </div>

            {/* Vision Highlights */}
            <motion.div
              className="space-y-4 relative z-10"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: <FaRocket className="text-customer-gold" />,
                  text: "Skilled Customer Success talent from Africa",
                },
                {
                  icon: <FaHandshake className="text-customer-gold" />,
                  text: "Ethical and principled professionals",
                },
                {
                  icon: <FaHeart className="text-customer-gold" />,
                  text: "Emotionally intelligent team members",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm"
                  whileHover={{ x: 5 }}
                >
                  <div className="shrink-0">{item.icon}</div>
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Inspirational Quote */}
            <motion.div
              className="mt-8 p-4 border-l-4 border-customer-gold bg-white/5 rounded-r-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-customer-cream/90 italic">
                "Shaping the future of customer relationships through African
                excellence and global standards."
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Connecting Element */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-customer-gold text-customer-charcoal px-6 py-3 rounded-full font-semibold shadow-lg">
            Together, Building Africa's Customer Success Legacy
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
