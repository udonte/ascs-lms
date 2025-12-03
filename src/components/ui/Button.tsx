import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  icon,
  iconPosition = "right",
  type = "button",
  disabled = false,
}: ButtonProps) => {
  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center gap-3 font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg";

  // Variant styles
  const variantStyles = {
    primary:
      "bg-customer-gold text-customer-charcoal hover:bg-customer-gold/90 focus:ring-customer-gold shadow-lg",
    secondary:
      "bg-customer-teal text-customer-cream hover:bg-customer-teal/90 focus:ring-customer-teal shadow-lg",
    outline:
      "bg-transparent border-2 border-customer-cream text-customer-cream hover:bg-customer-cream hover:text-customer-purple focus:ring-customer-cream",
    ghost:
      "bg-transparent text-customer-cream hover:bg-customer-cream/10 focus:ring-customer-cream",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Disabled styles
  const disabledStyles = "opacity-50 cursor-not-allowed hover:scale-100";

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabled ? disabledStyles : ""}
    ${className}
  `.trim();

  // Content with icon
  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </>
  );

  // Render as Link or button
  if (href && !disabled) {
    return (
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <Link to={href} className={combinedClassName}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={combinedClassName}
    >
      {content}
    </motion.button>
  );
};

export default Button;
