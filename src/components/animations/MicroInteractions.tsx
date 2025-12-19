import { motion, HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { tap, hover, hoverLift, press } from "@/lib/animations/variants";
import { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

// ============================================
// INTERACTIVE BUTTON
// ============================================
interface InteractiveButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "default" | "lift" | "bounce" | "glow";
}

export const InteractiveButton = forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ children, variant = "default", className, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    const variants = {
      default: {
        whileHover: prefersReducedMotion ? {} : { scale: 1.02 },
        whileTap: prefersReducedMotion ? {} : { scale: 0.98 }
      },
      lift: {
        whileHover: prefersReducedMotion ? {} : { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
        whileTap: prefersReducedMotion ? {} : { y: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }
      },
      bounce: {
        whileHover: prefersReducedMotion ? {} : { scale: 1.05 },
        whileTap: prefersReducedMotion ? {} : { scale: 0.9 }
      },
      glow: {
        whileHover: prefersReducedMotion ? {} : { boxShadow: "0 0 20px rgba(var(--primary), 0.4)" },
        whileTap: prefersReducedMotion ? {} : { scale: 0.98 }
      }
    };

    return (
      <motion.button
        ref={ref}
        className={cn("transition-colors", className)}
        {...variants[variant]}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
InteractiveButton.displayName = "InteractiveButton";

// ============================================
// INTERACTIVE CARD
// ============================================
interface InteractiveCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  interactive?: boolean;
}

export function InteractiveCard({ 
  children, 
  interactive = true, 
  className,
  ...props 
}: InteractiveCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        interactive && "cursor-pointer",
        className
      )}
      whileHover={interactive && !prefersReducedMotion ? { 
        y: -4, 
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" 
      } : {}}
      whileTap={interactive && !prefersReducedMotion ? { scale: 0.99 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// RIPPLE EFFECT
// ============================================
import { useState, useCallback } from "react";

interface RippleProps {
  x: number;
  y: number;
  size: number;
}

export function useRipple() {
  const [ripples, setRipples] = useState<RippleProps[]>([]);

  const addRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = { x, y, size };
    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.slice(1));
    }, 600);
  }, []);

  const RippleContainer = () => (
    <>
      {ripples.map((ripple, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </>
  );

  return { addRipple, RippleContainer };
}

// ============================================
// SUCCESS/ERROR FEEDBACK
// ============================================
interface FeedbackIconProps {
  type: "success" | "error" | "warning" | "info";
  size?: "sm" | "md" | "lg";
}

export function FeedbackIcon({ type, size = "md" }: FeedbackIconProps) {
  const prefersReducedMotion = useReducedMotion();
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const colors = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-amber-500",
    info: "text-blue-500"
  };

  const icons = {
    success: (
      <motion.svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={2}
        className={cn(sizeClasses[size], colors[type])}
      >
        <motion.path
          d="M20 6L9 17L4 12"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.2 }}
        />
      </motion.svg>
    ),
    error: (
      <motion.svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={2}
        className={cn(sizeClasses[size], colors[type])}
      >
        <motion.path
          d="M18 6L6 18M6 6l12 12"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
        />
      </motion.svg>
    ),
    warning: (
      <motion.svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={2}
        className={cn(sizeClasses[size], colors[type])}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 15 }}
      >
        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    ),
    info: (
      <motion.svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={2}
        className={cn(sizeClasses[size], colors[type])}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 15 }}
      >
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    )
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 20 }}
    >
      {icons[type]}
    </motion.div>
  );
}

// ============================================
// NUMBER COUNTER
// ============================================
import { useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export function Counter({ 
  from = 0, 
  to, 
  duration = 1.5, 
  className,
  formatter = (v) => Math.round(v).toString()
}: CounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const count = useMotionValue(prefersReducedMotion ? to : from);
  const rounded = useTransform(count, (v) => formatter(v));

  useEffect(() => {
    if (!prefersReducedMotion) {
      const controls = animate(count, to, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [to, duration, prefersReducedMotion, count]);

  return (
    <motion.span className={className}>
      {rounded}
    </motion.span>
  );
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
}

export function Typewriter({ text, delay = 0.05, className }: TypewriterProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * delay }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
