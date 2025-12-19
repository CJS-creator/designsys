// Animation System Constants - Timing, Easing, and Presets

// ============================================
// DURATION TOKENS
// ============================================
export const duration = {
  instant: 0,
  ultraFast: 0.05,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
  slowest: 1,
} as const;

// ============================================
// EASING CURVES
// ============================================
export const easing = {
  // Standard easings
  linear: [0, 0, 1, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeOut: [0, 0, 0.2, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,
  
  // Expressive easings
  spring: [0.34, 1.56, 0.64, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  snappy: [0.25, 0.1, 0.25, 1] as const,
  
  // Entrance/Exit
  enter: [0, 0, 0.2, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  
  // Smooth curves
  smooth: [0.45, 0, 0.55, 1] as const,
  anticipate: [0.36, 0, 0.66, -0.56] as const,
} as const;

// CSS-compatible easing strings
export const easingCSS = {
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  snappy: "cubic-bezier(0.25, 0.1, 0.25, 1)",
} as const;

// ============================================
// SPRING CONFIGURATIONS
// ============================================
export const springs = {
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  wobbly: { stiffness: 180, damping: 12, mass: 1 },
  stiff: { stiffness: 400, damping: 30, mass: 1 },
  slow: { stiffness: 80, damping: 20, mass: 1 },
  molasses: { stiffness: 50, damping: 30, mass: 1 },
  default: { stiffness: 260, damping: 20, mass: 1 },
  responsive: { stiffness: 300, damping: 25, mass: 0.8 },
} as const;

// ============================================
// TRANSITION PRESETS
// ============================================
export const transitions = {
  // Fast micro-interactions
  micro: {
    duration: duration.fast,
    ease: easing.easeOut,
  },
  
  // Standard UI transitions
  default: {
    duration: duration.normal,
    ease: easing.easeInOut,
  },
  
  // Smooth page transitions
  page: {
    duration: duration.slow,
    ease: easing.smooth,
  },
  
  // Bouncy feedback
  bounce: {
    type: "spring" as const,
    ...springs.wobbly,
  },
  
  // Snappy interactions
  snap: {
    type: "spring" as const,
    ...springs.stiff,
  },
  
  // Gentle reveals
  gentle: {
    type: "spring" as const,
    ...springs.gentle,
  },
} as const;

// ============================================
// STAGGER CONFIGURATIONS
// ============================================
export const stagger = {
  fast: 0.03,
  default: 0.05,
  slow: 0.1,
  slower: 0.15,
} as const;
