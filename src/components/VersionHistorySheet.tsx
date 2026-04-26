import { useEffect, useState, useCallback } from "react";
import { History, RotateCcw, Plus, Clock, GitCommit, AlertCircle, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import jsPDF from "jspdf";

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

interface ColorDiff { label: string; from: string; to: string }

function computeColorDiffs(a: VersionRow, b: VersionRow): ColorDiff[] {
    const sa = a.snapshot_data as unknown as GeneratedDesignSystem;
    const sb = b.snapshot_data as unknown as GeneratedDesignSystem;
    const diffs: ColorDiff[] = [];
    const colorsA = (sa?.colors ?? {}) as unknown as Record<string, unknown>;
    const colorsB = (sb?.colors ?? {}) as unknown as Record<string, unknown>;
    for (const k of Object.keys({ ...colorsA, ...colorsB })) {
        const va = colorsA[k];
        const vb = colorsB[k];
        if (typeof va === "string" && typeof vb === "string" && va !== vb) {
            diffs.push({ label: `colors.${k}`, from: va, to: vb });
        } else if (va !== vb && (typeof va === "string" || typeof vb === "string")) {
            diffs.push({ label: `colors.${k}`, from: typeof va === "string" ? va : "—", to: typeof vb === "string" ? vb : "—" });
        }
    }
    return diffs;
}

function downloadBlob(content: BlobPart, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportDiffJson(a: VersionRow, b: VersionRow, diffs: ColorDiff[]) {
    const payload = {
        generatedAt: new Date().toISOString(),
        from: { name: a.name, versionNumber: a.version_number, createdAt: a.created_at },
        to: { name: b.name, versionNumber: b.version_number, createdAt: b.created_at },
        summary: { colorChanges: diffs.length },
        diffs,
    };
    const filename = `diff-v${a.version_number}-to-v${b.version_number}.json`;
    downloadBlob(JSON.stringify(payload, null, 2), filename, "application/json");
    toast.success(`Downloaded ${filename}`);
}

function exportDiffPdf(a: VersionRow, b: VersionRow, diffs: ColorDiff[]) {
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const margin = 40;
    let y = margin;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("Version comparison", margin, y);
    y += 26;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(110);
    pdf.text(`Generated ${new Date().toLocaleString()}`, margin, y);
    y += 22;

    pdf.setTextColor(20);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(`From: ${a.name || `v${a.version_number}`} (v${a.version_number})`, margin, y); y += 14;
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(110);
    pdf.text(`Saved ${new Date(a.created_at).toLocaleString()}`, margin, y); y += 18;

    pdf.setTextColor(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(`To:   ${b.name || `v${b.version_number}`} (v${b.version_number})`, margin, y); y += 14;
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(110);
    pdf.text(`Saved ${new Date(b.created_at).toLocaleString()}`, margin, y); y += 24;

    pdf.setTextColor(20);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(`Color changes (${diffs.length})`, margin, y); y += 16;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    if (diffs.length === 0) {
        pdf.setTextColor(110);
        pdf.text("No color differences between these versions.", margin, y);
    } else {
        for (const d of diffs) {
            if (y > 780) { pdf.addPage(); y = margin; }
            const fromRgb = hexToRgb(d.from);
            const toRgb = hexToRgb(d.to);
            pdf.setTextColor(40);
            pdf.text(d.label, margin, y + 10);
            if (fromRgb) pdf.setFillColor(fromRgb.r, fromRgb.g, fromRgb.b); else pdf.setFillColor(220, 220, 220);
            pdf.rect(margin + 180, y, 16, 14, "F");
            pdf.setTextColor(110);
            pdf.text(d.from, margin + 202, y + 10);
            pdf.text("→", margin + 290, y + 10);
            if (toRgb) pdf.setFillColor(toRgb.r, toRgb.g, toRgb.b); else pdf.setFillColor(220, 220, 220);
            pdf.rect(margin + 308, y, 16, 14, "F");
            pdf.text(d.to, margin + 330, y + 10);
            y += 20;
        }
    }
    void pageW;
    const filename = `diff-v${a.version_number}-to-v${b.version_number}.pdf`;
    pdf.save(filename);
    toast.success(`Downloaded ${filename}`);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex || "").trim());
    if (!m) return null;
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function CompareSummary({ a, b }: { a: VersionRow; b: VersionRow }) {
    const diffs = computeColorDiffs(a, b);
    return (
        <div className="border-t mt-3 pt-3 max-h-56 overflow-y-auto">
            <div className="flex items-center justify-between mb-2 gap-2">
                <p className="text-xs font-semibold">
                    v{a.version_number} → v{b.version_number} · {diffs.length} color change{diffs.length === 1 ? "" : "s"}
                </p>
                <div className="flex items-center gap-1">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] rounded-lg"
                        onClick={() => exportDiffJson(a, b, diffs)}
                    >
                        <FileJson className="h-3 w-3 mr-1" /> JSON
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] rounded-lg"
                        onClick={() => exportDiffPdf(a, b, diffs)}
                    >
                        <FileText className="h-3 w-3 mr-1" /> PDF
                    </Button>
                </div>
            </div>
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
