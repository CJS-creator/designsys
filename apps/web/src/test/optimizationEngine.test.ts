
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { optimizationEngine } from '../lib/optimizationEngine';
import { patternRepository } from '../lib/patterns/repository';

// Mock repository
vi.mock('../lib/patterns/repository', () => ({
    patternRepository: {
        savePattern: vi.fn()
    }
}));

// Mock monitor
vi.mock('../lib/monitoring', () => ({
    monitor: {
        info: vi.fn(),
        trackEvent: vi.fn()
    }
}));

describe('OptimizationEngine', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should adjust config based on value metrics', async () => {
        // Initial state
        expect(optimizationEngine.getConfig().featureFlags.usePatternForColors).toBe(false);

        // Run analysis (uses mocked getRecentMetrics internally which has low color value)
        await optimizationEngine.analyzeAndOptimize();

        // Should switch to patterns for colors
        expect(optimizationEngine.getConfig().featureFlags.usePatternForColors).toBe(true);
        expect(optimizationEngine.getConfig().aiIntensity).toBeGreaterThan(0.5); // Layout value was high
    });

    it('should promote high value generations to patterns', async () => {
        const generations = [
            { id: '1', value_score: 0.2, category: 'layout' },
            { id: '2', value_score: 0.95, category: 'layout', data: { grid: 'cols-4' } }
        ];

        await optimizationEngine.expandLibrary(generations);

        expect(patternRepository.savePattern).toHaveBeenCalledTimes(1);
        expect(patternRepository.savePattern).toHaveBeenCalledWith(expect.objectContaining({
            category: 'layout',
            name: 'AI Generated layout Pattern'
        }));
    });

    it('should report pattern utilization', () => {
        const rate = optimizationEngine.getPatternUtilization();
        expect(rate).toBe(0.75); // Mocked value
    });
});
