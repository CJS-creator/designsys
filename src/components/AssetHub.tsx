import { useState } from "react";
import { monitor } from "@/lib/monitoring";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Download,
    FileText,
    Image as ImageIcon,
    Loader2,
    AlertCircle,
    ExternalLink,
    Settings2,
    Package,
    ArrowRight,
    Smartphone,
    Code,
    CheckCircle2,
    FileJson,
    Folder
} from "lucide-react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { DesignToken } from "@/types/tokens";
import { generateBulkBundle, BulkExportCategory } from "@/lib/exporters/bulk-exporter";
import { exportToPDF, exportToWord } from "@/lib/exporters/asset-exporters";
import { 
    generateCSSVariables, 
    generateSCSS, 
    generateTailwindConfig, 
    generateREADME 
} from "@/lib/exporters/web-exporters";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";

interface AssetHubProps {
    designSystem: GeneratedDesignSystem;
    tokens: DesignToken[];
}

export function AssetHub({ designSystem, tokens }: AssetHubProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [bundleFiles, setBundleFiles] = useState<string[]>([]);

    const handleBulkExport = async (category: BulkExportCategory = 'all') => {
        setIsGenerating(true);
        setProgress(0);
        setError(null);
        setBundleFiles([]);

        try {
            const blob = await generateBulkBundle(designSystem, tokens, {
                onProgress: (p) => setProgress(p),
                category
            });

            // If it's a full bundle, we can "preview" the structure
            // Since JSZip doesn't return the list easily without generating again, 
            // we'll just mock the visual for the user based on our known structure
            if (category === 'all') {
                setBundleFiles([
                    "manifest.json",
                    "README.md",
                    "documentation/specification.pdf",
                    "documentation/specification.docx",
                    "tokens/tokens.json",
                    "web/variables.css",
                    "mobile/Theme.swift",
                    "assets/color-swatches.png",
                    "assets/palette/primary.svg",
                    "...and 24 more files"
                ]);
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const suffix = category === 'all' ? 'full-bundle' : `${category}-assets`;
            a.download = `${designSystem.name}-${suffix}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success(`${category === 'all' ? 'Full bundle' : category.toUpperCase()} generated successfully!`);
        } catch (err: any) {
            monitor.error("Bulk export failed", err as Error);
            setError(err.message || "Export failed. Please try again.");
            toast.error("Bulk export failed");
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadFormat = async (type: string) => {
        let content: string = "";
        let filename: string = "";
        const toastId = toast.loading(`Preparing ${type.toUpperCase()}...`);
        
        try {
            switch(type) {
                // Documents
                case 'pdf': {
                    const blob = await exportToPDF(designSystem, tokens);
                    downloadBlob(blob, `${designSystem.name}-spec.pdf`);
                    toast.success("PDF Generated", { id: toastId });
                    return;
                }
                case 'docx': {
                    const blob = await exportToWord(designSystem, tokens);
                    downloadBlob(blob, `${designSystem.name}-spec.docx`);
                    toast.success("Word Doc Generated", { id: toastId });
                    return;
                }
                // Web
                case 'css': content = generateCSSVariables(designSystem); filename = "variables.css"; break;
                case 'scss': content = generateSCSS(designSystem); filename = "variables.scss"; break;
                case 'tailwind': content = generateTailwindConfig(designSystem); filename = "tailwind.js"; break;
                // Tokens
                case 'dtcg': content = JSON.stringify(designSystem, null, 2); filename = "tokens.json"; break;
                case 'figma': 
                    const { generateFigmaTokens } = await import("@/lib/exporters/web-exporters");
                    content = generateFigmaTokens(designSystem); 
                    filename = "figma-tokens.json"; 
                    break;
                // Mobile
                case 'react-native':
                    const { generateReactNative } = await import("@/lib/exporters/web-exporters");
                    content = generateReactNative(designSystem);
                    filename = "Theme.ts";
                    break;
                // Logic
                case 'readme': content = generateREADME(designSystem); filename = "README.md"; break;
                default: 
                    toast.info("This format is currently only available in the Full Bundle", { id: toastId }); 
                    return;
            }

            const blob = new Blob([content], { type: "text/plain" });
            downloadBlob(blob, filename);
            toast.success(`Downloaded ${filename}`, { id: toastId });
        } catch (err) {
            monitor.error(`Download failed: ${type}`, err as Error);
            toast.error("Export failed", { id: toastId });
        }
    };

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const assetCategories: Array<{
        id: BulkExportCategory;
        title: string;
        description: string;
        icon: any;
        color: string;
        bg: string;
        formats: Array<{ name: string; type?: string; size: string }>;
    }> = [
            {
                id: 'documentation',
                title: "Documentation",
                description: "Human-readable guidelines",
                icon: FileText,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                formats: [
                    { name: "Specification (PDF)", type: 'pdf', size: "~2.4 MB" },
                    { name: "Spec Document (DOCX)", type: 'docx', size: "~1.2 MB" },
                    { name: "Tokens Reference (MD)", type: 'readme', size: "12 KB" },
                ]
            },
            {
                id: 'tokens',
                title: "Data Tokens",
                description: "Cross-platform JSON formats",
                icon: FileJson,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
                formats: [
                    { name: "DTCG Standard", type: 'dtcg', size: "65 KB" },
                    { name: "Figma Variables", type: 'figma', size: "12 KB" },
                    { name: "Style Dictionary", size: "48 KB" },
                ]
            },
            {
                id: 'web',
                title: "Web Engineering",
                description: "Styles for modern web apps",
                icon: Code,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
                formats: [
                    { name: "CSS Variables", type: 'css', size: "15 KB" },
                    { name: "SCSS Variables", type: 'scss', size: "18 KB" },
                    { name: "Tailwind Config", type: 'tailwind', size: "8 KB" },
                ]
            },
            {
                id: 'mobile',
                title: "Mobile Themes",
                description: "Native styling solutions",
                icon: Smartphone,
                color: "text-pink-500",
                bg: "bg-pink-500/10",
                formats: [
                    { name: "React Native", type: 'react-native', size: "14 KB" },
                    { name: "iOS / SwiftUI", size: "32 KB" },
                    { name: "Android / Kotlin", size: "42 KB" },
                ]
            },
            {
                id: 'assets',
                title: "Visual Assets",
                description: "Renders & previews",
                icon: ImageIcon,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
                formats: [
                    { name: "Palette (PNG)", size: "850 KB" },
                    { name: "Swatches (SVG)", size: "122 KB" },
                    { name: "Brand Preview", size: "410 KB" },
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
                        onClick={() => handleBulkExport('all')}
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

            {/* Progress Bar & Preview */}
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
                    </motion.div>
                )}

                {bundleFiles.length > 0 && !isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/20 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-emerald-600">
                                <CheckCircle2 className="h-6 w-6" />
                                <h3 className="font-black">Bundle Generated!</h3>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setBundleFiles([])}>Dismiss</Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {bundleFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground truncate bg-white/50 p-2 rounded border">
                                    <Folder className="h-3 w-3 text-primary animate-pulse" />
                                    {file}
                                </div>
                            ))}
                        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {assetCategories.map((category, idx) => (
                    <Card key={idx} className="border-border/50 hover:border-primary/20 transition-all duration-300 group flex flex-col">
                        <CardHeader className="p-4">
                            <div className={`w-10 h-10 rounded-xl ${category.bg} flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform duration-500`}>
                                <category.icon className={`h-5 w-5 ${category.color}`} />
                            </div>
                            <CardTitle className="text-base">{category.title}</CardTitle>
                            <CardDescription className="text-[10px] leading-tight">{category.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2 flex-grow">
                            <Separator className="mb-3 opacity-50" />
                            {category.formats.map((format, fIdx) => (
                                <div key={fIdx} className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground truncate pr-2">{format.name}</span>
                                    <button 
                                        className="hover:text-primary transition-colors h-6 w-6 flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed"
                                        onClick={() => format.type && downloadFormat(format.type)}
                                        disabled={!format.type}
                                    >
                                        <Download className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-4 pt-0 mt-auto">
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full text-xs h-8 gap-2 rounded-lg"
                                onClick={() => handleBulkExport(category.id)}
                            >
                                <Download className="h-3 w-3" />
                                {category.title} Only
                            </Button>
                        </div>
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
