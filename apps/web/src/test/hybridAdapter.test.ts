
import { describe, it, expect, vi, beforeEach } from 'vitest';
// We need to mock modules before importing them
vi.mock('../lib/generateDesignSystem', () => ({
    generateDesignSystemFallback: vi.fn()
}));

vi.mock('../lib/circuitBreaker', () => ({
    aiCircuitBreaker: {
        execute: vi.fn().mockImplementation((fn: any) => fn())
    }
}));

vi.mock('../lib/utils', () => ({
    invokeWithRetry: vi.fn(),
    cn: vi.fn()
}));

vi.mock('../lib/monitoring', () => ({
    monitor: {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

vi.mock('../lib/optimizationEngine', () => ({
    optimizationEngine: {
        getConfig: vi.fn().mockReturnValue({ featureFlags: {} })
    }
}));

vi.mock('../lib/aiCache', () => ({
    aiCache: {
        generateKey: vi.fn().mockReturnValue('mock-cache-key'),
        get: vi.fn().mockReturnValue(null),
        set: vi.fn()
    }
}));

// Import after mocks
import { hybridAdapter } from '../lib/hybridAdapter';
import { generateDesignSystemFallback } from '../lib/generateDesignSystem';
import { aiCircuitBreaker } from '../lib/circuitBreaker';
import { invokeWithRetry } from '../lib/utils';
import { monitor } from '../lib/monitoring';
import { optimizationEngine } from '../lib/optimizationEngine';
import { DesignSystemInput, GeneratedDesignSystem } from '../types/designSystem';

describe('HybridAdapter', () => {
    const mockInput: DesignSystemInput = {
        appType: 'web',
        industry: 'tech',
        brandMood: ['modern'],
        description: 'test'
    };

    const mockFoundation: GeneratedDesignSystem = {
        name: 'Foundation',
        colors: { primary: '#000000' } as any,
        typography: { fontFamily: { heading: 'Inter' } } as any,
        spacing: { unit: 4 } as any,
        borderRadius: { md: '0.375rem' } as any,
        shadows: {} as any,
        grid: {} as any,
        animations: {} as any
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (generateDesignSystemFallback as any).mockResolvedValue(mockFoundation);
        (optimizationEngine.getConfig as any).mockReturnValue({ featureFlags: {} });
        (aiCircuitBreaker.execute as any).mockImplementation((fn: any) => fn());
    });

    it('should return foundation if AI returns null', async () => {
        (invokeWithRetry as any).mockResolvedValue({ data: null, error: null });

        const result = await hybridAdapter.generate(mockInput);

        expect(result).toBe(mockFoundation);
        expect(generateDesignSystemFallback).toHaveBeenCalledWith(mockInput);
    });

    it('should merge AI adaptations into foundation', async () => {
        const mockAdaptation = {
            colors: { primary: '#FF0000' },
            borderRadius: { md: '1rem' }
        };

        // HybridAdapter expects { adaptation: ... } inside data
        (invokeWithRetry as any).mockResolvedValue({
            data: { adaptation: mockAdaptation },
            error: null
        });

        const result = await hybridAdapter.generate(mockInput);

        expect(result.colors.primary).toBe('#FF0000'); // AI override
        expect(result.borderRadius.md).toBe('1rem'); // AI override
        // Check deep merge behavior for typography
        expect(result.typography.fontFamily.heading).toBe('Inter');
    });

    it('should handle AI errors gracefully via Circuit Breaker', async () => {
        (aiCircuitBreaker.execute as any).mockRejectedValue(new Error('Circuit Open'));

        const result = await hybridAdapter.generate(mockInput);

        expect(result).toBe(mockFoundation);
    });

    it('should pass optimization config to AI adaptation', async () => {
        const config = { featureFlags: { usePatternForColors: true } };
        (optimizationEngine.getConfig as any).mockReturnValue(config);

        (invokeWithRetry as any).mockResolvedValue({ data: { adaptation: {} }, error: null });

        await hybridAdapter.generate(mockInput);

        expect(invokeWithRetry).toHaveBeenCalledWith(
            "generate-design-adaptation",
            expect.objectContaining({
                body: expect.objectContaining({
                    config: config
                })
            })
        );
    });

    it('should log A/B testing metadata', async () => {
        (invokeWithRetry as any).mockResolvedValue({
            data: {
                adaptation: {},
                meta: { ab_variant: 'B' }
            },
            error: null
        });

        await hybridAdapter.generate(mockInput);

        expect(monitor.info).toHaveBeenCalledWith(
            "AI Generation Metadata",
            expect.objectContaining({
                meta: { ab_variant: 'B' }
            })
        );
    });
});
