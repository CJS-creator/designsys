import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DesignToken } from "@/types/tokens";

export interface ApprovalRequest {
    id: string;
    design_system_id: string;
    author_id: string;
    version_number: string;
    description: string;
    status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
    created_at: string;
    author?: {
        email: string;
    };
    changes?: ApprovalChange[];
}

export interface ApprovalChange {
    id: string;
    approval_request_id: string;
    token_path: string;
    change_type: 'create' | 'update' | 'delete';
    old_value: any;
    new_value: any;
}

export function useApprovals(designSystemId?: string) {
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchRequests = async () => {
        if (!designSystemId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("approval_requests")
                .select(`
                    *,
                    author:author_id(email)
                `)
                .eq("design_system_id", designSystemId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setRequests(data as any);
        } catch (error) {
            console.error("Error fetching approval requests:", error);
            toast.error("Failed to load approval requests");
        } finally {
            setLoading(false);
        }
    };

    const fetchRequestDetails = async (requestId: string) => {
        try {
            const { data, error } = await supabase
                .from("approval_changes")
                .select("*")
                .eq("approval_request_id", requestId);

            if (error) throw error;
            return data as ApprovalChange[];
        } catch (error) {
            console.error("Error fetching request details:", error);
            return [];
        }
    };

    const createRequest = async (description: string, changedTokens: DesignToken[]) => {
        if (!user || !designSystemId) return;

        try {
            // 1. Create Request
            const { data: request, error: reqError } = await supabase
                .from("approval_requests")
                .insert({
                    design_system_id: designSystemId,
                    author_id: user.id,
                    version_number: "v" + Date.now(), // Simple versioning for now
                    description,
                    status: 'PENDING_REVIEW'
                })
                .select()
                .single();

            if (reqError) throw reqError;

            // 2. Create Changes
            const changes = changedTokens.map(token => ({
                approval_request_id: request.id,
                token_path: token.path,
                change_type: token.publishedValue === undefined ? 'create' : 'update',
                old_value: token.publishedValue,
                new_value: token.value // The Draft value
            }));

            const { error: changesError } = await supabase
                .from("approval_changes")
                .insert(changes);

            if (changesError) throw changesError;

            toast.success("Approval request created");
            fetchRequests();
            return request;
        } catch (error) {
            console.error("Error creating approval request:", error);
            toast.error("Failed to create approval request");
            throw error;
        }
    };

    const approveRequest = async (request: ApprovalRequest) => {
        try {
            // 1. Publish tokens (Apply changes)
            // We can use the DB function if we want to publish ALL changes, 
            // but this request might only be for a subset. 
            // However, our model assumes current Drafts are the source.
            // If we approve, we should probably publish the tokens referenced in this request.

            // Fetch changes for this request to know which tokens to publish
            const changes = await fetchRequestDetails(request.id);

            // Loop and publish each token? Or custom DB function?
            // "publish_token" takes ID. We have paths.
            // We need to resolve paths to IDs or use a path-based publisher.
            // Let's rely on client-side ID resolution or fetching.
            // But wait, 'changes' doesn't have token ID.

            // Option: Call a new RPC function 'publish_tokens_by_paths(ds_id, paths[])'
            // Option 2: Just update 'status' to APPROVED, and let a separate process publish?
            // "Verify Publish promotes Draft to Live" is a requirement.

            // Let's use the 'publish_token' function we saw. But we need IDs.
            // We can fetch IDs for these paths.
            const { data: tokensToPublish } = await supabase
                .from("design_tokens")
                .select("id")
                .eq("design_system_id", request.design_system_id)
                .in("path", changes.map(c => c.token_path));

            if (tokensToPublish) {
                for (const t of tokensToPublish) {
                    await supabase.rpc('publish_token' as any, { p_token_id: t.id });
                }
            }

            // 2. Update Request Status
            const { error } = await supabase
                .from("approval_requests")
                .update({ status: 'PUBLISHED' }) // Skip APPROVED, go straight to PUBLISHED for MVP
                .eq("id", request.id);

            if (error) throw error;

            toast.success("Request approved and published");
            fetchRequests();
        } catch (error) {
            console.error("Error approving request:", error);
            toast.error("Failed to approve request");
        }
    };

    const rejectRequest = async (requestId: string) => {
        try {
            const { error } = await supabase
                .from("approval_requests")
                .update({ status: 'REJECTED' })
                .eq("id", requestId);

            if (error) throw error;
            toast.success("Request rejected");
            fetchRequests();
        } catch (error) {
            console.error("Error rejecting request:", error);
            toast.error("Failed to reject request");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [designSystemId]);

    return {
        requests,
        loading,
        fetchRequests,
        fetchRequestDetails,
        createRequest,
        approveRequest,
        rejectRequest
    };
}
