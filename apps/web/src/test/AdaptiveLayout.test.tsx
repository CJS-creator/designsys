import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdaptiveLayout } from '../components/hybrid/AdaptiveLayout';
import * as useAdaptiveLayoutHook from '../hooks/useAdaptiveLayout';

// Mock the hook
vi.mock('../hooks/useAdaptiveLayout', () => ({
    useAdaptiveLayout: vi.fn().mockImplementation(() => ({
        strategy: null,
        loading: false,
        error: null
    }))
}));

describe('AdaptiveLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders children correctly', () => {
        (useAdaptiveLayoutHook.useAdaptiveLayout as any).mockReturnValue({
            strategy: null,
            loading: false,
            error: null
        });

        render(
            <AdaptiveLayout>
                <div data-testid="child">Child Content</div>
            </AdaptiveLayout>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('applies flex layout by default', () => {
        (useAdaptiveLayoutHook.useAdaptiveLayout as any).mockReturnValue({
            strategy: null,
            loading: false,
            error: null
        });

        const { container } = render(
            <AdaptiveLayout>
                <div>Child</div>
            </AdaptiveLayout>
        );

        const layout = container.firstChild as HTMLElement;
        expect(layout.style.display).toBe('flex');
        expect(layout.style.flexDirection).toBe('column');
    });

    it('applies grid layout when strategy dictates', () => {
        (useAdaptiveLayoutHook.useAdaptiveLayout as any).mockReturnValue({
            strategy: {
                type: 'grid',
                config: { columns: 3, gap: 2 }
            },
            loading: false,
            error: null
        });

        const { container } = render(
            <AdaptiveLayout description="gallery">
                <div>Child</div>
            </AdaptiveLayout>
        );

        const layout = container.firstChild as HTMLElement;
        expect(layout.style.display).toBe('grid');
        // gap * 4 = 8px
        expect(layout.style.gap).toBe('8px');
        expect(layout.getAttribute('data-ai-driven')).toBe('true');
    });
});
