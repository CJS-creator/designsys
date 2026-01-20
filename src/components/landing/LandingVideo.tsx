import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Play } from "lucide-react";

export const LandingVideo = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">See DesignForge in Action</h2>
                    <p className="text-lg text-muted-foreground">
                        Watch how you can generate a complete, production-ready design system in under 2 minutes.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 group cursor-pointer">
                    {/* Thumbnail Layer */}
                    <div className="aspect-video bg-zinc-900 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent mix-blend-overlay" />

                        {/* Placeholder Grid Animation */}
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                                backgroundSize: "40px 40px"
                            }}
                        />

                        {/* Play Button Trigger */}
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative z-10 w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                                >
                                    <Play className="w-10 h-10 text-white fill-current ml-1" />
                                </motion.button>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-zinc-950 border-zinc-800">
                                <div className="aspect-video w-full">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                        title="Product Demo"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Floating Elements for Decoration */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-8 left-8 p-4 bg-background/10 backdrop-blur-md rounded-xl border border-white/10 hidden md:block"
                        >
                            <div className="flex gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-32 bg-white/20 rounded" />
                                <div className="h-2 w-24 bg-white/10 rounded" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
