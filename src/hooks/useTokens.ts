import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DesignToken, TokenType } from "@/types/tokens";
import { toast } from "sonner";
import { monitor } from "@/lib/monitoring";
import { useAuth } from "@/contexts/AuthContext";
import { recordAuditLog } from "@/lib/auditLogs";

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
                id: row.id,
                name: row.name,
                path: row.path,
                type: row.token_type as TokenType,
                value: ((row as any).staging_value !== null && (row as any).staging_value !== undefined) ? (row as any).staging_value : row.value, // Working Value (Draft)
                description: row.description,
                ref: row.alias_path,
                extensions: row.extensions,
                status: (row as any).status, // Lifecycle status (draft/published/deprecated)
                stagingValue: (row as any).staging_value, // Draft value
                publishedValue: row.value, // Live/Published Value
                syncStatus: (row as any).status === 'synced' || (row as any).status === 'changed' ? (row as any).status : undefined, // DB Sync Status
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

        // --- Validation ---
        if (!token.name || token.name.trim().length === 0) {
            toast.error("Token name is required");
            return;
        }
        if (!token.path || !/^[a-zA-Z0-9._-]+$/.test(token.path)) {
            toast.error("Invalid token path. Use only alphanumeric characters, dots, underscores, and hyphens.");
            return;
        }
        // Basic XSS check for string values (not exhaustive but safe for style injection)
        if (typeof token.value === 'string' && (token.value.includes('<script') || token.value.toLowerCase().includes('javascript:'))) {
            toast.error("Malicious content detected in token value");
            return;
        }
        // ------------------

        try {
            const existingToken = tokens.find(t => t.path === token.path);
            const isUpdate = !!existingToken;

            // Preserve Lifecycle status in extensions since DB 'status' is now Sync Status
            const lifecycleStatus = token.status || 'draft';
            const extensions = { ...token.extensions, lifecycleStatus };

            const payload: any = {
                design_system_id: designSystemId,
                name: token.name,
                path: token.path,
                token_type: token.type,
                description: token.description,
                alias_path: token.ref || null,
                is_alias: !!token.ref,
                extensions: extensions,

                // Governance Logic
                // If Update: preserve live value, update staging, set changed
                // If Create: set both values, set synced
                value: isUpdate ? (existingToken.publishedValue !== undefined ? existingToken.publishedValue : existingToken.value) : token.value,
                staging_value: token.value,
                status: isUpdate ? 'changed' : 'synced'
            };

            const { error } = await supabase
                .from("design_tokens")
                .upsert(payload, { onConflict: "design_system_id,path" });

            if (error) throw error;

            // Audit
            const oldToken = tokens.find(t => t.path === token.path);
            recordAuditLog({
                design_system_id: designSystemId,
                action: oldToken ? "UPDATE" : "CREATE",
                entity_type: "TOKEN",
                entity_id: token.path,
                old_value: oldToken?.value,
                new_value: token.value,
                metadata: { name: token.name, summary: `${oldToken ? 'Updated' : 'Created'} token ${token.path}` }
            });

            // Trigger webhooks in background
            triggerWebhooks(token);

            toast.success("Token saved");
            fetchTokens();
        } catch (error: any) {
            monitor.error("Error saving token", error as Error);
            toast.error("Failed to save token");
        }
    };

    const batchSaveTokens = async (tokensToSave: DesignToken[]) => {
        if (!user || !designSystemId) {
            toast.error("Sign in to save tokens");
            return;
        }

        try {
            const payloads = tokensToSave.map(token => {
                const existingToken = tokens.find(t => t.path === token.path);
                const isUpdate = !!existingToken;

                const lifecycleStatus = token.status || 'draft';
                const extensions = { ...token.extensions, lifecycleStatus };

                return {
                    design_system_id: designSystemId,
                    name: token.name,
                    path: token.path,
                    token_type: token.type,
                    description: token.description,
                    alias_path: token.ref || null,
                    is_alias: !!token.ref,
                    extensions: extensions,

                    value: isUpdate ? (existingToken.publishedValue !== undefined ? existingToken.publishedValue : existingToken.value) : token.value,
                    staging_value: token.value,
                    status: isUpdate ? 'changed' : 'synced'
                };
            });

            const { error } = await supabase
                .from("design_tokens")
                .upsert(payloads as any, { onConflict: "design_system_id,path" });

            if (error) throw error;

            toast.success(`${tokensToSave.length} tokens updated`);
            fetchTokens();
        } catch (error: any) {
            monitor.error("Error batch saving tokens", error as Error);
            toast.error("Failed to save multiple tokens");
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

            // Audit
            recordAuditLog({
                design_system_id: designSystemId,
                action: "ARCHIVE",
                entity_type: "TOKEN",
                entity_id: path,
                metadata: { summary: `Archived token ${path}` }
            });

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

            // Audit
            recordAuditLog({
                design_system_id: designSystemId,
                action: "RESTORE",
                entity_type: "TOKEN",
                entity_id: path,
                metadata: { summary: `Restored token ${path}` }
            });

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

            // Audit
            recordAuditLog({
                design_system_id: designSystemId,
                action: "DELETE",
                entity_type: "TOKEN",
                entity_id: path,
                metadata: { summary: `Permanently deleted token ${path}` }
            });

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
        batchSaveTokens,
        deleteToken,
        restoreToken,
        permanentlyDeleteToken,
        resolveToken,
        refresh: fetchTokens,
    };
}
