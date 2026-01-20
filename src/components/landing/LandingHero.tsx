import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingHero = () => {
    return (
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-accent/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6"
                    >
                        <Star className="h-3 w-3 fill-current" />
                        <span>Trusted by 500+ design teams worldwide</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
                    >
                        Design Systems at the <br />
                        <span className="text-primary">Speed of Thought</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
                    >
                        The world's first AI-powered design system engine. Generate, document, and sync production-ready tokens across all your platforms in seconds.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button size="lg" className="h-12 px-8 rounded-full text-base font-semibold group" asChild>
                            <Link to="/auth">
                                Start Building Free
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-base font-semibold">
                            <Play className="mr-2 h-4 w-4 fill-current" />
                            Watch Demo
                        </Button>
                    </motion.div>
                </div>

                {/* Hero Image / Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="relative max-w-5xl mx-auto"
                >
                    <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10 bg-card/50 backdrop-blur-sm p-2">
                        <img
                            src="/C:/Users/HP/.gemini/antigravity/brain/b29b19fa-d832-4a35-add7-d4676f563678/saas_product_hero_1768836098304.png"
                            alt="DesignForge Dashboard Mockup"
                            className="w-full h-auto rounded-xl"
                        />
                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Floating Trust Badge */}
                    <div className="absolute -bottom-6 -left-6 md:-left-12 p-4 rounded-xl bg-background/80 backdrop-blur-md border border-border shadow-xl animate-bounce-soft hidden sm:block">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs font-medium">
                                <span className="text-primary font-bold">10k+</span> users already signed up
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
