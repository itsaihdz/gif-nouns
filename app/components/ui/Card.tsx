"use client";

import { type ReactNode, forwardRef } from "react";
import { cn } from "../../../lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "elevated" | "outlined" | "gradient";
  onClick?: () => void;
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className = "",
  padding = "md",
  variant = "default",
  onClick,
  hover = false,
  ...props
}, ref) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const variantClasses = {
    default: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
    elevated: "bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700",
    outlined: "bg-transparent border-2 border-purple-200 dark:border-purple-800",
    gradient: "bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800",
  };

  const hoverClasses = hover ? "transition-all duration-200 hover:scale-[1.02] hover:shadow-xl" : "";

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl overflow-hidden",
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card"; 