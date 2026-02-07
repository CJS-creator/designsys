import { useState, useEffect, useRef } from 'react';

/**
 * Hook to monitor animation performance and detect frame drops
 * Useful for ensuring smooth 60fps animations
 */
export function useAnimationPerformance() {
    const [metrics, setMetrics] = useState({
        frameDrops: 0,
        averageFps: 60,
        animationDuration: 0,
        isSmooth: true,
    });

    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const frameTimesRef = useRef<number[]>([]);
    const animationStartRef = useRef<number | null>(null);

    useEffect(() => {
        const measureFrame = () => {
            frameCountRef.current++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTimeRef.current;

            // Store frame time for FPS calculation
            frameTimesRef.current.push(deltaTime);
            if (frameTimesRef.current.length > 60) {
                frameTimesRef.current.shift(); // Keep only last 60 frames
            }

            // Detect frame drops (frames taking longer than 16.67ms at 60fps)
            if (deltaTime > 16.67) {
                setMetrics(prev => ({
                    ...prev,
                    frameDrops: prev.frameDrops + 1,
                    isSmooth: false,
                }));
            }

            // Calculate average FPS
            if (frameTimesRef.current.length >= 10) {
                const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
                const fps = 1000 / avgFrameTime;

                setMetrics(prev => ({
                    ...prev,
                    averageFps: Math.round(fps),
                    isSmooth: fps >= 55, // Consider smooth if above 55fps
                }));
            }

            lastTimeRef.current = currentTime;
            requestAnimationFrame(measureFrame);
        };

        const animationFrame = requestAnimationFrame(measureFrame);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    // Function to start timing an animation
    const startAnimationTimer = () => {
        animationStartRef.current = performance.now();
    };

    // Function to end timing and record duration
    const endAnimationTimer = () => {
        if (animationStartRef.current) {
            const duration = performance.now() - animationStartRef.current;
            setMetrics(prev => ({
                ...prev,
                animationDuration: duration,
            }));
            animationStartRef.current = null;
            return duration;
        }
        return 0;
    };

    // Reset metrics
    const resetMetrics = () => {
        setMetrics({
            frameDrops: 0,
            averageFps: 60,
            animationDuration: 0,
            isSmooth: true,
        });
        frameCountRef.current = 0;
        frameTimesRef.current = [];
    };

    return {
        ...metrics,
        startAnimationTimer,
        endAnimationTimer,
        resetMetrics,
    };
}

/**
 * Hook to detect if animations should be disabled for performance
 */
export function useAnimationOptimization() {
    const { averageFps, frameDrops } = useAnimationPerformance();

    // Disable complex animations if performance is poor
    const shouldReduceMotion = averageFps < 45 || frameDrops > 10;

    return {
        shouldReduceMotion,
        performanceLevel: averageFps > 55 ? 'high' : averageFps > 45 ? 'medium' : 'low',
    };
}