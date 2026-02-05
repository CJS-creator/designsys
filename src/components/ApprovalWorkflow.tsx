import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XCircle,
    Clock,
    ShieldCheck,
    ArrowRight,
    MessageSquare,
    History,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { monitor } from '@/lib/monitoring';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

export type ApprovalStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';

interface PendingChange {
    id: string;
    token_path: string;
    old_value: any;
    new_value: any;
    change_type: string;
}

interface ApprovalRequest {
    id: string;
    version_number: string;
    description: string;
    author_id: string;
    created_at: string;
    status: ApprovalStatus;
    changes?: PendingChange[]; // Joined manually or via separate fetch
}

export const ApprovalWorkflow: React.FC<{ designSystemId?: string }> = ({ designSystemId }) => {
    const { user } = useAuth();
    const { role } = useUserRole(designSystemId || "");
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
    const [changes, setChanges] = useState<PendingChange[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingChanges, setLoadingChanges] = useState(false);

    const fetchRequests = async () => {
        if (!designSystemId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('approval_requests')
                .select('*')
                .eq('design_system_id', designSystemId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data as any[] || []);
            if (data && data.length > 0 && !selectedRequest) {
                setSelectedRequest(data[0] as any);
            }
        } catch (error) {
            monitor.error("Error fetching approval requests", error as Error);
            toast.error("Failed to load approval requests");
        } finally {
            setLoading(false);
        }
    };

    const fetchChanges = async (requestId: string) => {
        setLoadingChanges(true);
        try {
            const { data, error } = await supabase
                .from('approval_changes')
                .select('*')
                .eq('approval_request_id', requestId);

            if (error) throw error;
            setChanges(data as any[] || []);
        } catch (error) {
            monitor.error("Error fetching changes", error as Error);
        } finally {
            setLoadingChanges(false);
        }
    };

    useEffect(() => {
        if (designSystemId) {
            fetchRequests();
        }
    }, [designSystemId]);

    useEffect(() => {
        if (selectedRequest) {
            fetchChanges(selectedRequest.id);
        }
    }, [selectedRequest]);

    const updateStatus = async (id: string, status: ApprovalStatus) => {
        try {
            const { error } = await supabase
                .from('approval_requests')
                .update({ status })
                .eq('id', id);

            if (error) throw error;

            toast.success(`Request ${status.toLowerCase().replace('_', ' ')}`);

            // Update local state
            setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
            if (selectedRequest?.id === id) {
                setSelectedRequest(prev => prev ? { ...prev, status } : null);
            }
        } catch (error) {
            monitor.error("Error updating status", error as Error);
            toast.error("Failed to update status");
        }
    };

    const getStatusBadge = (status: ApprovalStatus) => {
        switch (status) {
            case 'DRAFT': return <Badge variant="secondary">Draft</Badge>;
            case 'PENDING_REVIEW': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending Review</Badge>;
            case 'APPROVED': return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>;
            case 'REJECTED': return <Badge variant="destructive">Rejected</Badge>;
            case 'PUBLISHED': return <Badge variant="default" className="bg-primary text-primary-foreground">Published</Badge>;
        }
    };

    const canApprove = role === 'owner' || role === 'editor';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
            {/* Sidebar: Requests List */}
            <div className="lg:col-span-1 border-2 border-primary/10 rounded-[2rem] bg-card/30 backdrop-blur-xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-primary/10 bg-primary/5">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Governance</h3>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Review and approve system changes</p>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-3">
                        {loading ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                        ) : requests.length === 0 ? (
                            <div className="text-center p-4 text-muted-foreground text-sm">No approval requests found.</div>
                        ) : (
                            requests.map((req) => (
                                <motion.div
                                    key={req.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedRequest(req)}
                                    className={cn(
                                        "p-4 rounded-2xl border transition-all cursor-pointer group",
                                        selectedRequest?.id === req.id
                                            ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                                            : "bg-white/5 border-white/10 hover:border-primary/50"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-black text-sm tracking-tighter">v{req.version_number}</div>
                                        {getStatusBadge(req.status)}
                                    </div>
                                    <div className="text-xs font-bold mb-3 line-clamp-1">{req.description}</div>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                        <span>User {req.author_id.slice(0, 4)}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(req.created_at).toLocaleDateString()}</span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Main: Change Review */}
            <div className="lg:col-span-2 border-2 border-primary/10 rounded-[2rem] bg-card/30 backdrop-blur-xl overflow-hidden flex flex-col relative">
                <AnimatePresence mode="wait">
                    {selectedRequest ? (
                        <motion.div
                            key={selectedRequest.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col h-full"
                        >
                            <div className="p-8 border-b border-primary/10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-3xl font-black tracking-tighter">v{selectedRequest.version_number}</h2>
                                            {getStatusBadge(selectedRequest.status)}
                                        </div>
                                        <p className="text-muted-foreground font-medium">Author ID: {selectedRequest.author_id}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {canApprove && selectedRequest.status === 'PENDING_REVIEW' && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-full border-destructive/50 text-destructive hover:bg-destructive/10"
                                                    onClick={() => updateStatus(selectedRequest.id, 'REJECTED')}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="rounded-full shadow-lg shadow-primary/20"
                                                    onClick={() => updateStatus(selectedRequest.id, 'APPROVED')}
                                                >
                                                    <ShieldCheck className="w-4 h-4 mr-2" /> Approve
                                                </Button>
                                            </>
                                        )}
                                        {canApprove && selectedRequest.status === 'APPROVED' && (
                                            <Button
                                                size="sm"
                                                className="rounded-full bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20"
                                                onClick={() => updateStatus(selectedRequest.id, 'PUBLISHED')}
                                            >
                                                <History className="w-4 h-4 mr-2" /> Publish Version
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 italic text-sm text-foreground/80">
                                    "{selectedRequest.description}"
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Pending Changes ({changes.length})</h4>
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                                            <span>Old</span>
                                            <ArrowRight className="w-3 h-3" />
                                            <span>New</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {loadingChanges ? (
                                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                                        ) : changes.length === 0 ? (
                                            <div className="text-center p-4 text-muted-foreground text-sm">No changes recorded for this request.</div>
                                        ) : (
                                            changes.map((change) => (
                                                <div key={change.id} className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                                                    <div className="space-y-1">
                                                        <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{change.change_type}</div>
                                                        <div className="text-sm font-bold font-mono text-primary">{change.token_path}</div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-mono line-through text-red-500 opacity-60">
                                                                {JSON.stringify(change.old_value)}
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
                                                        <div className="flex flex-col items-center">
                                                            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-mono font-bold text-green-500">
                                                                {JSON.stringify(change.new_value)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary">Discussion</h4>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 opacity-50 flex items-center justify-center h-24 border-dashed">
                                            <p className="text-xs font-medium text-muted-foreground">No comments yet. Start the conversation.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-white/5 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-muted-foreground flex items-center">
                                                Write a comment...
                                            </div>
                                            <Button size="icon" variant="ghost" className="rounded-full">
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground p-8 text-center">
                            <ShieldCheck className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-sm font-medium">Select a request from the sidebar to review changes</p>
                        </div>
                    )}
                </AnimatePresence>

                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            </div>
        </div>
    );
};
