import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './utils';
import { TeamSettings } from '@/components/TeamSettings';
import { supabase } from '@/integrations/supabase/client';



describe('TeamSettings RBAC', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows invite controls for owner', async () => {
        // Mock getting members
        vi.spyOn(supabase, 'from').mockImplementation(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        } as any));

        renderWithProviders(
            <TeamSettings
                designSystemId="ds-123"
                currentUserRole="owner"
            />
        );

        expect(screen.getByText(/invite new member/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /invite/i })).not.toBeDisabled();
    });

    it('disables invite controls for viewer', async () => {
        vi.spyOn(supabase, 'from').mockImplementation(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        } as any));

        renderWithProviders(
            <TeamSettings
                designSystemId="ds-123"
                currentUserRole="viewer"
            />
        );

        // Button should be disabled for viewer
        const inviteButton = screen.getByRole('button', { name: /invite/i });
        expect(inviteButton).toBeDisabled();
    });
});
