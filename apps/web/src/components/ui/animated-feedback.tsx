import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icon, IconName } from './icon-registry';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface AnimatedFeedbackProps {
    type: FeedbackType;
    message: string;
    description?: string;
    duration?: number;
    onClose?: () => void;
    className?: string;
    showIcon?: boolean;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const feedbackConfig = {
    success: {
        icon: 'check' as IconName,
        bgColor: 'bg-green-50 border-green-200 text-green-800',
        darkBgColor: 'dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
        iconColor: 'text-green-600',
        progressColor: 'bg-green-500',
    },
    error: {
        icon: 'error' as IconName,
        bgColor: 'bg-red-50 border-red-200 text-red-800',
        darkBgColor: 'dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
        iconColor: 'text-red-600',
        progressColor: 'bg-red-500',
    },
    warning: {
        icon: 'warning' as IconName,
        bgColor: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        darkBgColor: 'dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
        iconColor: 'text-yellow-600',
        progressColor: 'bg-yellow-500',
    },
    info: {
        icon: 'info' as IconName,
        bgColor: 'bg-blue-50 border-blue-200 text-blue-800',
        darkBgColor: 'dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
        iconColor: 'text-blue-600',
        progressColor: 'bg-blue-500',
    },
    loading: {
        icon: 'loading' as IconName,
        bgColor: 'bg-gray-50 border-gray-200 text-gray-800',
        darkBgColor: 'dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300',
        iconColor: 'text-gray-600',
        progressColor: 'bg-gray-500',
    },
};

const slideVariants = {
    'top-right': {
        initial: { opacity: 0, x: 300, y: -50 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 300, y: -50 },
    },
    'top-left': {
        initial: { opacity: 0, x: -300, y: -50 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: -300, y: -50 },
    },
    'bottom-right': {
        initial: { opacity: 0, x: 300, y: 50 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 300, y: 50 },
    },
    'bottom-left': {
        initial: { opacity: 0, x: -300, y: 50 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: -300, y: 50 },
    },
    'top-center': {
        initial: { opacity: 0, y: -50, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -50, scale: 0.95 },
    },
    'bottom-center': {
        initial: { opacity: 0, y: 50, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 50, scale: 0.95 },
    },
};

export function AnimatedFeedback({
    type,
    message,
    description,
    duration = 5000,
    onClose,
    className,
    showIcon = true,
    position = 'top-right',
}: AnimatedFeedbackProps) {
    const prefersReducedMotion = useReducedMotion();
    const config = feedbackConfig[type];

    useEffect(() => {
        if (duration > 0 && onClose && !prefersReducedMotion) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose, prefersReducedMotion]);

    const variants = slideVariants[position];

    return (
        <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : variants.initial}
            animate={prefersReducedMotion ? { opacity: 1 } : variants.animate}
            exit={prefersReducedMotion ? { opacity: 0 } : variants.exit}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                mass: 0.8,
            }}
            className={cn(
                'relative max-w-sm rounded-lg border p-4 shadow-lg backdrop-blur-sm',
                config.bgColor,
                config.darkBgColor,
                className
            )}
        >
            <div className="flex items-start space-x-3">
                {showIcon && (
                    <motion.div
                        initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
                        animate={prefersReducedMotion ? {} : { scale: 1, rotate: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 25,
                            delay: 0.1,
                        }}
                    >
                        <Icon
                            name={config.icon}
                            size={20}
                            className={cn('mt-0.5 flex-shrink-0', config.iconColor)}
                        />
                    </motion.div>
                )}

                <div className="flex-1 space-y-1">
                    <motion.p
                        className="text-sm font-medium leading-none"
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {message}
                    </motion.p>

                    {description && (
                        <motion.p
                            className="text-sm opacity-90"
                            initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {description}
                        </motion.p>
                    )}
                </div>

                {onClose && (
                    <motion.button
                        onClick={onClose}
                        className="flex-shrink-0 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Icon name="close" size={16} className="opacity-70" />
                    </motion.button>
                )}
            </div>

            {/* Progress bar for auto-dismiss */}
            {duration > 0 && onClose && !prefersReducedMotion && (
                <motion.div
                    className="absolute bottom-0 left-0 h-1 rounded-bl-lg bg-black/10 dark:bg-white/10"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: duration / 1000, ease: 'linear' }}
                >
                    <div className={cn('h-full rounded-bl-lg', config.progressColor)} />
                </motion.div>
            )}
        </motion.div>
    );
}

// Toast container component
interface ToastContainerProps {
    toasts: Array<{
        id: string;
        type: FeedbackType;
        message: string;
        description?: string;
        duration?: number;
    }>;
    onRemove: (id: string) => void;
    position?: AnimatedFeedbackProps['position'];
    className?: string;
}

export function ToastContainer({
    toasts,
    onRemove,
    position = 'top-right',
    className,
}: ToastContainerProps) {
    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };

    return (
        <div
            className={cn(
                'fixed z-50 flex flex-col space-y-2',
                positionClasses[position],
                className
            )}
        >
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <AnimatedFeedback
                        key={toast.id}
                        type={toast.type}
                        message={toast.message}
                        description={toast.description}
                        duration={toast.duration}
                        onClose={() => onRemove(toast.id)}
                        position={position}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

// Inline feedback component for forms/buttons
interface InlineFeedbackProps {
    type: FeedbackType;
    message: string;
    showIcon?: boolean;
    className?: string;
}

export function InlineFeedback({
    type,
    message,
    showIcon = true,
    className,
}: InlineFeedbackProps) {
    const config = feedbackConfig[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className={cn(
                'flex items-center space-x-2 rounded-md border px-3 py-2 text-sm',
                config.bgColor,
                config.darkBgColor,
                className
            )}
        >
            {showIcon && (
                <Icon
                    name={config.icon}
                    size={16}
                    className={config.iconColor}
                />
            )}
            <span>{message}</span>
        </motion.div>
    );
}