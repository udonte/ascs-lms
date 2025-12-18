import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
import {
  FaHeadphones,
  FaBookOpen,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import magazine from "@/assets/contact/magazine.png";

const MagazinePodcastSection = () => {
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

  const magazineFeatures = [
    "Industry insights & trends",
    "Success stories from graduates",
    "Expert interviews",
    "Career growth strategies",
    "Tool & technology reviews",
  ];

  return (
    <section className="py-20 bg-linear-to-br from-customer-cream to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <SectionHeader
          title="Stay Connected & Keep Learning"
          subtitle="Magazine & Podcast Plus Events"
          alignment="center"
          description="Explore our digital magazine and listen to our podcast for continuous learning and industry insights. Attend Our Events too"
          className="mb-16"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Top Container: Customer Success Magazine */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="bg-white rounded-2xl shadow-xl border border-customer-purple/10 overflow-hidden">
              {/* Magazine Header */}
              <div className="bg-linear-to-r from-customer-purple to-customer-gold p-6 text-customer-cream">
                <div className="flex items-center gap-3 mb-2">
                  <FaBookOpen className="text-xl" />
                  <h3 className="text-2xl font-bold">
                    Customer Success Magazine
                  </h3>
                </div>
                <p className="text-customer-cream/90">
                  Your guide to Customer Success excellence
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Magazine Image (Left) */}
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    {/* Magazine Cover Placeholder */}
                    <div className=" bg-linear-to-br from-customer-purple/20 to-customer-gold/10 flex items-center justify-center">
                      <div className="relative z-10 p-4 lg:p-8 h-96 lg:h-[600px]">
                        {/* image */}
                        <img
                          src={magazine}
                          alt="Future of Customer Success"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Magazine Content (Right) */}
                <div className="flex flex-col justify-center">
                  <h4 className="font-playfair text-2xl font-bold text-customer-charcoal mb-4">
                    SUCCESS+ Digest Magazine
                  </h4>

                  <p className="text-customer-charcoal/80 leading-relaxed mb-6">
                    Our SUCCESS+ Digest is a premium industry publication
                    showcasing the future of Customer Success from Africa to the
                    world. This digital magazine brings you the latest trends,
                    success stories, and expert advice from the world of
                    Customer Success.
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {magazineFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-customer-gold/20 rounded-full flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 bg-customer-gold rounded-full"></div>
                        </div>
                        <span className="text-customer-charcoal font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="primary" icon={<FaBookOpen />}>
                      <a href="https://selar.com/42aii25n71" target="_blank">
                        Get Magazine
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Middle Container: Let's Talk Customer Success Podcast */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="bg-white rounded-2xl shadow-xl border border-customer-purple/10 overflow-hidden">
              {/* Podcast Header */}
              <div className="bg-linear-to-r from-customer-gold to-customer-purple p-6 text-customer-cream">
                <div className="flex items-center gap-3 mb-2">
                  <FaHeadphones className="text-xl" />
                  <h3 className="text-2xl font-bold">
                    Let's Talk Customer Success - Podcast
                  </h3>
                </div>
                <p className="text-customer-cream/90">
                  Conversations with industry leaders and successful
                  professionals
                </p>
              </div>

              {/* Podcast Content (Left) */}
              <div className="flex flex-col justify-center p-8">
                <h4 className="font-playfair text-2xl font-bold text-customer-charcoal mb-4">
                  Listen to Industry Leaders
                </h4>

                <p className="text-customer-charcoal/80 leading-relaxed mb-6">
                  Join us for insightful conversations with Customer Success
                  leaders, practitioners, and innovators. Each episode explores
                  real-world challenges, career journeys, and practical advice
                  for success.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" icon={<FaHeadphones />}>
                    <a href="https://youtube.com/@theafricanschoolofcs?si=N6mlswgy4ldVyNSO">
                      Listen Now on Youtube
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Container: Realities of Customer Success in Africa - An Event */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl shadow-xl border border-customer-purple/10 overflow-hidden">
              {/* Event Header */}
              <div className="bg-linear-to-r from-customer-purple to-customer-gold p-6 text-customer-cream">
                <div className="flex items-center gap-3 mb-2">
                  <FaCalendarAlt className="text-xl" />
                  <h3 className="text-2xl font-bold">
                    Realities of Customer Success in Africa - An Event
                  </h3>
                </div>
                <p className="text-customer-cream/90">
                  Join us for an insightful exploration of Customer Success in
                  the African context
                </p>
              </div>

              {/* Event Content (Text only) */}
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  <h4 className="font-playfair text-2xl font-bold text-customer-charcoal mb-6 text-center">
                    Navigating the African Customer Success Landscape
                  </h4>

                  <div className="space-y-6">
                    <p className="text-customer-charcoal/80 leading-relaxed">
                      Join us for a transformative event that explores the
                      unique challenges and opportunities of building Customer
                      Success careers and practices in Africa. This event brings
                      together industry leaders, practitioners, and aspiring
                      professionals to discuss the realities of CS on the
                      continent.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                      <div className="text-center p-6 rounded-xl bg-customer-cream/50 border border-customer-purple/10">
                        <FaUsers className="text-3xl text-customer-purple mx-auto mb-3" />
                        <h5 className="font-semibold text-customer-charcoal mb-2">
                          Networking
                        </h5>
                        <p className="text-sm text-customer-charcoal/70">
                          Connect with 100+ CS professionals
                        </p>
                      </div>
                      <div className="text-center p-6 rounded-xl bg-customer-cream/50 border border-customer-purple/10">
                        <FaMapMarkerAlt className="text-3xl text-customer-gold mx-auto mb-3" />
                        <h5 className="font-semibold text-customer-charcoal mb-2">
                          Virtual Event
                        </h5>
                        <p className="text-sm text-customer-charcoal/70">
                          Join from anywhere in Africa
                        </p>
                      </div>
                      <div className="text-center p-6 rounded-xl bg-customer-cream/50 border border-customer-purple/10">
                        <FaClock className="text-3xl text-customer-purple mx-auto mb-3" />
                        <h5 className="font-semibold text-customer-charcoal mb-2">
                          Interactive
                        </h5>
                        <p className="text-sm text-customer-charcoal/70">
                          Live Q&A and panel discussions
                        </p>
                      </div>
                    </div>

                    <div className="bg-customer-cream/30 rounded-xl p-6 ">
                      <h5 className="font-semibold text-customer-charcoal text-lg mb-3">
                        What You'll Gain:
                      </h5>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-customer-gold rounded-full mt-2 shrink-0"></div>
                          <span className="text-customer-charcoal/80">
                            Insights into the African Customer Success ecosystem
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-customer-gold rounded-full mt-2 shrink-0"></div>
                          <span className="text-customer-charcoal/80">
                            Strategies for overcoming regional challenges
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-customer-gold rounded-full mt-2 shrink-0"></div>
                          <span className="text-customer-charcoal/80">
                            Networking with African CS leaders and peers
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-customer-gold rounded-full mt-2 shrink-0"></div>
                          <span className="text-customer-charcoal/80">
                            Practical advice for career growth in the African
                            market
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MagazinePodcastSection;
