import { useState } from "react";
import { useApprovals, ApprovalChange } from "@/hooks/useApprovals";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, X, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ApprovalQueueProps {
    designSystemId: string;
}

export function ApprovalQueue({ designSystemId }: ApprovalQueueProps) {
    const { requests, loading, fetchRequestDetails, approveRequest, rejectRequest } = useApprovals(designSystemId);
    const [selectedRequestDetails, setSelectedRequestDetails] = useState<Record<string, ApprovalChange[]>>({});

    const handleExpand = async (requestId: string) => {
        if (!selectedRequestDetails[requestId]) {
            const details = await fetchRequestDetails(requestId);
            setSelectedRequestDetails(prev => ({ ...prev, [requestId]: details }));
        }
    };

    if (loading && requests.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">Loading requests...</div>;
    }

    const pendingRequests = requests.filter(r => r.status === 'PENDING_REVIEW');
    const pastRequests = requests.filter(r => r.status !== 'PENDING_REVIEW');

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Approval Queue
                        <Badge variant="secondary" className="ml-2">{pendingRequests.length} Pending</Badge>
                    </CardTitle>
                    <CardDescription>Review and approve changes to the design system</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {pendingRequests.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground italic">
                                No pending requests.
                            </div>
                        ) : (
                            pendingRequests.map(request => (
                                <AccordionItem key={request.id} value={request.id}>
                                    <AccordionTrigger onClick={() => handleExpand(request.id)} className="hover:no-underline px-4 border rounded-md mb-2 bg-muted/20">
                                        <div className="flex items-center gap-4 w-full text-left">
                                            <Badge variant={request.status === 'PENDING_REVIEW' ? 'default' : 'secondary'}>
                                                {request.status.replace('_', ' ')}
                                            </Badge>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{request.description}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <span>{request.author?.email}</span>
                                                    <span>•</span>
                                                    <span>{formatDistanceToNow(new Date(request.created_at))} ago</span>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 py-4 border-x border-b rounded-b-md -mt-2">
                                        <div className="space-y-4">
                                            <div className="bg-muted/30 p-3 rounded-md">
                                                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Changes</h4>
                                                {selectedRequestDetails[request.id] ? (
                                                    <div className="space-y-2">
                                                        {selectedRequestDetails[request.id].map(change => (
                                                            <div key={change.id} className="flex items-center justify-between text-sm bg-background p-2 rounded border">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="outline" className="text-[10px] font-mono">
                                                                        {change.change_type}
                                                                    </Badge>
                                                                    <code className="text-xs">{change.token_path}</code>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs font-mono">
                                                                    {change.change_type !== 'create' && (
                                                                        <>
                                                                            <span className="bg-red-500/10 text-red-500 px-1 rounded truncate max-w-[100px]">
                                                                                {JSON.stringify(change.old_value)}
                                                                            </span>
                                                                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                                        </>
                                                                    )}
                                                                    <span className="bg-green-500/10 text-green-500 px-1 rounded truncate max-w-[100px]">
                                                                        {JSON.stringify(change.new_value)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs animate-pulse">Loading details...</div>
                                                )}
                                            </div>

                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => rejectRequest(request.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                    <X className="h-4 w-4 mr-1" /> General Reject
                                                </Button>
                                                <Button size="sm" onClick={() => approveRequest(request)} className="bg-green-600 hover:bg-green-700">
                                                    <Check className="h-4 w-4 mr-1" /> Approve & Publish
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        )}
                    </Accordion>
                </CardContent>
            </Card>

            {pastRequests.length > 0 && (
                <div className="opacity-70">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Past Activity</h3>
                    {/* Simple list for past */}
                    <div className="space-y-2">
                        {pastRequests.slice(0, 5).map(request => (
                            <div key={request.id} className="flex items-center justify-between p-3 rounded-md border bg-muted/10">
                                <div className="flex items-center gap-3">
                                    <Badge variant={request.status === 'PUBLISHED' ? 'outline' : 'destructive'} className={request.status === 'PUBLISHED' ? 'text-green-600 border-green-200' : ''}>
                                        {request.status}
                                    </Badge>
                                    <span className="text-sm font-medium">{request.description}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(request.created_at))} ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
