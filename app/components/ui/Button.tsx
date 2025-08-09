"use client";

import { type ReactNode, forwardRef } from "react";
import { cn } from "../../../lib/utils";
import { useHaptics } from "../../hooks/useHaptics";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  href?: string;
  target?: string;
  haptics?: boolean; // Enable haptic feedback
  hapticStyle?: "light" | "medium" | "heavy"; // Haptic intensity
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  loading = false,
  type = "button",
  icon,
  iconPosition = "left",
  href,
  target,
  haptics = true, // Enable haptics by default
  hapticStyle = "medium",
  ...props
}, ref) => {
  const { impactOccurred } = useHaptics();
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden";

  const variantClasses = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white",
    outline: "border-2 border-purple-600 hover:bg-purple-50 text-purple-600 focus:ring-purple-500 dark:hover:bg-purple-900/20",
    ghost: "hover:bg-purple-50 text-purple-600 focus:ring-purple-500 dark:hover:bg-purple-900/20",
    gradient: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white focus:ring-purple-500 shadow-lg hover:shadow-xl",
  };

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5 rounded-lg",
    md: "text-base px-4 py-2 rounded-lg",
    lg: "text-lg px-6 py-3 rounded-xl",
    xl: "text-xl px-8 py-4 rounded-xl",
  };

  const content = (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <span className={cn("flex items-center", loading && "opacity-0")}>
        {icon && iconPosition === "left" && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </span>
    </>
  );

  const handleClick = async () => {
    if (haptics && !disabled && !loading) {
      await impactOccurred(hapticStyle);
    }
    onClick?.();
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        onClick={handleClick}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button"; 