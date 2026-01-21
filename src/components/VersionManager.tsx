import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    History,
    GitCommit,
    Plus,
    CheckCircle2,
    Clock,
    ChevronRight,
    ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DesignVersion {
    id: string;
    version_number: string;
    name: string;
    description: string;
    is_published: boolean;
    published_at: string;
    snapshot: any;
    created_at: string;
}

export function VersionManager({ designSystemId }: { designSystemId: string }) {
    const [versions, setVersions] = useState<DesignVersion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [newVersion, setNewVersion] = useState({
        number: "1.0.0",
        name: "",
        description: ""
    });

    const fetchVersions = async () => {
        if (!designSystemId) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("design_system_versions" as any)
                .select("*")
                .eq("design_system_id", designSystemId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setVersions((data as any) || []);
        } catch (error) {
            console.error("Error fetching versions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!designSystemId) return;
        setIsPublishing(true);
        try {
            // 1. Fetch current tokens for the snapshot
            const { data: tokens, error: tokenError } = await supabase
                .from("design_tokens" as any)
                .select("*")
                .eq("design_system_id", designSystemId);

            if (tokenError) throw tokenError;

            // 2. Create version record
            const { error: versionError } = await supabase
                .from("design_system_versions" as any)
                .insert({
                    design_system_id: designSystemId,
                    version_number: newVersion.number,
                    name: newVersion.name,
                    description: newVersion.description,
                    is_published: true,
                    published_at: new Date().toISOString(),
                    snapshot: tokens, // Store the tokens array as the snapshot
                });

            if (versionError) throw versionError;

            toast.success(`Version ${newVersion.number} published!`);
            fetchVersions();
        } catch (error: any) {
            toast.error("Failed to publish version: " + error.message);
        } finally {
            setIsPublishing(false);
        }
    };

    useEffect(() => {
        fetchVersions();
    }, [designSystemId]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <History className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Version History</h2>
                        <p className="text-xs text-muted-foreground font-medium">Track and restore previous design system states</p>
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2 shadow-lg shadow-primary/20">
                            <Plus className="h-4 w-4" />
                            Publish New Version
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-primary/20">
                        <DialogHeader>
                            <DialogTitle>Publish New Version</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Version Number (SemVer)</label>
                                <Input
                                    value={newVersion.number}
                                    onChange={(e) => setNewVersion({ ...newVersion, number: e.target.value })}
                                    placeholder="e.g. 1.1.0"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Version Name</label>
                                <Input
                                    value={newVersion.name}
                                    onChange={(e) => setNewVersion({ ...newVersion, name: e.target.value })}
                                    placeholder="e.g. Q1 Design Update"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Release Notes</label>
                                <Textarea
                                    value={newVersion.description}
                                    onChange={(e) => setNewVersion({ ...newVersion, description: e.target.value })}
                                    placeholder="What changed in this version?"
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="w-full"
                            >
                                {isPublishing ? "Publishing..." : "Confirm Release"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <ScrollArea className="h-[500px] rounded-xl border border-border/50 bg-card/50">
                <div className="p-4 space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-muted-foreground">Loading versions...</div>
                    ) : versions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">No versions published yet.</div>
                    ) : (
                        versions.map((version) => (
                            <Card key={version.id} className="relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
                                                <GitCommit className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">{version.name || `Version ${version.version_number}`}</h3>
                                                    <Badge variant="secondary" className="font-mono text-[10px]">{version.version_number}</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(version.published_at).toLocaleDateString()} at {new Date(version.published_at).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    {version.description && (
                                        <p className="text-sm text-muted-foreground mt-4 pl-12 line-clamp-2 italic">
                                            "{version.description}"
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
