import { useState, useMemo } from "react";
import { DesignToken } from "@/types/tokens";
import { BrandTheme } from "@/hooks/useBrands";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Layers,
    MousePointer2,
    Split,
    Eye,
    Info,
    AlertCircle,
    ChevronRight,
    Search
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface ComponentSandboxProps {
    allTokens: DesignToken[];
    brands: BrandTheme[];
    onTokenClick?: (path: string) => void;
}

export function ComponentSandbox({ allTokens, brands, onTokenClick }: ComponentSandboxProps) {
    const [primaryBrandId, setPrimaryBrandId] = useState<string | null>(brands[0]?.id || null);
    const [comparisonBrandId, setComparisonBrandId] = useState<string | null>(brands[1]?.id || null);
    const [hoveredTokenPath, setHoveredTokenPath] = useState<string | null>(null);

    const primaryBrand = brands.find(b => b.id === primaryBrandId);
    const comparisonBrand = brands.find(b => b.id === comparisonBrandId);

    // Helper to resolve token value with brand override
    const resolveTokenValue = (path: string, brand?: BrandTheme | null): any => {
        if (!brand) {
            const token = allTokens.find(t => t.path === path);
            return token?.value || null;
        }

        // Check for override first
        if (brand.tokens_override && brand.tokens_override[path]) {
            return brand.tokens_override[path];
        }

        const token = allTokens.find(t => t.path === path);
        if (!token) return null;

        // If it's an alias, we need to resolve it recursively, 
        // but we also need to check for overrides at each step of the alias chain.
        if (token.ref) {
            const refPath = token.ref.replace(/[{}]/g, '');
            return resolveTokenValue(refPath, brand);
        }

        return token.value;
    };

    const SandboxPreview = ({ brand, label }: { brand?: BrandTheme | null, label: string }) => {
        const bg = resolveTokenValue('background.primary', brand) || 'transparent';
        const text = resolveTokenValue('text.primary', brand) || 'inherit';
        const surface = resolveTokenValue('surface.primary', brand) || 'rgba(0,0,0,0.05)';
        const border = resolveTokenValue('border.primary', brand) || 'rgba(0,0,0,0.1)';
        const primary = resolveTokenValue('color.primary', brand) || '#6366f1';
        const primaryText = resolveTokenValue('text.onPrimary', brand) || '#ffffff';
        const buttonRadius = resolveTokenValue('radius.button', brand) || '0.5rem';
        const cardRadius = resolveTokenValue('radius.card', brand) || '1rem';

        return (
            <div className="flex-1 min-w-[300px] flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                    <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest px-2 py-0.5">
                        {label}: {brand?.name || "Base tokens"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">
                        Mode: {brand?.mode || "standard"}
                    </span>
                </div>

                <div
                    className="p-8 rounded-2xl border transition-all duration-500 shadow-sm min-h-[400px]"
                    style={{
                        backgroundColor: bg,
                        color: text,
                        borderColor: border,
                    }}
                >
                    <div className="space-y-8">
                        {/* 1. Header Section */}
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold tracking-tight">Main Heading</h3>
                            <p className="opacity-70 text-sm leading-relaxed max-w-sm">
                                This component reacts to your semantic tokens. Change them in the list and watch the transformation.
                            </p>
                        </div>

                        {/* 2. Interactive Area */}
                        <div
                            className="p-6 border-2 border-dashed rounded-xl flex flex-col gap-4 transition-colors"
                            style={{
                                backgroundColor: surface,
                                borderColor: border
                            }}
                        >
                            <div className="flex flex-wrap gap-3">
                                <button
                                    className="px-6 py-2.5 font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/10"
                                    style={{
                                        backgroundColor: primary,
                                        color: primaryText,
                                        borderRadius: buttonRadius
                                    }}
                                    onMouseEnter={() => setHoveredTokenPath('color.primary')}
                                    onMouseLeave={() => setHoveredTokenPath(null)}
                                >
                                    Primary Action
                                </button>
                                <button
                                    className="px-6 py-2.5 font-semibold text-sm border-2 transition-all hover:bg-muted/10 active:scale-95"
                                    style={{
                                        borderColor: primary,
                                        color: primary,
                                        borderRadius: buttonRadius
                                    }}
                                    onMouseEnter={() => setHoveredTokenPath('radius.button')}
                                    onMouseLeave={() => setHoveredTokenPath(null)}
                                >
                                    Secondary
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold"
                                            style={{ backgroundColor: surface, borderColor: bg }}
                                        >
                                            {i}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs font-medium opacity-60">Collaborators</span>
                            </div>
                        </div>

                        {/* 3. Card Preview */}
                        <div
                            className="p-6 border transition-all duration-300 hover:shadow-xl group"
                            style={{
                                backgroundColor: bg,
                                borderColor: border,
                                borderRadius: cardRadius
                            }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Layers className="h-5 w-5 text-primary" />
                                </div>
                                <Badge variant="secondary" className="text-[9px]">ACTIVE</Badge>
                            </div>
                            <h4 className="font-bold mb-2">Semantic Structure</h4>
                            <p className="text-xs opacity-60 leading-normal">
                                Cards are a great way to test your elevation and surface token contrasts.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-muted/20 rounded-xl border border-border/50 overflow-hidden">
            {/* Top Bar */}
            <div className="p-4 border-b bg-background/50 backdrop-blur-md flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                            <Split className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-tight">Visual Interrogator</h2>
                    </div>

                    <div className="h-4 w-px bg-border mx-2 hidden sm:block" />

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap">Primary Brand</label>
                            <Select value={primaryBrandId || "none"} onValueChange={setPrimaryBrandId}>
                                <SelectTrigger className="h-8 w-[140px] text-xs font-medium border-primary/20 bg-primary/5">
                                    <SelectValue placeholder="Base System" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Base System</SelectItem>
                                    {brands.map(b => (
                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap">Compare With</label>
                            <Select value={comparisonBrandId || "none"} onValueChange={setComparisonBrandId}>
                                <SelectTrigger className="h-8 w-[140px] text-xs font-medium">
                                    <SelectValue placeholder="Comparison" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (Single View)</SelectItem>
                                    {brands.filter(b => b.id !== primaryBrandId).map(b => (
                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-tighter gap-2">
                        <Eye className="h-3.5 w-3.5" />
                        Live Update
                    </Button>
                </div>
            </div>

            {/* Sandbox Content */}
            <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-auto scrollbar-thin">
                <SandboxPreview brand={primaryBrand} label="Primary View" />

                {comparisonBrandId !== "none" && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-1"
                    >
                        <SandboxPreview brand={comparisonBrand} label="Comparison View" />
                    </motion.div>
                )}

                {/* Interrogator Sidebar */}
                <div className="w-full md:w-64 flex flex-col gap-4">
                    <Card className="border-primary/20 bg-primary/5 shadow-none h-fit">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs flex items-center gap-2 text-primary">
                                <Info className="h-3 w-3" />
                                Token Inspector
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {hoveredTokenPath ? (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
                                    <div>
                                        <label className="text-[9px] font-bold text-muted-foreground uppercase">Path</label>
                                        <div className="font-mono text-[10px] bg-primary/10 text-primary p-1 rounded mt-1 border border-primary/20 truncate">
                                            {hoveredTokenPath}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[9px] font-bold text-muted-foreground uppercase">Brand A</label>
                                            <div className="text-[10px] font-bold truncate">
                                                {resolveTokenValue(hoveredTokenPath, primaryBrand)}
                                            </div>
                                        </div>
                                        {comparisonBrandId !== "none" && (
                                            <div>
                                                <label className="text-[9px] font-bold text-muted-foreground uppercase">Brand B</label>
                                                <div className="text-[10px] font-bold truncate">
                                                    {resolveTokenValue(hoveredTokenPath, comparisonBrand)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0 text-[10px] text-primary"
                                        onClick={() => onTokenClick?.(hoveredTokenPath)}
                                    >
                                        Edit Token <ChevronRight className="h-2.5 w-2.5 ml-1" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center gap-2 opacity-40">
                                    <MousePointer2 className="h-8 w-8" />
                                    <p className="text-[10px] font-medium leading-tight">
                                        Hover over elements in the preview to inspect their tokens
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/40 shadow-none border-dashed">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs flex items-center gap-2">
                                <Search className="h-3 w-3" />
                                Quick Verify
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                            <p className="text-[9px] text-muted-foreground">Verify contrast ratios and semantic mappings automatically.</p>
                            <Button variant="outline" size="sm" className="w-full text-[10px] h-7 gap-2">
                                <AlertCircle className="h-3 w-3" />
                                Audit Contrast
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
