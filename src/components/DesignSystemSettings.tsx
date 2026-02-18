import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Copy, Check, Shield, Lock, ExternalLink, Trash2, Code2, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CustomExporterEditor } from "./exporters/CustomExporterEditor";
import { useTokens } from "@/hooks/useTokens";
import { APIKeys } from "./settings/APIKeys";
import { Key } from "lucide-react";

interface DesignSystemSettingsProps {
    designSystemId: string;
}

export function DesignSystemSettings({ designSystemId }: DesignSystemSettingsProps) {
    const [isPublic, setIsPublic] = useState(false);
    const [shareId, setShareId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const { tokens } = useTokens(designSystemId);

    useEffect(() => {
        const fetchSettings = async () => {
            // Note: is_public and share_id columns may not exist yet in the database
            // Using design_system_data as a workaround to store sharing settings
            const { data } = await supabase
                .from("design_systems")
                .select("design_system_data")
                .eq("id", designSystemId)
                .single();

            if (data?.design_system_data) {
                const dsData = data.design_system_data as Record<string, unknown>;
                setIsPublic(!!dsData.is_public);
                setShareId((dsData.share_id as string) || null);
            }
            setIsLoading(false);
        };

        if (designSystemId) fetchSettings();
    }, [designSystemId]);

    const handleTogglePublic = async (checked: boolean) => {
        setIsSaving(true);
        try {
            const newShareId = checked && !shareId ? crypto.randomUUID() : shareId;

            // First get current design_system_data
            const { data: currentData } = await supabase
                .from("design_systems")
                .select("design_system_data")
                .eq("id", designSystemId)
                .single();

            const currentDsData = (currentData?.design_system_data as Record<string, unknown>) || {};

            // Update with sharing settings stored in design_system_data
            const { error: updateError } = await supabase
                .from("design_systems")
                .update({
                    design_system_data: {
                        ...currentDsData,
                        is_public: checked,
                        share_id: checked ? newShareId : shareId
                    }
                })
                .eq("id", designSystemId);

            if (updateError) throw updateError;

            setIsPublic(checked);
            if (checked) setShareId(newShareId);

            toast.success(checked ? "Documentation is now public!" : "Documentation is now private.");
        } catch (err) {
            console.error("Failed to update sharing settings:", err);
            toast.error("Failed to update sharing settings");
        } finally {
            setIsSaving(false);
        }
    };

    const copyUrl = () => {
        if (!shareId) return;
        const url = `${window.location.origin}/docs/${shareId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Public URL copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <Tabs defaultValue="sharing" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
                    <TabsTrigger value="sharing" className="gap-2">
                        <Share2 className="h-4 w-4" /> Sharing & Distribution
                    </TabsTrigger>
                    <TabsTrigger value="exporters" className="gap-2">
                        <Code2 className="h-4 w-4" /> Custom Exporters
                    </TabsTrigger>
                    <TabsTrigger value="api" className="gap-2">
                        <Key className="h-4 w-4" /> API Access
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="api" className="animate-in fade-in duration-500">
                    <APIKeys />
                </TabsContent>

                <TabsContent value="sharing" className="space-y-6 animate-in fade-in duration-500">
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Hosted Documentation
                            </CardTitle>
                            <CardDescription>
                                Publish your design system as a hosted documentation portal for clients and developers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl border bg-background">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Public Access</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Anyone with the link can view tokens and component previews.
                                    </p>
                                </div>
                                <Switch
                                    checked={isPublic}
                                    onCheckedChange={handleTogglePublic}
                                    disabled={isSaving}
                                />
                            </div>

                            {isPublic && shareId && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase text-muted-foreground">Public URL</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                readOnly
                                                value={`${window.location.origin}/docs/${shareId}`}
                                                className="font-mono text-xs bg-muted/30"
                                            />
                                            <Button variant="outline" size="icon" onClick={copyUrl} aria-label="Copy public URL">
                                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                            <Button variant="secondary" size="icon" asChild aria-label="Open public documentation">
                                                <a href={`/docs/${shareId}`} target="_blank" rel="noreferrer">
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex gap-3 text-xs text-yellow-600">
                                        <Shield className="h-4 w-4 shrink-0" />
                                        <p>
                                            <strong>Pro Tip:</strong> Only tokens with the status "Published" will be visible to external viewers to protect your work-in-progress.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!isPublic && (
                                <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/20 opacity-60">
                                    <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                                    <p className="text-sm font-medium">Your documentation is currently private.</p>
                                    <p className="text-xs text-muted-foreground mt-1">Enable "Public Access" to generate a shareable link.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-red-500/20">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold text-red-600 flex items-center gap-2">
                                <Trash2 className="h-4 w-4" /> Danger Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="font-bold opacity-50 cursor-not-allowed" disabled>
                                Delete Design System
                            </Button>
                            <p className="text-[10px] text-muted-foreground mt-2">
                                System deletion is disabled for demo purposes.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="exporters" className="animate-in fade-in duration-500">
                    <CustomExporterEditor designSystemId={designSystemId} tokens={tokens} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
