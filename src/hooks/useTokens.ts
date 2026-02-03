import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DesignToken, TokenType } from "@/types/tokens";
import { toast } from "sonner";
import { monitor } from "@/lib/monitoring";
import { useAuth } from "@/contexts/AuthContext";

export function useTokens(designSystemId?: string) {
    const [tokens, setTokens] = useState<DesignToken[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchTokens = async () => {
        if (!designSystemId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("design_tokens")
                .select("*")
                .eq("design_system_id", designSystemId);

            if (error) throw error;

            const formattedTokens = (data || []).map((row) => ({
                name: row.name,
                path: row.path,
                type: row.token_type as TokenType,
                value: row.value,
                description: row.description,
                ref: row.alias_path,
                extensions: row.extensions,
                status: (row as any).status,
            }));

            setTokens(formattedTokens as DesignToken[]);
        } catch (error: any) {
            monitor.error("Error fetching tokens", error as Error);
            toast.error("Failed to load tokens");
        } finally {
            setLoading(false);
        }
    };

    const resolveToken = (path: string, visited = new Set<string>()): DesignToken | null => {
        if (visited.has(path)) {
            monitor.warn(`Circular reference detected for token: ${path}`);
            return null;
        }
        visited.add(path);

        const token = tokens.find(t => t.path === path);
        if (!token) return null;

        if (token.ref) {
            // Support both {path} and raw path syntax
            const refPath = token.ref.replace(/[{}]/g, '');
            return resolveToken(refPath, visited);
        }

        return token;
    };

    const triggerWebhooks = async (token: DesignToken) => {
        if (!designSystemId) return;

        try {
            const { data: webhooks } = await supabase
                .from("design_system_webhooks" as any)
                .select("url")
                .eq("design_system_id", designSystemId);

            if (webhooks && webhooks.length > 0) {
                for (const webhook of (webhooks as any[])) {
                    try {
                        await fetch(webhook.url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                event: "tokens.updated",
                                design_system_id: designSystemId,
                                timestamp: new Date().toISOString(),
                                data: { token }
                            })
                        });
                        monitor.info(`Webhook triggered: ${webhook.url}`);
                    } catch (e) {
                        monitor.error(`Failed to trigger webhook ${webhook.url}`, e as Error);
                    }
                }
            }
        } catch (error) {
            monitor.error("Error fetching webhooks", error as Error);
        }
    };

    const saveToken = async (token: DesignToken) => {
        if (!user || !designSystemId) {
            toast.error("Sign in to save tokens");
            return;
        }

        try {
            const { error } = await supabase
                .from("design_tokens")
                .upsert({
                    design_system_id: designSystemId,
                    name: token.name,
                    path: token.path,
                    token_type: token.type,
                    value: token.value as any,
                    description: token.description,
                    alias_path: token.ref || null,
                    is_alias: !!token.ref,
                    extensions: token.extensions,
                    status: token.status || 'draft',
                } as any, { onConflict: "design_system_id,path" });

            if (error) throw error;

            // Trigger webhooks in background
            triggerWebhooks(token);

            toast.success("Token saved");
            fetchTokens();
        } catch (error: any) {
            monitor.error("Error saving token", error as Error);
            toast.error("Failed to save token");
        }
    };

    const deleteToken = async (path: string) => {
        if (!designSystemId) return;

        try {
            const { error } = await supabase
                .from("design_tokens")
                .update({ status: 'archived' } as any)
                .eq("design_system_id", designSystemId)
                .eq("path", path);

            if (error) throw error;

            toast.success("Token archived");
            fetchTokens();
        } catch (error: any) {
            monitor.error("Error archiving token", error as Error);
            toast.error("Failed to archive token");
        }
    };

    const restoreToken = async (path: string) => {
        if (!designSystemId) return;

        try {
            const { error } = await supabase
                .from("design_tokens")
                .update({ status: 'published' } as any)
                .eq("design_system_id", designSystemId)
                .eq("path", path);

            if (error) throw error;

            toast.success("Token restored");
            fetchTokens();
        } catch (error: any) {
            monitor.error("Error restoring token", error as Error);
            toast.error("Failed to restore token");
        }
    };

    const permanentlyDeleteToken = async (path: string) => {
        if (!designSystemId) return;

        try {
            const { error } = await supabase
                .from("design_tokens")
                .delete()
                .eq("design_system_id", designSystemId)
                .eq("path", path);

            if (error) throw error;

            toast.success("Token permanently deleted");
            fetchTokens();
        } catch (error: any) {
            monitor.error("Error deleting token", error as Error);
            toast.error("Failed to delete token");
        }
    };

    useEffect(() => {
        fetchTokens();
    }, [designSystemId]);

    return {
        tokens,
        tokensByPath: Object.fromEntries(tokens.map(t => [t.path, t])),
        loading,
        saveToken,
        deleteToken,
        restoreToken,
        permanentlyDeleteToken,
        resolveToken,
        refresh: fetchTokens,
    };
}
