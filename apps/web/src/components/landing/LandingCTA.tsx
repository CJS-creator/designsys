import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { GradientOrbs } from "@/components/animations/GradientOrbs";

export const LandingCTA = () => {
    return (
        <section className="py-32 relative overflow-hidden bg-background">
            <GradientOrbs />

            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background -z-10" />

            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-lg shadow-primary/10"
                    >
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span>INSTANT SETUP • NO CREDIT CARD</span>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter">
                        Ship Your Design System{" "}
                        <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-shimmer">
                            This Week
                        </span>
                    </h2>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
                        Join 500+ teams using DesignForge to automate their design systems and bridge the gap between design and code.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                        <MagneticButton distance={0.2}>
                            <Button
                                size="lg"
                                className="h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest group shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 transition-all"
                                asChild
                            >
                                <Link to="/auth">
                                    <Rocket className="mr-3 h-5 w-5" />
                                    Start Building Free
                                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                                </Link>
                            </Button>
                        </MagneticButton>

                        <MagneticButton distance={0.3}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest bg-background/50 backdrop-blur-sm border-2 border-muted hover:bg-muted/50 transition-all"
                            >
                                Book a Demo
                            </Button>
                        </MagneticButton>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground font-bold">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span>Free forever for small teams</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span>No setup required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
    );
};
