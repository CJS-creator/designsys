import { useState } from "react";
import { monitor } from "@/lib/monitoring";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Download,
    FileType,
    FileText,
    Image as ImageIcon,
    Loader2,
    AlertCircle,
    ExternalLink,
    Settings2,
    Package,
    ArrowRight
} from "lucide-react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { DesignToken } from "@/types/tokens";
import { generateBulkBundle } from "@/lib/exporters/bulk-exporter";
import { exportToPDF, exportToWord } from "@/lib/exporters/asset-exporters";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AssetHubProps {
    designSystem: GeneratedDesignSystem;
    tokens: DesignToken[];
}

export function AssetHub({ designSystem, tokens }: AssetHubProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleBulkExport = async () => {
        setIsGenerating(true);
        setProgress(0);
        setError(null);

        try {
            const blob = await generateBulkBundle(designSystem, tokens, {
                onProgress: (p) => setProgress(p)
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${designSystem.name}-assets-bundle.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success("Design bundle generated successfully!");
        } catch (err: any) {
            monitor.error("Bulk export failed", err as Error);
            setError(err.message || "Export failed. Please try again.");
            toast.error("Bulk export failed");
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadIndividual = async (type: 'pdf' | 'docx') => {
        const toastId = toast.loading(`Generating ${type.toUpperCase()}...`);
        try {
            let blob: Blob;
            if (type === 'pdf') blob = await exportToPDF(designSystem, tokens);
            else blob = await exportToWord(designSystem, tokens);

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${designSystem.name}-spec.${type}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success(`${type.toUpperCase()} ready!`, { id: toastId });
        } catch (err) {
            toast.error(`Failed to generate ${type.toUpperCase()}`, { id: toastId });
        }
    };

    const assetCategories: Array<{
        title: string;
        description: string;
        icon: any;
        color: string;
        bg: string;
        formats: Array<{ name: string; type?: 'pdf' | 'docx' | 'css' | 'json'; format?: string; size: string }>;
    }> = [
            {
                title: "Documentation",
                description: "Full design specifications and guidelines",
                icon: FileText,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                formats: [
                    { name: "Specification (PDF)", type: 'pdf', size: "2.4 MB" },
                    { name: "Spec Document (DOCX)", type: 'docx', size: "1.2 MB" },
                ]
            },
            {
                title: "Code Tokens",
                description: "Raw variables for multiple platforms",
                icon: FileType,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
                formats: [
                    { name: "JSON Tokens", format: 'json', size: "45 KB" },
                    { name: "Tailwind Config", format: 'js', size: "12 KB" },
                ]
            },
            {
                title: "Asset Package",
                description: "SVG and high-res image representations",
                icon: ImageIcon,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
                formats: [
                    { name: "Color Swatches (PNG)", format: 'png', size: "850 KB" },
                    { name: "Logo Icons (SVG)", format: 'svg', size: "120 KB" },
                ]
            }
        ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-8 rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">Unified Asset Delivery</h2>
                    <p className="text-muted-foreground">Package and deliver your design system foundations in professional formats.</p>
                </div>

                <div className="relative z-10">
                    <Button
                        size="lg"
                        onClick={handleBulkExport}
                        disabled={isGenerating}
                        className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-3 group"
                    >
                        {isGenerating ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Package className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        )}
                        {isGenerating ? "Packaging Assets..." : "Download Full Bundle"}
                        <ArrowRight className="h-4 w-4 opacity-50" />
                    </Button>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -ml-10 -mb-10" />
            </div>

            {/* Progress Bar (Visible during generation) */}
            <AnimatePresence>
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 bg-muted/30 p-6 rounded-2xl border overflow-hidden"
                    >
                        <div className="flex justify-between text-sm font-bold">
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                Processing Hierarchical Packaging...
                            </span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            Bundling specification, code tokens, and visual assets
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-sm text-destructive font-medium">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </div>
            )}

            {/* Grid of format categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {assetCategories.map((category, idx) => (
                    <Card key={idx} className="border-border/50 hover:border-primary/20 transition-all duration-300 group">
                        <CardHeader>
                            <div className={`w-12 h-12 rounded-2xl ${category.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500`}>
                                <category.icon className={`h-6 w-6 ${category.color}`} />
                            </div>
                            <CardTitle className="text-xl">{category.title}</CardTitle>
                            <CardDescription>{category.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {category.formats.map((format, fIdx) => (
                                <div key={fIdx} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">{format.name}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{format.size}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => (format.type === 'pdf' || format.type === 'docx') ? downloadIndividual(format.type) : toast.info("Download available in bundle")}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions / Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Settings2 className="h-5 w-5" /> Export Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Default Format</span>
                            <span className="text-xs font-bold text-primary">ZIP Archive</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Include Private Tokens</span>
                            <span className="text-xs text-muted-foreground">Off</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-dashed">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ExternalLink className="h-5 w-5" /> Cloud Sync
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-8 opacity-40">
                        <div className="text-center space-y-2">
                            <Download className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-xs font-bold">AWS S3 / Google Cloud Storage</p>
                            <p className="text-[10px]">Premium Feature Coming Soon</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
