import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock Supabase client
// Helper to create a thenable query builder mock
const createQueryBuilder = (data: any = []) => {
    const builder: any = {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        // Make it thenable
        then: (resolve: any) => resolve({ data, error: null }),
    };
    return builder;
};

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
            onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
            signUp: vi.fn().mockResolvedValue({ data: { session: null, user: null }, error: null }),
            signInWithPassword: vi.fn().mockResolvedValue({ data: { session: null, user: null }, error: null }),
            signInWithOAuth: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
            signOut: vi.fn().mockResolvedValue({ error: null }),
            getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
        from: vi.fn(() => createQueryBuilder()),
        channel: vi.fn().mockReturnValue({
            on: vi.fn().mockReturnThis(),
            subscribe: vi.fn().mockReturnThis(),
            unsubscribe: vi.fn(),
        }),
    },
}));

// Mock Sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});
