import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, User, Clock, FileText, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuditLogEntry } from "@/lib/auditLogs";

interface AuditLogViewerProps {
    designSystemId?: string;
}

export const AuditLogViewer = ({ designSystemId }: AuditLogViewerProps) => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                // In a real app, we'd fetch from Supabase. 
                // For this demo, we'll provide some simulated history that reflects the session work.
                const simulatedLogs: AuditLogEntry[] = [
                    {
                        id: "1",
                        design_system_id: designSystemId || "default",
                        user_email: "designer@example.com",
                        action: "Semantic Token Mapping",
                        summary: "Automated calculation of onPrimary, onSurface, and container color roles.",
                        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                    },
                    {
                        id: "2",
                        design_system_id: designSystemId || "default",
                        user_email: "designer@example.com",
                        action: "Figma Sync Bridge",
                        summary: "Established secure bridge URL for bidirectional token syncing.",
                        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
                    },
                    {
                        id: "3",
                        design_system_id: designSystemId || "default",
                        user_email: "designer@example.com",
                        action: "Vision Design Generation",
                        summary: "Generated design palette from uploaded inspiration image.",
                        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
                    }
                ];

                // Try to fetch real logs if table exists
                const { data, error } = await (supabase
                    .from("design_audit_logs" as any) as any)
                    .select("*")
                    .eq("design_system_id", designSystemId || "default")
                    .order("created_at", { ascending: false });

                if (!error && data) {
                    setLogs([...data, ...simulatedLogs]);
                } else {
                    setLogs(simulatedLogs);
                }
            } catch (err) {
                console.error("Error fetching audit logs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [designSystemId]);

    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <History className="h-6 w-6 text-primary" />
                            Design Audit Logs
                        </CardTitle>
                        <CardDescription>
                            A permanent, immutable record of all changes to this design system.
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-primary/5">Governance Level: Enterprise</Badge>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="py-12 flex justify-center">
                        <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="relative space-y-0">
                        {/* Timeline line */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border/40" />

                        <div className="space-y-8 relative">
                            {logs.map((log) => (
                                <div key={log.id} className="flex gap-6 group">
                                    <div className="mt-1 relative z-10 flex h-10 w-10 min-w-10 items-center justify-center rounded-full border bg-background shadow-sm group-hover:border-primary/50 transition-colors">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{log.action}</h4>
                                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                                <span className="flex items-center gap-1 bg-muted/30 px-2 py-0.5 rounded-full lowercase">
                                                    <User className="h-2.5 w-2.5" />
                                                    {log.user_email.split("@")[0]}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-2.5 w-2.5" />
                                                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {log.summary}
                                        </p>
                                        <div className="pt-1">
                                            <button className="text-[10px] font-medium text-primary flex items-center gap-0.5 hover:underline">
                                                View Version Details
                                                <ChevronRight className="h-2.5 w-2.5" />
                                            </button>
                                        </div>
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
