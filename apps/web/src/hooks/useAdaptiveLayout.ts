import { useState, useEffect } from 'react';
import { LayoutStrategy } from '@/types/designSystem';
import { hybridAdapter } from '@/lib/hybridAdapter';

export function useAdaptiveLayout(description?: string) {
    const [strategy, setStrategy] = useState<LayoutStrategy | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!description) {
            setStrategy(null);
            return;
        }

        let mounted = true;

        const fetchStrategy = async () => {
            setLoading(true);
            try {
                const result = await hybridAdapter.getLayoutStrategy(description);
                if (mounted) {
                    setStrategy(result);
                }
            } catch (err: any) {
                if (mounted) {
                    setError(err);
                    // Fallback is handled inside hybridAdapter, but if that fails too:
                    setStrategy({ type: 'flex', config: { direction: 'column', gap: 4 } });
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchStrategy();

        return () => {
            mounted = false;
        };
    }, [description]);

    return { strategy, loading, error };
}
