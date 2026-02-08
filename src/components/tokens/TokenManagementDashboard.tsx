import { TokenList } from "./TokenList";
import { TokenEditor } from "./TokenEditor";
import { BrandSwitcher } from "../BrandSwitcher";
import { VersionManager } from "../VersionManager";
import { TokenCompareSandbox } from "./TokenCompareSandbox";
import { GovernanceDashboard } from "./GovernanceDashboard";
import { ExportButton } from "../ExportButton";
import { SemanticCopilot } from "./SemanticCopilot";
import { SpacingGrid } from "./SpacingGrid";
import { DashboardSkeleton } from "../skeletons/DashboardSkeleton";
import { TokenListSkeleton } from "../skeletons/TokenListSkeleton";
import { SandboxSkeleton } from "../skeletons/SandboxSkeleton";
import { DesignToken } from "@/types/tokens";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Button } from "@/components/ui/button";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
    History,
    LayoutDashboard,
    Split,
    Shield,
    Sparkles,
    Layers
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

import { useTokens } from "@/hooks/useTokens";
import { useBrands } from "@/hooks/useBrands";
import { useSearchParams } from "react-router-dom";
import { AISuggestion } from "@/lib/ai";
import { flattenDesignSystemToTokens } from "@/lib/token-utils";

interface TokenManagementDashboardProps {
    designSystem?: GeneratedDesignSystem | null;
    designSystemId?: string;
}

export function TokenManagementDashboard({
    designSystem: propDesignSystem,
    designSystemId: propDesignSystemId
}: TokenManagementDashboardProps = {}) {
    const [searchParams] = useSearchParams();
    const urlDesignSystemId = searchParams.get("id");
    const designSystemId = propDesignSystemId || urlDesignSystemId;

    const {
        tokens: dbTokens,
        loading: isLoadingTokens,
        saveToken,
        batchSaveTokens,
        deleteToken,
        restoreToken,
        permanentlyDeleteToken
    } = useTokens(designSystemId || undefined);

    // If no DB tokens but we have a design system prop, generate tokens locally
    const tokens = dbTokens.length > 0 ? dbTokens : (propDesignSystem ? flattenDesignSystemToTokens(propDesignSystem) : []);

    const { brands } = useBrands(designSystemId || undefined);

    const [designSystem, setDesignSystem] = useState<GeneratedDesignSystem | null>(propDesignSystem || null);
    const [isLoadingDS, setIsLoadingDS] = useState(false);
    const [editingToken, setEditingToken] = useState<DesignToken | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<"tokens" | "history" | "sandbox" | "governance" | "copilot">("tokens");
    const [localTokens, setLocalTokens] = useState<DesignToken[]>([]);
    const [showSpacingGrid, setShowSpacingGrid] = useState(false);

    useEffect(() => {
        if (designSystemId && !propDesignSystem) {
            fetchDesignSystem();
        } else if (propDesignSystem) {
            setDesignSystem(propDesignSystem);
        }
    }, [designSystemId, propDesignSystem]);

    useEffect(() => {
        if (tokens.length > 0) {
            setLocalTokens(tokens.filter(t => t.status !== 'archived'));
        }
    }, [tokens]);

    const fetchDesignSystem = async () => {
        setIsLoadingDS(true);
        const { data, error } = await supabase
            .from("design_systems")
            .select("*")
            .eq("id", designSystemId as string)
            .single();

        if (data && !error) {
            setDesignSystem(data.design_system_data as unknown as GeneratedDesignSystem);
        }
        setIsLoadingDS(false);
    };

    const handleSave = async (token: DesignToken) => {
        if (!designSystemId) {
            toast.error("Please save the design system first before modifying tokens.");
            return;
        }
        await saveToken(token);
        setEditingToken(null);
        setIsCreating(false);
    };

    const handleDelete = async (path: string) => {
        if (!designSystemId) {
            toast.error("Please save the design system first.");
            return;
        }
        await deleteToken(path);
    };

    const handleReorder = (newTokens: DesignToken[]) => {
        setLocalTokens(newTokens);
    };

    const handleApplyAISuggestion = async (suggestion: AISuggestion) => {
        try {
            if (suggestion.type === 'consolidate' || suggestion.type === 'new-token') {
                const tokensToBatch: DesignToken[] = [];
                let baseTokenValue = suggestion.value;

                if (!baseTokenValue && suggestion.tokensToAlias && suggestion.tokensToAlias.length > 0) {
                    const firstToken = tokens.find(t => t.path === suggestion.tokensToAlias![0]);
                    baseTokenValue = firstToken?.value;
                }

                if (baseTokenValue) {
                    tokensToBatch.push({
                        name: suggestion.newName.split('.').pop() || suggestion.newName,
                        path: suggestion.newName,
                        type: 'color',
                        value: baseTokenValue,
                        status: 'published'
                    });
                }

                if (suggestion.tokensToAlias) {
                    for (const path of suggestion.tokensToAlias) {
                        const token = tokens.find(t => t.path === path);
                        if (token) {
                            tokensToBatch.push({
                                ...token,
                                ref: `{${suggestion.newName}}`
                            });
                        }
                    }
                }

                if (tokensToBatch.length > 0) {
                    await batchSaveTokens(tokensToBatch);
                    toast.success(`Successfully applied AI suggestion: ${suggestion.newName}`);
                }
            }
        } catch (error) {
            toast.error("Failed to apply AI suggestion");
        }
    };

    const handleApplyAllSuggestions = async (suggestions: AISuggestion[]) => {
        if (suggestions.length === 0) return;
        toast.loading(`Applying ${suggestions.length} suggestions...`);
        try {
            const allTokensToUpdate: DesignToken[] = [];

            for (const suggestion of suggestions) {
                if (suggestion.type === 'consolidate' || suggestion.type === 'new-token') {
                    let baseTokenValue = suggestion.value;
                    if (!baseTokenValue && suggestion.tokensToAlias?.length) {
                        baseTokenValue = tokens.find(t => t.path === suggestion.tokensToAlias![0])?.value;
                    }

                    if (baseTokenValue) {
                        allTokensToUpdate.push({
                            name: suggestion.newName.split('.').pop() || suggestion.newName,
                            path: suggestion.newName,
                            type: 'color',
                            value: baseTokenValue,
                            status: 'published'
                        });
                    }

                    if (suggestion.tokensToAlias) {
                        for (const path of suggestion.tokensToAlias) {
                            const token = tokens.find(t => t.path === path);
                            if (token) {
                                allTokensToUpdate.push({
                                    ...token,
                                    ref: `{${suggestion.newName}}`
                                });
                            }
                        }
                    }
                }
            }

            if (allTokensToUpdate.length > 0) {
                await batchSaveTokens(allTokensToUpdate);
                toast.dismiss();
                toast.success(`Applied ${suggestions.length} suggestions successfully`);
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to apply all suggestions");
        }
    };

    if (!designSystemId && !propDesignSystem) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-4">
                <div className="p-4 bg-muted rounded-full">
                    <LayoutDashboard className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold">No Design System Selected</h2>
                <p className="text-muted-foreground max-w-sm">
                    Please select or generate a design system first to manage its tokens.
                </p>
            </div>
        );
    }

    if (isLoadingDS) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
            <header className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Token Management</h1>
                        <p className="text-xs text-muted-foreground font-medium">Configure and organize your design system foundations</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ErrorBoundary variant="mini">
                        {designSystemId && (
                            <BrandSwitcher designSystemId={designSystemId} />
                        )}
                        <div className="h-6 w-px bg-border/40 mx-2" />
                        {designSystem && (
                            <ExportButton designSystem={designSystem} tokens={tokens} />
                        )}
                    </ErrorBoundary>
                    <div className="flex bg-muted/30 p-1 rounded-lg border border-border/50">
                        <Button
                            variant={activeTab === "tokens" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 gap-2 px-3 text-xs"
                            onClick={() => setActiveTab("tokens")}
                        >
                            <LayoutDashboard className="h-3.5 w-3.5" />
                            Tokens
                        </Button>
                        <Button
                            variant={activeTab === "sandbox" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 gap-2 px-3 text-xs"
                            onClick={() => setActiveTab("sandbox")}
                        >
                            <Split className="h-3.5 w-3.5" />
                            Sandbox
                        </Button>
                        <Button
                            variant={activeTab === "history" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 gap-2 px-3 text-xs"
                            onClick={() => setActiveTab("history")}
                        >
                            <History className="h-3.5 w-3.5" />
                            History
                        </Button>
                        <Button
                            variant={activeTab === "governance" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 gap-2 px-3 text-xs"
                            onClick={() => setActiveTab("governance")}
                        >
                            <Shield className="h-3.5 w-3.5" />
                            Governance
                        </Button>
                        <Button
                            variant={activeTab === "copilot" ? "secondary" : "ghost"}
                            size="sm"
                            className="h-8 gap-2 px-3 text-xs"
                            onClick={() => setActiveTab("copilot")}
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            Copilot
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden p-6 gap-6">
                <ErrorBoundary variant="component">
                    {activeTab === "history" ? (
                        designSystemId ? (
                            <div className="w-full animate-in fade-in slide-in-from-left duration-300">
                                <VersionManager designSystemId={designSystemId} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                Save the design system to view version history
                            </div>
                        )
                    ) : activeTab === "sandbox" ? (
                        isLoadingTokens ? <SandboxSkeleton /> : (
                            <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <TokenCompareSandbox
                                    allTokens={tokens}
                                    brands={brands}
                                    onTokenClick={(path) => {
                                        const token = tokens.find(t => t.path === path);
                                        if (token) {
                                            setEditingToken(token);
                                            setActiveTab("tokens");
                                        }
                                    }}
                                />
                            </div>
                        )
                    ) : activeTab === "governance" ? (
                        designSystemId ? (
                            <div className="w-full h-full animate-in fade-in slide-in-from-right duration-500 overflow-y-auto pr-2">
                                <GovernanceDashboard
                                    tokens={tokens}
                                    designSystemId={designSystemId}
                                    onRestore={restoreToken}
                                    onPermanentDelete={permanentlyDeleteToken}
                                    onApplyAISuggestion={handleApplyAISuggestion}
                                    onApplyAllSuggestions={handleApplyAllSuggestions}
                                    onTokenClick={(path) => {
                                        const token = tokens.find(t => t.path === path);
                                        if (token) {
                                            setEditingToken(token);
                                            setActiveTab("tokens");
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                Save the design system to manage governance
                            </div>
                        )
                    ) : activeTab === "copilot" ? (
                        designSystemId ? (
                            <div className="w-full h-full animate-in fade-in slide-in-from-right duration-500 overflow-y-auto pr-2">
                                <SemanticCopilot
                                    designSystemId={designSystemId}
                                    tokens={tokens}
                                    onRefresh={() => { }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                Save the design system to use Copilot
                            </div>
                        )
                    ) : (
                        <>
                            <div className={`transition-all duration-300 flex flex-col gap-6 ${editingToken || isCreating ? 'w-1/2' : 'w-full'}`}>
                                <div className="flex items-center justify-between bg-card/10 p-2 rounded-lg border border-border/50">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-2">Visual Editors</span>
                                    <Button
                                        variant={showSpacingGrid ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-8 gap-2 text-xs"
                                        onClick={() => setShowSpacingGrid(!showSpacingGrid)}
                                    >
                                        <Layers className="h-3.5 w-3.5" />
                                        {showSpacingGrid ? "Hide Grid" : "Spacing Scale"}
                                    </Button>
                                </div>

                                {showSpacingGrid && (
                                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                        <SpacingGrid
                                            tokens={tokens
                                                .filter(t => t.type === 'spacing' || t.type === 'dimension')
                                                .map(t => ({ path: t.path, value: t.value as string }))
                                            }
                                            onSelect={(path: string) => {
                                                const token = tokens.find(t => t.path === path);
                                                if (token) setEditingToken(token);
                                            }}
                                        />
                                    </div>
                                )}

                                {isLoadingTokens ? (
                                    <TokenListSkeleton />
                                ) : (
                                    <TokenList
                                        tokens={localTokens}
                                        onEdit={setEditingToken}
                                        onDelete={handleDelete}
                                        onAdd={() => setIsCreating(true)}
                                        onReorder={handleReorder}
                                    />
                                )}
                            </div>

                            {(editingToken || isCreating) && (
                                <div className="w-1/2 animate-in slide-in-from-right duration-300">
                                    <TokenEditor
                                        token={editingToken || undefined}
                                        allTokens={tokens}
                                        onSave={handleSave}
                                        onCancel={() => {
                                            setEditingToken(null);
                                            setIsCreating(false);
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </ErrorBoundary>
            </div>
        </div>
    );
}
