import { useEffect, useState } from "react";
import { monitor } from "@/lib/monitoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MetricsDashboard() {
    const [events, setEvents] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalGenerations: 0,
        aiGenerations: 0,
        patternGenerations: 0,
        errors: 0,
        avgLatency: 0
    });

    useEffect(() => {
        const fetchMetrics = () => {
            const allEvents = monitor.getRecentEvents();
            setEvents(allEvents);

            // Calculate simple stats
            const generations = allEvents.filter(e => e.message.includes("Generation"));
            const aiGens = generations.filter(e => e.context?.source === "ai");
            const patternGens = generations.filter(e => e.context?.source === "pattern");
            const errs = allEvents.filter(e => e.level === "error");

            const latencies = generations
                .map(e => e.context?.durationMs)
                .filter(d => typeof d === "number");

            const avg = latencies.length
                ? latencies.reduce((a, b) => a + b, 0) / latencies.length
                : 0;

            setStats({
                totalGenerations: generations.length,
                aiGenerations: aiGens.length,
                patternGenerations: patternGens.length,
                errors: errs.length,
                avgLatency: Math.round(avg)
            });
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">System Health & Metrics</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalGenerations}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.aiGenerations} AI / {stats.patternGenerations} Pattern
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgLatency}ms</div>
                        <p className="text-xs text-muted-foreground">
                            Last 100 events
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stats.errors > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {stats.errors}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Recent errors
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={stats.errors === 0 ? "default" : "destructive"}>
                            {stats.errors === 0 ? "Operational" : "Degraded"}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Event Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        {events.slice().reverse().map((event, i) => (
                            <div key={i} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                <span className={`flex h-2 w-2 translate-y-1 rounded-full ${event.level === 'error' ? 'bg-red-500' :
                                        event.level === 'warn' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`} />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {event.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {event.timestamp} • {event.category || event.level}
                                    </p>
                                    {event.context && (
                                        <pre className="mt-2 w-[340px] rounded bg-slate-950 p-2 text-xs text-white overflow-x-auto">
                                            {JSON.stringify(event.context, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
