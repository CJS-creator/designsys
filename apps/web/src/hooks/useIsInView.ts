import { useState, useEffect, useRef, RefObject } from "react";

interface UseIsInViewOptions {
    /** Threshold for intersection (0-1) */
    threshold?: number;
    /** Root margin for expanding/shrinking viewport detection area */
    rootMargin?: string;
    /** Only trigger once */
    once?: boolean;
}

/**
 * Hook to detect if an element is in the viewport
 * Useful for pausing animations when off-screen to improve performance
 */
export function useIsInView<T extends HTMLElement = HTMLDivElement>(
    options: UseIsInViewOptions = {}
): [RefObject<T>, boolean] {
    const { threshold = 0.1, rootMargin = "0px", once = false } = options;
    const ref = useRef<T>(null);
    const [isInView, setIsInView] = useState(false);
    const hasTriggered = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Once mode: if already triggered, don't observe
        if (once && hasTriggered.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const inView = entry.isIntersecting;

                if (once) {
                    if (inView && !hasTriggered.current) {
                        hasTriggered.current = true;
                        setIsInView(true);
                        observer.disconnect();
                    }
                } else {
                    setIsInView(inView);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return [ref, isInView];
}

/**
 * Hook to pause animations when element is off-screen
 * Returns animation state that can be used for Framer Motion's animate prop
 */
export function usePauseWhenOffScreen<T extends HTMLElement = HTMLDivElement>(
    options: UseIsInViewOptions = {}
): [RefObject<T>, "visible" | "hidden"] {
    const [ref, isInView] = useIsInView<T>(options);
    return [ref, isInView ? "visible" : "hidden"];
}
