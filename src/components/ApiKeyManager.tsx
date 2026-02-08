import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Key, Copy, Check, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    lastUsed: string | null;
}

interface ApiKeyManagerProps {
    designSystemId: string;
}

export function ApiKeyManager({ designSystemId }: ApiKeyManagerProps) {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [newKeyName, setNewKeyName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

    // Load API keys from localStorage (stub implementation)
    useEffect(() => {
        const stored = localStorage.getItem(`api-keys-${designSystemId}`);
        if (stored) {
            try {
                setApiKeys(JSON.parse(stored));
            } catch {
                setApiKeys([]);
            }
        }
    }, [designSystemId]);

    // Save API keys to localStorage
    const saveKeys = (keys: ApiKey[]) => {
        localStorage.setItem(`api-keys-${designSystemId}`, JSON.stringify(keys));
        setApiKeys(keys);
    };

    const generateApiKey = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = 'df_';
        for (let i = 0; i < 32; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
    };

    const handleCreateKey = () => {
        if (!newKeyName.trim()) {
            toast.error("Please enter a name for the API key");
            return;
        }

        setIsCreating(true);
        
        const newKey: ApiKey = {
            id: crypto.randomUUID(),
            name: newKeyName.trim(),
            key: generateApiKey(),
            createdAt: new Date().toISOString(),
            lastUsed: null,
        };

        saveKeys([...apiKeys, newKey]);
        setNewKeyName("");
        setIsCreating(false);
        toast.success("API key created successfully");
    };

    const handleDeleteKey = (id: string) => {
        saveKeys(apiKeys.filter(k => k.id !== id));
        toast.success("API key deleted");
    };

    const handleCopyKey = (key: ApiKey) => {
        navigator.clipboard.writeText(key.key);
        setCopiedId(key.id);
        toast.success("API key copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleKeyVisibility = (id: string) => {
        setVisibleKeys(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const maskKey = (key: string) => {
        return key.substring(0, 6) + '•'.repeat(20) + key.substring(key.length - 4);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    API Keys
                </CardTitle>
                <CardDescription>
                    Manage API keys for programmatic access to your design system.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Create new key */}
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Label htmlFor="key-name" className="sr-only">Key Name</Label>
                        <Input
                            id="key-name"
                            placeholder="Enter key name (e.g., CI/CD Pipeline)"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
                        />
                    </div>
                    <Button onClick={handleCreateKey} disabled={isCreating} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Key
                    </Button>
                </div>

                {/* Key list */}
                <div className="space-y-3">
                    {apiKeys.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                            <Key className="h-8 w-8 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">No API keys yet</p>
                            <p className="text-xs mt-1">Create your first API key to get started</p>
                        </div>
                    ) : (
                        apiKeys.map((apiKey) => (
                            <div
                                key={apiKey.id}
                                className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{apiKey.name}</span>
                                        <Badge variant="outline" className="text-[10px]">
                                            {new Date(apiKey.createdAt).toLocaleDateString()}
                                        </Badge>
                                    </div>
                                    <code className="text-xs font-mono text-muted-foreground mt-1 block truncate">
                                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                                    </code>
                                </div>
                                <div className="flex items-center gap-1 ml-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => toggleKeyVisibility(apiKey.id)}
                                    >
                                        {visibleKeys.has(apiKey.id) ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleCopyKey(apiKey)}
                                    >
                                        {copiedId === apiKey.id ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => handleDeleteKey(apiKey.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {apiKeys.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> API keys are stored locally for demo purposes. 
                        In production, keys would be securely stored in the database.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
