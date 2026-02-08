import { useState, useMemo } from "react";
import { DesignToken } from "@/types/tokens";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    AlertTriangle,
    Activity,
    Link as LinkIcon,
    FileWarning,
    RefreshCw,
    CheckCircle2,
    Sparkles,
    Check,
    FileDiff,
    ClipboardList
} from "lucide-react";
import { ApprovalQueue } from "./governance/ApprovalQueue";
import { ApprovalRequest } from "./governance/ApprovalRequest";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { runAICopilot, AISuggestion } from "@/lib/ai";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditLogViewer } from "../AuditLogViewer";

// Helper function to check if a value is a valid color
function isValidColor(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    // Check for hex, rgb, rgba, hsl, hsla, or named colors
    const colorPatterns = [
        /^#([0-9A-Fa-f]{3}){1,2}$/,
        /^#([0-9A-Fa-f]{4}){1,2}$/,
        /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
        /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/,
        /^hsl\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*\)$/,
        /^hsla\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*,\s*[\d.]+\s*\)$/
    ];
    return colorPatterns.some(pattern => pattern.test(value));
}

interface GovernanceDashboardProps {
    tokens: DesignToken[];
    designSystemId: string;
    onTokenClick: (path: string) => void;
    onRestore: (path: string) => void;
    onPermanentDelete: (path: string) => void;
    onApplyAISuggestion?: (suggestion: AISuggestion) => void;
    onApplyAllSuggestions?: (suggestions: AISuggestion[]) => void;
}

export function GovernanceDashboard({
    tokens,
    designSystemId,
    onTokenClick,
    onRestore,
    onPermanentDelete,
    onApplyAISuggestion,
    onApplyAllSuggestions
}: GovernanceDashboardProps) {
    const [isAuditing, setIsAuditing] = useState(false);
    const [tokenToDelete, setTokenToDelete] = useState<string | null>(null);
    const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
    const [isApprovalRequestOpen, setIsApprovalRequestOpen] = useState(false);

    // Identify Changed Tokens (Drafts)
    const changedTokens = useMemo(() => {
        return tokens.filter(t => t.syncStatus === 'changed' || (t.publishedValue === undefined && t.value !== undefined));
    }, [tokens]);

    // 1. Identify Unused Tokens (Tokens not referenced by any other token)
    // Note: In a real app, we'd also check if they are used in components, but here we check internal refs.
    const unusedTokens = useMemo(() => {
        const referencedPaths = new Set<string>();
        tokens.forEach(t => {
            if (t.ref) {
                referencedPaths.add(t.ref.replace(/[{}]/g, ''));
            }
        });

        return tokens.filter(t => !referencedPaths.has(t.path));
    }, [tokens]);

    // 2. Identify Duplicate Values
    const duplicates = useMemo(() => {
        const valueMap = new Map<string, string[]>();
        tokens.forEach(t => {
            if (t.ref) return; // Skip aliases
            const valStr = JSON.stringify(t.value);
            if (!valueMap.has(valStr)) {
                valueMap.set(valStr, []);
            }
            valueMap.get(valStr)!.push(t.path);
        });

        const result: { value: any, paths: string[] }[] = [];
        valueMap.forEach((paths, value) => {
            if (paths.length > 1) {
                result.push({ value: JSON.parse(value), paths });
            }
        });
        return result;
    }, [tokens]);

    // 3. Health Score Calculation
    const healthScore = useMemo(() => {
        if (tokens.length === 0) return 100;
        const duplicatePenalty = duplicates.length * 5;
        const unusedPenalty = (unusedTokens.length / tokens.length) * 20;
        return Math.max(0, Math.min(100, 100 - duplicatePenalty - unusedPenalty)).toFixed(0);
    }, [tokens, duplicates, unusedTokens]);

    const handleAIAudit = async () => {
        setIsAuditing(true);
        try {
            // Only send relevant data for audit to save tokens/tokens
            const auditData = tokens.map(t => ({
                path: t.path,
                value: t.value,
                type: t.type,
                name: t.name
            }));

            const result = await runAICopilot('audit', auditData);
            if (result && result.suggestions) {
                setAiSuggestions(result.suggestions);
                toast.success("AI Audit complete!");
            }
        } catch (error) {
            toast.error("Failed to run AI Audit");
        } finally {
            setIsAuditing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Health Score Card */}
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            <Activity className="h-4 w-4" /> Health Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-black">{healthScore}%</span>
                            <Badge variant="outline" className="mb-2 bg-background border-primary/20">
                                {Number(healthScore) > 80 ? 'EXCELLENT' : Number(healthScore) > 50 ? 'GOOD' : 'POOR'}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">
                            Based on duplicate values and internal referencing
                        </p>
                    </CardContent>
                </Card>

                {/* Unpublished Changes Status */}
                <Card className={changedTokens.length > 0 ? "border-primary/50 bg-primary/5 shadow-sm" : ""}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            <FileDiff className="h-4 w-4" /> Unpublished Changes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-black">{changedTokens.length}</span>
                            <span className="text-xs text-muted-foreground mb-2 font-medium bg-background px-2 py-0.5 rounded border">
                                DRAFT STATE
                            </span>
                        </div>
                        <Button
                            className="w-full mt-4 gap-2 font-bold"
                            disabled={changedTokens.length === 0}
                            onClick={() => setIsApprovalRequestOpen(true)}
                        >
                            <ClipboardList className="h-4 w-4" />
                            Request Approval
                        </Button>
                    </CardContent>
                </Card>

                {/* Duplicates Status */}
                <Card className={duplicates.length > 0 ? "border-yellow-500/20 bg-yellow-500/5" : ""}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle className={`h-4 w-4 ${duplicates.length > 0 ? "text-yellow-500" : "text-green-500"}`} />
                            Duplicates
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{duplicates.length}</div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                            Value groups that should be aliased
                        </p>
                    </CardContent>
                </Card>

                {/* Unused Tokens Status */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Orphan Tokens
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-bold">{unusedTokens.length}</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                                Tokens not referenced
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2 font-bold h-9"
                            onClick={handleAIAudit}
                            disabled={isAuditing}
                        >
                            {isAuditing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            AI Audit
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* AI Suggestions Section */}
            {(isAuditing || aiSuggestions.length > 0) && (
                <Card className="border-primary/20 bg-primary/5 animate-in slide-in-from-top duration-500">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    AI Architect Suggestions
                                </CardTitle>
                                <CardDescription>Intelligent recommendations for token consolidation and naming.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 font-bold gap-2"
                                    onClick={() => onApplyAllSuggestions?.(aiSuggestions)}
                                    disabled={aiSuggestions.length === 0}
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Apply All
                                </Button>
                                <Badge variant="secondary" className="bg-primary text-primary-foreground hidden sm:flex">BETA</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isAuditing ? (
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {aiSuggestions.map((s, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-background border border-primary/10 flex flex-col gap-3 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Badge className="text-[10px] uppercase mb-1">{s.type}</Badge>
                                                <p className="text-sm font-bold leading-tight">{s.newName}</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 text-[10px] font-bold gap-1 bg-primary/5 border-primary/20 hover:bg-primary/10"
                                                onClick={() => onApplyAISuggestion?.(s)}
                                            >
                                                <Check className="h-3 w-3" /> Apply
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground italic">"{s.reason}"</p>
                                        {s.tokensToAlias && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {s.tokensToAlias.map(t => (
                                                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-muted border font-mono">{t}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <ApprovalQueue designSystemId={designSystemId} />
            <ApprovalRequest
                designSystemId={designSystemId}
                changedTokens={changedTokens}
                open={isApprovalRequestOpen}
                onOpenChange={setIsApprovalRequestOpen}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detailed Duplicate Report */}
                <Card className="flex flex-col max-h-[500px]">
                    <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <FileWarning className="h-4 w-4 text-yellow-500" />
                            Redundancy Report
                        </CardTitle>
                        <CardDescription>Tokens sharing identical values (candidates for aliasing)</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-hidden">
                        <ScrollArea className="h-[350px] px-6">
                            <div className="space-y-4 pb-6">
                                {duplicates.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground">
                                        <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-20 text-green-500" />
                                        <p>No duplicate values found!</p>
                                    </div>
                                ) : (
                                    duplicates.map((dup, i) => (
                                        <div key={i} className="p-3 rounded-lg border bg-muted/30 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded border" style={{ backgroundColor: isValidColor(dup.value) ? dup.value : 'transparent' }} />
                                                    <code className="text-xs font-mono">{JSON.stringify(dup.value)}</code>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 text-[10px] font-bold gap-1 text-primary hover:text-primary hover:bg-primary/10"
                                                        onClick={() => {
                                                            const newName = dup.paths[0].split('.').slice(0, -1).join('.') + '.consolidated';
                                                            onApplyAISuggestion?.({
                                                                type: 'consolidate',
                                                                newName: newName,
                                                                tokensToAlias: dup.paths,
                                                                reason: "Consolidated identical values into a single source",
                                                                value: dup.value
                                                            });
                                                        }}
                                                    >
                                                        <Sparkles className="h-3 w-3" /> Consolidate
                                                    </Button>
                                                    <Badge variant="outline" className="text-[10px]">{dup.paths.length} tokens</Badge>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {dup.paths.map(path => (
                                                    <button
                                                        key={path}
                                                        onClick={() => onTokenClick(path)}
                                                        className="text-[9px] px-1.5 py-0.5 rounded bg-background border hover:border-primary transition-colors font-mono"
                                                    >
                                                        {path}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Internal Usage Tree / Reachability */}
                <Card className="flex flex-col max-h-[500px]">
                    <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <LinkIcon className="h-4 w-4 text-primary" />
                            Token Hierarchy Depth
                        </CardTitle>
                        <CardDescription>Deeply nested alias chains and dependency levels</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-hidden">
                        <ScrollArea className="h-[350px] px-6">
                            <div className="space-y-3 pb-6">
                                {tokens.filter(t => t.ref).sort((a, b) => (b.ref?.length || 0) - (a.ref?.length || 0)).slice(0, 10).map(t => (
                                    <div key={t.path} className="flex items-center justify-between p-2 rounded border bg-card/50">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate">{t.name}</p>
                                            <p className="text-[10px] text-muted-foreground truncate font-mono">{t.path}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] text-muted-foreground">→</span>
                                            <code className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 font-mono">
                                                {t.ref?.replace(/[{}]/g, '')}
                                            </code>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Trash / Archived Tokens Section */}
            <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <FileWarning className="h-4 w-4 text-destructive" />
                        Archived Tokens (Trash)
                    </CardTitle>
                    <CardDescription>Soft-deleted tokens that can be restored or permanently removed</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tokens.filter(t => t.status === 'archived').length === 0 ? (
                            <div className="col-span-full py-8 text-center text-muted-foreground italic text-xs">
                                Trash is empty.
                            </div>
                        ) : (
                            tokens.filter(t => t.status === 'archived').map(t => (
                                <div key={t.path} className="p-3 rounded-lg border bg-background flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold truncate">{t.name}</p>
                                            <p className="text-[10px] text-muted-foreground truncate font-mono">{t.path}</p>
                                        </div>
                                        <Badge variant="outline" className="text-[8px] uppercase">{t.type}</Badge>
                                    </div>
                                    <div className="flex gap-2 mt-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-[10px] flex-1 font-bold"
                                            onClick={() => onRestore(t.path)}
                                        >
                                            <RefreshCw className="h-3 w-3 mr-1" /> Restore
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="h-7 text-[10px] flex-1 font-bold"
                                            onClick={() => setTokenToDelete(t.path)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <AuditLogViewer designSystemId={designSystemId} />

            <AlertDialog open={!!tokenToDelete} onOpenChange={(open) => !open && setTokenToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the token
                            <span className="font-mono font-bold mx-1">{tokenToDelete}</span>
                            from the design system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (tokenToDelete) onPermanentDelete(tokenToDelete);
                                setTokenToDelete(null);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete Permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
