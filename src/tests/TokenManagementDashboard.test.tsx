import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "./test-utils";
import { TokenManagementDashboard } from "@/components/tokens/TokenManagementDashboard";
import * as useTokensHook from "@/hooks/useTokens";
import * as useBrandsHook from "@/hooks/useBrands";
import { DesignToken } from "@/types/tokens";
import React from "react";

// Mocks
vi.mock("@/integrations/supabase/client", () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn().mockResolvedValue({ data: { design_system_data: {} }, error: null })
                }))
            }))
        })),
        channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn(), unsubscribe: vi.fn() })),
    }
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set("id", "123");
    return {
        ...actual,
        useSearchParams: () => [mockSearchParams, vi.fn()]
    };
});

vi.mock("lucide-react", () => ({
    LayoutDashboard: () => <div />,
    History: () => <div />,
    Split: () => <div />,
    Shield: () => <div />,
    Sparkles: () => <div />,
    Layers: () => <div />,
    Search: () => <div />,
    Plus: () => <div />,
    Filter: () => <div />,
    ChevronRight: () => <div />,
    Trash2: () => <div />,
    Edit: () => <div />,
    RotateCcw: () => <div />,
    Save: () => <div />,
    X: () => <div />
}));

// Mock child components
vi.mock("@/components/tokens/TokenList", () => ({
    TokenList: ({ tokens, onAdd }: any) => (
        <div data-testid="token-list">
            {tokens.map((t: any) => <div key={t.path}>{t.name}</div>)}
            <button onClick={onAdd}>Add Token</button>
        </div>
    )
}));
vi.mock("@/components/tokens/TokenEditor", () => ({ TokenEditor: () => <div data-testid="token-editor">TokenEditor Mock</div> }));
vi.mock("@/components/BrandSwitcher", () => ({ BrandSwitcher: () => <div>BrandSwitcher Mock</div> }));
vi.mock("@/components/VersionManager", () => ({ VersionManager: () => <div>VersionManager Mock</div> }));
vi.mock("@/components/tokens/TokenCompareSandbox", () => ({ TokenCompareSandbox: () => <div>CompareSandbox Mock</div> }));
vi.mock("@/components/tokens/GovernanceDashboard", () => ({ GovernanceDashboard: () => <div>GovernanceDashboard Mock</div> }));
vi.mock("@/components/ExportButton", () => ({ ExportButton: () => <div>ExportButton Mock</div> }));
vi.mock("@/components/tokens/SemanticCopilot", () => ({ SemanticCopilot: () => <div>SemanticCopilot Mock</div> }));
vi.mock("@/components/tokens/SpacingGrid", () => ({ SpacingGrid: () => <div>SpacingGrid Mock</div> }));
vi.mock("@/components/skeletons/DashboardSkeleton", () => ({ DashboardSkeleton: () => <div data-testid="dashboard-skeleton">DashboardSkeleton Mock</div> }));
vi.mock("@/components/skeletons/TokenListSkeleton", () => ({ TokenListSkeleton: () => <div data-testid="token-list-skeleton">TokenListSkeleton Mock</div> }));
vi.mock("@/components/skeletons/SandboxSkeleton", () => ({ SandboxSkeleton: () => <div>SandboxSkeleton Mock</div> }));

const mockTokens: DesignToken[] = [
    { name: 'Primary Color', path: 'colors.primary', type: 'color', value: '#000000', description: 'Primary', status: 'published' },
    { name: 'Spacing SM', path: 'spacing.sm', type: 'spacing', value: '4px', description: 'Small Spacing', status: 'published' }
];

describe("TokenManagementDashboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(useBrandsHook, "useBrands").mockReturnValue({
            brands: [], activeBrand: null, setActiveBrandId: vi.fn(), loading: false, createBrand: vi.fn(), refresh: vi.fn()
        });
    });

    it("renders with design system id", async () => {
        vi.spyOn(useTokensHook, "useTokens").mockReturnValue({
            tokens: mockTokens, tokensByPath: {}, loading: false, saveToken: vi.fn(), refresh: vi.fn(), batchSaveTokens: vi.fn(), deleteToken: vi.fn(), restoreToken: vi.fn(), permanentlyDeleteToken: vi.fn(), resolveToken: vi.fn()
        } as any);

        render(<TokenManagementDashboard />);
        const header = await screen.findByText(/Token Management/i);
        expect(header).toBeInTheDocument();
        expect(screen.getByText("Primary Color")).toBeInTheDocument();
    });

    it("shows token list skeleton when tokens are loading", async () => {
        vi.spyOn(useTokensHook, "useTokens").mockReturnValue({
            tokens: [], tokensByPath: {}, loading: true, saveToken: vi.fn(), refresh: vi.fn(), batchSaveTokens: vi.fn(), deleteToken: vi.fn(), restoreToken: vi.fn(), permanentlyDeleteToken: vi.fn(), resolveToken: vi.fn()
        } as any);

        render(<TokenManagementDashboard />);
        expect(await screen.findByTestId("token-list-skeleton")).toBeInTheDocument();
    });

    it("opens token editor when 'Add Token' is clicked", async () => {
        vi.spyOn(useTokensHook, "useTokens").mockReturnValue({
            tokens: mockTokens, tokensByPath: {}, loading: false, saveToken: vi.fn(), refresh: vi.fn(), batchSaveTokens: vi.fn(), deleteToken: vi.fn(), restoreToken: vi.fn(), permanentlyDeleteToken: vi.fn(), resolveToken: vi.fn()
        } as any);

        render(<TokenManagementDashboard />);

        const addBtn = await screen.findByText("Add Token");
        addBtn.click();

        expect(await screen.findByTestId("token-editor")).toBeInTheDocument();
    });

    it("switches to sandbox tab when clicked", async () => {
        vi.spyOn(useTokensHook, "useTokens").mockReturnValue({
            tokens: mockTokens, tokensByPath: {}, loading: false, saveToken: vi.fn(), refresh: vi.fn(), batchSaveTokens: vi.fn(), deleteToken: vi.fn(), restoreToken: vi.fn(), permanentlyDeleteToken: vi.fn(), resolveToken: vi.fn()
        } as any);

        render(<TokenManagementDashboard />);

        const sandboxTabBtn = await screen.findByText(/Sandbox/i);
        sandboxTabBtn.click();

        expect(await screen.findByText("CompareSandbox Mock")).toBeInTheDocument();
    });
});
