import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DesignToken } from "@/types/tokens";
import { toast } from "sonner";
import { monitor } from "@/lib/monitoring";
import { useAuth } from "@/contexts/AuthContext";

/**
 * useTokens hook
 * 
 * Migrated to use the relational design_tokens table.
 * Includes a legacy sync mechanism for systems still using JSONB.
 */
export function useTokens(designSystemId?: string) {
    const [tokens, setTokens] = useState<DesignToken[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchTokens = useCallback(async () => {
        if (!designSystemId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            // 1. Try to fetch from the relational table
            const { data: tableData, error: tableError } = await supabase
                .from("design_tokens")
                .select("*")
                .eq("design_system_id", designSystemId)
                .order('path', { ascending: true });

            if (tableError) throw tableError;

            if (tableData && tableData.length > 0) {
                setTokens(tableData as unknown as DesignToken[]);
                setLoading(false);
                return;
            }

            // 2. Fallback: Check legacy JSONB if table is empty
            const { data: dsData, error: dsError } = await supabase
                .from("design_systems")
                .select("design_system_data")
                .eq("id", designSystemId)
                .single();

            if (dsError) throw dsError;

            const legacyData = dsData?.design_system_data as any;
            const legacyTokens = legacyData?.tokens as DesignToken[];

            if (legacyTokens && legacyTokens.length > 0) {
                setTokens(legacyTokens);
                // Trigger background migration if user is owner/editor
                await migrateLegacyTokens(legacyTokens);
            } else {
                setTokens([]);
            }
        } catch (error) {
            monitor.error("Error fetching tokens", error as Error);
            setTokens([]);
        } finally {
            setLoading(false);
        }
    }, [designSystemId]);

    const migrateLegacyTokens = async (legacyTokens: DesignToken[]) => {
        if (!designSystemId || !user) return;
        
        try {
            const tokensToInsert = legacyTokens.map(t => ({
                design_system_id: designSystemId,
                name: t.name,
                path: t.path,
                type: t.type,
                value: t.value as any,
                description: t.description,
                ref: t.ref,
                status: t.status || 'published',
                created_by: user.id
            }));

            const { error } = await supabase
                .from("design_tokens")
                .insert(tokensToInsert);

            if (!error) {
                monitor.info(`Successfully migrated ${legacyTokens.length} tokens for DS ${designSystemId}`);
            }
        } catch (err) {
            monitor.error("Migration failed", err as Error);
        }
    };

    const resolveToken = (path: string, visited = new Set<string>()): DesignToken | null => {
        if (visited.has(path)) {
            monitor.warn(`Circular reference detected: ${path}`);
            return null;
        }
        visited.add(path);

        const token = tokens.find(t => t.path === path);
        if (!token) return null;

        if (token.ref) {
            const refPath = token.ref.replace(/[{}]/g, '');
            return resolveToken(refPath, visited);
        }

        return token;
    };

    const saveToken = async (token: DesignToken) => {
        if (!user || !designSystemId) {
            toast.error("Sign in to save tokens");
            return;
        }

        // Validation
        if (!token.name?.trim()) {
            toast.error("Token name is required");
            return;
        }
        if (!token.path || !/^[a-zA-Z0-9._-]+$/.test(token.path)) {
            toast.error("Invalid token path");
            return;
        }

        try {
            const tokenData = {
                design_system_id: designSystemId,
                name: token.name,
                path: token.path,
                type: token.type,
                value: token.value as any,
                description: token.description,
                ref: token.ref,
                status: token.status || 'published',
                created_by: user.id,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from("design_tokens")
                .upsert(tokenData, { onConflict: 'design_system_id,path' });

            if (error) throw error;
            
            toast.success("Token saved");
            fetchTokens(); // Refresh
        } catch (error) {
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
            const tokensData = tokensToSave.map(token => ({
                design_system_id: designSystemId,
                name: token.name,
                path: token.path,
                type: token.type,
                value: token.value as any,
                description: token.description,
                ref: token.ref,
                status: token.status || 'published',
                created_by: user.id,
                updated_at: new Date().toISOString()
            }));

            const { error } = await supabase
                .from("design_tokens")
                .upsert(tokensData, { onConflict: 'design_system_id,path' });

            if (error) throw error;
            
            toast.success(`${tokensToSave.length} tokens updated`);
            fetchTokens();
        } catch (error) {
            monitor.error("Batch save failed", error as Error);
            toast.error("Failed to save tokens");
        }
    };

    const deleteToken = async (path: string) => {
        if (!designSystemId) return;
        try {
            const { error } = await supabase
                .from("design_tokens")
                .update({ status: 'archived' })
                .eq("design_system_id", designSystemId)
                .eq("path", path);

            if (error) throw error;
            toast.success("Token archived");
            fetchTokens();
        } catch (error) {
            monitor.error("Archive failed", error as Error);
            toast.error("Failed to archive token");
        }
    };

    const restoreToken = async (path: string) => {
        if (!designSystemId) return;
        try {
            const { error } = await supabase
                .from("design_tokens")
                .update({ status: 'published' })
                .eq("design_system_id", designSystemId)
                .eq("path", path);
            if (error) throw error;
            toast.success("Token restored");
            fetchTokens();
        } catch (error) {
            monitor.error("Restore failed", error as Error);
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
            toast.success("Token deleted");
            fetchTokens();
        } catch (error) {
            monitor.error("Delete failed", error as Error);
            toast.error("Failed to delete token");
        }
    };

    useEffect(() => {
        fetchTokens();
    }, [fetchTokens]);

    return {
        tokens,
        tokensByPath: Object.fromEntries(tokens.map(t => [t.path, t])),
        loading,
        saveToken,
        batchSaveTokens,
        deleteToken,
        permanentlyDeleteToken,
        resolveToken,
        refresh: fetchTokens,
    };
}
