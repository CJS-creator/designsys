import { useEffect, useState, useCallback } from "react";
import { History, RotateCcw, Plus, Clock, GitCommit, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface VersionRow {
    id: string;
    version_number: number;
    name: string;
    description: string | null;
    created_at: string;
    snapshot_data: Json;
}

interface Props {
    designSystem: GeneratedDesignSystem;
    onRestore: (ds: GeneratedDesignSystem) => void;
    triggerClassName?: string;
}

export function VersionHistorySheet({ designSystem, onRestore, triggerClassName }: Props) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [versions, setVersions] = useState<VersionRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [snapshotting, setSnapshotting] = useState(false);
    const [comparing, setComparing] = useState<[VersionRow?, VersionRow?]>([]);

    const dsId = designSystem.id;

    const load = useCallback(async () => {
        if (!dsId) return;
        setLoading(true);
        const { data, error } = await supabase
            .from("design_system_versions")
            .select("id, version_number, name, description, created_at, snapshot_data")
            .eq("design_system_id", dsId)
            .order("version_number", { ascending: false });
        if (!error && data) setVersions(data as unknown as VersionRow[]);
        setLoading(false);
    }, [dsId]);

    useEffect(() => {
        if (open) load();
    }, [open, load]);

    const handleSaveSnapshot = async () => {
        if (!user || !dsId) return;
        setSnapshotting(true);
        try {
            const { data: latest } = await supabase
                .from("design_system_versions")
                .select("version_number")
                .eq("design_system_id", dsId)
                .order("version_number", { ascending: false })
                .limit(1)
                .maybeSingle();
            const next = (latest?.version_number ?? 0) + 1;
            const { error } = await supabase.from("design_system_versions").insert({
                design_system_id: dsId,
                version_number: next,
                name: `Manual snapshot v${next}`,
                description: `Saved on ${new Date().toLocaleString()}`,
                snapshot_data: designSystem as unknown as Json,
                created_by: user.id,
            });
            if (error) throw error;
            toast.success(`Snapshot v${next} saved`);
            load();
        } catch (e) {
            toast.error("Could not save snapshot", {
                description: e instanceof Error ? e.message : undefined,
            });
        } finally {
            setSnapshotting(false);
        }
    };

    const handleRestore = (v: VersionRow) => {
        try {
            const snap = v.snapshot_data as unknown as GeneratedDesignSystem;
            if (!snap || typeof snap !== "object" || !snap.colors) {
                toast.error("Snapshot is incompatible with current schema");
                return;
            }
            onRestore({ ...snap, id: dsId });
            toast.success(`Restored ${v.name || `v${v.version_number}`}`);
            setOpen(false);
        } catch {
            toast.error("Could not restore version");
        }
    };

    const toggleCompare = (v: VersionRow) => {
        setComparing((prev) => {
            const [a, b] = prev;
            if (a?.id === v.id) return [b, undefined];
            if (b?.id === v.id) return [a, undefined];
            if (!a) return [v, b];
            if (!b) return [a, v];
            return [v, undefined];
        });
    };

    const [cmpA, cmpB] = comparing;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!dsId}
                    className={triggerClassName ?? "justify-start font-semibold rounded-xl w-full"}
                    aria-label={dsId ? "Open version history" : "Save the design system first"}
                >
                    <History className="h-4 w-4 mr-2" aria-hidden="true" />
                    Version history
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <History className="h-4 w-4 text-primary" /> Version history
                    </SheetTitle>
                    <SheetDescription>
                        Save snapshots of your design system, compare them and revert when needed.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex items-center gap-2 mt-4">
                    <Button
                        size="sm"
                        onClick={handleSaveSnapshot}
                        disabled={!user || !dsId || snapshotting}
                        className="rounded-xl"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        {snapshotting ? "Saving…" : "Save snapshot"}
                    </Button>
                    {(cmpA || cmpB) && (
                        <Badge variant="outline" className="text-xs">
                            Comparing: {cmpA ? `v${cmpA.version_number}` : "?"} ↔ {cmpB ? `v${cmpB.version_number}` : "?"}
                        </Badge>
                    )}
                </div>

                {!user && (
                    <div className="mt-3 p-3 rounded-lg border border-warning/30 bg-warning/10 text-xs text-warning flex gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" /> Sign in to save snapshots.
                    </div>
                )}

                <ScrollArea className="flex-1 mt-4 -mx-6 px-6">
                    {loading ? (
                        <div className="text-center text-sm text-muted-foreground py-10">Loading…</div>
                    ) : versions.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground py-10">
                            No versions yet. Save a snapshot to get started.
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {versions.map((v) => {
                                const isCmp = cmpA?.id === v.id || cmpB?.id === v.id;
                                return (
                                    <li
                                        key={v.id}
                                        className={`p-3 rounded-xl border ${isCmp ? "border-primary bg-primary/5" : "border-border bg-card"} transition-colors`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <GitCommit className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="font-semibold text-sm truncate">
                                                        {v.name || `Version ${v.version_number}`}
                                                    </span>
                                                    <Badge variant="secondary" className="font-mono text-[10px]">v{v.version_number}</Badge>
                                                </div>
                                                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(v.created_at).toLocaleString()}
                                                </div>
                                                {v.description && (
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{v.description}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1 shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-xs rounded-lg"
                                                    onClick={() => handleRestore(v)}
                                                >
                                                    <RotateCcw className="h-3 w-3 mr-1" /> Restore
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={isCmp ? "default" : "ghost"}
                                                    className="h-7 text-xs rounded-lg"
                                                    onClick={() => toggleCompare(v)}
                                                >
                                                    {isCmp ? "Selected" : "Compare"}
                                                </Button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </ScrollArea>

                {cmpA && cmpB && (
                    <CompareSummary a={cmpA} b={cmpB} />
                )}
            </SheetContent>
        </Sheet>
    );
}

function CompareSummary({ a, b }: { a: VersionRow; b: VersionRow }) {
    const sa = a.snapshot_data as unknown as GeneratedDesignSystem;
    const sb = b.snapshot_data as unknown as GeneratedDesignSystem;
    const diffs: { label: string; from: string; to: string }[] = [];
    const colorsA = (sa?.colors ?? {}) as unknown as Record<string, unknown>;
    const colorsB = (sb?.colors ?? {}) as unknown as Record<string, unknown>;
    for (const k of Object.keys({ ...colorsA, ...colorsB })) {
        const va = colorsA[k];
        const vb = colorsB[k];
        if (typeof va === "string" && typeof vb === "string" && va !== vb) {
            diffs.push({ label: `colors.${k}`, from: va, to: vb });
        }
    }
    return (
        <div className="border-t mt-3 pt-3 max-h-40 overflow-y-auto">
            <p className="text-xs font-semibold mb-2">
                v{a.version_number} → v{b.version_number} · {diffs.length} color change{diffs.length === 1 ? "" : "s"}
            </p>
            {diffs.length === 0 ? (
                <p className="text-xs text-muted-foreground">No color differences.</p>
            ) : (
                <ul className="space-y-1 text-[11px] font-mono">
                    {diffs.slice(0, 12).map((d) => (
                        <li key={d.label} className="flex items-center gap-2">
                            <span className="text-muted-foreground truncate w-32">{d.label}</span>
                            <span
                                className="w-3 h-3 rounded-sm border"
                                style={{ backgroundColor: d.from }}
                                title={d.from}
                            />
                            <span className="text-muted-foreground">→</span>
                            <span
                                className="w-3 h-3 rounded-sm border"
                                style={{ backgroundColor: d.to }}
                                title={d.to}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
