import { useState, useEffect } from "react";
import { monitor } from "@/lib/monitoring";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout, Copy, Check, RefreshCw, Link as LinkIcon, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface FigmaSyncProps {
    designSystemId?: string;
}

interface FigmaConnection {
    id: string;
    access_token: string;
    last_sync_at: string | null;
    sync_status: string;
    figma_token?: string;
    figma_file_key?: string;
}

export const FigmaSync = ({ designSystemId }: FigmaSyncProps) => {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [connection, setConnection] = useState<FigmaConnection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRotating, setIsRotating] = useState(false);

    const figmaPluginUrl = "https://designforge.me/figma-plugin";
    const bridgeUrl = `${window.location.origin}/api/tokens/${designSystemId || "default"}`;

    const fetchConnection = async () => {
        if (!designSystemId) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("figma_connections" as any)
                .select("*")
                .eq("design_system_id", designSystemId)
                .maybeSingle();

            if (error) throw error;
            if (data) {
                setConnection(data as unknown as FigmaConnection);
            } else if (user) {
                // Initialize a token if none exists
                const newToken = `df_${Math.random().toString(36).substring(2, 15)}`;
                const { data: created, error: createError } = await supabase
                    .from("figma_connections" as any)
                    .insert({
                        design_system_id: designSystemId,
                        user_id: user.id,
                        access_token: newToken,
                        sync_status: 'idle'
                    })
                    .select()
                    .single();

                if (createError) throw createError;
                setConnection(created as unknown as FigmaConnection);
            }
        } catch (error) {
            monitor.error("Error fetching figma connection", error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRotateToken = async () => {
        if (!designSystemId || !user || !connection) return;
        setIsRotating(true);
        const newToken = `df_${Math.random().toString(36).substring(2, 15)}`;

        try {
            const { error } = await supabase
                .from("figma_connections" as any)
                .update({ access_token: newToken })
                .eq("design_system_id", designSystemId);

            if (error) throw error;
            setConnection({ ...connection, access_token: newToken });
            toast.success("Token rotated successfully");
        } catch (error: any) {
            toast.error("Failed to rotate token: " + error.message);
        } finally {
            setIsRotating(false);
        }
    };

    useEffect(() => {
        fetchConnection();
    }, [designSystemId]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Initializing Figma bridge...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Layout className="h-6 w-6 text-primary" />
                                Figma Sync Bridge
                            </CardTitle>
                            <CardDescription>
                                Connect your design system to Figma for live token syncing.
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <a href={figmaPluginUrl} target="_blank" rel="noopener noreferrer">
                                Get Figma Plugin
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="bridge-url">Bridge API URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="bridge-url"
                                    value={bridgeUrl}
                                    readOnly
                                    className="bg-muted/30 font-mono text-xs"
                                />
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bridgeUrl)} aria-label="Copy Bridge URL">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <LinkIcon className="h-3 w-3" />
                                Use this URL in the DesignForge Figma Plugin.
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sync-token">Access Token</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="sync-token"
                                    value={connection?.access_token || ""}
                                    readOnly
                                    type="password"
                                    className="bg-muted/30 font-mono text-xs"
                                />
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(connection?.access_token || "")} aria-label="Copy Access Token">
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3 text-primary" />
                                This token grants read-only access to your design system tokens.
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className={cn("h-2 w-2 rounded-full", connection?.sync_status === 'idle' ? 'bg-green-500 animate-pulse' : 'bg-blue-500')} />
                                <span className="text-xs font-medium">Bridge {connection?.sync_status === 'idle' ? 'Active' : 'Connected'}</span>
                            </div>
                            {connection?.last_sync_at && (
                                <div className="text-[10px] text-muted-foreground italic">
                                    Last synced: {new Date(connection.last_sync_at).toLocaleString()}
                                </div>
                            )}
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs gap-2" onClick={handleRotateToken} disabled={isRotating}>
                            <RefreshCw className={cn("h-3 w-3", isRotating && "animate-spin")} />
                            Rotate Token
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="pt-6 space-y-2">
                        <h5 className="font-semibold text-sm">How it works</h5>
                        <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Install the DesignForge plugin in Figma</li>
                            <li>Enter your Bridge API URL and Token</li>
                            <li>Whenever you update tokens here, click "Sync" in Figma</li>
                        </ol>
                    </CardContent>
                </Card>

                <Card className="bg-muted/20 border-border/50">
                    <CardContent className="pt-6 space-y-2">
                        <h5 className="font-semibold text-sm">Upcoming: Auto-Push</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            We are working on a background worker that will automatically push changes to Figma whenever you save a version in DesignForge.
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Card className="glass-card mt-6">
                <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Figma Account Connection
                    </CardTitle>
                    <CardDescription>
                        Connect your Figma account to import variables directly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="figma-pat">Personal Access Token</Label>
                        <Input
                            id="figma-pat"
                            type="password"
                            placeholder="figd_..."
                            value={connection?.figma_token || ""}
                            onChange={(e) => setConnection(prev => prev ? ({ ...prev, figma_token: e.target.value }) : null)}
                        />
                        <p className="text-[10px] text-muted-foreground">
                            Generate this in Figma Settings {'>'} Security {'>'} Personal Access Tokens
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file-key">Figma File Key</Label>
                        <Input
                            id="file-key"
                            placeholder="e.g. 8Kj9..."
                            value={connection?.figma_file_key || ""}
                            onChange={(e) => setConnection(prev => prev ? ({ ...prev, figma_file_key: e.target.value }) : null)}
                        />
                        <p className="text-[10px] text-muted-foreground">
                            Found in the URL of your Figma file: figma.com/file/KEY/...
                        </p>
                    </div>
                    <Button
                        onClick={async () => {
                            if (!connection) return;
                            const { error } = await supabase
                                .from("figma_connections" as any)
                                .update({
                                    figma_token: connection.figma_token,
                                    figma_file_key: connection.figma_file_key
                                })
                                .eq("id", connection.id);

                            if (error) toast.error("Failed to save credentials");
                            else toast.success("Credentials saved!");
                        }}
                        className="w-full"
                    >
                        Save Connection
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
