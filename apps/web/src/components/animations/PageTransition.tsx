import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { pageSlide, pageFade, pageScale } from "@/lib/animations/variants";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

type TransitionType = "slide" | "fade" | "scale";

interface PageTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  className?: string;
}

const variantMap = {
  slide: pageSlide,
  fade: pageFade,
  scale: pageScale,
};

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

export function PageTransition({
  children,
  type = "fade",
  className = ""
}: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  
  const variants = prefersReducedMotion ? reducedMotionVariants : variantMap[type];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className={className}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Wrapper component that doesn't depend on location
export function AnimatedPage({
  children,
  type = "fade",
  className = ""
}: Omit<PageTransitionProps, "key">) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : variantMap[type];

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
