import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DesignToken, TokenType } from "@/types/tokens";
import { toast } from "sonner";
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
                extensions: row.extensions,
            }));

            setTokens(formattedTokens as DesignToken[]);
        } catch (error: any) {
            console.error("Error fetching tokens:", error);
            toast.error("Failed to load tokens");
        } finally {
            setLoading(false);
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
                    extensions: token.extensions,
                }, { onConflict: "design_system_id,path" });

            if (error) throw error;

            toast.success("Token saved");
            fetchTokens();
        } catch (error: any) {
            console.error("Error saving token:", error);
            toast.error("Failed to save token");
        }
    };

    const deleteToken = async (path: string) => {
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
        } catch (error: any) {
            console.error("Error deleting token:", error);
            toast.error("Failed to delete token");
        }
    };

    useEffect(() => {
        fetchTokens();
    }, [designSystemId]);

    return {
        tokens,
        loading,
        saveToken,
        deleteToken,
        refresh: fetchTokens,
    };
}
