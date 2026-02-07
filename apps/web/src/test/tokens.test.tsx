import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTokens } from '@/hooks/useTokens';
import { supabase } from '@/integrations/supabase/client';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock useAuth
vi.mock("@/contexts/AuthContext", () => ({
    useAuth: () => ({
        user: { id: 'test-user' },
        loading: false,
    }),
}));

// Wrapper for React Query
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

// Helper for mocking Supabase query chain
const createMockBuilder = (data: any, error: any = null) => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    then: (resolve: any) => resolve({ data, error }),
});

describe('useTokens Hook', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('fetches tokens successfully', async () => {
        // Mock data (DB Rows)
        const dbRows = [
            { id: '1', name: 'Primary Color', value: '#0000FF', path: 'color.primary', token_type: 'color' },
        ];

        vi.spyOn(supabase, 'from').mockImplementation(() => createMockBuilder(dbRows));

        const { result } = renderHook(() => useTokens('ds-123'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.tokens).toMatchObject([
            { name: 'Primary Color', value: '#0000FF', path: 'color.primary', type: 'color' }
        ]));
        expect(result.current.loading).toBe(false);
    });

    it('handles fetch error', async () => {
        vi.spyOn(supabase, 'from').mockImplementation(() => createMockBuilder(null, { message: 'Fetch error' }));

        const { result } = renderHook(() => useTokens('ds-123'), {
            wrapper: createWrapper(),
        });

        // If error is not exposed, we might check if tokens are empty or loading creates a toast
        // For now assuming we just check loading state is false after error
        await waitFor(() => expect(result.current.loading).toBe(false));
    });
});
