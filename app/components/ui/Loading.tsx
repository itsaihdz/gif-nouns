"use client";

import { Icon } from "../icons";
import { cn } from "../../../lib/utils";

interface LoadingProps {
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loading({ 
  variant = "spinner", 
  size = "md", 
  text,
  className = "",
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const renderSpinner = () => (
    <div className={cn("animate-spin", sizeClasses[size])}>
      <Icon name="refresh" className="text-purple-600 dark:text-purple-400" size={size} />
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse",
            size === "sm" && "w-1 h-1",
            size === "md" && "w-2 h-2",
            size === "lg" && "w-3 h-3",
            size === "xl" && "w-4 h-4"
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={cn(
      "bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse",
      sizeClasses[size]
    )} />
  );

  const renderSkeleton = () => (
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6" />
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "skeleton":
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {renderContent()}
      {text && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

// Specific loading components for common use cases
export function PageLoading() {
  return (
    <Loading 
      variant="spinner" 
      size="lg" 
      text="Loading page..." 
      fullScreen 
    />
  );
}

export function ComponentLoading() {
  return (
    <Loading 
      variant="dots" 
      size="md" 
      text="Loading..." 
    />
  );
}

export function SkeletonLoading() {
  return (
    <Loading 
      variant="skeleton" 
      size="md" 
    />
  );
}

export function ButtonLoading() {
  return (
    <Loading 
      variant="spinner" 
      size="sm" 
    />
  );
} 