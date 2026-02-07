import { animate, AnimationPlaybackControls } from 'framer-motion';

/**
 * Animation batching utilities for coordinating complex animation sequences
 */

export interface AnimationStep {
    element: HTMLElement | null;
    keyframes: any;
    options?: {
        duration?: number;
        ease?: any; // Framer motion easing type is complex, using any to allow custom and standard types
        delay?: number;
        type?: 'spring' | 'tween' | 'inertia';
        stiffness?: number;
        damping?: number;
    };
}

export interface AnimationSequence {
    steps: AnimationStep[];
    onComplete?: () => void;
    onStart?: () => void;
}

/**
 * Execute a sequence of animations in order
 */
export async function animateSequence(sequence: AnimationSequence): Promise<void> {
    const { steps, onStart, onComplete } = sequence;

    onStart?.();

    for (const step of steps) {
        if (!step.element) continue;

        await animate(
            step.element,
            step.keyframes,
            {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1] as any,
                ...step.options,
            }
        );
    }

    onComplete?.();
}

/**
 * Execute multiple animations simultaneously
 */
export function animateParallel(steps: AnimationStep[]): AnimationPlaybackControls[] {
    return steps
        .filter(step => step.element)
        .map(step =>
            animate(
                step.element!,
                step.keyframes,
                {
                    duration: 0.3,
                    ease: 'easeOut',
                    ...step.options,
                }
            )
        );
}

/**
 * Staggered animation for lists or grids
 */
export async function animateStaggered(
    elements: (HTMLElement | null)[],
    keyframes: any,
    options: {
        staggerDelay?: number;
        baseOptions?: AnimationStep['options'];
    } = {}
): Promise<void> {
    const { staggerDelay = 0.05, baseOptions = {} } = options;

    const animations = elements
        .filter(el => el)
        .map((element, index) =>
            animate(
                element!,
                keyframes,
                {
                    duration: 0.3,
                    ease: 'easeOut' as any,
                    delay: index * staggerDelay,
                    ...baseOptions,
                }
            )
        );

    await Promise.all(animations.map(animation => animation.then(() => { })));
}

/**
 * Complex form submission animation sequence
 */
export const formAnimations = {
    async submitForm(formElement: HTMLElement, buttonElement: HTMLElement) {
        const sequence: AnimationSequence = {
            steps: [
                {
                    element: buttonElement,
                    keyframes: { scale: 0.95 },
                    options: { duration: 0.1 },
                },
                {
                    element: buttonElement,
                    keyframes: { scale: 1 },
                    options: { duration: 0.2, type: 'spring', stiffness: 500 },
                },
            ],
            onStart: () => {
                // Disable form interactions
                formElement.style.pointerEvents = 'none';
            },
            onComplete: () => {
                // Re-enable form interactions
                formElement.style.pointerEvents = 'auto';
            },
        };

        await animateSequence(sequence);
    },

    async showSuccess(buttonElement: HTMLElement, successIcon: HTMLElement) {
        await animateParallel([
            {
                element: buttonElement,
                keyframes: { backgroundColor: 'hsl(var(--success))' },
                options: { duration: 0.3 },
            },
            {
                element: successIcon,
                keyframes: { scale: [0, 1.2, 1], rotate: [0, 180, 360] },
                options: { duration: 0.5, type: 'spring', stiffness: 500 },
            },
        ]);
    },

    async showError(buttonElement: HTMLElement, errorIcon: HTMLElement) {
        await animateParallel([
            {
                element: buttonElement,
                keyframes: {
                    backgroundColor: 'hsl(var(--destructive))',
                    x: [0, -5, 5, -5, 5, 0]
                },
                options: { duration: 0.6 },
            },
            {
                element: errorIcon,
                keyframes: { scale: [0, 1], rotate: [0, 90] },
                options: { duration: 0.3, type: 'spring' },
            },
        ]);
    },
};

/**
 * Page transition animations
 */
export const pageAnimations = {
    async fadeIn(contentElement: HTMLElement) {
        await animate(
            contentElement,
            { opacity: [0, 1], y: [20, 0] },
            { duration: 0.5, ease: 'easeOut' }
        );
    },

    async fadeOut(contentElement: HTMLElement) {
        await animate(
            contentElement,
            { opacity: [1, 0], y: [0, -20] },
            { duration: 0.3, ease: 'easeIn' }
        );
    },

    async slideIn(contentElement: HTMLElement, direction: 'left' | 'right' | 'up' | 'down' = 'right') {
        const directions = {
            left: { x: [-100, 0], y: 0 },
            right: { x: [100, 0], y: 0 },
            up: { x: 0, y: [-100, 0] },
            down: { x: 0, y: [100, 0] },
        };

        await animate(
            contentElement,
            {
                opacity: [0, 1],
                ...directions[direction],
            },
            { duration: 0.5, ease: 'easeOut' }
        );
    },
};

/**
 * Loading state animations
 */
export const loadingAnimations = {
    async showSkeleton(skeletonElements: HTMLElement[]) {
        await animateStaggered(
            skeletonElements,
            { opacity: [0, 1] },
            { staggerDelay: 0.1 }
        );
    },

    async hideSkeleton(skeletonElements: HTMLElement[]) {
        await animateStaggered(
            skeletonElements,
            { opacity: [1, 0] },
            { staggerDelay: 0.05 }
        );
    },

    async shimmerEffect(shimmerElement: HTMLElement) {
        await animate(
            shimmerElement,
            { x: ['-100%', '100%'] },
            {
                duration: 1.5,
                ease: 'linear',
                repeat: Infinity,
            }
        );
    },
};

/**
 * Utility to cancel all running animations
 */
export function cancelAnimations(controls: AnimationPlaybackControls[]) {
    controls.forEach(control => control.stop());
}

/**
 * Performance-aware animation executor
 */
export function createPerformanceAwareAnimator() {
    let isAnimating = false;
    const animationQueue: (() => Promise<void>)[] = [];

    const executeAnimation = async (animationFn: () => Promise<void>) => {
        if (isAnimating) {
            animationQueue.push(animationFn);
            return;
        }

        isAnimating = true;
        try {
            await animationFn();
        } finally {
            isAnimating = false;

            // Execute next animation in queue
            const nextAnimation = animationQueue.shift();
            if (nextAnimation) {
                executeAnimation(nextAnimation);
            }
        }
    };

    return {
        animate: executeAnimation,
        clearQueue: () => animationQueue.length = 0,
        get isAnimating() { return isAnimating; },
        get queueLength() { return animationQueue.length; },
    };
}