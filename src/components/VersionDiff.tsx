import { useState } from "react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitCompare, ArrowRight, Check, X, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VersionDiffProps {
    currentSystem: GeneratedDesignSystem;
    previousSystem?: GeneratedDesignSystem;
}

export const VersionDiff = ({ currentSystem, previousSystem }: VersionDiffProps) => {
    if (!previousSystem) {
        return (
            <Card className="glass-card border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center">
                        <GitCompare className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold">No version to compare</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Save a version of your design system first to enable side-by-side visual diffing.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const findDiffs = () => {
        const diffs: { path: string; old: string; new: string }[] = [];

        // Compare main colors
        const colorKeys = Object.keys(currentSystem.colors) as (keyof typeof currentSystem.colors)[];
        colorKeys.forEach(key => {
            if (typeof currentSystem.colors[key] === "string" && currentSystem.colors[key] !== previousSystem.colors[key]) {
                diffs.push({
                    path: `Colors > ${key}`,
                    old: previousSystem.colors[key] as string,
                    new: currentSystem.colors[key] as string
                });
            }
        });

        // Compare radius
        const radiusKeys = Object.keys(currentSystem.borderRadius) as (keyof typeof currentSystem.borderRadius)[];
        radiusKeys.forEach(key => {
            if (currentSystem.borderRadius[key] !== previousSystem.borderRadius[key]) {
                diffs.push({
                    path: `Radius > ${key}`,
                    old: previousSystem.borderRadius[key],
                    new: currentSystem.borderRadius[key]
                });
            }
        });

        return diffs;
    };

    const diffs = findDiffs();

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <GitCompare className="h-6 w-6 text-primary" />
                                Version Comparison
                            </CardTitle>
                            <CardDescription>
                                Comparing <Badge variant="outline" className="ml-1">Current Draft</Badge> vs <Badge variant="secondary" className="ml-1">Previous Version</Badge>
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {diffs.length} Change{diffs.length !== 1 ? 's' : ''} Detected
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border bg-muted/10 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/20 text-left border-b font-medium">
                                <tr>
                                    <th className="px-6 py-3">Property</th>
                                    <th className="px-6 py-3">Previous</th>
                                    <th className="px-6 py-3"></th>
                                    <th className="px-6 py-3">Current</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {diffs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                                            No changes detected between these versions.
                                        </td>
                                    </tr>
                                ) : (
                                    diffs.map((diff, i) => (
                                        <tr key={i} className="hover:bg-muted/5 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                                                {diff.path}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {(diff.old.startsWith("#") || diff.old.startsWith("hsl")) && (
                                                        <div className="h-4 w-4 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: diff.old }} />
                                                    )}
                                                    <span className="font-mono text-xs tabular-nums">{diff.old}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-center">
                                                <ArrowRight className="h-3 w-3 inline-block" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {(diff.new.startsWith("#") || diff.new.startsWith("hsl")) && (
                                                        <div className="h-4 w-4 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: diff.new }} />
                                                    )}
                                                    <span className="font-mono text-xs text-primary font-bold tabular-nums">{diff.new}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <div className="flex-1 p-4 rounded-lg bg-red-500/5 border border-red-500/10 flex items-start gap-3">
                            <X className="h-4 w-4 text-red-500 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-red-300">Previous</p>
                                <p className="text-[10px] text-red-200/60 leading-relaxed uppercase tracking-wider">Older tokens are being replaced</p>
                            </div>
                        </div>
                        <div className="flex-1 p-4 rounded-lg bg-green-500/5 border border-green-500/10 flex items-start gap-3">
                            <Check className="h-4 w-4 text-green-500 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-green-300">Current</p>
                                <p className="text-[10px] text-green-200/60 leading-relaxed uppercase tracking-wider">New tokens are live in current draft</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/10">
                <CardContent className="pt-6 flex gap-4 items-start">
                    <Info className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div className="space-y-1">
                        <h5 className="font-semibold text-sm">Automated Governance</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            DesignForge automatically maps semantic contrasts between versions. If a background changes from light to dark, all "On" tokens are recalculated to maintain compliance.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
