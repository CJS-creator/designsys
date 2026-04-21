import { Save, Download, Share2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Suspense, lazy, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ExportButton = lazy(() => import("@/components/ExportButton").then(m => ({ default: m.ExportButton })));

interface QuickActionsCardProps {
    designSystem: GeneratedDesignSystem;
    onSave: () => void;
}

export function QuickActionsCard({ designSystem, onSave }: QuickActionsCardProps) {
    const { user } = useAuth();
    const [sharing, setSharing] = useState(false);

    const handleShare = async () => {
        if (!designSystem.id) {
            toast.error("Save the design system first to share it");
            return;
        }
        setSharing(true);
        try {
            // Ensure share_id exists & is_public is true
            const { data, error } = await supabase
                .from("design_systems")
                .update({ is_public: true })
                .eq("id", designSystem.id)
                .select("share_id")
                .single();

            if (error) throw error;
            const shareId = data?.share_id;
            if (!shareId) throw new Error("Share link unavailable");

            const url = `${window.location.origin}/share/${shareId}`;
            await navigator.clipboard.writeText(url);
            toast.success("Share link copied to clipboard!", { description: url });
        } catch (e) {
            toast.error("Failed to create share link", {
                description: e instanceof Error ? e.message : "Unknown error",
            });
        } finally {
            setSharing(false);
        }
    };

    return (
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
                    onClick={onSave}
                    disabled={!user}
                    className="justify-start font-semibold rounded-xl"
                    aria-label={user ? "Save design system" : "Sign in to save"}
                >
                    <Save className="h-4 w-4 mr-2" aria-hidden="true" />
                    {designSystem.id ? "Save changes" : "Save design"}
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
                    onClick={handleShare}
                    disabled={sharing || !designSystem.id}
                    className="justify-start font-semibold rounded-xl"
                    aria-label="Copy public share link"
                >
                    <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    {sharing ? "Creating link…" : "Share link"}
                </Button>
            </div>
            {!user && (
                <p className="mt-3 text-[11px] text-muted-foreground">Sign in to save and share.</p>
            )}
        </section>
    );
}
