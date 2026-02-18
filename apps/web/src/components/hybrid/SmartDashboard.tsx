import React, { useEffect, useState } from 'react';
import { AdaptiveLayout } from './AdaptiveLayout';
import { moodTuner } from '@/lib/moodTuner';
import { GeneratedDesignSystem } from '@/types/designSystem';
import { cn } from '@/lib/utils';
import { monitor } from '@/lib/monitoring';

interface Widget {
    id: string;
    title: string;
    content: React.ReactNode;
    type: 'chart' | 'stat' | 'feed';
}

interface SmartDashboardProps {
    title: string;
    widgets: Widget[];
    context: string; // e.g. "Financial Overview", "Social Feed"
    className?: string;
    initialSystem?: GeneratedDesignSystem; // Optional system to tune
}

export const SmartDashboard: React.FC<SmartDashboardProps> = ({
    title,
    widgets,
    context,
    className,
    initialSystem
}) => {
    const [tunedSystem, setTunedSystem] = useState<GeneratedDesignSystem | null>(null);

    // Auto-tune theme based on context
    useEffect(() => {
        if (!initialSystem) return;

        const tune = async () => {
            const mood = context.toLowerCase().includes('finance') ? 'Trust'
                : context.toLowerCase().includes('creative') ? 'Playful'
                    : 'Modern'; // Default

            try {
                const result = await moodTuner.tuneTheme(initialSystem, mood);
                setTunedSystem(result);
            } catch (err) {
                monitor.error("Failed to tune dashboard theme", { error: err as Error });
            }
        };

        tune();
    }, [context, initialSystem]);

    // Apply tuned styles if available
    const containerStyle = tunedSystem ? {
        backgroundColor: tunedSystem.colors.background,
        color: tunedSystem.colors.text,
        borderRadius: tunedSystem.borderRadius.lg,
    } : {};

    return (
        <div className={cn("p-6", className)} style={containerStyle}>
            <header className="mb-6">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-sm opacity-70">Context: {context}</p>
            </header>

            <AdaptiveLayout
                description={`Dashboard for ${context} with ${widgets.length} widgets`}
                className="gap-4"
            >
                {widgets.map(w => (
                    <div
                        key={w.id}
                        className="p-4 bg-white/5 border rounded shadow-sm"
                        style={{
                            borderRadius: tunedSystem?.borderRadius.md
                        }}
                    >
                        <h3 className="font-semibold mb-2">{w.title}</h3>
                        <div>{w.content}</div>
                    </div>
                ))}
            </AdaptiveLayout>
        </div>
    );
};
