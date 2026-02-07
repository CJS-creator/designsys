import { motion, AnimatePresence, Variants, TargetAndTransition } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StaggerListProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  direction?: "vertical" | "horizontal";
  staggerDelay?: number;
}

export function StaggerList({
  children,
  className,
  itemClassName,
  direction = "vertical",
  staggerDelay = 0.05
}: StaggerListProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      }
    }
  };

  const itemVariants: Variants = prefersReducedMotion ? {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  } : {
    hidden: { 
      opacity: 0, 
      y: direction === "vertical" ? 20 : 0,
      x: direction === "horizontal" ? 20 : 0,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: { duration: 0.3, ease: [0, 0, 0.2, 1] as const }
    }
  };

  return (
    <motion.div
      className={cn(
        direction === "horizontal" ? "flex gap-4" : "space-y-4",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Animated list with add/remove animations
interface AnimatedListProps<T> {
  items: T[];
  keyExtractor: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  itemClassName?: string;
}

export function AnimatedList<T>({
  items,
  keyExtractor,
  renderItem,
  className,
  itemClassName
}: AnimatedListProps<T>) {
  const prefersReducedMotion = useReducedMotion();

  const initial: TargetAndTransition = prefersReducedMotion 
    ? { opacity: 1 } 
    : { opacity: 0, height: 0, y: -20 };

  const animateState: TargetAndTransition = prefersReducedMotion 
    ? { opacity: 1 } 
    : { 
        opacity: 1, 
        height: "auto", 
        y: 0,
        transition: { duration: 0.3, ease: [0, 0, 0.2, 1] as const }
      };

  const exit: TargetAndTransition = prefersReducedMotion 
    ? { opacity: 0 } 
    : { 
        opacity: 0, 
        height: 0, 
        y: -20,
        transition: { duration: 0.2 }
      };

  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={keyExtractor(item, index)}
            className={itemClassName}
            layout={!prefersReducedMotion}
            initial={initial}
            animate={animateState}
            exit={exit}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Grid with stagger animation
interface StaggerGridProps {
  children: ReactNode[];
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
}

export function StaggerGrid({
  children,
  columns = 3,
  className,
  itemClassName,
  staggerDelay = 0.05
}: StaggerGridProps) {
  const prefersReducedMotion = useReducedMotion();

  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
  };

  const containerVariants: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      }
    }
  };

  const itemVariants: Variants = prefersReducedMotion ? {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  } : {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as const }
    }
  };

  return (
    <motion.div
      className={cn("grid gap-4", columnClasses[columns], className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {children.map((child, index) => (
        <motion.div key={index} className={itemClassName} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
