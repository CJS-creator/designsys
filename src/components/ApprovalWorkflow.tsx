import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { GovernanceDashboard } from "@/components/tokens/GovernanceDashboard";
import { useTokens } from "@/hooks/useTokens";
import { toast } from "sonner";

export type ApprovalStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "PUBLISHED";

interface ApprovalWorkflowProps {
    designSystemId?: string;
    currentUserRole?: "owner" | "editor" | "viewer" | null;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ designSystemId }) => {
    const {
        tokens,
        loading,
        restoreToken,
        permanentlyDeleteToken,
    } = useTokens(designSystemId);

    if (!designSystemId) {
        return (
            <Card className="border-dashed border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Approval Workflow
                    </CardTitle>
                    <CardDescription>Select a design system to manage governance.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Approval Workflow
                    </CardTitle>
                    <CardDescription>Loading governance dashboard...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-24 rounded-md border bg-muted/30 animate-pulse" />
                </CardContent>
            </Card>
        );
    }

    return (
        <GovernanceDashboard
            tokens={tokens}
            designSystemId={designSystemId}
            onTokenClick={(path) => {
                toast.info(`Token selected: ${path}. Open the Tokens tab to edit details.`);
            }}
            onRestore={restoreToken}
            onPermanentDelete={permanentlyDeleteToken}
        />
    );
};
