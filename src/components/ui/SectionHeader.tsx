import { Easing, motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  alignment?: "left" | "center" | "right";
  className?: string;
  badge?: ReactNode;
  variant?: "default" | "minimal";
}

const SectionHeader = ({
  title,
  subtitle,
  description,
  alignment = "center",
  className = "",
  badge,
  variant = "default",
}: SectionHeaderProps) => {
  const alignmentStyles = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  const variantStyles = {
    default: "space-y-4",
    minimal: "space-y-2",
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: dynamicEase as Easing,
      },
    },
  };

  return (
    <motion.div
      className={`max-w-4xl ${alignmentStyles[alignment]} ${variantStyles[variant]} ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Badge */}
      {badge && (
        <motion.div variants={itemVariants} className="inline-block">
          {badge}
        </motion.div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          variants={itemVariants}
          className="text-customer-gold font-semibold text-lg uppercase tracking-wider animate-pulse duration-300 transition-all"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Title */}
      <motion.h2
        variants={itemVariants}
        className={`font-playfair font-bold text-3xl md:text-4xl lg:text-5xl text-customer-charcoal leading-tight ${
          variant === "minimal" ? "text-2xl md:text-3xl" : ""
        }`}
      >
        {title}
      </motion.h2>

      {/* Description */}
      {description && (
        <motion.p
          variants={itemVariants}
          className={`text-customer-charcoal/80 leading-relaxed ${
            variant === "minimal" ? "text-base" : "text-lg md:text-xl"
          }`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
