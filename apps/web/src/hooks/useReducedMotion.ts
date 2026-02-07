import { useState, useEffect } from "react";

/**
 * Hook to detect user's reduced motion preference
 * Returns true if the user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Returns animation-safe values based on user preference
 * When reduced motion is preferred, returns instant/no animation values
 */
export function useAnimationSafe<T>(
  animatedValue: T,
  reducedValue: T
): T {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedValue : animatedValue;
}
