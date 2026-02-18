import React from 'react';
import { useAdaptiveLayout } from '@/hooks/useAdaptiveLayout';
import { cn } from '@/lib/utils';
import { LayoutStrategy } from '@/types/designSystem';

interface AdaptiveLayoutProps {
    children: React.ReactNode;
    description?: string; // If provided, triggers AI layout strategy
    defaultStrategy?: LayoutStrategy;
    className?: string;
}

export const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
    children,
    description,
    defaultStrategy = { type: 'flex', config: { direction: 'column', gap: 4 } },
    className
}) => {
    const { strategy, loading } = useAdaptiveLayout(description);

    const activeStrategy = strategy || defaultStrategy;
    const config = activeStrategy.config;

    // Loading State (optional: could be valid to just show default while loading)
    // For now, we render default immediately to avoid layout shift, unless we want a shell.

    const getStyle = (): React.CSSProperties => {
        const style: React.CSSProperties = {
            gap: typeof config.gap === 'number' ? `${config.gap * 4}px` : config.gap,
        };

        if (activeStrategy.type === 'grid') {
            style.display = 'grid';
            style.gridTemplateColumns = config.columns
                ? `repeat(${config.columns}, 1fr)`
                : 'repeat(auto-fit, minmax(250px, 1fr))';
        } else if (activeStrategy.type === 'flex') {
            style.display = 'flex';
            style.flexDirection = config.direction || 'row';
            style.flexWrap = config.wrap ? 'wrap' : 'nowrap';
            style.alignItems = config.alignItems || 'stretch';
            style.justifyContent = config.justifyContent || 'flex-start';
        } else if (activeStrategy.type === 'masonry') {
            // Placeholder for Masonry (needs JS lib or complex CSS)
            style.columnCount = config.columns || 3;
            style.columnGap = typeof config.gap === 'number' ? `${config.gap * 4}px` : config.gap;
            style.display = 'block';
        }

        return style;
    };

    return (
        <div
            className={cn(
                "w-full transition-all duration-500 ease-in-out",
                loading ? "opacity-80" : "opacity-100",
                className
            )}
            style={getStyle()}
            data-layout-type={activeStrategy.type}
            data-ai-driven={!!strategy}
        >
            {children}
        </div>
    );
};
