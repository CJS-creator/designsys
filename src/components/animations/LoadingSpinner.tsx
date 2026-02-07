import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "bars";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

export function LoadingSpinner({ 
  size = "md", 
  variant = "spinner",
  className 
}: LoadingSpinnerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (variant === "spinner") {
    return (
      <motion.div
        className={cn(sizeClasses[size], "border-2 border-primary/20 border-t-primary rounded-full", className)}
        animate={prefersReducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              size === "sm" ? "w-1.5 h-1.5" : size === "md" ? "w-2 h-2" : size === "lg" ? "w-3 h-3" : "w-4 h-4",
              "bg-primary rounded-full"
            )}
            animate={prefersReducedMotion ? { opacity: [0.3, 1, 0.3] } : { y: [-4, 4, -4] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={cn(sizeClasses[size], "bg-primary/20 rounded-full", className)}
        animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  if (variant === "bars") {
    return (
      <div className={cn("flex items-end gap-0.5", sizeClasses[size], className)}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-1 bg-primary rounded-t"
            animate={prefersReducedMotion ? { opacity: [0.3, 1, 0.3] } : { height: ["40%", "100%", "40%"] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
            style={{ height: "60%" }}
          />
        ))}
      </div>
    );
  }

  return null;
}

// Progress bar component
interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  animate?: boolean;
}

export function ProgressBar({ 
  progress, 
  className, 
  showLabel = false,
  animate = true 
}: ProgressBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span>Progress</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={
            prefersReducedMotion || !animate
              ? { duration: 0 }
              : { duration: 0.5, ease: [0, 0, 0.2, 1] }
          }
        />
      </div>
    </div>
  );
}

// Skeleton loader
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className, 
  variant = "text",
  width,
  height 
}: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  const baseClasses = cn(
    "bg-muted overflow-hidden relative",
    variant === "text" && "h-4 rounded",
    variant === "circular" && "rounded-full",
    variant === "rectangular" && "rounded-md",
    className
  );

  return (
    <div 
      className={baseClasses}
      style={{ width, height }}
    >
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-background/50 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
