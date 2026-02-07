import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { GitSettings } from "@/components/GitSettings";
import { supabase } from "@/integrations/supabase/client";
import React from "react";
import { BrowserRouter } from "react-router-dom";

vi.mock("@/integrations/supabase/client", () => ({
    supabase: {
        from: vi.fn(),
    }
}));

vi.mock("@/contexts/AuthContext", () => ({
    useAuth: () => ({
        user: { id: 'u1' }
    })
}));

vi.mock("lucide-react", () => ({
    Github: () => <div />, GitBranch: () => <div />, Settings2: () => <div />, RefreshCw: () => <div />,
    ExternalLink: () => <div />, CheckCircle2: () => <div />, AlertCircle: () => <div />, Lock: () => <div />,
    Globe: () => <div />, Zap: () => <div />, Key: () => <div />, Menu: () => <div />
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
);

describe("GitSettings", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it("renders connection form when data is loaded", async () => {
        (supabase.from as any).mockImplementation(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
                }))
            }))
        }));

        render(<GitSettings designSystemId="123" />, { wrapper: Wrapper });
        expect(await screen.findByText(/Connect Repository/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/org\/repo-name/i)).toBeInTheDocument();
    });

    it("renders connection details when connected", async () => {
        const mockConnection = {
            id: 'conn1',
            design_system_id: '123',
            repo_full_name: 'org/repo',
            default_branch: 'main',
            sync_status: 'idle',
            last_sync_at: null
        };

        (supabase.from as any).mockImplementation((table: string) => {
            if (table === 'git_connections') {
                return {
                    select: vi.fn(() => ({
                        eq: vi.fn(() => ({
                            single: vi.fn().mockResolvedValue({ data: mockConnection, error: null })
                        }))
                    }))
                } as any;
            }
            return {
                select: vi.fn(() => ({
                    eq: vi.fn(() => ({
                        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
                    }))
                }))
            } as any;
        });

        render(<GitSettings designSystemId="123" />, { wrapper: Wrapper });

        expect(await screen.findByText(/Update Connection/i)).toBeInTheDocument();
        expect(screen.getByText("org/repo")).toBeInTheDocument();
    });
});
