import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingCTA = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-8">
                        <Zap className="h-3 w-3 fill-current" />
                        <span>INSTANT SETUP • NO CREDIT CARD REQUIRED</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                        Ready to transform your <br />
                        <span className="text-primary italic">design workflow?</span>
                    </h2>

                    <p className="text-xl text-muted-foreground mb-12">
                        Join 500+ teams using DesignForge to automate their design systems and bridge the gap between design and code.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-14 px-10 rounded-full text-lg font-bold group shadow-xl shadow-primary/20" asChild>
                            <Link to="/auth">
                                Start Building Free
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-lg font-bold bg-background/50 backdrop-blur-sm">
                            Book a Demo
                        </Button>
                    </div>

                    <p className="mt-8 text-sm text-muted-foreground">
                        Free forever for small teams. Pro plans include Figma sync and unlimited versions.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
