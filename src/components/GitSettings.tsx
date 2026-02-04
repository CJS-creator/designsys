import { useState, useEffect } from "react";
import { monitor } from "@/lib/monitoring";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Github,
    GitBranch,
    Settings2,
    RefreshCw,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Lock,
    Globe,
    Zap,
    Key
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { exportToGitHub } from "@/lib/git/sync";

// Define GitConnection type locally since table was just created
interface GitConnection {
    id: string;
    design_system_id: string;
    user_id: string;
    provider: string;
    repo_full_name: string;
    default_branch: string;
    sync_status: string;
    last_sync_at: string | null;
    created_at: string;
    updated_at: string;
}


export function GitSettings({ designSystemId }: { designSystemId: string }) {
    const { user } = useAuth();
    const [connection, setConnection] = useState<GitConnection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLinking, setIsLinking] = useState(false);
    const [repoName, setRepoName] = useState("");
    const [branch, setBranch] = useState("main");
    const [webhookUrl, setWebhookUrl] = useState("");
    const [isSavingWebhook, setIsSavingWebhook] = useState(false);

    const fetchConnection = async () => {
        if (!designSystemId) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("git_connections" as any)
                .select("*")
                .eq("design_system_id", designSystemId)
                .single();

            if (error && error.code !== "PGRST116") throw error;
            setConnection((data as unknown as GitConnection) || null);
            if (data) {
                const conn = data as unknown as GitConnection;
                setRepoName(conn.repo_full_name);
                setBranch(conn.default_branch);
            }
        } catch (error) {
            monitor.error("Error fetching git connection", error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWebhook = async () => {
        if (!designSystemId) return;
        const { data } = await supabase
            .from("design_system_webhooks" as any)
            .select("*")
            .eq("design_system_id", designSystemId)
            .maybeSingle();

        if (data) {
            setWebhookUrl((data as any).url);
        }
    };

    const handleConnect = async () => {
        if (!designSystemId || !repoName || !user) {
            toast.error("Please enter a repository name");
            return;
        }
        setIsLinking(true);
        try {
            const { error } = await supabase
                .from("git_connections" as any)
                .upsert({
                    design_system_id: designSystemId,
                    user_id: user.id,
                    repo_full_name: repoName,
                    default_branch: branch,
                    provider: 'github',
                    sync_status: 'idle'
                }, { onConflict: 'design_system_id' });

            if (error) throw error;
            toast.success("Repository connected successfully!");
            fetchConnection();
        } catch (error: any) {
            toast.error("Failed to connect repository: " + error.message);
        } finally {
            setIsLinking(false);
        }
    };

    const handleSaveWebhook = async () => {
        if (!designSystemId || !webhookUrl || !user) {
            toast.error("Please enter a valid webhook URL");
            return;
        }
        setIsSavingWebhook(true);
        try {
            const { error } = await supabase
                .from("design_system_webhooks" as any)
                .upsert({
                    design_system_id: designSystemId,
                    user_id: user.id,
                    url: webhookUrl,
                    event_types: ['tokens.updated']
                }, { onConflict: 'design_system_id' });

            if (error) throw error;
            toast.success("Webhook configured successfully!");
        } catch (error: any) {
            toast.error("Failed to save webhook: " + error.message);
        } finally {
            setIsSavingWebhook(false);
        }
    };

    const [isSyncing, setIsSyncing] = useState(false);

    const handleSyncNow = async () => {
        if (!connection || !designSystemId) return;
        setIsSyncing(true);
        const toastId = toast.loading("Syncing with GitHub...");

        try {
            // 1. Fetch current tokens for export
            const { data: tokensData } = await supabase
                .from("design_tokens")
                .select("*")
                .eq("design_system_id", designSystemId);

            const tokens = (tokensData || []).map(row => ({
                path: row.path,
                name: row.name,
                type: row.token_type,
                value: row.value,
                ref: row.alias_path
            }));

            // 2. Perform export
            const result = await exportToGitHub(
                designSystemId,
                tokens as any,
                connection.repo_full_name,
                connection.default_branch
            );

            if (result.success) {
                toast.success(result.message, { id: toastId });
            } else {
                toast.error(result.message, { id: toastId });
            }

            fetchConnection();
        } catch (error: any) {
            toast.error("Sync failed: " + error.message, { id: toastId });
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        fetchConnection();
        fetchWebhook();
    }, [designSystemId]);

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading settings...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-foreground rounded-lg">
                    <Github className="h-6 w-6 text-background" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Git Code Connect</h2>
                    <p className="text-xs text-muted-foreground font-medium">Auto-sync design tokens to your codebase</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Settings2 className="h-4 w-4" />
                                Repository Configuration
                            </CardTitle>
                            <CardDescription>
                                Link this design system to a GitHub repository to enable automated PRs.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">GitHub Repository</label>
                                <div className="relative">
                                    <Input
                                        placeholder="org/repo-name"
                                        value={repoName}
                                        onChange={(e) => setRepoName(e.target.value)}
                                        className="pl-9"
                                    />
                                    <Github className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Default Branch</label>
                                <div className="relative">
                                    <Input
                                        placeholder="main"
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        className="pl-9"
                                    />
                                    <GitBranch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                            <Button
                                onClick={handleConnect}
                                disabled={isLinking}
                                className="w-full gap-2 font-bold"
                            >
                                {connection ? "Update Connection" : "Connect Repository"}
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    {connection && (
                        <Card className="border-accent/10 bg-accent/5">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">Sync Active</span>
                                            <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent-foreground border-accent/20 uppercase">Live</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Linked to <strong>{connection.repo_full_name}</strong> on <strong>{connection.default_branch}</strong></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Last Sync</p>
                                    <p className="text-xs font-medium">{connection.last_sync_at ? new Date(connection.last_sync_at).toLocaleString() : "Never"}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Webhook Delivery
                            </CardTitle>
                            <CardDescription>
                                Notify external services (like CI/CD or Slack) when tokens change.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payload URL</label>
                                <div className="relative">
                                    <Input
                                        placeholder="https://api.yourdomain.com/webhooks/design-tokens"
                                        value={webhookUrl}
                                        onChange={(e) => setWebhookUrl(e.target.value)}
                                        className="pl-9"
                                    />
                                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Zap className="h-4 w-4 text-primary" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase">Event Type</p>
                                        <p className="text-xs font-medium">tokens.updated</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-[9px]">JSON POST</Badge>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={handleSaveWebhook}
                                disabled={isSavingWebhook}
                                className="w-full gap-2 font-bold"
                            >
                                {webhookUrl ? "Update Webhook" : "Configure Webhook"}
                                <Key className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <Lock className="h-3 w-3" /> Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                DesignForge uses <strong>GitHub Apps</strong> for secure, granular access. We never store your personal credentials.
                            </p>
                            <div className="p-3 bg-background rounded-lg border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="h-3 w-3 text-destructive" />
                                    <span className="text-[10px] font-bold">Token Safety</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Access tokens are encrypted at rest using industry-standard AES-256 GCM.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-dashed">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <RefreshCw className={cn("h-8 w-8 text-muted-foreground mb-4 opacity-20", isSyncing && "animate-spin opacity-100 text-primary")} />
                            <h4 className="text-sm font-bold mb-1">Manual Trigger</h4>
                            <p className="text-[10px] text-muted-foreground mb-4">Force a synchronization for debugging</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-[10px] h-8"
                                disabled={!connection || isSyncing}
                                onClick={handleSyncNow}
                            >
                                {isSyncing ? "Syncing..." : "Sync Now"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
