import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fade, fadeUp, fadeDown, fadeLeft, fadeRight, scale, scaleUp, pop } from "@/lib/animations/variants";
import { ReactNode } from "react";

type AnimationType = "fade" | "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "scaleUp" | "pop" | "none";

interface MotionWrapperProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const variantMap: Record<AnimationType, Variants> = {
  fade,
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  scale,
  scaleUp,
  pop,
  none: {
    hidden: {},
    visible: {},
    exit: {}
  }
};

const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } }
};

export function MotionWrapper({
  children,
  animation = "fadeUp",
  delay = 0,
  className,
  once = true,
  amount = 0.3,
  ...props
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();
  
  const variants = prefersReducedMotion ? reducedMotionVariants : variantMap[animation];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
