import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuroraBackground } from "@/components/animations/AuroraBackground";
import { motion } from "framer-motion";

export const LandingNewsletter = () => {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        // Simulate API call
        setTimeout(() => {
            setIsSubscribed(true);
            toast.success("Thanks for subscribing! We'll keep you posted.");
        }, 1000);
    };

    return (
        <section className="py-24 relative overflow-hidden bg-background">
            <AuroraBackground className="py-24 px-4 rounded-[3rem] max-w-7xl mx-auto overflow-hidden">
                <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 text-center md:text-left space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest shadow-sm"
                        >
                            <Mail className="h-3 w-3" />
                            Newsletter
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                            Design System <br />
                            <span className="text-primary italic">Intelligence</span>
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
                            Join 10,000+ designers getting weekly insights on tokens, AI, and scale.
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        {isSubscribed ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center text-center p-10 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl"
                            >
                                <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold">You're in!</h3>
                                <p className="text-muted-foreground mt-2 font-medium">
                                    Welcome to the future of design ops.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                onSubmit={handleSubmit}
                                className="space-y-4 p-2 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Input
                                        type="email"
                                        placeholder="your@work-email.com"
                                        className="h-14 bg-transparent border-none focus-visible:ring-0 text-lg font-medium px-6 placeholder:text-muted-foreground/50"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl shadow-primary/20"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Join
                                    </Button>
                                </div>
                            </motion.form>
                        )}
                        {!isSubscribed && (
                            <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest opacity-50">
                                NO SPAM • WEEKLY VALUE • ACTIONABLE AI TIPS
                            </p>
                        )}
                    </div>
                </div>
            </AuroraBackground>
        </section>
    );
};
