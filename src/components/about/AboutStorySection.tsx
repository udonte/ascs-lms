import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
// @ts-expect-error: Allow importing JPEG asset without image module declarations
import storySection from "@/assets/about/story.png";
import { FaArrowRight, FaGlobeAfrica, FaUsers, FaRocket } from "react-icons/fa";

const AboutStorySection = () => {
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

  const features = [
    {
      icon: <FaGlobeAfrica className="text-3xl text-customer-gold" />,
      title: "Global Vision",
      description:
        "Building bridges between African talent and global opportunities",
    },
    {
      icon: <FaUsers className="text-3xl text-customer-gold" />,
      title: "Community First",
      description:
        "Creating supportive networks for lifelong learning and growth",
    },
    {
      icon: <FaRocket className="text-3xl text-customer-gold" />,
      title: "Rapid Growth",
      description:
        "Accelerating careers in one of tech's fastest-growing fields",
    },
  ];

  return (
    <section className="py-20 bg-customer-cream">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <SectionHeader
          title="How We Began The Customer Success Movement"
          subtitle="The ASCS Story"
          alignment="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Visual Content */}
          <motion.div
            className=""
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="h-full min-h-[500px]">
              <img
                src={storySection}
                alt="ASCS Community"
                className="rounded-2xl min-h-[500px] w-full object-cover border-4 border-customer-cream/20 shadow-lg"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                The{" "}
                <span className="font-semibold text-customer-purple">
                  African School of Customer Success (ASCS™)
                </span>{" "}
                was created to solve a global challenge:
              </p>

              <blockquote className="border-l-4 border-customer-gold pl-6 ">
                <p className="text-xl font-playfair font-semibold text-customer-charcoal italic">
                  "Customer Success is growing worldwide - but Africans remain
                  underrepresented in the field."
                </p>
              </blockquote>

              <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                ASCS™ exists to change that by offering a globally competitive
                education, infused with{" "}
                <span className="font-semibold text-customer-purple">
                  African creativity, resilience, community, and leadership.
                </span>
              </p>

              <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                We are building the{" "}
                <span className="font-semibold text-customer-purple">
                  largest pipeline of Customer Success talent in Africa
                </span>{" "}
                - and a trusted global source of professionals trained with
                empathy, ethics, and excellence.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="text-center p-4 rounded-lg bg-white shadow-lg border border-customer-purple/10 hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-customer-charcoal mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-customer-charcoal/70">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="mt-8">
              <Button
                href="/about"
                variant="primary"
                size="lg"
                icon={<FaArrowRight />}
              >
                Learn Our Full Story
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutStorySection;
