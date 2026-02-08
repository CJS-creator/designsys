import { useState } from "react";
import { toast } from "sonner";
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
    old_value: unknown;
    new_value: unknown;
}

/**
 * useApprovals hook - Stub implementation
 * 
 * This hook requires the following database tables that are not yet created:
 * - approval_requests
 * - approval_changes
 * 
 * Once these tables are created via migration, this hook can be fully implemented.
 */
export function useApprovals(_designSystemId?: string) {
    const [requests] = useState<ApprovalRequest[]>([]);
    const [loading] = useState(false);

    const fetchRequests = async () => {
        // Stub: Database tables not yet created
        console.log("useApprovals: approval_requests table not yet created");
    };

    const fetchRequestDetails = async (requestId: string): Promise<ApprovalChange[]> => {
        // Stub: Database tables not yet created
        console.log("useApprovals: approval_changes table not yet created", requestId);
        return [];
    };

    const createRequest = async (description: string, changedTokens: DesignToken[]) => {
        // Stub: Database tables not yet created
        toast.info("Approval workflow requires database setup");
        console.log("useApprovals: Cannot create request - tables not yet created", { description, changedTokens });
    };

    const approveRequest = async (request: ApprovalRequest) => {
        // Stub: Database tables not yet created
        toast.info("Approval workflow requires database setup");
        console.log("useApprovals: Cannot approve request - tables not yet created", request);
    };

    const rejectRequest = async (requestId: string) => {
        // Stub: Database tables not yet created
        toast.info("Approval workflow requires database setup");
        console.log("useApprovals: Cannot reject request - tables not yet created", requestId);
    };

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
