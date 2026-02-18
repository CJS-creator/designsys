
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SmartDashboard } from '../components/hybrid/SmartDashboard';

// Mock dependencies
vi.mock('../lib/moodTuner', () => ({
    moodTuner: {
        tuneTheme: vi.fn().mockResolvedValue({
            colors: {
                background: '#ffffff',
                text: '#000000'
            },
            borderRadius: {
                lg: '12px',
                md: '8px'
            }
        })
    }
}));

vi.mock('../components/hybrid/AdaptiveLayout', () => ({
    AdaptiveLayout: ({ children }: any) => <div data-testid="adaptive-layout">{children}</div>
}));

describe('SmartDashboard', () => {
    const mockWidgets = [
        { id: '1', title: 'Widget 1', content: 'Content', type: 'stat' as const }
    ];

    it('renders dashboard with title and widgets', async () => {
        render(
            <SmartDashboard
                title="My Dashboard"
                widgets={mockWidgets}
                context="Financial Overview"
                initialSystem={{ colors: {} } as any}
            />
        );

        expect(screen.getByText('My Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Widget 1')).toBeInTheDocument();
    });

    // Add more specific tests for tuning logic if we export internal state or hook
});
