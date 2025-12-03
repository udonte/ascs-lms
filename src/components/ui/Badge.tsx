import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "outline" | "gold";
  className?: string;
  icon?: ReactNode;
}

const Badge = ({
  children,
  variant = "default",
  className = "",
  icon,
}: BadgeProps) => {
  const variantStyles = {
    default: "bg-customer-purple text-customer-cream",
    outline:
      "bg-transparent border border-customer-purple text-customer-purple",
    gold: "bg-customer-gold text-customer-charcoal",
  };

  return (
    <motion.span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${variantStyles[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {icon}
      {children}
    </motion.span>
  );
};

export default Badge;
