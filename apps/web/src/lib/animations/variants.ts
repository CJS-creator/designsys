import { Variants } from "framer-motion";
import { duration, easing, stagger } from "./constants";

// ============================================
// FADE VARIANTS
// ============================================
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: duration.normal, ease: easing.easeOut }
  },
  exit: { 
    opacity: 0,
    transition: { duration: duration.fast, ease: easing.easeIn }
  }
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: duration.normal, ease: easing.easeOut }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: duration.fast, ease: easing.easeIn }
  }
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: duration.normal, ease: easing.easeOut }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: duration.fast, ease: easing.easeIn }
  }
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: duration.normal, ease: easing.easeOut }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: duration.fast, ease: easing.easeIn }
  }
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: duration.normal, ease: easing.easeOut }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: duration.fast, ease: easing.easeIn }
  }
};

// ============================================
// SCALE VARIANTS
// ============================================
export const scale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: duration.normal, ease: easing.spring }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: duration.fast, ease: easing.easeIn }
  }
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: duration.normal, ease: easing.spring }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: duration.fast, ease: easing.easeIn }
  }
};

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: duration.fast }
  }
};

// ============================================
// SLIDE VARIANTS
// ============================================
export const slideUp: Variants = {
  hidden: { y: "100%" },
  visible: { 
    y: 0,
    transition: { duration: duration.slow, ease: easing.easeOut }
  },
  exit: { 
    y: "100%",
    transition: { duration: duration.normal, ease: easing.easeIn }
  }
};

export const slideDown: Variants = {
  hidden: { y: "-100%" },
  visible: { 
    y: 0,
    transition: { duration: duration.slow, ease: easing.easeOut }
  },
  exit: { 
    y: "-100%",
    transition: { duration: duration.normal, ease: easing.easeIn }
  }
};

export const slideLeft: Variants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { duration: duration.slow, ease: easing.easeOut }
  },
  exit: { 
    x: "100%",
    transition: { duration: duration.normal, ease: easing.easeIn }
  }
};

export const slideRight: Variants = {
  hidden: { x: "-100%" },
  visible: { 
    x: 0,
    transition: { duration: duration.slow, ease: easing.easeOut }
  },
  exit: { 
    x: "-100%",
    transition: { duration: duration.normal, ease: easing.easeIn }
  }
};

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================
export const pageSlide: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: duration.slow, ease: easing.smooth }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: duration.normal, ease: easing.easeIn }
  }
};

export const pageFade: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: duration.slow, ease: easing.easeOut }
  },
  exit: { 
    opacity: 0,
    transition: { duration: duration.normal, ease: easing.easeIn }
  }
};

export const pageScale: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: duration.slow, ease: easing.smooth }
  },
  exit: { 
    opacity: 0, 
    scale: 1.02,
    transition: { duration: duration.normal, ease: easing.easeIn }
  }
};

// ============================================
// CONTAINER/STAGGER VARIANTS
// ============================================
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.default,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: stagger.fast,
      staggerDirection: -1,
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: duration.normal, ease: easing.easeOut }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: duration.fast }
  }
};

// ============================================
// LIST VARIANTS
// ============================================
export const listContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.fast,
    }
  },
  exit: {
    transition: {
      staggerChildren: stagger.fast,
      staggerDirection: -1,
    }
  }
};

export const listItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: duration.fast, ease: easing.easeOut }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: duration.fast }
  }
};

// ============================================
// MODAL/OVERLAY VARIANTS
// ============================================
export const overlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: duration.fast }
  },
  exit: { 
    opacity: 0,
    transition: { duration: duration.fast }
  }
};

export const modal: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: { duration: duration.fast }
  }
};

export const drawer: Variants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { 
    x: "100%",
    transition: { duration: duration.normal, ease: easing.easeIn }
  }
};

// ============================================
// MICRO-INTERACTION VARIANTS
// ============================================
export const tap = {
  scale: 0.97,
  transition: { duration: duration.ultraFast }
};

export const hover = {
  scale: 1.02,
  transition: { duration: duration.fast }
};

export const hoverLift = {
  y: -2,
  transition: { duration: duration.fast }
};

export const press = {
  scale: 0.95,
  transition: { duration: duration.ultraFast }
};

// ============================================
// SKELETON/LOADING VARIANTS
// ============================================
export const shimmer: Variants = {
  hidden: { x: "-100%" },
  visible: { 
    x: "100%",
    transition: { 
      repeat: Infinity, 
      duration: 1.5, 
      ease: "linear" 
    }
  }
};

export const pulse: Variants = {
  hidden: { opacity: 0.4 },
  visible: { 
    opacity: 1,
    transition: { 
      repeat: Infinity, 
      repeatType: "reverse", 
      duration: 1 
    }
  }
};
