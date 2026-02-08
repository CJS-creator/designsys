import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(),
            signUp: vi.fn(),
            signInWithPassword: vi.fn(),
            signInWithOAuth: vi.fn(),
            signOut: vi.fn(),
        },
    },
}));

// Test component to consume AuthContext
const TestComponent = () => {
    const { user, loading, session } = useAuth();
    if (loading) return <div data-testid="loading">Loading...</div>;
    return (
        <div data-testid="content">
            {user ? `User: ${user.email}` : "No User"}
            {session ? "Has Session" : "No Session"}
        </div>
    );
};

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <BrowserRouter>
            <AuthProvider>{ui}</AuthProvider>
        </BrowserRouter>
    );
};

describe("AuthContext", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default mocks
        vi.mocked(supabase.auth.getSession).mockResolvedValue({
            data: { session: null },
            error: null
        } as any);

        vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
        } as any);
    });

    it("shows loading state initially", async () => {
        // Delay resolution to catch loading state
        vi.mocked(supabase.auth.getSession).mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve({ data: { session: null }, error: null } as any), 100))
        );

        renderWithProviders(<TestComponent />);
        expect(screen.getByTestId("loading")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
        });
    });

    it("renders unauthenticated state correctly", async () => {
        renderWithProviders(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId("content")).toHaveTextContent("No User");
        });
    });

    it("renders authenticated state correctly", async () => {
        const mockUser = { id: "123", email: "test@example.com" };
        const mockSession = { user: mockUser };

        vi.mocked(supabase.auth.getSession).mockResolvedValue({
            data: { session: mockSession },
            error: null
        } as any);

        renderWithProviders(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId("content")).toHaveTextContent("User: test@example.com");
        });
    });

    it("updates state on auth change", async () => {
        let authChangeListener: (event: unknown, session: unknown) => void = () => { };

        vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback: unknown) => {
            authChangeListener = callback as (event: unknown, session: unknown) => void;
            return { data: { subscription: { unsubscribe: vi.fn() } } } as any;
        });

        renderWithProviders(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId("content")).toHaveTextContent("No User");
        });

        const mockUser = { id: "456", email: "login@example.com" };

        // Simulate login event
        act(() => {
            authChangeListener("SIGNED_IN", { user: mockUser });
        });

        await waitFor(() => {
            expect(screen.getByTestId("content")).toHaveTextContent("User: login@example.com");
        });
    });

    it("handles sign out correctly", async () => {
        const mockUser = { id: "123", email: "user@example.com" };

        // Start authenticated
        vi.mocked(supabase.auth.getSession).mockResolvedValue({
            data: { session: { user: mockUser } },
            error: null
        } as any);

        let authChangeListener: (event: unknown, session: unknown) => void = () => { };
        vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback: unknown) => {
            authChangeListener = callback as (event: unknown, session: unknown) => void;
            return { data: { subscription: { unsubscribe: vi.fn() } } } as any;
        });

        renderWithProviders(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId("content")).toHaveTextContent("User: user@example.com");
        });

        // Simulate sign out event
        act(() => {
            authChangeListener("SIGNED_OUT", null);
        });

        await waitFor(() => {
            expect(screen.getByTestId("content")).toHaveTextContent("No User");
        });
    });
});
