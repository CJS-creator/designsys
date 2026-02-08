// @ts-nocheck
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { DesignToken } from "@/types/tokens";
import { ColorPaletteDisplay } from "@/components/ColorPaletteDisplay";
import { TypographyDisplay } from "@/components/TypographyDisplay";
import { SpacingDisplay } from "@/components/SpacingDisplay";
import { ShadowDisplay } from "@/components/ShadowDisplay";
import { GridDisplay } from "@/components/GridDisplay";
import { BorderRadiusDisplay } from "@/components/BorderRadiusDisplay";
import { BrandSwitcher } from "@/components/BrandSwitcher";
import { Wand2, Shield, Palette, Type, Ruler, Cast, Grid3X3, Smartphone, ExternalLink, Box, Layers, BookOpen, Search, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, AnimatedTabsTrigger } from "@/components/ui/animated-tabs";
import { DesignSystemSkeleton } from "@/components/DesignSystemSkeleton";
import { ModeToggle } from "@/components/mode-toggle";
import { toast } from "sonner";

export function PublicDocViewer() {
    const { shareId } = useParams<{ shareId: string }>();
    const [designSystem, setDesignSystem] = useState<GeneratedDesignSystem | null>(null);
    const [tokens, setTokens] = useState<DesignToken[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPublicData = async () => {
            if (!shareId) return;

            // 1. Fetch Design System Metadata
            const { data: dsData, error: dsError } = await supabase
                .from("design_systems")
                .select("*")
                .eq("share_id", shareId)
                .eq("is_public", true)
                .single();

            if (dsError || !dsData) {
                setIsLoading(false);
                return;
            }

            const ds = dsData.design_system_data as unknown as GeneratedDesignSystem;
            setDesignSystem({ ...ds, id: dsData.id });

            // 2. Fetch Published Tokens
            const { data: tokenData, error: tokenError } = await supabase
                .from("design_tokens")
                .select("*")
                .eq("design_system_id", dsData.id)
                .eq("status", "published");

            if (tokenData) {
                setTokens(tokenData.map(t => ({
                    ...t,
                    value: t.value as any,
                    type: t.token_type as any
                } as any)));
            }

            setIsLoading(false);
        };

        fetchPublicData();
    }, [shareId]);

    const copyTokenValue = (value: string) => {
        navigator.clipboard.writeText(value);
        toast.success("Value copied!");
    };

    if (isLoading) return <DesignSystemSkeleton />;

    if (!designSystem) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-12 space-y-6">
                <div className="p-4 rounded-full bg-red-500/10 text-red-500">
                    <Shield className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-black">Access Denied</h1>
                    <p className="text-muted-foreground">This design system is either private or does not exist.</p>
                </div>
                <Button asChild variant="outline">
                    <Link to="/">Go Back to DesignForge</Link>
                </Button>
            </div>
        );
    }

    const filteredTokens = tokens.filter(t =>
        t.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Public Header */}
            <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Wand2 className="h-6 w-6 text-primary" />
                        <div>
                            <h1 className="font-bold leading-none">{designSystem.name}</h1>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Documentation Portal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5">Public Access</Badge>
                        <ModeToggle />
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-6 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <TabsList className="bg-muted/50 p-1">
                            <AnimatedTabsTrigger value="overview" className="gap-2">
                                <BookOpen className="h-4 w-4" /> Overview
                            </AnimatedTabsTrigger>
                            <AnimatedTabsTrigger value="tokens" className="gap-2">
                                <Layers className="h-4 w-4" /> Tokens
                            </AnimatedTabsTrigger>
                        </TabsList>

                        <div className="relative max-w-xs w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search documentation..."
                                className="pl-9 h-9 text-xs"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl border bg-card/30 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Palette className="h-5 w-5 text-primary" />
                                    <h3 className="font-bold">Palette</h3>
                                </div>
                                <ColorPaletteDisplay colors={designSystem.colors} />
                            </div>

                            <div className="p-6 rounded-2xl border bg-card/30 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Type className="h-5 w-5 text-primary" />
                                    <h3 className="font-bold">Typography</h3>
                                </div>
                                <TypographyDisplay typography={designSystem.typography} />
                            </div>

                            <div className="p-6 rounded-2xl border bg-card/30 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="h-5 w-5 text-primary" />
                                    <h3 className="font-bold">Spacing & Radius</h3>
                                </div>
                                <div className="space-y-4">
                                    <SpacingDisplay spacing={designSystem.spacing} />
                                    <BorderRadiusDisplay borderRadius={designSystem.borderRadius} />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="tokens" className="animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredTokens.map((token: any) => (
                                <div key={token.id} className="p-4 rounded-xl border bg-card/50 hover:border-primary/30 transition-colors group">
                                    <div className="flex items-center gap-3 mb-3">
                                        {token.type === 'color' ? (
                                            <div className="w-8 h-8 rounded-lg border shadow-sm" style={{ backgroundColor: isValidColor(token.value) ? token.value : 'transparent' }} />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg border bg-muted flex items-center justify-center">
                                                <Box className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-bold leading-none truncate">{token.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-mono mt-1 opacity-60 truncate">{token.path}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 p-1.5 rounded bg-muted/40 border border-border/50">
                                        <code className="text-[10px] font-mono truncate">{String(token.value)}</code>
                                        <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyTokenValue(String(token.value))}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            <footer className="border-t py-8 bg-card/30 backdrop-blur-sm">
                <div className="container mx-auto px-6 text-center space-y-2">
                    <p className="text-xs text-muted-foreground">Generated and hosted by <strong>DesignForge</strong></p>
                    <Link to="/" className="text-[10px] text-primary hover:underline font-bold inline-flex items-center gap-1">
                        Create your own system <ExternalLink className="h-3 w-3" />
                    </Link>
                </div>
            </footer>
        </div>
    );
}
