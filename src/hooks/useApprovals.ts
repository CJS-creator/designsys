import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DesignToken } from "@/types/tokens";
import { useAuth } from "@/contexts/AuthContext";
import { Json, Tables, TablesInsert } from "@/integrations/supabase/types";
import { monitor } from "@/lib/monitoring";
import { trackEvent } from "@/lib/analytics";
import { publishApprovedVersion } from "@/lib/versioning";

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
    old_value: unknown;
    new_value: unknown;
}

const serialize = (value: unknown): string => JSON.stringify(value ?? null);

const normalizeChangeType = (changeType: string): ApprovalChange["change_type"] => {
    const normalized = changeType.toLowerCase();
    if (normalized === "create" || normalized === "update" || normalized === "delete") {
        return normalized;
    }
    return "update";
};

const displayActor = (
    authorId: string,
    profileMap: Map<string, { username: string | null; full_name: string | null }>
): string => {
    const profile = profileMap.get(authorId);
    if (!profile) return `user-${authorId.slice(0, 8)}`;
    return profile.username || profile.full_name || `user-${authorId.slice(0, 8)}`;
};

type ApprovalChangeInsert = Omit<TablesInsert<"approval_changes">, "approval_request_id">;

const mapTokensToChanges = (tokens: DesignToken[]): ApprovalChangeInsert[] => {
    const mappedChanges: (ApprovalChangeInsert | null)[] = tokens.map((token) => {
        const hasDifferentValue = serialize(token.publishedValue) !== serialize(token.value);
        const hasDraftFlag = token.syncStatus === "changed";

        if (token.status === "archived") {
            return {
                token_path: token.path,
                old_value: (token.publishedValue as Json) ?? null,
                new_value: null,
                change_type: "delete",
            };
        }

        if (token.publishedValue === undefined) {
            return {
                token_path: token.path,
                old_value: null,
                new_value: (token.value as Json) ?? null,
                change_type: "create",
            };
        }

        if (hasDifferentValue || hasDraftFlag) {
            return {
                token_path: token.path,
                old_value: (token.publishedValue as Json) ?? null,
                new_value: (token.value as Json) ?? null,
                change_type: "update",
            };
        }

        return null;
    });

    return mappedChanges.filter((change) => change !== null) as ApprovalChangeInsert[];
};

const safeAuditInsert = async (
    designSystemId: string,
    action: string,
    summary: string,
    entityId: string,
    metadata: Record<string, Json | undefined>
) => {
    try {
        await supabase.from("audit_logs").insert({
            design_system_id: designSystemId,
            action,
            entity_type: "SYSTEM",
            entity_id: entityId,
            summary,
            metadata: metadata as Json,
        });
    } catch (error) {
        monitor.warn("Failed to record approval audit event", { error: (error as Error).message });
    }
};

export function useApprovals(designSystemId?: string) {
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchRequests = useCallback(async () => {
        if (!designSystemId) {
            setRequests([]);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("approval_requests")
                .select("*")
                .eq("design_system_id", designSystemId)
                .order("created_at", { ascending: false });

            if (error) throw error;

            const rows = (data || []) as Tables<"approval_requests">[];
            const authorIds = Array.from(new Set(rows.map((row) => row.author_id)));
            const profileMap = new Map<string, { username: string | null; full_name: string | null }>();

            if (authorIds.length > 0) {
                const { data: profiles } = await supabase
                    .from("profiles")
                    .select("id, username, full_name")
                    .in("id", authorIds);

                (profiles || []).forEach((profile) => {
                    profileMap.set(profile.id, {
                        username: profile.username,
                        full_name: profile.full_name,
                    });
                });
            }

            const mappedRequests: ApprovalRequest[] = rows.map((row) => ({
                id: row.id,
                design_system_id: row.design_system_id,
                author_id: row.author_id,
                version_number: row.version_number,
                description: row.description || "No description provided",
                status: row.status,
                created_at: row.created_at,
                author: { email: displayActor(row.author_id, profileMap) },
            }));

            setRequests(mappedRequests);
        } catch (error) {
            monitor.error("Error fetching approval requests", error as Error);
            toast.error("Failed to load approval requests");
        } finally {
            setLoading(false);
        }
    }, [designSystemId]);

    const fetchRequestDetails = useCallback(async (requestId: string): Promise<ApprovalChange[]> => {
        try {
            const { data, error } = await supabase
                .from("approval_changes")
                .select("*")
                .eq("approval_request_id", requestId)
                .order("created_at", { ascending: true });

            if (error) throw error;

            return ((data || []) as Tables<"approval_changes">[]).map((change) => ({
                id: change.id,
                approval_request_id: change.approval_request_id,
                token_path: change.token_path,
                change_type: normalizeChangeType(change.change_type),
                old_value: change.old_value,
                new_value: change.new_value,
            }));
        } catch (error) {
            monitor.error("Error fetching approval request details", error as Error);
            toast.error("Failed to load request details");
            return [];
        }
    }, []);

    const createRequest = useCallback(async (description: string, changedTokens: DesignToken[]): Promise<boolean> => {
        if (!designSystemId || !user) {
            toast.error("Sign in to submit approval requests");
            return false;
        }

        const normalizedDescription = description.trim();
        if (!normalizedDescription) {
            toast.error("Description is required");
            return false;
        }

        const changeRows = mapTokensToChanges(changedTokens);
        if (changeRows.length === 0) {
            toast.info("No pending token changes found");
            return false;
        }

        setLoading(true);
        try {
            const { count } = await supabase
                .from("approval_requests")
                .select("id", { count: "exact", head: true })
                .eq("design_system_id", designSystemId);

            const versionNumber = `v${(count || 0) + 1}`;

            const { data: requestRow, error: requestError } = await supabase
                .from("approval_requests")
                .insert({
                    design_system_id: designSystemId,
                    author_id: user.id,
                    version_number: versionNumber,
                    description: normalizedDescription,
                    status: "PENDING_REVIEW",
                })
                .select("*")
                .single();

            if (requestError || !requestRow) throw requestError;

            const requestChanges: TablesInsert<"approval_changes">[] = changeRows.map((change) => ({
                ...change,
                approval_request_id: requestRow.id,
            }));

            const { error: changesError } = await supabase.from("approval_changes").insert(requestChanges);
            if (changesError) throw changesError;

            await safeAuditInsert(
                designSystemId,
                "CREATE",
                "Approval request submitted",
                requestRow.id,
                {
                    request_id: requestRow.id,
                    request_status: requestRow.status,
                    change_count: changeRows.length,
                }
            );

            await trackEvent(designSystemId, "approval_request_created", {
                request_id: requestRow.id,
                change_count: changeRows.length,
            });

            await fetchRequests();
            toast.success("Approval request submitted");
            return true;
        } catch (error) {
            monitor.error("Error creating approval request", error as Error);
            toast.error("Failed to submit approval request");
            return false;
        } finally {
            setLoading(false);
        }
    }, [designSystemId, fetchRequests, user]);

    const loadDesignSystemTokens = useCallback(async () => {
        if (!designSystemId) return null;
        const { data, error } = await supabase
            .from("design_systems")
            .select("design_system_data")
            .eq("id", designSystemId)
            .single();

        if (error) throw error;
        const designSystemData = (data?.design_system_data as Record<string, unknown>) || {};
        const tokens = Array.isArray(designSystemData.tokens)
            ? (designSystemData.tokens as DesignToken[])
            : [];
        return { designSystemData, tokens };
    }, [designSystemId]);

    const saveDesignSystemTokens = useCallback(async (
        designSystemData: Record<string, unknown>,
        tokens: DesignToken[]
    ) => {
        if (!designSystemId) return;
        const { error } = await supabase
            .from("design_systems")
            .update({
                design_system_data: {
                    ...designSystemData,
                    tokens: tokens as unknown as Json[],
                } as Json,
            })
            .eq("id", designSystemId);

        if (error) throw error;
    }, [designSystemId]);

    const approveRequest = useCallback(async (request: ApprovalRequest): Promise<boolean> => {
        if (!designSystemId) return false;

        setLoading(true);
        try {
            const requestChanges = await fetchRequestDetails(request.id);
            const tokenPayload = await loadDesignSystemTokens();
            if (!tokenPayload) return false;

            const { designSystemData, tokens } = tokenPayload;
            const changedTokenPaths = new Set(requestChanges.map((change) => change.token_path));

            const publishedTokens: DesignToken[] = tokens.map((token) => {
                if (!changedTokenPaths.has(token.path)) return token;

                const tokenChange = requestChanges.find((change) => change.token_path === token.path);
                if (!tokenChange) return token;

                if (tokenChange.change_type === "delete") {
                    return {
                        ...token,
                        status: "archived" as const,
                        value: (token.publishedValue ?? token.value) as DesignToken["value"],
                        syncStatus: "synced" as const,
                    } as DesignToken;
                }

                return {
                    ...token,
                    status: token.status === "archived" ? "archived" : "published",
                    publishedValue: token.value,
                    syncStatus: "synced" as const,
                } as DesignToken;
            });


            await saveDesignSystemTokens(designSystemData, publishedTokens);

            // Use the versioning utility to create a snapshot and update status
            const versionPublished = await publishApprovedVersion(request.id);
            if (!versionPublished) {
                // Fallback to manual status update if versioning fails
                await supabase
                    .from("approval_requests")
                    .update({ status: "PUBLISHED" })
                    .eq("id", request.id);
            }

            const leadTimeMs = Date.now() - new Date(request.created_at).getTime();

            await safeAuditInsert(
                designSystemId,
                "PUBLISH",
                "Approval request published",
                request.id,
                {
                    request_id: request.id,
                    request_status: "PUBLISHED",
                    change_count: requestChanges.length,
                    lead_time_ms: leadTimeMs,
                }
            );

            await trackEvent(designSystemId, "approval_request_published", {
                request_id: request.id,
                change_count: requestChanges.length,
                lead_time_ms: leadTimeMs,
            });

            await fetchRequests();
            toast.success("Changes approved and published");
            return true;
        } catch (error) {
            monitor.error("Error approving request", error as Error);
            toast.error("Failed to approve request");
            return false;
        } finally {
            setLoading(false);
        }
    }, [designSystemId, fetchRequestDetails, fetchRequests, loadDesignSystemTokens, saveDesignSystemTokens]);

    const rejectRequest = useCallback(async (requestId: string): Promise<boolean> => {
        if (!designSystemId) return false;

        setLoading(true);
        try {
            const requestChanges = await fetchRequestDetails(requestId);
            const tokenPayload = await loadDesignSystemTokens();
            if (!tokenPayload) return false;

            const { designSystemData, tokens } = tokenPayload;
            const changedTokenPaths = new Set(requestChanges.map((change) => change.token_path));

            const revertedTokens: DesignToken[] = tokens.flatMap((token): DesignToken[] => {
                if (!changedTokenPaths.has(token.path)) return [token];

                const tokenChange = requestChanges.find((change) => change.token_path === token.path);
                if (!tokenChange) return [token];

                if (tokenChange.change_type === "create") {
                    if (token.publishedValue === undefined) return [];
                    return [{
                        ...token,
                        status: "published" as const,
                        value: token.publishedValue as DesignToken["value"],
                        syncStatus: "synced" as const,
                    } as DesignToken];
                }

                if (tokenChange.change_type === "delete") {
                    return [{
                        ...token,
                        status: "published" as const,
                        value: (token.publishedValue ?? token.value) as DesignToken["value"],
                        syncStatus: "synced" as const,
                    } as DesignToken];
                }

                return [{
                    ...token,
                    value: (token.publishedValue ?? token.value) as DesignToken["value"],
                    syncStatus: "synced" as const,
                } as DesignToken];
            });

            await saveDesignSystemTokens(designSystemData, revertedTokens);

            const { error: statusError } = await supabase
                .from("approval_requests")
                .update({ status: "REJECTED" })
                .eq("id", requestId);

            if (statusError) throw statusError;

            const rejectedRequest = requests.find((request) => request.id === requestId);
            const leadTimeMs = rejectedRequest
                ? Date.now() - new Date(rejectedRequest.created_at).getTime()
                : 0;

            await safeAuditInsert(
                designSystemId,
                "UPDATE",
                "Approval request rejected",
                requestId,
                {
                    request_id: requestId,
                    request_status: "REJECTED",
                    change_count: requestChanges.length,
                    lead_time_ms: leadTimeMs,
                }
            );

            await trackEvent(designSystemId, "approval_request_rejected", {
                request_id: requestId,
                change_count: requestChanges.length,
                lead_time_ms: leadTimeMs,
            });

            await fetchRequests();
            toast.success("Request rejected");
            return true;
        } catch (error) {
            monitor.error("Error rejecting request", error as Error);
            toast.error("Failed to reject request");
            return false;
        } finally {
            setLoading(false);
        }
    }, [designSystemId, fetchRequestDetails, fetchRequests, loadDesignSystemTokens, requests, saveDesignSystemTokens]);

    useEffect(() => {
        if (!designSystemId) return;

        fetchRequests();

        const channel = supabase
            .channel(`approval-requests-${designSystemId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "approval_requests",
                    filter: `design_system_id=eq.${designSystemId}`,
                },
                () => {
                    fetchRequests();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [designSystemId, fetchRequests]);

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
