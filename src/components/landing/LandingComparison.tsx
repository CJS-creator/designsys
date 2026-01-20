import { motion } from "framer-motion";
import { Check, X, Timer, Zap, FileSpreadsheet, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const comparisonData = [
    {
        feature: "Token Creation",
        oldWay: "Manual spreadsheet entry",
        newWay: "AI-generated in seconds",
    },
    {
        feature: "Accessibility",
        oldWay: "Checked manually (often forgotten)",
        newWay: "WCAG compliance built-in",
    },
    {
        feature: "Documentation",
        oldWay: "Static PDF or Wiki updates",
        newWay: "Live, interactive docs",
    },
    {
        feature: "Code Sync",
        oldWay: "Copy-paste hex codes",
        newWay: "Direct export to CSS/iOS/Android",
    },
    {
        feature: "Updates",
        oldWay: "Weeks of refactoring",
        newWay: "One-click regeneration",
    },
];

export const LandingComparison = () => {
    return (
        <section className="py-24 bg-muted/20 relative">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Stop Wrestling with Spreadsheets</h2>
                    <p className="text-lg text-muted-foreground">
                        See why modern product teams are switching from manual maintenance to automated design systems.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* The Old Way */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl border border-border/50 bg-background/50 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FileSpreadsheet className="w-32 h-32" />
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                                <Timer className="h-5 w-5" />
                            </div>
                            <h3 className="text-2xl font-bold">The Old Way</h3>
                        </div>

                        <div className="space-y-6">
                            {comparisonData.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 opacity-70">
                                    <X className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                                    <div>
                                        <div className="font-semibold text-sm text-muted-foreground">{item.feature}</div>
                                        <div className="font-medium line-through decoration-red-500/50">{item.oldWay}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* New Way */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl border border-primary/20 bg-background shadow-2xl shadow-primary/5 relative overflow-hidden ring-1 ring-primary/20"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-32 h-32 text-primary" />
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Zap className="h-5 w-5" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary">With DesignForge</h3>
                        </div>

                        <div className="space-y-6">
                            {comparisonData.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-1 shrink-0">
                                        <Check className="h-3 w-3 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm text-muted-foreground">{item.feature}</div>
                                        <div className="font-bold text-lg">{item.newWay}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
