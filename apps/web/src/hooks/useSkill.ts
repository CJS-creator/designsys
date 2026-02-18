import { useState, useCallback } from 'react';
import { useSkillContext } from '../contexts/SkillContext';
import { SkillResult } from '@designsys/ui-ux-core';
import { trackSkillExecution } from '../lib/metrics';

interface UseSkillOptions {
    onSuccess?: (result: any) => void;
    onError?: (error: any) => void;
}

export function useSkill<TInput = any, TOutput = any>(skillId: string, options: UseSkillOptions = {}) {
    const { executeSkill, isReady } = useSkillContext();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SkillResult<TOutput> | null>(null);
    const [error, setError] = useState<any>(null);

    const execute = useCallback(async (input: TInput) => {
        if (!isReady) {
            console.warn('Skill engine not ready');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        const startTime = Date.now();

        try {
            const res = await executeSkill<TInput, TOutput>(skillId, input);
            const durationMs = Date.now() - startTime;

            trackSkillExecution({
                skillId,
                durationMs,
                success: res.status === 'success',
                cached: !!res.cached,
                error: res.error?.message
            });

            if (res.status === 'success') {
                setResult(res);
                options.onSuccess?.(res.output);
            } else {
                setError(res.error);
                options.onError?.(res.error);
            }
            return res;
        } catch (e) {
            const durationMs = Date.now() - startTime;
            trackSkillExecution({
                skillId,
                durationMs,
                success: false,
                cached: false,
                error: e instanceof Error ? e.message : 'Unknown error'
            });

            setError(e);
            options.onError?.(e);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [skillId, executeSkill, isReady, options]);

    return {
        execute,
        isLoading,
        result,
        error,
        isReady
    };
}
