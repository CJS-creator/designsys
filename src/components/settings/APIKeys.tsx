import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Key, Copy, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";

interface ApiKey {
    id: string;
    name: string;
    created_at: string;
    last_used_at: string | null;
}

export function APIKeys() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [newKeyName, setNewKeyName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const designSystemId = searchParams.get("id");

    const fetchKeys = async () => {
        if (!user || !designSystemId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("api_keys")
                .select("*")
                .eq("design_system_id", designSystemId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setApiKeys((data as any) || []);
        } catch (error) {
            console.error("Error fetching API keys:", error);
            toast.error("Failed to load API keys");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, [user, designSystemId]);

    const generateHash = async (key: string) => {
        const msgUint8 = new TextEncoder().encode(key);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) {
            toast.error("Please enter a name for the API key");
            return;
        }
        if (!user || !designSystemId) return;

        setIsCreating(true);
        try {
            const rawKey = `df_${crypto.randomUUID().replace(/-/g, '')}`;
            const keyHash = await generateHash(rawKey);

            const { error } = await supabase
                .from("api_keys")
                .insert({
                    user_id: user.id,
                    design_system_id: designSystemId,
                    name: newKeyName.trim(),
                    key_hash: keyHash
                });

            if (error) throw error;

            setNewlyCreatedKey(rawKey);
            setNewKeyName("");
            fetchKeys();
            toast.success("API key generated successfully");
        } catch (error) {
            console.error("Error creating API key:", error);
            toast.error("Failed to create API key");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteKey = async (id: string) => {
        try {
            const { error } = await supabase
                .from("api_keys")
                .delete()
                .eq("id", id);

            if (error) throw error;
            setApiKeys(prev => prev.filter(k => k.id !== id));
            toast.success("API key revoked");
        } catch (error) {
            console.error("Error deleting API key:", error);
            toast.error("Failed to revoke API key");
        }
    };

    const handleCopyKey = (keyString: string, id: string) => {
        navigator.clipboard.writeText(keyString);
        setCopiedId(id);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">API Keys</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your API keys for programmatic access to the DesignSys API.
                    </p>
                </div>
            </div>

            {newlyCreatedKey && (
                <Card className="border-primary bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-500" />
                            Key Generated
                        </CardTitle>
                        <CardDescription>
                            Copy this key now. For security, it will not be shown again.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={newlyCreatedKey}
                                className="font-mono bg-background"
                            />
                            <Button onClick={() => handleCopyKey(newlyCreatedKey, 'new-key')} variant="outline">
                                {copiedId === 'new-key' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => setNewlyCreatedKey(null)}>
                            I've saved the key
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-primary" />
                        Generate New Key
                    </CardTitle>
                    <CardDescription>
                        Give your key a name to identify where it's being used.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                placeholder="e.g., CI/CD Pipeline, Figma Plugin"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
                            />
                        </div>
                        <Button onClick={handleCreateKey} disabled={isCreating || newlyCreatedKey !== null}>
                            {isCreating ? "Generating..." : "Generate Key"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Existing Keys</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <div className="py-8 text-center animate-pulse text-sm text-muted-foreground">Loading keys...</div>
                    ) : apiKeys.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                            <Key className="h-8 w-8 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">No API keys yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {apiKeys.map((key) => (
                                <div key={key.id} className="py-4 flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{key.name}</span>
                                            <Badge variant="outline" className="text-[10px] font-mono">
                                                Active
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                                            <span>Created {new Date(key.created_at).toLocaleDateString()}</span>
                                            {key.last_used_at && (
                                                <span className="flex items-center gap-1">
                                                    <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                                    Last used {new Date(key.last_used_at).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDeleteKey(key.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
