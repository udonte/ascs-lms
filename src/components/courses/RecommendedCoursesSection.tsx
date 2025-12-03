import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
import {
  FaBrain,
  FaComments,
  FaUsers,
  FaRocket,
  FaChartLine,
  FaLightbulb,
  FaUserShield,
  FaGlobe,
  FaLaptopHouse,
} from "react-icons/fa";

import storySection from "@/assets/course/recommend-courses.png";

const RecommendedCoursesSection = () => {
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

  const recommendedCourses = [
    {
      title: "Customer Success & Human Behaviour",
      description:
        "Understand the psychology behind customer decisions and relationships",
      icon: <FaBrain className="text-2xl" />,
      level: "Advanced",
      duration: "4 weeks",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Emotional Intelligence for CS",
      description:
        "Develop EQ skills for better customer relationships and team management",
      icon: <FaLightbulb className="text-2xl" />,
      level: "Intermediate",
      duration: "3 weeks",
      color: "from-amber-500 to-amber-600",
    },
    {
      title: "Communication Mastery for Tech Teams",
      description:
        "Professional communication skills for technical environments",
      icon: <FaComments className="text-2xl" />,
      level: "All Levels",
      duration: "2 weeks",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Leadership in Customer Success",
      description: "Develop leadership skills to manage CS teams effectively",
      icon: <FaUsers className="text-2xl" />,
      level: "Advanced",
      duration: "6 weeks",
      color: "from-green-500 to-green-600",
    },
    {
      title: "CS for Startups & Founders",
      description: "Build customer-centric cultures in early-stage companies",
      icon: <FaRocket className="text-2xl" />,
      level: "Intermediate",
      duration: "4 weeks",
      color: "from-red-500 to-red-600",
    },
    {
      title: "CS Operations & Analytics",
      description: "Master data-driven decision making in Customer Success",
      icon: <FaChartLine className="text-2xl" />,
      level: "Advanced",
      duration: "5 weeks",
      color: "from-teal-500 to-teal-600",
    },
    {
      title: "Customer Psychology",
      description:
        "Deep dive into understanding customer needs and motivations",
      icon: <FaUserShield className="text-2xl" />,
      level: "Intermediate",
      duration: "3 weeks",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Global Customer Experience Strategy",
      description: "Create customer experiences that work across cultures",
      icon: <FaGlobe className="text-2xl" />,
      level: "Advanced",
      duration: "6 weeks",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Remote Work & Productivity",
      description: "Excel in distributed Customer Success teams",
      icon: <FaLaptopHouse className="text-2xl" />,
      level: "All Levels",
      duration: "2 weeks",
      color: "from-gray-500 to-gray-600",
    },
  ];

  return (
    <section className="py-20 bg-linear-to-br from-customer-cream to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <SectionHeader
          title="Stay Ahead with Future-Ready Skills"
          subtitle="Recommended New Course Additions"
          alignment="center"
          description="We're constantly innovating our curriculum to include the most relevant and in-demand skills for the future of Customer Success."
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden">
              {/* Glass Background */}
              <div className="absolute inset-0 bg-linear-to-br from-customer-purple/20 to-customer-gold/10 backdrop-blur-sm border border-white/20 rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10 p-4 lg:p-8 h-96 lg:h-[600px]">
                {/* image */}
                <img
                  src={storySection}
                  alt="Future of Customer Success"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -left-4 bg-customer-purple text-customer-cream px-4 py-2 rounded-lg font-semibold shadow-lg backdrop-blur-sm"
                animate={{
                  y: [0, -10, 0],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🔮 Future Skills
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-customer-gold text-customer-charcoal px-4 py-2 rounded-lg font-semibold shadow-lg backdrop-blur-sm"
                animate={{
                  y: [0, 10, 0],
                  rotate: [2, -2, 2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                📈 In Demand
              </motion.div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-customer-gold/10 rounded-full blur-2xl"></div>
            <div className="absolute -z-10 bottom-8 -left-8 w-96 h-96 bg-customer-purple/10 rounded-full blur-2xl"></div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="order-1 lg:order-2"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="font-playfair text-3xl font-bold text-customer-charcoal mb-6">
                Building the Complete Customer Success Professional
              </h3>
              <p className="text-lg text-customer-charcoal/80 leading-relaxed mb-6">
                As Customer Success evolves, so must the skills of its
                professionals. Our recommended courses focus on the human,
                strategic, and analytical skills that will define top performers
                in the coming years.
              </p>
            </motion.div>

            {/* Courses Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-[400px] overflow-y-auto pr-4 hide-scrollbar"
            >
              {recommendedCourses.map((course) => (
                <motion.div
                  key={course.title}
                  variants={itemVariants}
                  className="p-4 rounded-xl bg-white border border-customer-purple/10 shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`shrink-0 w-12 h-12 rounded-lg bg-linear-to-r ${course.color} flex items-center justify-center text-white`}
                    >
                      {course.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-customer-charcoal text-sm mb-1">
                        {course.title}
                      </h4>
                      <p className="text-xs text-customer-charcoal/70 mb-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-customer-cream rounded">
                          {course.level}
                        </span>
                        <span className="text-xs text-customer-charcoal/60">
                          {course.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        {/* Why These Courses */}

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Button
            href="/contact"
            variant="primary"
            size="lg"
            icon={<FaLightbulb />}
          >
            Express Interest
          </Button>
          <Button
            href="/courses"
            variant="outline"
            size="lg"
            className="border-customer-purple text-customer-purple hover:bg-customer-purple hover:text-white"
          >
            View Current Courses
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default RecommendedCoursesSection;
