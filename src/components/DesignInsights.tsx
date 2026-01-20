import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getContrastRatio, getWCAGCompliance, optimizeColorForContrast, WCAGLevel } from "@/lib/colorUtils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2, AlertCircle, Info, Activity, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface DesignInsightsProps {
    designSystem: GeneratedDesignSystem;
    onUpdate: (updatedSystem: GeneratedDesignSystem) => void;
}

export const DesignInsights = ({ designSystem, onUpdate }: DesignInsightsProps) => {
    const { colors, typography, spacing, shadows, borderRadius } = designSystem;

    // 1. Accessibility Analysis
    const checkContrast = (foreground: string, background: string) => {
        const ratio = getContrastRatio(foreground, background);
        return {
            ratio: ratio.toFixed(2),
            status: getWCAGCompliance(ratio),
        };
    };

    const primaryContrast = checkContrast(colors.primary, colors.background);
    const secondaryContrast = checkContrast(colors.secondary, colors.background);
    const textContrast = checkContrast(colors.text, colors.background);

    const accessibilityScore = [
        primaryContrast.status !== "Fail",
        secondaryContrast.status !== "Fail",
        textContrast.status === "AAA",
    ].filter(Boolean).length * 33.3;

    const handleSmartFix = () => {
        const updatedColors = { ...colors };
        let fixed = false;

        if (primaryContrast.status === "Fail") {
            updatedColors.primary = optimizeColorForContrast(colors.primary, colors.background, "AA");
            fixed = true;
        }

        if (secondaryContrast.status === "Fail") {
            updatedColors.secondary = optimizeColorForContrast(colors.secondary, colors.background, "AA");
            fixed = true;
        }

        if (fixed) {
            onUpdate({
                ...designSystem,
                colors: updatedColors,
            });
            toast.success("AI Smart Fix applied! Colors optimized for accessibility.");
        } else {
            toast.info("Your colors already pass accessibility standards.");
        }
    };

    // 2. Token Statistics
    const tokenStats = [
        { label: "Colors", count: Object.keys(colors).length + Object.keys(colors.interactive).length * 4 },
        { label: "Typography", count: Object.keys(typography.sizes).length },
        { label: "Spacing", count: Object.keys(spacing.scale).length },
        { label: "Effects", count: Object.keys(shadows).length + Object.keys(borderRadius).length },
    ];

    // 3. DNA Data (Simplified visualization of design intent)
    const dnaData = [
        { name: "Brand", value: 40, color: colors.primary },
        { name: "Structure", value: 30, color: colors.secondary },
        { name: "Utility", value: 30, color: colors.accent },
    ];

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                {/* Overall Health */}
                <Card className="glass-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Design Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">{Math.round(accessibilityScore)}%</div>
                        <Progress value={accessibilityScore} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                            Based on WCAG contrast compliance and token completeness.
                        </p>
                    </CardContent>
                </Card>

                {/* Token Count */}
                <Card className="glass-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Total Tokens
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">
                            {tokenStats.reduce((acc, curr) => acc + curr.count, 0)}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {tokenStats.map(stat => (
                                <Badge key={stat.label} variant="secondary" className="text-[10px]">
                                    {stat.label}: {stat.count}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* DNA Composition */}
                <Card className="glass-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            Style DNA
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[80px] pt-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dnaData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={20}
                                    outerRadius={35}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dnaData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Accessibility Details */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Contrast Audit</CardTitle>
                            <CardDescription>WCAG 2.1 compliance for core brand colors</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-primary/20 hover:bg-primary/5"
                            onClick={handleSmartFix}
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                            Smart Fix
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { label: "Primary on Background", result: primaryContrast, color: colors.primary },
                            { label: "Secondary on Background", result: secondaryContrast, color: colors.secondary },
                            { label: "Text on Background", result: textContrast, color: colors.text },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full border"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Ratio</p>
                                        <p className="text-sm font-mono">{item.result.ratio}:1</p>
                                    </div>
                                    <Badge
                                        variant={item.result.status === "Fail" ? "destructive" : "default"}
                                        className={item.result.status === "AAA" ? "bg-success hover:bg-success/80" : ""}
                                    >
                                        {item.result.status === "Fail" ? (
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                        ) : (
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                        )}
                                        {item.result.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Design Recommendations */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        AI Design Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-muted-foreground">
                    {accessibilityScore < 70 && (
                        <p className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Your primary or secondary color has low contrast against the background. Consider darkening the primary color for better accessibility.
                        </p>
                    )}
                    {Object.keys(spacing.scale).length < 10 && (
                        <p className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Your spacing scale is quite tight. Adding a few more large values (e.g., 48, 64) could improve layout flexibility.
                        </p>
                    )}
                    <p className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        The "{typography.fontFamily.heading}" font pairs well with "{typography.fontFamily.body}", providing a professional and clean look.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
