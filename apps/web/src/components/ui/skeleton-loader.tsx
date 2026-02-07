import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// Shimmer animation variant
const shimmer: Variants = {
    hidden: { x: '-100%' },
    visible: {
        x: '100%',
        transition: {
            repeat: Infinity,
            duration: 1.5,
            ease: [0, 0, 1, 1],
        },
    },
};

interface SkeletonProps {
    className?: string;
    animate?: boolean;
    style?: React.CSSProperties;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-md bg-muted',
                className
            )}
        >
            {animate && (
                <motion.div
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-background/50 to-transparent"
                />
            )}
        </div>
    );
}

// Predefined skeleton components for common use cases
export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn('space-y-3 p-4', className)}>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
        </div>
    );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        'h-4',
                        i === lines - 1 ? 'w-3/4' : 'w-full' // Last line shorter
                    )}
                />
            ))}
        </div>
    );
}

export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
    return (
        <Skeleton
            className={cn('rounded-full', className)}
            style={{ width: `${size}px`, height: `${size}px` }}
        />
    );
}

export function SkeletonButton({ className }: { className?: string }) {
    return <Skeleton className={cn('h-10 w-24 rounded-md', className)} />;
}

export function SkeletonInput({ className }: { className?: string }) {
    return <Skeleton className={cn('h-10 w-full rounded-md', className)} />;
}

// Table skeleton
export function SkeletonTable({
    rows = 5,
    columns = 4,
    className
}: {
    rows?: number;
    columns?: number;
    className?: string;
}) {
    return (
        <div className={cn('space-y-3', className)}>
            {/* Header */}
            <div className="flex space-x-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={`header-${i}`} className="h-4 flex-1" />
                ))}
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex space-x-4">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton
                            key={`cell-${rowIndex}-${colIndex}`}
                            className="h-4 flex-1"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

// List skeleton
export function SkeletonList({
    items = 5,
    className
}: {
    items?: number;
    className?: string;
}) {
    return (
        <div className={cn('space-y-3', className)}>
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                    <SkeletonAvatar size={32} />
                    <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Card grid skeleton
export function SkeletonCardGrid({
    count = 6,
    className
}: {
    count?: number;
    className?: string;
}) {
    return (
        <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                    <Skeleton className="h-32 w-full mb-3" />
                    <SkeletonText lines={2} />
                </div>
            ))}
        </div>
    );
}