import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export type ApprovalStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';

interface ApprovalWorkflowProps {
    designSystemId?: string;
}

/**
 * ApprovalWorkflow component - Stub implementation
 * 
 * This component requires the following database tables that are not yet created:
 * - approval_requests
 * - approval_changes
 * 
 * Once these tables are created via migration, this component can be fully implemented.
 */
export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = (_props) => {
    return (
        <Card className="border-dashed border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Approval Workflow
                </CardTitle>
                <CardDescription>
                    Manage design system changes through an approval process
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium text-amber-700 dark:text-amber-400">
                            Database Setup Required
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                            The approval workflow requires additional database tables (approval_requests, approval_changes) 
                            to be created. Please run the required migrations to enable this feature.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
