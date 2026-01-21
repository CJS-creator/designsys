import { motion } from "framer-motion";
import { Check, X, Timer, Zap, FileSpreadsheet, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const comparisonData = [
    {
        feature: "Token Creation",
        oldWay: "Manual spreadsheet entry",
        newWay: "AI-generated semantic scaling",
    },
    {
        feature: "Design Quality",
        oldWay: "Subjective manual audits",
        newWay: "Automated AI Health Scores",
    },
    {
        feature: "Handoff",
        oldWay: "Static PDF or Wiki updates",
        newWay: "Live Docs & VS Code Snippets",
    },
    {
        feature: "Deployment",
        oldWay: "Copy-paste hex codes",
        newWay: "CI/CD & Local CLI Sync",
    },
    {
        feature: "Maintenance",
        oldWay: "Weeks of refactoring",
        newWay: "Real-time AI Refinement",
    },
];

const DrawCheck = ({ delay }: { delay: number }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3 text-primary"
    >
        <motion.path
            d="M20 6L9 17L4 12"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay, ease: "easeInOut" }}
        />
    </svg>
);

const DrawX = ({ delay }: { delay: number }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-red-500"
    >
        <motion.path
            d="M18 6L6 18M6 6l12 12"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay, ease: "easeInOut" }}
        />
    </svg>
);

export const LandingComparison = () => {
    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        THE EVOLUTION OF DESIGN OPS
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Stop Building Systems Manually</h2>
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        See why modern product teams are switching from manual maintenance to automated design systems.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-stretch">
                    {/* The Old Way */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-10 rounded-[2.5rem] border border-border/50 glass hover:bg-muted/10 transition-colors relative overflow-hidden flex flex-col"
                    >
                        <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12">
                            <FileSpreadsheet className="w-64 h-64" />
                        </div>

                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10">
                                <Timer className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight">The Legacy Flow</h3>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">High friction • Low ROI</p>
                            </div>
                        </div>

                        <div className="space-y-8 flex-1">
                            {comparisonData.map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="mt-1 shrink-0">
                                        <DrawX delay={0.2 + i * 0.1} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-bold text-sm text-foreground/40 uppercase tracking-widest">{item.feature}</div>
                                        <div className="font-medium text-lg text-muted-foreground line-through decoration-red-500/30 decoration-2">{item.oldWay}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-center">
                            <p className="text-xs font-bold text-red-500 uppercase tracking-tighter">LOST REVENUE & DEVELOPER BURNOUT</p>
                        </div>
                    </motion.div>

                    {/* New Way */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="p-10 rounded-[2.5rem] border border-primary/20 glass-card shadow-[0_32px_80px_-20px_rgba(124,58,237,0.2)] hover-glow transition-all duration-500 relative overflow-hidden flex flex-col ring-1 ring-primary/20"
                    >
                        <div className="absolute -top-10 -right-10 opacity-[0.03] -rotate-12 text-primary">
                            <Sparkles className="w-64 h-64" />
                        </div>

                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-xl shadow-primary/10">
                                <Zap className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-primary">The Forge Workflow</h3>
                                <p className="text-sm text-primary/60 font-medium uppercase tracking-wider">Zero friction • Maximum Velocity</p>
                            </div>
                        </div>

                        <div className="space-y-8 flex-1">
                            {comparisonData.map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="h-6 w-6 rounded-lg bg-primary/20 flex items-center justify-center mt-1 shrink-0">
                                        <DrawCheck delay={0.3 + i * 0.1} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-bold text-sm text-primary/40 uppercase tracking-widest">{item.feature}</div>
                                        <div className="font-bold text-xl tracking-tight">{item.newWay}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                            <p className="text-xs font-bold text-primary uppercase tracking-tighter">FUTURE-PROOFED & SCALABLE</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Decorative Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] border border-primary/5 rounded-full -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[700px] border border-primary/5 rounded-full -z-10" />
        </section>
    );
};
