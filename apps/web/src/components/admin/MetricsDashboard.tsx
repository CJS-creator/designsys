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
        avgLatency: 0,
        skillExecutions: 0,
        skillCacheHits: 0,
        skillAvgLatency: 0,
        skillEfficiency: 0
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

            // Skill stats
            const skillEvents = allEvents.filter(e => e.message.includes("skill_execution_completed"));
            const cacheHits = skillEvents.filter(e => e.context?.cached === true);
            const skillLatencies = skillEvents
                .map(e => e.context?.duration_ms)
                .filter(d => typeof d === "number");

            const skillAvg = skillLatencies.length
                ? skillLatencies.reduce((a, b) => a + b, 0) / skillLatencies.length
                : 0;

            setStats({
                totalGenerations: generations.length,
                aiGenerations: aiGens.length,
                patternGenerations: patternGens.length,
                errors: errs.length,
                avgLatency: Math.round(avg),
                skillExecutions: skillEvents.length,
                skillCacheHits: cacheHits.length,
                skillAvgLatency: Math.round(skillAvg),
                skillEfficiency: skillEvents.length > 0
                    ? Math.round((cacheHits.length / skillEvents.length) * 100)
                    : 0
            });
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">System Health & Metrics</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                        <CardTitle className="text-sm font-medium">Skill Cache Hit Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stats.skillEfficiency > 50 ? 'text-green-500' : 'text-yellow-500'}`}>
                            {stats.skillEfficiency}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.skillCacheHits} hits / {stats.skillExecutions} total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Skill Latency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.skillAvgLatency}ms</div>
                        <p className="text-xs text-muted-foreground">
                            Avg execution time
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Latency (Overall)</CardTitle>
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

            <Tabs defaultValue="events" className="w-full">
                <TabsList>
                    <TabsTrigger value="events">Event Log</TabsTrigger>
                    <TabsTrigger value="skills">Skill Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="events">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Event Log</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
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
                                                <pre className="mt-2 w-full rounded bg-slate-950 p-2 text-xs text-white overflow-x-auto">
                                                    {JSON.stringify(event.context, null, 2)}
                                                </pre>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="skills">
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Execution Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {events.filter(e => e.message.includes("skill_execution_completed")).slice().reverse().map((event, i) => (
                                    <div key={i} className="p-3 border rounded-lg bg-muted/20 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{event.context?.skill_id}</p>
                                            <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={event.context?.cached ? "secondary" : "outline"}>
                                                {event.context?.cached ? "Cached" : "Fresh"}
                                            </Badge>
                                            <p className="text-sm font-mono mt-1">{event.context?.duration_ms}ms</p>
                                        </div>
                                    </div>
                                ))}
                                {events.filter(e => e.message.includes("skill_execution_completed")).length === 0 && (
                                    <p className="text-center text-muted-foreground py-8">No skill executions tracked yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
}
