import { useState, useEffect } from "react";
import { monitor } from "@/lib/monitoring";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Clock, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface AuditLog {
    id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    created_at: string;
    user_id: string;
    metadata: any;
}

interface AuditLogViewerProps {
    designSystemId?: string;
}

export const AuditLogViewer = ({ designSystemId }: AuditLogViewerProps) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            if (!designSystemId) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("audit_logs" as any)
                    .select("*")
                    .eq("design_system_id", designSystemId)
                    .order("created_at", { ascending: false })
                    .limit(50);

                if (error) throw error;
                setLogs((data as any) || []);
            } catch (err) {
                monitor.error("Error fetching audit logs", err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [designSystemId]);

    const getActionColor = (action: string) => {
        switch (action) {
            case "CREATE": return "bg-green-500/10 text-green-600 border-green-500/20";
            case "UPDATE": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            case "DELETE": return "bg-red-500/10 text-red-600 border-red-500/20";
            case "PUBLISH": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
            default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
        }
    };

    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <History className="h-6 w-6 text-primary" />
                            Governance Audit Logs
                        </CardTitle>
                        <CardDescription>
                            A permanent, immutable record of all changes to this design system.
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-primary/5">Phase 2.2 Governance</Badge>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 animate-pulse">
                        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-tighter">Loading Governance Records</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl bg-muted/5">
                        No governance activity recorded yet.
                    </div>
                ) : (
                    <div className="relative space-y-0">
                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border/40" />
                        <div className="space-y-6 relative">
                            {logs.map((log) => (
                                <div key={log.id} className="flex gap-4 group">
                                    <div className="mt-1 relative z-10 flex h-10 w-10 min-w-10 items-center justify-center rounded-full border bg-background shadow-sm group-hover:border-primary/50 transition-colors">
                                        <Activity className="h-4 w-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex-1 space-y-1.5 p-4 rounded-xl border bg-card/20 hover:bg-card/40 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`text-[10px] font-extrabold uppercase tracking-widest ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </Badge>
                                                <span className="text-xs font-bold capitalize text-foreground/80">{log.entity_type.toLowerCase()} Modification</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                                                <Clock className="h-3 w-3" />
                                                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            User <span className="text-foreground font-bold">{log.user_id?.slice(0, 8)}</span> performed <span className="lowercase">{log.action}</span> on {log.entity_type.toLowerCase()}
                                            <code className="bg-muted px-1.5 py-0.5 rounded ml-1 text-[10px] font-mono">{log.entity_id || 'system'}</code>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
