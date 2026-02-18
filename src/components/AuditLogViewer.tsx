import { useState, useEffect } from "react";
import { monitor } from "@/lib/monitoring";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Clock, Activity, Box, Palette, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface AuditLog {
    id: string;
    action: string;
    entity_type: string;
    entity_id: string | null;
    created_at: string;
    user_id: string | null;
    summary?: string;
    metadata?: unknown;
    old_value?: unknown;
    new_value?: unknown;
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
                    .from("audit_logs")
                    .select("*")
                    .eq("design_system_id", designSystemId)
                    .order("created_at", { ascending: false })
                    .limit(50);

                if (error) throw error;
                setLogs((data as AuditLog[]) || []);
            } catch (err) {
                monitor.error("Error fetching audit logs", err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();

        // Realtime Subscription
        const channel = supabase
            .channel('audit-logs-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'audit_logs',
                    filter: `design_system_id=eq.${designSystemId}`
                },
                (payload) => {
                    setLogs(prev => [payload.new as AuditLog, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [designSystemId]);

    const getActionColor = (action: string) => {
        switch (action.toUpperCase()) {
            case "CREATE": return "bg-green-500/10 text-green-600 border-green-500/20";
            case "UPDATE": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            case "DELETE": return "bg-red-500/10 text-red-600 border-red-500/20";
            case "ARCHIVE": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
            case "RESTORE": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            case "PUBLISH": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
            default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
        }
    };

    const getEntityIcon = (type: string) => {
        switch (type.toUpperCase()) {
            case "TOKEN": return <Box className="h-4 w-4" />;
            case "BRAND": return <Palette className="h-4 w-4" />;
            case "SYSTEM": return <Settings className="h-4 w-4" />;
            default: return <Activity className="h-4 w-4" />;
        }
    };

    return (
        <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <History className="h-5 w-5 text-primary" />
                            Design Audit Trail
                        </CardTitle>
                        <CardDescription>
                            Real-time immutable ledger of design system evolutions.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Accessing Ledger...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl bg-muted/5">
                        No governance activity recorded yet.
                    </div>
                ) : (
                    <div className="relative space-y-6">
                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border/40" />
                        {logs.map((log) => (
                            <div key={log.id} className="flex gap-4 group">
                                <div className="mt-1 relative z-10 flex h-10 w-10 min-w-10 items-center justify-center rounded-full border bg-background shadow-sm group-hover:border-primary/50 transition-colors">
                                    {getEntityIcon(log.entity_type)}
                                </div>
                                <div className="flex-1 space-y-2 p-4 rounded-xl border bg-card/30 hover:bg-card/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge className={cn("text-[9px] font-black uppercase tracking-tighter px-1.5 h-5", getActionColor(log.action))}>
                                                {log.action}
                                            </Badge>
                                            <span className="text-[11px] font-bold text-foreground/70">{log.entity_type}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium leading-snug">
                                        {(log.metadata as any)?.summary || `${log.action} performed on ${log.entity_type}`}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                                        <span className="bg-muted px-1.5 py-0.5 rounded uppercase tracking-tighter">ID: {log.entity_id?.split('.').pop() || 'system'}</span>
                                        <span className="opacity-50">•</span>
                                        <span>User: {log.user_id?.slice(0, 8) || 'anonymous'}</span>
                                    </div>
                                    {log.action === "UPDATE" && log.old_value !== undefined && log.new_value !== undefined && (
                                        <div className="mt-3 p-2 rounded bg-muted/30 border border-border/40 text-[10px] font-mono grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <div className="text-[8px] uppercase text-muted-foreground">Original</div>
                                                <div className="text-red-400 truncate">{JSON.stringify(log.old_value)}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[8px] uppercase text-muted-foreground">New</div>
                                                <div className="text-green-400 truncate">{JSON.stringify(log.new_value)}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
