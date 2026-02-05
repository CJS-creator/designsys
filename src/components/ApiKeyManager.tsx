
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Key, Plus, Trash2, Copy, Check, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface ApiKey {
    id: string;
    name: string;
    created_at: string;
    last_used_at: string | null;
    scopes: string[];
}

interface ApiKeyManagerProps {
    designSystemId: string;
}

export function ApiKeyManager({ designSystemId }: ApiKeyManagerProps) {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const fetchKeys = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("api_keys" as any)
            .select("id, name, created_at, last_used_at, scopes")
            .eq("design_system_id", designSystemId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching keys:", error);
            toast.error("Failed to load API keys");
        } else {
            setKeys((data as unknown) as ApiKey[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchKeys();
    }, [designSystemId]);

    const handleGenerate = async () => {
        if (!newKeyName.trim()) {
            toast.error("Please enter a name for the key");
            return;
        }

        setIsGenerating(true);
        try {
            const { data, error } = await supabase.functions.invoke("generate-api-key", {
                body: { design_system_id: designSystemId, name: newKeyName }
            });

            if (error) throw error;

            setGeneratedKey(data.apiKey);
            setNewKeyName("");
            fetchKeys();
            toast.success("API Key generated successfully");
        } catch (error) {
            console.error("Error generating key:", error);
            toast.error("Failed to generate API Key");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("api_keys" as any)
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Failed to revoke key");
        } else {
            toast.success("API Key revoked");
            setKeys(keys.filter(k => k.id !== id));
        }
    };

    const copyToClipboard = () => {
        if (generatedKey) {
            navigator.clipboard.writeText(generatedKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    API Access
                </CardTitle>
                <CardDescription>
                    Manage API keys to access your design tokens programmatically.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-4 items-end">
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="key-name">New Key Name</Label>
                        <Input
                            id="key-name"
                            placeholder="e.g., CI/CD Pipeline"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? "Generating..." : <><Plus className="h-4 w-4 mr-2" /> Generate Key</>}
                    </Button>
                </div>

                <div className="rounded-md border bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Scopes</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Last Used</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading keys...</TableCell>
                                </TableRow>
                            ) : keys.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No API keys found.</TableCell>
                                </TableRow>
                            ) : (
                                keys.map(key => (
                                    <TableRow key={key.id}>
                                        <TableCell className="font-medium">{key.name}</TableCell>
                                        <TableCell>
                                            {key.scopes.map(scope => (
                                                <Badge key={scope} variant="outline" className="text-[10px] mr-1">{scope}</Badge>
                                            ))}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-xs">{format(new Date(key.created_at), 'MMM d, yyyy')}</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">
                                            {key.last_used_at ? format(new Date(key.last_used_at), 'MMM d, HH:mm') : 'Never'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(key.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <Dialog open={!!generatedKey} onOpenChange={() => setGeneratedKey(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <Check className="h-5 w-5" /> Key Generated Successfully
                        </DialogTitle>
                        <DialogDescription>
                            Copy this key now. You won't be able to see it again!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 bg-muted rounded-md relative group">
                        <code className="break-all font-mono text-sm text-primary">{generatedKey}</code>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={copyToClipboard}
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Keep this key secret. It grants full read access to your tokens.</span>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setGeneratedKey(null)}>Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
