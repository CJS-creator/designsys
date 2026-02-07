// @ts-nocheck
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingBag,
    Palette,
    Apple,
    Wind,
    Check,
    ArrowRight,
    Star,
    ShieldCheck,
    Users,
    Download,
    TrendingUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketplacePreset {
    id: string;
    name: string;
    description: string;
    author: string;
    category: string;
    icon: string;
    is_premium: boolean;
    price_cents: number;
    preset_data: any;
}

interface MarketplaceProps {
    onImport: (preset: GeneratedDesignSystem) => void;
    currentSystemId?: string;
}

const IconMap: Record<string, any> = {
    Apple: Apple,
    Palette: Palette,
    Wind: Wind,
    ShoppingBag: ShoppingBag
};

export function Marketplace({ onImport, currentSystemId }: MarketplaceProps) {
    const [presets, setPresets] = useState<MarketplacePreset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [importingId, setImportingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchPresets = async () => {
            const { data, error } = await supabase
                .from("marketplace_presets")
                .select("*")
                .order("is_premium", { ascending: false });

            if (data) setPresets(data);
            setIsLoading(false);
        };

        fetchPresets();
    }, []);

    const handleImport = async (preset: MarketplacePreset) => {
        if (importingId) return;

        setImportingId(preset.id);
        const toastId = toast.loading(`Importing ${preset.name}...`);

        try {
            // If we have a current design system, we update it in Supabase as well
            if (currentSystemId) {
                const { error } = await supabase
                    .from("design_systems")
                    .update({
                        design_system_data: preset.preset_data,
                        name: preset.name
                    } as any)
                    .eq("id", currentSystemId);

                if (error) throw error;
            }

            // Update local state
            onImport(preset.preset_data as GeneratedDesignSystem);

            toast.success(`${preset.name} imported successfully!`, { id: toastId });
        } catch (error: any) {
            toast.error(`Import failed: ${error.message}`, { id: toastId });
        } finally {
            setImportingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="bg-card/50 border-dashed">
                        <CardHeader>
                            <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                            <Skeleton className="h-6 w-1/2 mb-2" />
                            <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardFooter>
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black flex items-center gap-3">
                        <ShoppingBag className="h-8 w-8 text-primary" />
                        Design Marketplace
                    </h2>
                    <p className="text-muted-foreground mt-1">Professional foundations to accelerate your workflow.</p>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-primary">Pro Tip</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">Presets include full token sets, typography scales, and grid systems.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {presets.map(preset => {
                    const Icon = IconMap[preset.icon] || ShoppingBag;
                    return (
                        <Card key={preset.id} className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 border-primary/10 hover:border-primary/30 min-h-[300px] flex flex-col">
                            {preset.is_premium && (
                                <div className="absolute top-4 right-4 z-10">
                                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 border-none">
                                        <Star className="h-3 w-3 mr-1 fill-white" /> Premium
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="relative z-10 flex-1">
                                <div className="p-3 rounded-2xl bg-primary/10 w-fit mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                    <Icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{preset.name}</CardTitle>
                                <CardDescription className="mt-2 text-sm line-clamp-3 leading-relaxed">
                                    {preset.description}
                                </CardDescription>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 text-[10px] font-bold">
                                        <Users className="h-3 w-3" /> {preset.author}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 text-[10px] font-bold">
                                        <ShieldCheck className="h-3 w-3 text-green-500" /> Verified
                                    </div>
                                </div>
                            </CardHeader>

                            <CardFooter className="relative z-10 pt-4 border-t border-border/40">
                                <Button
                                    className="w-full group/btn relative overflow-hidden h-11"
                                    variant={preset.is_premium ? "default" : "secondary"}
                                    onClick={() => handleImport(preset)}
                                    disabled={importingId !== null}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {importingId === preset.id ? (
                                            "Importing..."
                                        ) : (
                                            <>
                                                {preset.is_premium ? `Unlock for $${(preset.price_cents / 100).toFixed(2)}` : "Import Preset"}
                                                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </CardFooter>

                            {/* Decorative Background */}
                            <div className="absolute -bottom-12 -right-12 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                        </Card>
                    );
                })}
            </div>

            <section className="mt-12 p-12 rounded-3xl border border-dashed border-primary/20 bg-muted/30 text-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                    <Download className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Contribute to the Marketplace</h3>
                <p className="max-w-md mx-auto text-sm text-muted-foreground">
                    Are you a Design System lead? Soon you will be able to publish your own foundations and themes to the DesignForge community.
                </p>
                <Button variant="outline" className="rounded-full">Get Notified</Button>
            </section>
        </div>
    );
}
