import { motion } from "framer-motion";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Heart, Activity, Repeat, MousePointer2, Smartphone } from "lucide-react";

interface MotionGalleryProps {
    designSystem: GeneratedDesignSystem;
}

export const MotionGallery = ({ designSystem }: MotionGalleryProps) => {
    const { colors, borderRadius } = designSystem;
    const [tapCount, setTapCount] = useState(0);
    const [isHearted, setIsHearted] = useState(false);

    // Helper to map easing strings to framer-motion transition objects (available for future use)
    // const getTransition = (type: "spring" | "bounce" | "normal") => {
    //     const easing = animations.easing[type === "normal" ? "easeInOut" : type];
    //     return {
    //         duration: parseFloat(animations.duration.normal) / 1000,
    //         ease: "easeOut",
    //     };
    // };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // itemVariants available for future use
    // const itemVariants = {
    //     hidden: { y: 20, opacity: 0 },
    //     visible: { y: 0, opacity: 1 }
    // };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Motion Design</h2>
                <p className="text-muted-foreground">Interactive exploration of your design system's movement patterns.</p>
            </header>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-2"
            >
                {/* Micro-interaction: Heart Pulse */}
                <Card className="glass-card overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Heart className={`h-4 w-4 ${isHearted ? "text-red-500 fill-red-500" : "text-muted-foreground"}`} />
                            Micro-interaction: Feedback
                        </CardTitle>
                        <CardDescription>Icon pulse on interaction</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-8">
                        <motion.div
                            whileTap={{ scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setIsHearted(!isHearted)}
                            className="cursor-pointer p-6 rounded-full bg-muted/30"
                        >
                            <motion.div
                                animate={isHearted ? { scale: [1, 1.4, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                <Heart className={`h-12 w-12 ${isHearted ? "text-red-500 fill-red-500" : "text-muted-foreground"}`} />
                            </motion.div>
                        </motion.div>
                    </CardContent>
                </Card>

                {/* Micro-interaction: Button States */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <MousePointer2 className="h-4 w-4 text-primary" />
                            Button Dynamics
                        </CardTitle>
                        <CardDescription>Hover and active state transitions</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4 items-center justify-center p-8">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button style={{ backgroundColor: colors.primary, borderRadius: borderRadius.md }}>
                                Primary Bounce
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            whileTap={{ y: 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <Button variant="outline" style={{ borderColor: colors.primary, color: colors.primary, borderRadius: borderRadius.md }}>
                                Spring Lift
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>

                {/* Staggered Entrance */}
                <Card className="glass-card md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Repeat className="h-4 w-4 text-primary" />
                            Entrance Patterns
                        </CardTitle>
                        <CardDescription>Sequential item loading (Stagger)</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <motion.div
                            className="flex gap-4 justify-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false }}
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            {[1, 2, 3, 4, 5].map((i) => (
                                <motion.div
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    className="w-12 h-12 rounded-lg border bg-muted/30 flex items-center justify-center"
                                    style={{ borderRadius: borderRadius.sm }}
                                >
                                    {i}
                                </motion.div>
                            ))}
                        </motion.div>
                    </CardContent>
                </Card>

                {/* Haptic Feedback (Visual Simulation) */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-primary" />
                            Visual Haptics
                        </CardTitle>
                        <CardDescription>Simulating physical feedback loops</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4 p-8">
                        <motion.div
                            animate={{
                                x: tapCount > 0 ? [0, -10, 10, -10, 10, 0] : 0
                            }}
                            transition={{ duration: 0.4 }}
                            onAnimationComplete={() => setTapCount(0)}
                            className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20 text-sm"
                        >
                            Error State Shake
                        </motion.div>
                        <Button
                            variant="destructive"
                            onClick={() => setTapCount(prev => prev + 1)}
                            size="sm"
                        >
                            Trigger Error
                        </Button>
                    </CardContent>
                </Card>

                {/* Pure Easing Curves */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Ease Curves
                        </CardTitle>
                        <CardDescription>Linear vs Spring vs Custom Bezier</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>Linear</span>
                                <span>1.0</span>
                            </div>
                            <div className="h-1 bg-muted rounded-full relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-primary"
                                    animate={{ width: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>Spring (Dynamic)</span>
                                <span>1.2 Resilience</span>
                            </div>
                            <div className="h-1 bg-muted rounded-full relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-primary"
                                    animate={{ width: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 2, repeat: Infinity, type: "spring", bounce: 0.4 }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
