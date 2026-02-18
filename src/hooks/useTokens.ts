import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DesignToken } from "@/types/tokens";
import { toast } from "sonner";
import { monitor } from "@/lib/monitoring";
import { useAuth } from "@/contexts/AuthContext";
import { Json } from "@/integrations/supabase/types";

/**
 * useTokens hook
 * 
 * This hook stores tokens in the design_system_data JSONB column
 * since the design_tokens table doesn't exist yet.
 * 
 * When the design_tokens table is created via migration,
 * this hook can be updated to use it directly.
 */
export function useTokens(designSystemId?: string) {
    const [tokens, setTokens] = useState<DesignToken[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchTokens = async () => {
        if (!designSystemId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            // Fetch tokens from design_system_data JSONB column
            const { data, error } = await supabase
                .from("design_systems")
                .select("design_system_data")
                .eq("id", designSystemId)
                .single();

            if (error) throw error;

            // Extract tokens from design_system_data
            const dsData = data?.design_system_data as Record<string, unknown> | null;
            const storedTokens = (dsData?.tokens as DesignToken[]) || [];

            setTokens(storedTokens);
        } catch (error) {
            monitor.error("Error fetching tokens", error as Error);
            // Don't show error toast for missing data
            setTokens([]);
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
            const refPath = token.ref.replace(/[{}]/g, '');
            return resolveToken(refPath, visited);
        }

        return token;
    };

    const saveTokensToDesignSystem = async (updatedTokens: DesignToken[]) => {
        if (!designSystemId || !user) return;

        // Get current design_system_data
        const { data: currentData } = await supabase
            .from("design_systems")
            .select("design_system_data")
            .eq("id", designSystemId)
            .single();

        const currentDsData = (currentData?.design_system_data as Record<string, unknown>) || {};

        // Update with new tokens - cast to Json for Supabase compatibility
        const { error } = await supabase
            .from("design_systems")
            .update({
                design_system_data: {
                    ...currentDsData,
                    tokens: updatedTokens as unknown as Json[]
                } as Json
            })
            .eq("id", designSystemId);

        if (error) throw error;
        setTokens(updatedTokens);
    };

    const saveToken = async (token: DesignToken) => {
        if (!user || !designSystemId) {
            toast.error("Sign in to save tokens");
            return;
        }

        // Validation
        if (!token.name || token.name.trim().length === 0) {
            toast.error("Token name is required");
            return;
        }
        if (!token.path || !/^[a-zA-Z0-9._-]+$/.test(token.path)) {
            toast.error("Invalid token path. Use only alphanumeric characters, dots, underscores, and hyphens.");
            return;
        }
        if (typeof token.value === 'string' && (token.value.includes('<script') || token.value.toLowerCase().includes('javascript:'))) {
            toast.error("Malicious content detected in token value");
            return;
        }

        try {
            const existingIndex = tokens.findIndex(t => t.path === token.path);
            let updatedTokens: DesignToken[];

            if (existingIndex >= 0) {
                // Update existing token
                updatedTokens = [...tokens];
                updatedTokens[existingIndex] = {
                    ...token,
                    id: tokens[existingIndex].id || crypto.randomUUID()
                };
            } else {
                // Add new token
                updatedTokens = [...tokens, { ...token, id: crypto.randomUUID() }];
            }

            await saveTokensToDesignSystem(updatedTokens);
            toast.success("Token saved");
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
            const updatedTokens = [...tokens];

            for (const token of tokensToSave) {
                const existingIndex = updatedTokens.findIndex(t => t.path === token.path);
                if (existingIndex >= 0) {
                    updatedTokens[existingIndex] = {
                        ...token,
                        id: updatedTokens[existingIndex].id || crypto.randomUUID()
                    };
                } else {
                    updatedTokens.push({ ...token, id: crypto.randomUUID() });
                }
            }

            await saveTokensToDesignSystem(updatedTokens);
            toast.success(`${tokensToSave.length} tokens updated`);
        } catch (error) {
            monitor.error("Error batch saving tokens", error as Error);
            toast.error("Failed to save multiple tokens");
        }
    };

    const deleteToken = async (path: string) => {
        if (!designSystemId) return;

        try {
            const tokenToArchive = tokens.find(t => t.path === path);
            if (!tokenToArchive) return;

            const updatedTokens = tokens.map(t =>
                t.path === path ? { ...t, status: 'archived' as const } : t
            );

            await saveTokensToDesignSystem(updatedTokens);
            toast.success("Token archived");
        } catch (error) {
            monitor.error("Error archiving token", error as Error);
            toast.error("Failed to archive token");
        }
    };

    const restoreToken = async (path: string) => {
        if (!designSystemId) return;

        try {
            const updatedTokens = tokens.map(t =>
                t.path === path ? { ...t, status: 'published' as const } : t
            );

            await saveTokensToDesignSystem(updatedTokens);
            toast.success("Token restored");
        } catch (error) {
            monitor.error("Error restoring token", error as Error);
            toast.error("Failed to restore token");
        }
    };

    const permanentlyDeleteToken = async (path: string) => {
        if (!designSystemId) return;

        try {
            const updatedTokens = tokens.filter(t => t.path !== path);

            await saveTokensToDesignSystem(updatedTokens);
            toast.success("Token permanently deleted");
        } catch (error) {
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
