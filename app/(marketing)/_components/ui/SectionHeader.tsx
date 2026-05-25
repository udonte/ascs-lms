"use client";

import { motion } from "framer-motion";

type Alignment = "left" | "center" | "right";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  alignment?: Alignment;
  className?: string;
}

const alignmentClasses: Record<Alignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function SectionHeader({
  title,
  subtitle,
  description,
  alignment = "left",
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div
      className={`${alignmentClasses[alignment]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {subtitle && (
        <p className="text-customer-purple font-semibold tracking-wide uppercase mb-3">
          {subtitle}
        </p>
      )}
      <h2 className="font-playfair text-3xl md:text-4xl font-bold text-customer-charcoal mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-customer-charcoal/70 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}

