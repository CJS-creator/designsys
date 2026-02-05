import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Focus ring props
 */
export interface FocusRingProps {
    /** Children to wrap */
    children: React.ReactNode;
    /** Color of the focus ring */
    color?: string;
    /** Intensity of the focus ring (0-1) */
    intensity?: number;
    /** Offset from the element */
    offset?: number;
    /** Blur radius */
    blur?: number;
    /** Inset focus ring */
    inset?: boolean;
    /** Additional class name */
    className?: string;
}

/**
 * Focus ring component with CSS-only implementation for better type compatibility
 */
export const FocusRing = React.forwardRef<HTMLDivElement, FocusRingProps>(
    (
        {
            children,
            className,
            color = 'var(--primary)',
            // intensity = 0.4, // Unused
            offset = 2,
            blur = 4,
            inset = false,
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = React.useState(false);

        return (
            <div
                ref={ref}
                className={cn("relative inline-flex", className)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                <style>{`
          .focus-ring-${offset}-${blur}:focus {
            outline: none;
          }
          .focus-ring-${offset}-${blur}:focus-visible {
            outline: ${offset}px ${inset ? 'inset' : 'outset'} ${color};
            outline-offset: 0px;
            box-shadow: 0 0 ${blur}px ${color};
          }
        `}</style>
                <div
                    className={cn(
                        "absolute inset-0 rounded-inherit pointer-events-none transition-all duration-200",
                        isFocused ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                        boxShadow: isFocused ? `0 0 ${blur}px ${color}` : 'none',
                        outline: isFocused ? `${offset}px ${inset ? 'inset' : 'outset'} ${color}` : 'none',
                    }}
                />
                <div className="relative z-10">{children}</div>
            </div>
        );
    }
);
FocusRing.displayName = "FocusRing";

/**
 * Skip link for keyboard navigation
 */
export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    /** ID of the main content element */
    mainContentId?: string;
    /** Text to display */
    children?: React.ReactNode;
}

export const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
    (
        {
            mainContentId = "main-content",
            children = "Skip to main content",
            className,
            ...props
        },
        ref
    ) => {
        return (
            <a
                ref={ref}
                href={`#${mainContentId}`}
                className={cn(
                    "sr-only focus:not-sr-only",
                    "focus:absolute focus:top-4 focus:left-4 focus:z-[9999]",
                    "focus:px-4 focus:py-2",
                    "focus:bg-primary focus:text-primary-foreground",
                    "focus:rounded-lg focus:shadow-lg",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "transition-all duration-200",
                    className
                )}
                {...props}
            >
                {children}
            </a>
        );
    }
);
SkipLink.displayName = "SkipLink";

/**
 * Accessible focus management hook
 */
export function useAccessibleFocus<T extends HTMLElement>(options: {
    onFocus?: () => void;
    onBlur?: () => void;
    skipFocus?: boolean;
} = {}) {
    const { onFocus, onBlur, skipFocus = false } = options;
    const elementRef = React.useRef<T>(null);
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = React.useCallback(() => {
        if (skipFocus) return;
        setIsFocused(true);
        onFocus?.();
    }, [onFocus, skipFocus]);

    const handleBlur = React.useCallback(() => {
        setIsFocused(false);
        onBlur?.();
    }, [onBlur]);

    const focus = React.useCallback(() => {
        elementRef.current?.focus();
    }, []);

    return {
        ref: elementRef,
        isFocused,
        focus,
        handlers: {
            onFocus: handleFocus,
            onBlur: handleBlur,
        },
    };
}

/**
 * Announce message to screen readers
 */
export function useLiveRegion(options: {
    politeness?: 'polite' | 'assertive' | 'off';
    clearAfter?: number;
} = {}) {
    const { politeness = 'polite', clearAfter = 1000 } = options;
    const [message, setMessage] = React.useState<string | null>(null);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

    const announce = React.useCallback((msg: string) => {
        setMessage(msg);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (clearAfter > 0) {
            timeoutRef.current = setTimeout(() => {
                setMessage(null);
            }, clearAfter);
        }
    }, [clearAfter]);

    const clear = React.useCallback(() => {
        setMessage(null);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        announce,
        clear,
        message,
        liveRegionProps: {
            'aria-live': politeness,
            'aria-atomic': true,
            className: "sr-only",
        } as React.HTMLAttributes<HTMLDivElement>,
    };
}

/**
 * Live region announcement component
 */
export interface LiveRegionProps {
    message: string | null;
    politeness?: 'polite' | 'assertive';
    children?: React.ReactNode;
}

export function LiveRegion({ message, politeness = 'polite', children }: LiveRegionProps) {
    return (
        <div
            aria-live={politeness}
            aria-atomic={true}
            className="sr-only"
        >
            {message}
            {children}
        </div>
    );
}

/**
 * High contrast mode detection
 */
export function useHighContrastMode() {
    const [isHighContrast, setIsHighContrast] = React.useState(false);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(forced-colors: active)');
        setIsHighContrast(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsHighContrast(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isHighContrast;
}

/**
 * Reduced motion detection
 */
export function useReducedMotion(): boolean {
    const [reduced, setReduced] = React.useState(false);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setReduced(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return reduced;
}

/**
 * Accessible icon button with proper ARIA
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Label for screen readers */
    ariaLabel: string;
    /** Icon to display */
    icon: React.ReactNode;
    /** Show label to visual users */
    showLabel?: boolean;
    /** Size of the button */
    size?: 'sm' | 'md' | 'lg';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        {
            ariaLabel,
            icon,
            showLabel = false,
            size = 'md',
            className,
            children,
            ...props
        },
        ref
    ) => {
        const sizes = {
            sm: 'h-8 w-8',
            md: 'h-10 w-10',
            lg: 'h-12 w-12',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "disabled:opacity-50 disabled:pointer-events-none",
                    "transition-colors duration-200",
                    sizes[size],
                    className
                )}
                aria-label={ariaLabel}
                {...props}
            >
                {icon}
                {showLabel && children}
            </button>
        );
    }
);
IconButton.displayName = "IconButton";

/**
 * Generate unique IDs for form accessibility
 */
let idCounter = 0;
export function generateId(prefix: string = 'id'): string {
    return `${prefix}-${++idCounter}`;
}

/**
 * Form field accessibility hook
 */
export function useFormFieldAccessibility(options: {
    id?: string;
    label?: string;
    error?: string;
    required?: boolean;
    describedBy?: string;
} = {}) {
    const { id: providedId, error, required, describedBy } = options;
    const generatedId = React.useMemo(() => providedId || generateId('field'), [providedId]);
    const errorId = React.useMemo(() => `${generatedId}-error`, [generatedId]);
    const helpId = React.useMemo(() => `${generatedId}-help`, [generatedId]);

    const describedByIds = React.useMemo(() => {
        const ids: string[] = [];
        if (error) ids.push(errorId);
        if (describedBy) ids.push(describedBy);
        if (!error && helpId) ids.push(helpId);
        return ids.length > 0 ? ids.join(' ') : undefined;
    }, [error, describedBy, helpId]);

    return {
        id: generatedId,
        errorId,
        helpId,
        describedByIds,
        labelProps: {
            htmlFor: generatedId,
            id: `${generatedId}-label`,
        } as React.LabelHTMLAttributes<HTMLLabelElement>,
        inputProps: {
            id: generatedId,
            'aria-describedby': describedByIds,
            'aria-required': required,
            'aria-invalid': !!error,
        } as React.InputHTMLAttributes<HTMLInputElement>,
        errorProps: {
            id: errorId,
            role: 'alert',
            'aria-live': 'polite',
        } as React.HTMLAttributes<HTMLDivElement>,
    };
}

/**
 * Keyboard navigation helper
 */
export function useKeyboardNavigation<T extends HTMLElement>(options: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onHome?: () => void;
    onEnd?: () => void;
    onTab?: () => void;
    disabled?: boolean;
} = {}) {
    const {
        onEnter,
        onEscape,
        onArrowUp,
        onArrowDown,
        onArrowLeft,
        onArrowRight,
        onHome,
        onEnd,
        onTab,
        disabled = false,
    } = options;

    const handleKeyDown = React.useCallback(
        (event: React.KeyboardEvent<T>) => {
            if (disabled) return;

            switch (event.key) {
                case 'Enter':
                case ' ':
                    if (onEnter) {
                        event.preventDefault();
                        onEnter();
                    }
                    break;
                case 'Escape':
                    if (onEscape) {
                        event.preventDefault();
                        onEscape();
                    }
                    break;
                case 'ArrowUp':
                    if (onArrowUp) {
                        event.preventDefault();
                        onArrowUp();
                    }
                    break;
                case 'ArrowDown':
                    if (onArrowDown) {
                        event.preventDefault();
                        onArrowDown();
                    }
                    break;
                case 'ArrowLeft':
                    if (onArrowLeft) {
                        event.preventDefault();
                        onArrowLeft();
                    }
                    break;
                case 'ArrowRight':
                    if (onArrowRight) {
                        event.preventDefault();
                        onArrowRight();
                    }
                    break;
                case 'Home':
                    if (onHome) {
                        event.preventDefault();
                        onHome();
                    }
                    break;
                case 'End':
                    if (onEnd) {
                        event.preventDefault();
                        onEnd();
                    }
                    break;
                case 'Tab':
                    if (onTab) {
                        onTab();
                    }
                    break;
            }
        },
        [disabled, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onHome, onEnd, onTab]
    );

    return {
        handlers: {
            onKeyDown: handleKeyDown,
        },
    };
}

/**
 * Contrast ratio utility functions
 */

/**
 * Calculate relative luminance of a color
 */
export function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        const sRGB = c / 255;
        return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parse hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG contrast level
 */
export type WCAGLevel = 'AA' | 'AAA';

/**
 * Check if contrast meets WCAG requirements
 */
export function meetsWCAGRequirements(
    foreground: string,
    background: string,
    level: WCAGLevel = 'AA',
    isLargeText: boolean = false
): boolean {
    const ratio = getContrastRatio(foreground, background);

    if (level === 'AAA') {
        return isLargeText ? ratio >= 4.5 : ratio >= 7;
    }

    return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Suggest better foreground color for given background
 */
export function suggestForegroundColor(
    background: string,
    targetRatio: number = 4.5,
    preferences: string[] = ['#000000', '#ffffff', '#1a1a1a', '#ffffff']
): string {
    const bgRgb = hexToRgb(background);
    if (!bgRgb) return '#000000';

    for (const fg of preferences) {
        if (getContrastRatio(fg, background) >= targetRatio) {
            return fg;
        }
    }

    return getContrastRatio(background, '#000000') > getContrastRatio(background, '#ffffff')
        ? '#000000'
        : '#ffffff';
}
