"use client";

import Image from "next/image";
import { Easing, motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import { FaSignature } from "react-icons/fa";

export default function CeoNoteSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const dynamicEase = "easeOut";
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: dynamicEase as Easing },
    },
  };

  return (
    <section className="py-20 bg-white" id="ceo-note">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="A Personal Message From Our Founder"
          subtitle="From the Desk of Gloria Michael"
          alignment="center"
          className="mb-16"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-5xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="rounded-2xl overflow-hidden shadow-2xl mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="bg-customer-purple p-8 flex flex-col items-center justify-center text-customer-cream relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 text-center">
                  <div className="w-52 h-52 bg-customer-gold rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/30 overflow-hidden relative">
                    <Image
                      src="/assets/about/GloriaMichael.jpeg"
                      alt="Gloria Michael, CEO"
                      fill
                      className="rounded-full object-cover border-2 border-customer-charcoal/50 drop-shadow-sm"
                      sizes="208px"
                    />
                  </div>

                  <h3 className="font-playfair text-3xl font-bold mb-2">
                    Gloria Michael
                  </h3>
                  <p className="text-lg mb-1">Founder & CEO</p>
                  <p className="text-sm opacity-90 text-customer-gold">
                    African School of Customer Success
                  </p>

                  <div className="mt-8 pt-6 border-t border-white/30">
                    <p className="italic text-sm">
                      "When you light one person's path, you brighten an entire
                      generation."
                    </p>
                  </div>
                </div>

                <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
              </div>

              <div className="bg-white p-8 lg:col-span-2">
                <div className="space-y-6">
                  <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                    Every great movement begins with a simple belief - that
                    people, when empowered with the right knowledge and the
                    right support, can change their lives, their communities,
                    and the world.
                  </p>

                  <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                    <span className="font-semibold text-customer-purple">
                      ASCS™
                    </span>{" "}
                    was born from that belief. For years, I watched brilliant
                    Africans doubt themselves, shrink their ambitions, and
                    question their place in the global tech industry. Not
                    because they lacked talent - but because they lacked access,
                    clarity, confidence, and a school that truly understood
                    them.
                  </p>

                  <div className="bg-customer-cream/50 p-6 rounded-xl border-l-4 border-customer-gold">
                    <p className="text-xl font-playfair font-semibold text-customer-charcoal italic">
                      "Customer Success is one of the fastest-growing fields in
                      the world. But Africa's voice was missing. Our creativity,
                      empathy, resilience, and emotional intelligence were
                      absent in the global narrative."
                    </p>
                  </div>

                  <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                    I created{" "}
                    <span className="font-semibold text-customer-purple">
                      ASCS™
                    </span>{" "}
                    to change that. Here, we are not just training
                    professionals. We are shaping leaders, thinkers,
                    problem-solvers, and global citizens who can stand anywhere
                    in the world and say:{" "}
                    <span className="font-semibold text-customer-purple">
                      "I belong here."
                    </span>
                  </p>

                  <p className="text-lg text-customer-charcoal/80 leading-relaxed">
                    At{" "}
                    <span className="font-semibold text-customer-purple">
                      ASCS™
                    </span>
                    , we blend global excellence with African depth. We teach
                    the technical skills the world demands - and the human
                    skills the world forgot. We train with empathy, ethics,
                    communication, and integrity at the center, because the
                    future of Customer Success is deeply human.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center bg-linear-to-r from-customer-purple/10 to-customer-gold/5 rounded-2xl p-8 border border-customer-purple/20"
          >
            <div className="max-w-3xl mx-auto">
              <h3 className="font-playfair text-2xl font-bold text-customer-charcoal mb-6">
                My Personal Promise
              </h3>

              <div className="space-y-4 text-lg text-customer-charcoal/80 leading-relaxed">
                <p>
                  This school is more than an institution. It is a doorway. A
                  bridge. A promise.
                </p>

                <p>
                  A promise that African talent will no longer be overlooked. A
                  promise that global companies will look to Africa for
                  world-class Customer Success professionals. A promise that
                  every learner who walks through our doors will walk out
                  changed - more confident, more capable, and more equipped to
                  shape their own story.
                </p>

                <div className="pt-6 border-t border-customer-purple/20">
                  <p className="italic">
                    To our students, future alumni, partners, and global
                    community - thank you for believing in this vision. Thank
                    you for choosing ASCS™. Thank you for building the future
                    with us.
                  </p>

                  <div className="mt-6">
                    <p className="font-playfair text-xl font-semibold text-customer-purple">
                      This is only the beginning.
                    </p>
                    <p className="text-lg font-medium text-customer-charcoal mt-2">
                      Africa is rising - and the world is watching.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-customer-gold/30">
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <FaSignature className="text-4xl text-customer-charcoal" />
                  </div>
                  <p className="text-xl font-bold text-customer-purple">
                    Gloria Michael
                  </p>
                  <p className="text-customer-charcoal/70">
                    Lead Senior Customer Success Manager
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

