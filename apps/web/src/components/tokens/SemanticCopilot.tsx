import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Moon, Palette, CheckCircle2, RefreshCw, Layout } from "lucide-react";
import { DesignToken } from "@/types/tokens";
import { runAICopilot, AIThemeResult } from "@/lib/ai";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StyleRecommendationPanel } from "@/components/ui-ux";

interface SemanticCopilotProps {
    designSystemId: string;
    tokens: DesignToken[];
    onRefresh: () => void;
}

export function SemanticCopilot({ designSystemId, tokens, onRefresh }: SemanticCopilotProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewTheme, setPreviewTheme] = useState<AIThemeResult | null>(null);
    const [activeTab, setActiveTab] = useState("darkmode");

    const generateDarkMode = async () => {
        setIsGenerating(true);
        try {
            const colorTokens = tokens.filter(t => t.type === 'color');

            const result = await runAICopilot('generate-theme', colorTokens, {
                mode: 'dark',
                designSystemName: 'Main'
            });

            if (result && result.overrides) {
                setPreviewTheme(result);
                toast.success("Dark Mode theme generated!");
            }
        } catch (error) {
            toast.error("Failed to generate Dark Mode");
        } finally {
            setIsGenerating(false);
        }
    };

    const saveGeneratedTheme = async () => {
        if (!previewTheme) return;

        try {
            const { error } = await supabase
                .from('brand_themes')
                .insert({
                    design_system_id: designSystemId,
                    name: previewTheme.themeName,
                    mode: 'dark',
                    tokens_override: previewTheme.overrides as any,
                    is_default: false
                });

            if (error) throw error;

            toast.success(`${previewTheme.themeName} saved successfully!`);
            setPreviewTheme(null);
            onRefresh();
        } catch (error) {
            toast.error("Failed to save theme");
        }
    };

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="darkmode" className="gap-2">
                        <Moon className="h-4 w-4" />
                        Dark Mode
                    </TabsTrigger>
                    <TabsTrigger value="palette" className="gap-2">
                        <Palette className="h-4 w-4" />
                        Palette
                    </TabsTrigger>
                    <TabsTrigger value="consolidation" className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Consolidation
                    </TabsTrigger>
                    <TabsTrigger value="styles" className="gap-2">
                        <Layout className="h-4 w-4" />
                        Styles
                    </TabsTrigger>
                </TabsList>

                {/* Dark Mode Generator */}
                <TabsContent value="darkmode">
                    <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Moon className="h-24 w-24 rotate-12" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                AI Dark Mode Copilot
                            </CardTitle>
                            <CardDescription>
                                Automatically generate a high-contrast dark theme by analyzing your current light mode tokens.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl border bg-background flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold">Source Tokens</p>
                                    <p className="text-xs text-muted-foreground">{tokens.filter(t => t.type === 'color').length} Colors Detected</p>
                                </div>
                                <Button
                                    onClick={generateDarkMode}
                                    disabled={isGenerating}
                                    className="font-bold gap-2"
                                >
                                    {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Moon className="h-4 w-4" />}
                                    Generate Dark Theme
                                </Button>
                            </div>

                            {previewTheme && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top duration-500">
                                    <div className="p-4 rounded-xl border bg-background space-y-3 shadow-inner">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="font-mono text-[10px]">{previewTheme.themeName}</Badge>
                                            <span className="text-[10px] text-muted-foreground">{previewTheme.overrides.length} Overrides</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {previewTheme.overrides.slice(0, 4).map((o, i) => (
                                                <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-muted/50 text-[10px] truncate">
                                                    <div className="w-3 h-3 rounded border" style={{ backgroundColor: o.value }} />
                                                    <span className="font-mono truncate">{o.path}</span>
                                                </div>
                                            ))}
                                            {previewTheme.overrides.length > 4 && (
                                                <div className="text-[10px] text-muted-foreground flex items-center justify-center italic">
                                                    + {previewTheme.overrides.length - 4} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button className="flex-1 font-bold" onClick={saveGeneratedTheme}>
                                            Save Theme
                                        </Button>
                                        <Button variant="outline" onClick={() => setPreviewTheme(null)}>
                                            Discard
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Palette Builder */}
                <TabsContent value="palette">
                    <Card className="border-secondary/20 bg-secondary/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Palette className="h-24 w-24 -rotate-12" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-secondary-foreground">
                                <Sparkles className="h-5 w-5 text-secondary-foreground" />
                                AI Palette Builder
                            </CardTitle>
                            <CardDescription>
                                Pick a base color and generate a harmonized 10-step scale based on perceptual uniform spacing.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl border bg-background space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Select Base Color</label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a token..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tokens.filter(t => t.type === 'color').map(t => (
                                                <SelectItem key={t.path} value={t.path}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded border" style={{ backgroundColor: t.value }} />
                                                        {t.path}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                                        <div key={shade} className="text-center">
                                            <div className="h-10 rounded border" style={{ backgroundColor: `hsl(220, 85%, ${100 - shade / 10}%)` }} />
                                            <p className="text-[10px] mt-1">{shade}</p>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="secondary" className="w-full font-bold gap-2">
                                    <Palette className="h-4 w-4" />
                                    Generate Scale
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Consolidation */}
                <TabsContent value="consolidation">
                    <Card className="border-cyan-500/20 bg-cyan-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Palette className="h-24 w-24 rotate-45" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-cyan-500" />
                                AI Consolidation Assistant
                            </CardTitle>
                            <CardDescription>
                                Identifies duplicate values across your design system and groups them under semantic aliases.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    <div className="p-6 rounded-xl border bg-background/50 backdrop-blur-sm space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Consolidation Engine</h3>
                                            <Button size="sm" variant="outline" className="h-8 gap-2">
                                                <RefreshCw className="h-3.5 w-3.5" />
                                                Scan for Duplicates
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="p-4 rounded-lg border border-dashed border-cyan-500/30 bg-cyan-500/5 text-center transition-all hover:bg-cyan-500/10 cursor-pointer">
                                                <p className="text-xs text-cyan-700 font-medium">Ready to analyze {tokens.length} design tokens...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl border bg-background space-y-3">
                                        <h4 className="text-xs font-bold uppercase text-muted-foreground">Architect Insights</h4>
                                        <ul className="space-y-2">
                                            <li className="flex gap-2 text-[10px] leading-tight">
                                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mt-1 shrink-0" />
                                                <span>Consolidating 12 HEX duplicates into 3 semantic tokens can reduce maintenance by 40%.</span>
                                            </li>
                                            <li className="flex gap-2 text-[10px] leading-tight">
                                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mt-1 shrink-0" />
                                                <span>3 tokens match common "Action" semantics but have inconsistent naming.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* UI UX Pro Max Styles */}
                <TabsContent value="styles">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layout className="h-5 w-5 text-primary" />
                                Style Recommendations
                            </CardTitle>
                            <CardDescription>
                                AI-powered style recommendations based on industry and brand mood using UI UX Pro Max database.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StyleRecommendationPanel
                                industry="SaaS"
                                productType="General"
                                brandMood={['modern', 'professional']}
                                onApply={(recommendation) => {
                                    toast.success(`Applied ${recommendation.style.name} style recommendations!`);
                                    console.log('Applied recommendations:', recommendation);
                                }}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Accessibility Lab */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Accessibility Lab (WCAG 2.1)
                    </CardTitle>
                    <CardDescription>AI analyzes your color pairs and suggests adjustments for AA/AAA compliance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/20">
                        <div className="max-w-xs mx-auto space-y-4">
                            <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                            <div>
                                <h3 className="font-bold text-sm">Accessibility Ready</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Use the Style Recommendations tab to get industry-specific accessibility guidelines.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
