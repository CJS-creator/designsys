import { Save, Download, Share2, Zap, Copy, ExternalLink, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Suspense, lazy, useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { VersionHistorySheet } from "@/components/VersionHistorySheet";
import { buildThemeUrl, isThemeUrlTooLong, MAX_THEME_URL_LENGTH } from "@/lib/themeUrl";

const ExportButton = lazy(() => import("@/components/ExportButton").then(m => ({ default: m.ExportButton })));

interface QuickActionsCardProps {
    designSystem: GeneratedDesignSystem;
    onSave: () => void | Promise<void>;
    onRestoreVersion?: (ds: GeneratedDesignSystem) => void;
}

export function QuickActionsCard({ designSystem, onSave, onRestoreVersion }: QuickActionsCardProps) {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [creatingLink, setCreatingLink] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [themeCopied, setThemeCopied] = useState(false);

    // Refs to prevent double-firing across re-renders / accidental double-clicks
    const saveInFlightRef = useRef(false);
    const shareInFlightRef = useRef(false);

    const handleSave = useCallback(async () => {
        if (saveInFlightRef.current) return;
        saveInFlightRef.current = true;
        setSaving(true);
        try {
            await onSave();
        } finally {
            saveInFlightRef.current = false;
            setSaving(false);
        }
    }, [onSave]);

    const openShareModal = useCallback(async () => {
        if (!designSystem.id) {
            toast.error("Save the design system first to share it");
            return;
        }
        // If we already have a URL cached for this id, just reopen
        if (shareUrl) {
            setShareOpen(true);
            return;
        }
        if (shareInFlightRef.current) return;
        shareInFlightRef.current = true;
        setCreatingLink(true);
        try {
            const { data, error } = await supabase
                .from("design_systems")
                .update({ is_public: true })
                .eq("id", designSystem.id)
                .select("share_id")
                .single();
            if (error) throw error;
            const sid = data?.share_id;
            if (!sid) throw new Error("Share link unavailable");
            const url = `${window.location.origin}/share/${sid}`;
            setShareUrl(url);
            setShareOpen(true);
        } catch (e) {
            toast.error("Failed to create share link", {
                description: e instanceof Error ? e.message : "Unknown error",
            });
        } finally {
            shareInFlightRef.current = false;
            setCreatingLink(false);
        }
    }, [designSystem.id, shareUrl]);

    const copyLink = useCallback(async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Could not copy link");
        }
    }, [shareUrl]);

    const copyThemeUrl = useCallback(async () => {
        if (isThemeUrlTooLong(designSystem)) {
            toast.error("This theme is too large for a URL", {
                description: "Use the public share link instead.",
            });
            return;
        }
        try {
            const url = buildThemeUrl(designSystem);
            await navigator.clipboard.writeText(url);
            setThemeCopied(true);
            toast.success("Theme URL copied", {
                description: "Anyone opening this link will load the exact design system.",
            });
            setTimeout(() => setThemeCopied(false), 2000);
        } catch {
            toast.error("Could not copy theme URL");
        }
    }, [designSystem]);

    return (
        <>
            <section
                aria-labelledby="quick-actions-title"
                className="p-6 rounded-2xl border border-border bg-card shadow-sm"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
                    <h3 id="quick-actions-title" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Quick Actions
                    </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        disabled={!user || saving}
                        className="justify-start font-semibold rounded-xl"
                        aria-label={user ? "Save design system" : "Sign in to save"}
                    >
                        <Save className="h-4 w-4 mr-2" aria-hidden="true" />
                        {saving ? "Saving…" : designSystem.id ? "Save changes" : "Save design"}
                    </Button>

                    <Suspense
                        fallback={
                            <Button variant="outline" size="sm" disabled className="justify-start font-semibold rounded-xl">
                                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                                Export
                            </Button>
                        }
                    >
                        <div className="[&>button]:w-full [&>button]:justify-start [&>button]:font-semibold [&>button]:rounded-xl">
                            <ExportButton designSystem={designSystem} />
                        </div>
                    </Suspense>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openShareModal}
                        disabled={creatingLink || !designSystem.id}
                        className="justify-start font-semibold rounded-xl"
                        aria-label="Open share dialog"
                    >
                        <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                        {creatingLink ? "Creating link…" : shareUrl ? "Share link" : "Share design"}
                    </Button>

                    {onRestoreVersion && (
                        <VersionHistorySheet
                            designSystem={designSystem}
                            onRestore={onRestoreVersion}
                            triggerClassName="justify-start font-semibold rounded-xl w-full"
                        />
                    )}
                </div>
                {!user && (
                    <p className="mt-3 text-[11px] text-muted-foreground">Sign in to save and share.</p>
                )}
            </section>

            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-primary" aria-hidden="true" />
                            Share this design system
                        </DialogTitle>
                        <DialogDescription>
                            Anyone with this link can view a read-only version of your system.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                        <Input
                            readOnly
                            value={shareUrl ?? ""}
                            onFocus={(e) => e.currentTarget.select()}
                            className="font-mono text-xs"
                            aria-label="Public share URL"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={copyLink}
                            aria-label="Copy share URL"
                        >
                            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={copyThemeUrl}
                        className="w-full justify-start rounded-xl"
                    >
                        {themeCopied ? <Check className="h-4 w-4 mr-2 text-primary" /> : <Link2 className="h-4 w-4 mr-2" />}
                        Copy theme URL (no account needed)
                    </Button>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={() => setShareOpen(false)}
                            className="rounded-xl"
                        >
                            Close
                        </Button>
                        <Button
                            type="button"
                            onClick={() => shareUrl && window.open(shareUrl, "_blank", "noopener,noreferrer")}
                            disabled={!shareUrl}
                            className="rounded-xl"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                            Open in new tab
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
