import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
import {
  FaFileAlt,
  FaBriefcase,
  FaUserTie,
  FaUsers,
  FaRocket,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";
import Career from "@/assets/course/career.png";

const CareerAcceleratorSection = () => {
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

  const acceleratorServices = [
    {
      icon: <FaFileAlt className="text-2xl" />,
      title: "CV & LinkedIn Optimization",
      description:
        "Professional resume writing and LinkedIn profile enhancement",
      color: "bg-customer-purple/10",
    },
    {
      icon: <FaUserTie className="text-2xl" />,
      title: "Interview Coaching",
      description: "Mock interviews and feedback for global roles",
      color: "bg-customer-gold/10",
    },
    {
      icon: <FaBriefcase className="text-2xl" />,
      title: "Portfolio Building",
      description: "Create compelling case studies and work samples",
      color: "bg-customer-charcoal/10",
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Job Search Strategy",
      description: "Personalized job search and application plan",
      color: "bg-customer-purple/10",
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Reference Preparation",
      description: "Prepare professional references and recommendations",
      color: "bg-customer-gold/10",
    },
    {
      icon: <FaRocket className="text-2xl" />,
      title: "Access to Employer Partners",
      description: "Connect with our network of hiring companies",
      color: "bg-customer-charcoal/10",
    },
  ];

  return (
    <section id="career-accelerator" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <SectionHeader
          title="We Help You Succeed Even After Graduation"
          subtitle="Career Accelerator"
          alignment="center"
          description="Our comprehensive career support ensures you're not just course-complete, but job-ready and confident to compete anywhere in the world."
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div>
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="font-playfair text-3xl font-bold text-customer-charcoal mb-6">
                From Learning to Earning: Your Career Journey
              </h3>
              <p className="text-lg text-customer-charcoal/80 leading-relaxed mb-6">
                At{" "}
                <span className="font-semibold text-customer-purple">
                  ASCS™
                </span>
                , we don't just promise jobs — we prepare you to be job-ready,
                not just "course-complete." Our New Career Accelerator program
                provides the tools, guidance, and connections you need to land
                your dream role.
              </p>
            </motion.div>

            {/* Services Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
              {acceleratorServices.map((service) => (
                <motion.div
                  key={service.title}
                  variants={itemVariants}
                  className={`p-4 rounded-xl ${service.color} border border-customer-purple/10`}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0">{service.icon}</div>
                    <div>
                      <h4 className="font-semibold text-customer-charcoal mb-1">
                        {service.title}
                      </h4>
                      <p className="text-sm text-customer-charcoal/70">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Image Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden">
              {/* Glass Background */}
              <div className="absolute inset-0 bg-linear-to-br from-customer-gold/20 to-customer-purple/10 backdrop-blur-sm border border-white/20 rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10 p-4 lg:p-8  h-80 lg:h-96">
                <img
                  src={Career}
                  alt="Career Support"
                  className="w-full h-full rounded-2xl shadow-lg"
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
                Career Launch
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
                Job Ready
              </motion.div>
            </div>
            {/* CTA */}
            <motion.div variants={itemVariants} className="mt-12">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                icon={<FaCheckCircle />}
              >
                Start Your Career Acceleration
              </Button>
            </motion.div>
            {/* Background Decorative Elements */}
            <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-customer-purple/10 rounded-full blur-2xl"></div>
            <div className="absolute -z-10 bottom-8 -left-8 w-96 h-96 bg-customer-gold/10 rounded-full blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CareerAcceleratorSection;
