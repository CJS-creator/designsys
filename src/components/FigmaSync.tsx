import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout, Copy, Check, RefreshCw, Link as LinkIcon, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface FigmaSyncProps {
    designSystemId?: string;
}

export const FigmaSync = ({ designSystemId }: FigmaSyncProps) => {
    const [copied, setCopied] = useState(false);
    const [syncToken] = useState(`df_${Math.random().toString(36).substring(2, 15)}`);

    const figmaPluginUrl = "https://www.figma.com/community/plugin/designforge_sync";
    const bridgeUrl = `${window.location.origin}/api/tokens/${designSystemId || "default"}`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

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
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bridgeUrl)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <LinkIcon className="h-3 w-3" />
                                Use this URL in the DesignForge Figma Plugin.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sync-token">Access Token</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="sync-token"
                                    value={syncToken}
                                    readOnly
                                    type="password"
                                    className="bg-muted/30 font-mono text-xs"
                                />
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(syncToken)}>
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-medium">Bridge Active</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs gap-2">
                            <RefreshCw className="h-3 w-3" />
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
        </div>
    );
};
