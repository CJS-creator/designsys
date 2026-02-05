
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Key, AlertTriangle, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface APIKey {
    id: string;
    name: string;
    created_at: string;
    last_used_at: string | null;
    key_hash: string;
}

export function APIKeys() {
    const [keys, setKeys] = useState<APIKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [isRevokeOpen, setIsRevokeOpen] = useState(false);
    const [keyToRevoke, setKeyToRevoke] = useState<APIKey | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const { data, error } = await supabase
                .from("api_keys")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setKeys(data || []);
        } catch (error) {
            console.error("Error fetching keys:", error);
            toast.error("Failed to load API keys and please create the api keys table in supabase");
        } finally {
            setLoading(false);
        }
    };

    const generateKey = async () => {
        if (!newKeyName.trim()) {
            toast.error("Please enter a name for the key");
            return;
        }

        setActionLoading(true);
        try {
            // 1. Generate random key
            const keyPrefix = "ds_live_";
            const randomBytes = new Uint8Array(32);
            crypto.getRandomValues(randomBytes);
            const randomString = Array.from(randomBytes)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            const fullKey = `${keyPrefix}${randomString}`;

            // 2. Hash key
            const encoder = new TextEncoder();
            const data = encoder.encode(fullKey);
            const hashBuffer = await crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const keyHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

            // 3. Get user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            // 4. Insert into DB
            const { error } = await supabase.from("api_keys").insert({
                name: newKeyName,
                key_hash: keyHash,
                user_id: user.id,
            });

            if (error) throw error;

            setGeneratedKey(fullKey);
            setNewKeyName("");
            fetchKeys();
            toast.success("API Key generated successfully");
        } catch (error) {
            console.error("Error generating key:", error);
            toast.error("Failed to generate API Key");
        } finally {
            setActionLoading(false);
        }
    };

    const revokeKey = async () => {
        if (!keyToRevoke) return;

        setActionLoading(true);
        try {
            const { error } = await supabase
                .from("api_keys")
                .delete()
                .eq("id", keyToRevoke.id);

            if (error) throw error;

            setKeys(keys.filter((k) => k.id !== keyToRevoke.id));
            setIsRevokeOpen(false);
            setKeyToRevoke(null);
            toast.success("API Key revoked");
        } catch (error: any) {
            console.error("Error revoking key:", error);
            toast.error(error.message || "Failed to revoke API Key");
        } finally {
            setActionLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
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
                <Button onClick={() => setIsGenerateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Generate New Key
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : keys.length === 0 ? (
                <Card className="bg-muted/50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                        <Key className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No API keys found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-4">
                            Generate an API key to access the DesignSys API from your applications or CI/CD pipelines.
                        </p>
                        <Button variant="outline" onClick={() => setIsGenerateOpen(true)}>
                            Generate your first key
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {keys.map((key) => (
                        <Card key={key.id} className="overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Key className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">{key.name}</h4>
                                        <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                                            {key.key_hash.substring(0, 10)}...{key.key_hash.substring(key.key_hash.length - 8)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="hidden sm:block">
                                        Created {formatDistanceToNow(new Date(key.created_at))} ago
                                    </div>
                                    {key.last_used_at && (
                                        <div className="hidden sm:block">
                                            Last used {formatDistanceToNow(new Date(key.last_used_at))} ago
                                        </div>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                            setKeyToRevoke(key);
                                            setIsRevokeOpen(true);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Generate Key Dialog */}
            <Dialog
                open={isGenerateOpen}
                onOpenChange={(open) => {
                    if (!open && generatedKey) {
                        setGeneratedKey(null); // Clear key on close
                    }
                    setIsGenerateOpen(open);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Generate New API Key</DialogTitle>
                        <DialogDescription>
                            Enter a name for this API key to identify it later.
                        </DialogDescription>
                    </DialogHeader>

                    {!generatedKey ? (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="key-name">Key Name</Label>
                                <Input
                                    id="key-name"
                                    placeholder="e.g. Production Server, CI/CD Pipeline"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            <div className="rounded-md bg-amber-500/10 p-4 border border-amber-500/20">
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <p className="font-semibold text-sm">Save your key immediately!</p>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    We verify your key via a secure hash, so we can't show it to you again.
                                </p>
                                <div className="relative">
                                    <Input
                                        className="pr-20 font-mono text-sm bg-background"
                                        readOnly
                                        value={generatedKey}
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute right-1 top-1 h-7"
                                        onClick={() => copyToClipboard(generatedKey)}
                                    >
                                        <Copy className="h-3 w-3 mr-1" /> Copy
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        {!generatedKey ? (
                            <div className="flex justify-end gap-2 w-full">
                                <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={generateKey} disabled={!newKeyName.trim() || actionLoading}>
                                    {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate Key
                                </Button>
                            </div>
                        ) : (
                            <Button className="w-full" onClick={() => {
                                setGeneratedKey(null);
                                setIsGenerateOpen(false);
                            }}>
                                <Check className="mr-2 h-4 w-4" /> I have saved my key
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revoke Key Dialog */}
            <Dialog open={isRevokeOpen} onOpenChange={setIsRevokeOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Revoke API Key</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to revoke the key <strong>{keyToRevoke?.name}</strong>?
                            This action cannot be undone and any applications using this key will immediately lose access.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRevokeOpen(false)} disabled={actionLoading}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={revokeKey} disabled={actionLoading}>
                            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Revoke Key
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
