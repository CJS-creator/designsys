import { supabase } from "@/integrations/supabase/client";
import { monitor } from "@/lib/monitoring";
import { DesignToken } from "@/types/tokens";

export interface GitSyncResult {
    success: boolean;
    message: string;
    prUrl?: string;
}

export async function exportToGitHub(
    designSystemId: string,
    tokens: DesignToken[],
    repoFullName: string,
    branch: string = "main"
): Promise<GitSyncResult> {
    try {
        // 1. Get the connection and access token (In real app, this would be highly secure)
        const { data: connection, error: connError } = await supabase
            .from("git_connections" as any)
            .select("*")
            .eq("design_system_id", designSystemId)
            .single();

        if (connError || !connection) {
            throw new Error("No GitHub connection found for this design system");
        }

        // 2. Invoke the Edge Function to perform the actual git operations
        // We pass the tokens and repo info. The Edge Function uses the stored access_token.
        const { data, error } = await supabase.functions.invoke('github-sync', {
            body: {
                action: 'push-tokens',
                designSystemId,
                tokens,
                repoFullName,
                branch
            }
        });

        if (error) throw error;

        return {
            success: true,
            message: data.message || "Changes successfully pushed to GitHub",
            prUrl: data.prUrl
        };
    } catch (error: any) {
        monitor.error("GitHub Export Error", error as Error);
        return {
            success: false,
            message: error.message || "Failed to push changes to GitHub"
        };
    }
}

export async function fetchGitLogs(connectionId: string) {
    const { data, error } = await supabase
        .from("git_sync_logs" as any)
        .select("*")
        .eq("connection_id", connectionId)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) throw error;
    return data;
}
