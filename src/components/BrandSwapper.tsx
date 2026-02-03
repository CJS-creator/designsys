import { useState, useEffect } from "react";
import { monitor } from "@/lib/monitoring";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, Plus, SwatchBook, Check, Trash2, Box, Layers, Zap, Eye, Contrast } from "lucide-react";
import { toast } from "sonner";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { VisualMode, mergeTheme } from "@/lib/theming/modes";
import { injectDesignSystemVariables } from "@/lib/theming/injectVariables";

interface BrandTheme {
    id: string;
    name: string;
    overrides: any;
    is_active: boolean;
}

interface BrandSwapperProps {
    designSystemId: string;
    baseDesignSystem: GeneratedDesignSystem;
    onThemeChange: (themedSystem: GeneratedDesignSystem) => void;
}

export function BrandSwapper({ designSystemId, baseDesignSystem, onThemeChange }: BrandSwapperProps) {
    const [themes, setThemes] = useState<BrandTheme[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newThemeName, setNewThemeName] = useState("");
    const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
    const [visualMode, setVisualMode] = useState<VisualMode>("default");

    useEffect(() => {
        fetchThemes();
    }, [designSystemId]);

    const fetchThemes = async () => {
        if (!designSystemId) return;
        try {
            const { data, error } = await (supabase as any)
                .from("brand_themes")
                .select("*")
                .eq("design_system_id", designSystemId);

            if (error) throw error;
            setThemes((data as any[]) || []);
            const active = (data as any[])?.find(t => t.is_active);
            if (active) {
                setActiveThemeId(active.id);
                applyTheme(active);
            }
        } catch (err) {
            monitor.error("Error fetching themes", err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    const createTheme = async () => {
        if (!newThemeName) return;
        try {
            const { data, error } = await (supabase as any)
                .from("brand_themes")
                .insert([{
                    design_system_id: designSystemId,
                    name: newThemeName,
                    overrides: {
                        colors: {
                            primary: baseDesignSystem.colors.primary // Default override
                        }
                    }
                }])
                .select();

            if (error) throw error;
            setThemes([...themes, data[0] as any]);
            setNewThemeName("");
            toast.success("New brand theme created");
        } catch (err) {
            toast.error("Failed to create theme");
        }
    };

    const applyTheme = (theme: BrandTheme | null, mode: VisualMode = visualMode) => {
        setVisualMode(mode);

        if (!theme && mode === 'default') {
            onThemeChange(baseDesignSystem);
            injectDesignSystemVariables(baseDesignSystem);
            setActiveThemeId(null);
            return;
        }

        const brandOverrides = theme?.overrides || null;
        const themedSystem = mergeTheme(baseDesignSystem, brandOverrides, mode);

        onThemeChange(themedSystem);
        injectDesignSystemVariables(themedSystem);
        if (theme) setActiveThemeId(theme.id);
        else setActiveThemeId(null);
    };

    const deleteTheme = async (id: string) => {
        try {
            const { error } = await (supabase as any).from("brand_themes").delete().eq("id", id);
            if (error) throw error;
            setThemes(themes.filter(t => t.id !== id));
            if (activeThemeId === id) applyTheme(null);
            toast.success("Theme deleted");
        } catch (err) {
            toast.error("Failed to delete theme");
        }
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <SwatchBook className="h-5 w-5 text-primary" />
                            Brand Swapper
                        </CardTitle>
                        <CardDescription>Manage multi-brand thematic overrides</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {themes.length + 1} Themes
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">System Style Mode</Label>
                    <div className="grid grid-cols-5 gap-2">
                        {[
                            { id: 'default', icon: Zap, label: 'Default' },
                            { id: 'brutalism', icon: Box, label: 'Brutal' },
                            { id: 'glassmorphism', icon: Layers, label: 'Glass' },
                            { id: 'minimalist', icon: Eye, label: 'Minimal' },
                            { id: 'high-contrast', icon: Contrast, label: 'High' }
                        ].map((m) => (
                            <Button
                                key={m.id}
                                variant={visualMode === m.id ? "default" : "outline"}
                                className="flex-col h-auto py-3 gap-2 rounded-xl text-[10px]"
                                onClick={() => applyTheme(themes.find(t => t.id === activeThemeId) || null, m.id as VisualMode)}
                            >
                                <m.icon className="h-4 w-4" />
                                {m.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Brand Overrides</Label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                placeholder="Sub-brand name..."
                                value={newThemeName}
                                onChange={(e) => setNewThemeName(e.target.value)}
                                className="bg-background/50"
                            />
                        </div>
                        <Button onClick={createTheme} disabled={!newThemeName}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                        onClick={() => applyTheme(null)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden group ${!activeThemeId ? "border-primary bg-primary/5" : "border-border bg-background/30"}`}
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border">
                                    <Palette className="h-4 w-4" />
                                </div>
                                <div className="text-sm font-bold">Default Brand</div>
                            </div>
                            {!activeThemeId && <Check className="h-4 w-4 text-primary" />}
                        </div>
                    </div>

                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            onClick={() => applyTheme(theme)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden group ${activeThemeId === theme.id ? "border-primary bg-primary/5" : "border-border bg-background/30"}`}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-8 w-8 rounded-lg border border-border"
                                        style={{ backgroundColor: theme.overrides?.colors?.primary || baseDesignSystem.colors.primary }}
                                    />
                                    <div className="text-sm font-bold">{theme.name}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {activeThemeId === theme.id && <Check className="h-4 w-4 text-primary" />}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                                        onClick={(e) => { e.stopPropagation(); deleteTheme(theme.id); }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
