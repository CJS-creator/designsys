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

/** Schema version for diff exports. Bump when the diff payload shape changes. */
const DIFF_SCHEMA_VERSION = "1.2.0";

type ChangeKind = "added" | "removed" | "changed";
type DiffCategory = "colors" | "typography" | "spacing" | "shadows" | "grid";
interface ColorDiff {
    label: string;
    category: DiffCategory;
    /** Old value, or null for added tokens. */
    from: string | null;
    /** New value, or null for removed tokens. */
    to: string | null;
    kind: ChangeKind;
}

/** Walk a nested object and return flat key→string-value pairs. */
function flatten(obj: unknown, prefix = ""): Record<string, string> {
    const out: Record<string, string> = {};
    if (obj === null || obj === undefined) return out;
    if (typeof obj !== "object") {
        out[prefix] = String(obj);
        return out;
    }
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        const key = prefix ? `${prefix}.${k}` : k;
        if (v !== null && typeof v === "object") {
            Object.assign(out, flatten(v, key));
        } else if (v !== undefined) {
            out[key] = String(v);
        }
    }
    return out;
}

function diffSection(category: DiffCategory, labelPrefix: string, a: unknown, b: unknown): ColorDiff[] {
    const fa = flatten(a);
    const fb = flatten(b);
    const keys = Array.from(new Set([...Object.keys(fa), ...Object.keys(fb)])).sort();
    const diffs: ColorDiff[] = [];
    for (const k of keys) {
        const va = fa[k];
        const vb = fb[k];
        const label = `${labelPrefix}.${k}`;
        if (va === undefined && vb !== undefined) {
            diffs.push({ category, label, from: null, to: vb, kind: "added" });
        } else if (va !== undefined && vb === undefined) {
            diffs.push({ category, label, from: va, to: null, kind: "removed" });
        } else if (va !== undefined && vb !== undefined && va !== vb) {
            diffs.push({ category, label, from: va, to: vb, kind: "changed" });
        }
    }
    return diffs;
}

function computeColorDiffs(a: VersionRow, b: VersionRow): ColorDiff[] {
    const sa = a.snapshot_data as unknown as GeneratedDesignSystem;
    const sb = b.snapshot_data as unknown as GeneratedDesignSystem;
    return [
        ...diffSection("colors", "colors", sa?.colors, sb?.colors),
        ...diffSection("typography", "typography", sa?.typography, sb?.typography),
        ...diffSection("spacing", "spacing", sa?.spacing, sb?.spacing),
        ...diffSection("shadows", "shadows", sa?.shadows, sb?.shadows),
        ...diffSection("grid", "grid", sa?.grid, sb?.grid),
    ];
}

function summarize(diffs: ColorDiff[]) {
    const byCategory: Record<DiffCategory, number> = { colors: 0, typography: 0, spacing: 0, shadows: 0, grid: 0 };
    for (const d of diffs) byCategory[d.category]++;
    return {
        total: diffs.length,
        added: diffs.filter((d) => d.kind === "added").length,
        removed: diffs.filter((d) => d.kind === "removed").length,
        changed: diffs.filter((d) => d.kind === "changed").length,
        byCategory,
    };
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
        schemaVersion: DIFF_SCHEMA_VERSION,
        kind: "design-system.color-diff",
        generatedAt: new Date().toISOString(),
        from: { name: a.name, versionNumber: a.version_number, createdAt: a.created_at },
        to: { name: b.name, versionNumber: b.version_number, createdAt: b.created_at },
        summary: summarize(diffs),
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
    pdf.text(`Generated ${new Date().toLocaleString()}  ·  Schema v${DIFF_SCHEMA_VERSION}`, margin, y);
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
    pdf.text(`Saved ${new Date(b.created_at).toLocaleString()}`, margin, y); y += 18;

    const s = summarize(diffs);
    pdf.setTextColor(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Summary: ${s.total} change${s.total === 1 ? "" : "s"} — ${s.added} added · ${s.removed} removed · ${s.changed} changed`, margin, y);
    y += 22;

    pdf.setTextColor(20);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(`Color tokens (${diffs.length})`, margin, y); y += 16;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    if (diffs.length === 0) {
        pdf.setTextColor(110);
        pdf.text("No color differences between these versions.", margin, y);
    } else {
        for (const d of diffs) {
            if (y > 780) { pdf.addPage(); y = margin; }
            pdf.setTextColor(40);
            // Tag column
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(7);
            const tagColor = d.kind === "added" ? [22, 130, 70] : d.kind === "removed" ? [180, 40, 40] : [80, 80, 160];
            pdf.setTextColor(tagColor[0], tagColor[1], tagColor[2]);
            pdf.text(d.kind.toUpperCase(), margin, y + 10);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(40);
            pdf.text(d.label, margin + 60, y + 10);

            const fromRgb = d.from ? hexToRgb(d.from) : null;
            const toRgb = d.to ? hexToRgb(d.to) : null;

            if (fromRgb) pdf.setFillColor(fromRgb.r, fromRgb.g, fromRgb.b); else pdf.setFillColor(245, 245, 245);
            pdf.setDrawColor(220);
            pdf.rect(margin + 220, y, 16, 14, fromRgb ? "F" : "FD");
            pdf.setTextColor(110);
            pdf.text(d.from ?? "—", margin + 242, y + 10);

            pdf.text("→", margin + 320, y + 10);

            if (toRgb) pdf.setFillColor(toRgb.r, toRgb.g, toRgb.b); else pdf.setFillColor(245, 245, 245);
            pdf.rect(margin + 338, y, 16, 14, toRgb ? "F" : "FD");
            pdf.text(d.to ?? "—", margin + 360, y + 10);
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
    const s = summarize(diffs);
    return (
        <div className="border-t mt-3 pt-3 max-h-56 overflow-y-auto">
            <div className="flex items-center justify-between mb-2 gap-2">
                <p className="text-xs font-semibold">
                    v{a.version_number} → v{b.version_number} · {s.total} change{s.total === 1 ? "" : "s"}
                    {s.total > 0 && (
                        <span className="ml-1 font-normal text-muted-foreground">
                            ({s.added} added · {s.removed} removed · {s.changed} changed)
                        </span>
                    )}
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
                            <Badge
                                variant="outline"
                                className={`text-[9px] px-1 py-0 h-4 ${
                                    d.kind === "added" ? "text-success border-success/40"
                                    : d.kind === "removed" ? "text-destructive border-destructive/40"
                                    : "text-muted-foreground"
                                }`}
                            >
                                {d.kind}
                            </Badge>
                            <span className="text-muted-foreground truncate w-28">{d.label}</span>
                            <span
                                className="w-3 h-3 rounded-sm border"
                                style={{ backgroundColor: d.from ?? "transparent" }}
                                title={d.from ?? "—"}
                            />
                            <span className="text-muted-foreground">→</span>
                            <span
                                className="w-3 h-3 rounded-sm border"
                                style={{ backgroundColor: d.to ?? "transparent" }}
                                title={d.to ?? "—"}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
