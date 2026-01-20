import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPaletteDisplay } from "@/components/ColorPaletteDisplay";
import { TypographyDisplay } from "@/components/TypographyDisplay";
import { SpacingDisplay } from "@/components/SpacingDisplay";
import { ShadowDisplay } from "@/components/ShadowDisplay";
import { GridDisplay } from "@/components/GridDisplay";
import { BorderRadiusDisplay } from "@/components/BorderRadiusDisplay";
import { ComponentLibraryPreview } from "@/components/ComponentLibraryPreview";
import { LivePreview } from "@/components/LivePreview";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Layers, Type, Grid3X3, Smartphone, Eye, Wand2 } from "lucide-react";

const SharedDesign = () => {
    const { id } = useParams<{ id: string }>();
    const [designSystem, setDesignSystem] = useState<GeneratedDesignSystem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDesign = async () => {
            if (!id) return;

            try {
                const { data, error } = await supabase
                    .from("design_systems")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;

                // Add type assertion/checking here if needed, or assume it matches GeneratedDesignSystem
                setDesignSystem(data.design_system_data as unknown as GeneratedDesignSystem);
            } catch (err: unknown) {
                console.error("Error fetching design:", err);
                setError((err as Error)?.message || "Failed to load design system");
                toast.error("Design not found or access denied");
            } finally {
                setLoading(false);
            }
        };

        fetchDesign();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !designSystem) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Design Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    The design system you are looking for does not exist or has been deleted.
                </p>
                <Button asChild>
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link to="/">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                {designSystem.name}
                                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    Read-Only
                                </span>
                            </h1>
                            <p className="text-sm text-muted-foreground">Shared Design System</p>
                        </div>
                    </div>

                    <Button asChild variant="default">
                        <Link to="/">
                            <Wand2 className="h-4 w-4 mr-2" />
                            Create Your Own
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-8">
                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="flex-wrap">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="components">Components</TabsTrigger>
                        <TabsTrigger value="preview">Live Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8">
                        <ColorPaletteDisplay colors={designSystem.colors} />
                        <div className="grid lg:grid-cols-2 gap-8">
                            <TypographyDisplay typography={designSystem.typography} />
                            <SpacingDisplay spacing={designSystem.spacing} />
                        </div>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <ShadowDisplay shadows={designSystem.shadows} />
                            <BorderRadiusDisplay borderRadius={designSystem.borderRadius} />
                        </div>
                        <GridDisplay grid={designSystem.grid} />
                    </TabsContent>

                    <TabsContent value="components">
                        <ComponentLibraryPreview designSystem={designSystem} />
                    </TabsContent>

                    <TabsContent value="preview">
                        <LivePreview designSystem={designSystem} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default SharedDesign;
