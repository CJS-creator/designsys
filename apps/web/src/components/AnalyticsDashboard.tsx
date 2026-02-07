import { useState, useEffect } from "react";
import { monitor } from "@/lib/monitoring";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Activity, Download, MousePointer2, BarChart3 } from "lucide-react";

interface AnalyticsDashboardProps {
    designSystemId: string;
}

export function AnalyticsDashboard({ designSystemId }: AnalyticsDashboardProps) {
    const [data, setData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalExports: 0,
        totalEdits: 0,
        activeUsers: 0
    });

    useEffect(() => {
        fetchAnalytics();
    }, [designSystemId]);

    const fetchAnalytics = async () => {
        if (!designSystemId) return;
        try {
            const { data: events, error } = await (supabase as any)
                .from("analytics_events")
                .select("*")
                .eq("design_system_id", designSystemId);

            if (error) throw error;

            // Group by event type for a bar chart
            const grouped = (events as any[]).reduce((acc: any, event) => {
                const type = event.event_type;
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {});

            const chartData = Object.keys(grouped).map(key => ({
                name: key.replace(/_/g, " ").toUpperCase(),
                value: grouped[key]
            }));

            setData(chartData);

            // Aggregate stats
            setStats({
                totalExports: (events as any[]).filter(e => e.event_type.startsWith("exported")).length,
                totalEdits: (events as any[]).filter(e => e.event_type === "token_updated").length,
                activeUsers: new Set((events as any[]).map(e => e.metadata?.user_id)).size || 1
            });
        } catch (err) {
            monitor.error("Error fetching analytics", err as Error);
        }
    };

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Download className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Exports</p>
                                <h3 className="text-2xl font-bold">{stats.totalExports}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/5 border-emerald-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Activity className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Token Updates</p>
                                <h3 className="text-2xl font-bold">{stats.totalEdits}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <MousePointer2 className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Collaborators</p>
                                <h3 className="text-2xl font-bold">{stats.activeUsers}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Event Distribution
                    </CardTitle>
                    <CardDescription>Telemetry across all design system interactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: 'currentColor', opacity: 0.5 }}
                                />
                                <YAxis
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: 'currentColor', opacity: 0.5 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
