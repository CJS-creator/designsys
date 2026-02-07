import { useState, useMemo } from "react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Copy, Check, Terminal, Layout, Layers, Sparkles, Smartphone, Box, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { componentGenerator, Framework } from "@/lib/generators/componentGenerator";

interface ComponentBlueprintsProps {
    designSystem: GeneratedDesignSystem;
}

export const ComponentBlueprints = ({ designSystem }: ComponentBlueprintsProps) => {
    const [copied, setCopied] = useState(false);
    const [framework, setFramework] = useState<Framework>("react");
    const [activeComponent, setActiveComponent] = useState("button");
    const [showStory, setShowStory] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Blueprint copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const currentCode = useMemo(() => {
        if (showStory) {
            return componentGenerator.generateStory(designSystem, activeComponent);
        }
        return componentGenerator.generate(designSystem, framework, activeComponent);
    }, [designSystem, framework, activeComponent, showStory]);

    const components = [
        { id: "button", label: "Button", icon: Layers },
        { id: "card", label: "Card", icon: Layout },
        { id: "input", label: "Input", icon: Sparkles },
        { id: "badge", label: "Badge", icon: Box },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="glass-card overflow-hidden border-2 border-primary/10">
                <CardHeader className="bg-muted/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Code2 className="h-6 w-6 text-primary" />
                                Component Fabric
                            </CardTitle>
                            <CardDescription>
                                Production-ready code snippets with your design tokens baked in.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant={showStory ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowStory(!showStory)}
                                className="h-9 rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest"
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                {showStory ? "Viewing Story" : "Show Story"}
                            </Button>
                            <div className="h-6 w-px bg-border/50 mx-1" />
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">Framework</div>
                            <Select value={framework} onValueChange={(v: Framework) => setFramework(v)}>
                                <SelectTrigger className="w-[140px] h-9 rounded-xl bg-card border-border/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="react" className="text-xs font-bold">React + TW</SelectItem>
                                    <SelectItem value="vue" className="text-xs font-bold">Vue 3 (SFC)</SelectItem>
                                    <SelectItem value="swiftui" className="text-xs font-bold" disabled>SwiftUI</SelectItem>
                                    <SelectItem value="flutter" className="text-xs font-bold" disabled>Flutter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <Tabs value={activeComponent} onValueChange={setActiveComponent} className="w-full">
                        <TabsList className="flex w-full mb-6 bg-muted/20 p-1 rounded-xl overflow-x-auto">
                            {components.map((c) => (
                                <TabsTrigger key={c.id} value={c.id} className="flex-1 gap-2 rounded-lg">
                                    <c.icon className="h-4 w-4" />
                                    <span className="hidden sm:inline">{c.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="relative group">
                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow-xl rounded-lg"
                                    onClick={() => copyToClipboard(currentCode)}
                                >
                                    {copied ? <Check className="h-3.5 w-3.5 mr-2" /> : <Copy className="h-3.5 w-3.5 mr-2" />}
                                    {copied ? "Copied" : "Copy Code"}
                                </Button>
                            </div>
                            <div className="absolute bottom-4 right-6 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                                <Terminal className="h-20 w-20 text-white" />
                            </div>
                            <pre className="p-6 rounded-2xl overflow-auto max-h-[500px] bg-zinc-950 text-zinc-300 font-mono text-xs leading-relaxed border border-zinc-800 shadow-2xl">
                                {currentCode}
                            </pre>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20 rounded-2xl">
                    <CardContent className="pt-6 space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <h5 className="font-black text-xs uppercase tracking-widest text-primary">Semantic Injection</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            These components don't just use colors; they use **design system intent**. We automatically map your tokens to the right accessibility roles.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-muted/30 border-dashed rounded-2xl border-2">
                    <CardContent className="pt-6 space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <Smartphone className="h-5 w-5 text-orange-500" />
                        </div>
                        <h5 className="font-black text-xs uppercase tracking-widest text-orange-500">Cross-Platform Readiness</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            SwiftUI and Flutter support are in the engineering pipeline. Soon you'll be able to export 1:1 match for mobile apps.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
