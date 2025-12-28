import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Gloria from "@/assets/mentors/Gloria-Michael.jpeg";
import Mayank from "@/assets/mentors/Mayank-Vyas.png";
import Virginia from "@/assets/mentors/Virginia-Bloom.jpeg";
import Mohammed from "@/assets/mentors/Mohammed-Asif.png";
import Deepali from "@/assets/mentors/Deepali-Jagota.png";
import Deedra from "@/assets/mentors/DeEdra-Williams.jpg";

const MentorsSection = () => {
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

  const mentors = [
    {
      id: 1,
      name: "Mayank Vyas",
      role: "Senior Key Account Manager at Kapture",
      image: Mayank,
    },
    {
      id: 2,
      name: "Virginia Bloom",
      role: "Director of Customer Experience at Acclaimant",
      image: Virginia,
    },
    {
      id: 3,
      name: "Mohammed Asif",
      role: "Snr. Customer Sucess Manager at Zendesk",
      image: Mohammed,
    },
    {
      id: 4,
      name: "Deepali Jagota",
      role: "Customer Success Manager Cornerstone Ondemand",
      image: Deepali,
    },
    {
      id: 5,
      name: "De'Edra Williams",
      role: "Customer Success Manager at Revenue Frontier",
      image: Deedra,
    },

    {
      id: 6,
      name: "Gloria Michael",
      role: "Success & Partnership Lead, WRO",
      image: Gloria,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <SectionHeader
          title="Learn From Industry Experts"
          subtitle="Our Mentors"
          alignment="center"
          description="Get guidance from experienced Customer Success professionals who have walked the path and achieved remarkable career success."
          className="mb-16"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {mentors.map((mentor) => (
              <motion.div
                key={mentor.id}
                variants={itemVariants}
                className="group"
                whileHover={{ y: -5 }}
              >
                <div className="h-full rounded-2xl overflow-hidden bg-white shadow-lg border border-customer-purple/10 transition-all duration-300 group-hover:shadow-2xl">
                  {/* Mentor Card Header */}
                  <div className="relative h-48 bg-linear-to-r from-customer-purple/20 to-customer-gold/10">
                    {/* Round Image Container */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        {/* Main Round Image */}
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mentor Card Content */}
                  <div className="pt-16 pb-8 px-6 text-center">
                    <h3 className="font-playfair text-xl font-bold text-customer-charcoal mb-2">
                      {mentor.name}
                    </h3>

                    <div className="inline-block bg-customer-purple/10 text-customer-purple text-sm font-semibold px-3 py-1 rounded-full mb-2">
                      {mentor.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-customer-charcoal/80 mb-6">
                Ready to accelerate your Customer Success career with
                personalized mentorship?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 bg-customer-purple text-white px-8 py-3 rounded-lg font-semibold hover:bg-customer-purple/90 transition-colors duration-200"
                >
                  View All Programs
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border-2 border-customer-purple text-customer-purple px-8 py-3 rounded-lg font-semibold hover:bg-customer-purple hover:text-white transition-colors duration-200"
                >
                  Book Consultation
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MentorsSection;
