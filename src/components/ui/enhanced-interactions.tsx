import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Enhanced hover effect with multiple visual feedback
interface EnhancedHoverProps {
    children: React.ReactNode;
    className?: string;
    scale?: number;
    lift?: number;
    glow?: boolean;
    glowColor?: string;
    borderGlow?: boolean;
    magnetic?: boolean;
    magneticStrength?: number;
}

export function EnhancedHover({
    children,
    className,
    scale = 1.02,
    lift = -2,
    glow = false,
    glowColor = 'hsl(var(--primary) / 0.3)',
    borderGlow = false,
    magnetic = false,
    magneticStrength = 0.3,
}: EnhancedHoverProps) {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    // Magnetic effect values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!magnetic || prefersReducedMotion) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX.set((e.clientX - centerX) * magneticStrength);
        mouseY.set((e.clientY - centerY) * magneticStrength);
    };

    const handleMouseLeave = () => {
        if (!magnetic || prefersReducedMotion) return;
        mouseX.set(0);
        mouseY.set(0);
    };

    if (prefersReducedMotion) {
        return (
            <div className={className}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            className={cn('relative cursor-pointer', className)}
            style={{
                x: magnetic ? springX : 0,
                y: magnetic ? springY : 0,
            }}
            whileHover={{
                scale,
                y: lift,
                transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 17,
                },
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                handleMouseLeave();
            }}
        >
            {children}

            {/* Glow effect */}
            {glow && isHovered && (
                <motion.div
                    className="absolute inset-0 rounded-lg blur-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        background: glowColor,
                    }}
                />
            )}

            {/* Border glow effect */}
            {borderGlow && isHovered && (
                <motion.div
                    className="absolute inset-0 rounded-lg"
                    initial={{ opacity: 0, boxShadow: 'none' }}
                    animate={{
                        opacity: 1,
                        boxShadow: `0 0 20px ${glowColor}`,
                    }}
                    exit={{ opacity: 0, boxShadow: 'none' }}
                    style={{
                        filter: 'blur(1px)',
                    }}
                />
            )}
        </motion.div>
    );
}

// Enhanced button with multiple interaction states
interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    success?: boolean;
    error?: boolean;
    magnetic?: boolean;
    glow?: boolean;
}

export function EnhancedButton({
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    success = false,
    error = false,
    magnetic = false,
    glow = false,
    disabled,
    ...props
}: EnhancedButtonProps) {
    const prefersReducedMotion = useReducedMotion();

    const baseClasses = 'relative inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variantClasses = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
    };

    const sizeClasses = {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
    };

    const buttonVariants: Variants = {
        idle: {},
        loading: {
            scale: [1, 0.98, 1],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
        success: {
            scale: [1, 1.05, 1],
            backgroundColor: 'hsl(var(--success))',
            transition: { duration: 0.3 },
        },
        error: {
            scale: [1, 0.95, 1.05, 1],
            backgroundColor: 'hsl(var(--destructive))',
            transition: { duration: 0.4 },
        },
    };

    const getCurrentVariant = () => {
        if (error) return 'error';
        if (success) return 'success';
        if (loading) return 'loading';
        return 'idle';
    };

    return (
        <EnhancedHover
            scale={magnetic ? 1.02 : 1.01}
            lift={magnetic ? -1 : 0}
            glow={glow}
            magnetic={magnetic}
            className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
        >
            <motion.button
                variants={buttonVariants}
                animate={getCurrentVariant()}
                disabled={disabled || loading}
                {...(props as any)}
            >
                {loading && (
                    <motion.div
                        className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                )}

                {success && !loading && (
                    <motion.svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                        <path
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 6L9 17L4 12"
                        />
                    </motion.svg>
                )}

                {error && !loading && !success && (
                    <motion.svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                        <path
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 6L6 18M6 6l12 12"
                        />
                    </motion.svg>
                )}

                <span className={loading ? 'opacity-70' : ''}>
                    {children}
                </span>
            </motion.button>
        </EnhancedHover>
    );
}

// Enhanced card with hover effects
interface EnhancedCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    lift?: boolean;
}

export function EnhancedCard({
    children,
    className,
    hover = true,
    glow = false,
    lift = true,
}: EnhancedCardProps) {
    return (
        <EnhancedHover
            scale={hover ? 1.02 : 1}
            lift={lift ? -4 : 0}
            glow={glow}
            className={cn(
                'rounded-lg border bg-card text-card-foreground shadow-sm transition-all',
                hover && 'cursor-pointer',
                className
            )}
        >
            {children}
        </EnhancedHover>
    );
}