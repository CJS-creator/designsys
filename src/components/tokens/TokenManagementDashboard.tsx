import { TokenList } from "./TokenList";
import { TokenEditor } from "./TokenEditor";
import { VersionManager } from "../VersionManager";
import { DesignToken } from "@/types/tokens";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Settings,
    Download,
    History,
    LayoutDashboard
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react"; // Added useState import

import { useTokens } from "@/hooks/useTokens";
import { useSearchParams } from "react-router-dom";

export function TokenManagementDashboard() {
    const [searchParams] = useSearchParams();
    const designSystemId = searchParams.get("id");
    const { tokens, loading, saveToken, deleteToken } = useTokens(designSystemId || undefined);
    const [editingToken, setEditingToken] = useState<DesignToken | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleSave = async (token: DesignToken) => {
        await saveToken(token);
        setEditingToken(null);
        setIsCreating(false);
    };

    const handleDelete = async (path: string) => {
        await deleteToken(path);
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
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button
                        variant={showHistory ? "secondary" : "outline"}
                        size="sm"
                        className="gap-2"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        <History className="h-4 w-4" />
                        History
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden p-6 gap-6">
                {showHistory ? (
                    <div className="w-full animate-in fade-in slide-in-from-left duration-300">
                        <VersionManager designSystemId={designSystemId} />
                    </div>
                ) : (
                    <>
                        {/* Token List Sidebar/Main (depending on scale) */}
                        <div className={`transition-all duration-300 ${editingToken || isCreating ? 'w-1/2' : 'w-full'}`}>
                            <TokenList
                                tokens={tokens}
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
        </div>
    );
}
