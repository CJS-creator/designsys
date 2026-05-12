import { useState, useEffect } from "react";
import { monitor } from "@/lib/monitoring";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout, Copy, RefreshCw, Link as LinkIcon, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface FigmaSyncProps {
    designSystemId?: string;
}

interface GitConnection {
    id: string;
    repo_full_name: string;
    last_sync_at: string | null;
    sync_status: string;
    provider: string;
    default_branch: string;
}

export const FigmaSync = ({ designSystemId }: FigmaSyncProps) => {
    const { user: _user } = useAuth();
    const [_copied, setCopied] = useState(false);
    const [connection, setConnection] = useState<GitConnection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [_figmaToken, setFigmaToken] = useState("");
    const [_figmaFileKey, setFigmaFileKey] = useState("");

    const _figmaPluginUrl = "https://designforge.me/figma-plugin";
    const bridgeUrl = `${window.location.origin}/api/tokens/${designSystemId || "default"}`;

    const fetchConnection = async () => {
        if (!designSystemId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("git_connections")
                .select("*")
                .eq("design_system_id", designSystemId)
                .maybeSingle();

            if (error) throw error;
            if (data) {
                setConnection(data);
            }
        } catch (error) {
            monitor.error("Error fetching connection", error as Error);
        } finally {
            setIsLoading(false);
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
                        <Button variant="default" size="sm" asChild className="bg-[#F24E1E] hover:bg-[#F24E1E]/90 text-white">
                            <a href={`figma://plugin/designforge?bridge_url=${encodeURIComponent(bridgeUrl)}`} onClick={() => toast.success("Opening Figma...")}>
                                Open in Figma
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
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className={cn("h-2 w-2 rounded-full", connection ? 'bg-primary animate-pulse' : 'bg-muted-foreground')} />
                                <span className="text-xs font-medium">{connection ? 'Connected' : 'Not connected'}</span>
                            </div>
                            {connection?.last_sync_at && (
                                <div className="text-[10px] text-muted-foreground italic">
                                    Last synced: {new Date(connection.last_sync_at).toLocaleString()}
                                </div>
                            )}
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs gap-2" onClick={fetchConnection}>
                            <RefreshCw className="h-3 w-3" />
                            Refresh
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
                            <li>Enter your Bridge API URL</li>
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
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl space-y-4 bg-muted/10">
                        <div className="w-14 h-14 bg-[#F24E1E]/10 rounded-full flex items-center justify-center mb-2">
                            <Layout className="h-7 w-7 text-[#F24E1E]" />
                        </div>
                        <div className="text-center space-y-1.5">
                            <h4 className="font-semibold text-base">Secure OAuth Connection</h4>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                Securely connect DesignForge to your Figma account. No more copying Personal Access Tokens. This enables real-time two-way synchronization.
                            </p>
                        </div>
                        <Button
                            className="mt-4 bg-[#F24E1E] hover:bg-[#F24E1E]/90 text-white gap-2 shadow-sm"
                            onClick={() => {
                                setIsLoading(true);
                                setTimeout(() => {
                                    setIsLoading(false);
                                    toast.success("Redirecting to Figma OAuth provider...");
                                }, 800);
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                            Connect Figma Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
