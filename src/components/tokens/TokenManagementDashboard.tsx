import { TokenList } from "./TokenList";
import { TokenEditor } from "./TokenEditor";
import { BrandSwitcher } from "../BrandSwitcher";
import { VersionManager } from "../VersionManager";
import { ComponentSandbox } from "./ComponentSandbox";
import { GovernanceDashboard } from "./GovernanceDashboard";
import { ExportButton } from "../ExportButton";
import { SemanticCopilot } from "./SemanticCopilot";
import { DesignToken } from "@/types/tokens";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Settings,
    Download,
    History,
    LayoutDashboard,
    Split,
    Shield,
    Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

import { useTokens } from "@/hooks/useTokens";
import { useBrands } from "@/hooks/useBrands";
import { useSearchParams } from "react-router-dom";
import { AISuggestion } from "@/lib/ai";

export function TokenManagementDashboard() {
    const [searchParams] = useSearchParams();
    const designSystemId = searchParams.get("id");
    const {
        tokens,
        loading,
        saveToken,
        deleteToken,
        restoreToken,
        permanentlyDeleteToken
    } = useTokens(designSystemId || undefined);
    const { brands } = useBrands(designSystemId || undefined);

    const [designSystem, setDesignSystem] = useState<GeneratedDesignSystem | null>(null);
    const [editingToken, setEditingToken] = useState<DesignToken | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<"tokens" | "history" | "sandbox" | "governance" | "copilot">("tokens");

    useEffect(() => {
        if (designSystemId) {
            fetchDesignSystem();
        }
    }, [designSystemId]);

    const fetchDesignSystem = async () => {
        const { data, error } = await supabase
            .from("design_systems")
            .select("*")
            .eq("id", designSystemId)
            .single();

        if (data && !error) {
            setDesignSystem(data.design_system_data as unknown as GeneratedDesignSystem);
        }
    };

    const handleSave = async (token: DesignToken) => {
        await saveToken(token);
        setEditingToken(null);
        setIsCreating(false);
    };

    const handleDelete = async (path: string) => {
        await deleteToken(path);
    };

    const handleApplyAISuggestion = async (suggestion: AISuggestion) => {
        try {
            if (suggestion.type === 'consolidate' || suggestion.type === 'new-token') {
                // 1. If it's a new token, create it (base for others)
                // We assume suggestion.value or the first token's value
                let baseTokenValue = suggestion.value;
                if (!baseTokenValue && suggestion.tokensToAlias && suggestion.tokensToAlias.length > 0) {
                    const firstToken = tokens.find(t => t.path === suggestion.tokensToAlias![0]);
                    baseTokenValue = firstToken?.value;
                }

                if (baseTokenValue) {
                    await saveToken({
                        name: suggestion.newName.split('.').pop() || suggestion.newName,
                        path: suggestion.newName,
                        type: 'color', // Default to color for now, AI should specify
                        value: baseTokenValue,
                        status: 'published'
                    });
                }

                // 2. Point all other tokens to this one
                if (suggestion.tokensToAlias) {
                    for (const path of suggestion.tokensToAlias) {
                        const token = tokens.find(t => t.path === path);
                        if (token) {
                            await saveToken({
                                ...token,
                                ref: `{${suggestion.newName}}`
                            });
                        }
                    }
                }
                toast.success(`Successfully applied AI suggestion: ${suggestion.newName}`);
            }
        } catch (error) {
            toast.error("Failed to apply AI suggestion");
        }
    };

    if (!designSystemId) {
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

    return (
        <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
            {/* Dashboard Header */}
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
                    {designSystemId && (
                        <BrandSwitcher designSystemId={designSystemId} />
                    )}
                    <div className="h-6 w-px bg-border/40 mx-2" />
                    {designSystem && (
                        <ExportButton designSystem={designSystem} tokens={tokens} />
                    )}
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

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden p-6 gap-6">
                {activeTab === "history" ? (
                    <div className="w-full animate-in fade-in slide-in-from-left duration-300">
                        <VersionManager designSystemId={designSystemId} />
                    </div>
                ) : activeTab === "sandbox" ? (
                    <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ComponentSandbox
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
                ) : activeTab === "governance" ? (
                    <div className="w-full h-full animate-in fade-in slide-in-from-right duration-500 overflow-y-auto pr-2">
                        <GovernanceDashboard
                            tokens={tokens}
                            onRestore={restoreToken}
                            onPermanentDelete={permanentlyDeleteToken}
                            onApplyAISuggestion={handleApplyAISuggestion}
                            onTokenClick={(path) => {
                                const token = tokens.find(t => t.path === path);
                                if (token) {
                                    setEditingToken(token);
                                    setActiveTab("tokens");
                                }
                            }}
                        />
                    </div>
                ) : activeTab === "copilot" ? (
                    <div className="w-full h-full animate-in fade-in slide-in-from-right duration-500 overflow-y-auto pr-2">
                        <SemanticCopilot
                            designSystemId={designSystemId!}
                            tokens={tokens}
                            brands={brands}
                            onRefresh={() => {
                                // Refresh logic - useTokens usually handles it but we can trigger it
                            }}
                        />
                    </div>
                ) : (
                    <>
                        {/* Token List Sidebar/Main (depending on scale) */}
                        <div className={`transition-all duration-300 ${editingToken || isCreating ? 'w-1/2' : 'w-full'}`}>
                            <TokenList
                                tokens={tokens.filter(t => t.status !== 'archived')}
                                onEdit={setEditingToken}
                                onDelete={handleDelete}
                                onAdd={() => setIsCreating(true)}
                            />
                        </div>

                        {/* Editor Side Panel */}
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
            </div>
        </div >
    );
}
