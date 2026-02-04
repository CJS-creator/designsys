import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Play } from "lucide-react";
import { GlowingBorder } from "@/components/animations/GlowingBorder";
import { MagneticButton } from "@/components/animations/MagneticButton";

const VideoPreview = () => {
    return (
        <div className="relative w-full aspect-video bg-black/90 rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/[0.05]" />

            {/* Animated Code Overlay */}
            <div className="absolute top-10 left-10 p-4 bg-black/80 backdrop-blur border border-white/10 rounded-xl font-mono text-xs text-green-400 opacity-60">
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    $ npx designforge init
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    {">"} Analyzing brand assets...
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                >
                    {">"} Generating tokens... OK
                </motion.div>
            </div>

            {/* Floating UI Elements */}
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-10 bottom-20 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl"
            >
                <div className="flex gap-2 items-center mb-3">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex gap-2">
                    <div className="h-16 w-16 bg-gradient-to-br from-primary to-purple-600 rounded-lg" />
                    <div className="h-16 w-16 bg-white/10 rounded-lg" />
                    <div className="h-16 w-16 bg-white/10 rounded-lg" />
                </div>
            </motion.div>

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
                <MagneticButton distance={0.3}>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center relative group/play cursor-pointer"
                    >
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover/play:opacity-50" />
                        <Play className="w-8 h-8 text-white fill-white ml-1 shadow-xl" />
                    </motion.div>
                </MagneticButton>
            </div>
        </div>
    );
};

export const LandingVideo = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        SEE THE MAGIC
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Design at the Speed of Light</h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                        Watch how DesignForge transforms a simple prompt into a fully documented design system in under 60 seconds.
                    </p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="max-w-5xl mx-auto cursor-pointer"
                        >
                            <GlowingBorder borderRadius="1.5rem" duration={3000}>
                                <VideoPreview />
                            </GlowingBorder>
                        </motion.div>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl w-full p-0 overflow-hidden bg-black border-zinc-800 aspect-video">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                            title="Product Demo"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        </section>
    );
};
