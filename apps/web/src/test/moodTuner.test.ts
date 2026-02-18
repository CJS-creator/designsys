
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { moodTuner } from '../lib/moodTuner';
import { hybridAdapter } from '../lib/hybridAdapter';
import { GeneratedDesignSystem } from '../types/designSystem';

// Mock dependencies
vi.mock('../lib/hybridAdapter', () => ({
    hybridAdapter: {
        getAIAdaptation: vi.fn()
    }
}));

// Mock monitor to avoid console spam
vi.mock('../lib/monitoring', () => ({
    monitor: {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

describe('MoodTuner', () => {
    const mockSystem: GeneratedDesignSystem = {
        colors: { primary: '#000000' } as any,
        borderRadius: { md: '4px' } as any,
        typography: { fontFamily: {} } as any,
        spacing: {} as any
    } as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should apply deterministic patterns for known moods', async () => {
        const result = await moodTuner.tuneTheme(mockSystem, 'Friendly');

        // Friendly mood should increase border radius (deterministic)
        expect(result.borderRadius.md).toBe('8px');
        expect(hybridAdapter.getAIAdaptation).not.toHaveBeenCalled();
    });

    it('should use AI for unknown moods', async () => {
        const mockAdaptation = {
            colors: { primary: '#FF00FF' } // Neon for "Cyberpunk"
        };

        (hybridAdapter.getAIAdaptation as any).mockResolvedValue(mockAdaptation);

        const result = await moodTuner.tuneTheme(mockSystem, 'Cyberpunk');

        expect(hybridAdapter.getAIAdaptation).toHaveBeenCalledWith(expect.objectContaining({
            brandMood: ['Cyberpunk']
        }));
        expect(result.colors.primary).toBe('#FF00FF');
    });

    it('should return original system if AI fails', async () => {
        (hybridAdapter.getAIAdaptation as any).mockRejectedValue(new Error('AI Failed'));

        const result = await moodTuner.tuneTheme(mockSystem, 'Unknown');

        expect(result).toEqual(mockSystem);
    });
});
