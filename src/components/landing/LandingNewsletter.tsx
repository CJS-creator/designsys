import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BackgroundBeams } from "@/components/ui/background-beams";

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
        <section className="py-24 relative overflow-hidden">
            <BackgroundBeams />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-md border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary/5 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-4 tracking-tight">Stay ahead of the curve</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Join 10,000+ designers getting weekly insights on design systems, token architecture, and AI-driven workflows.
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        {isSubscribed ? (
                            <div className="flex flex-col items-center justify-center text-center p-6 bg-green-500/10 rounded-2xl border border-green-500/20 animate-in fade-in zoom-in duration-300">
                                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                                <h3 className="text-xl font-bold text-green-700 dark:text-green-400">You're on the list!</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Watch your inbox for our next update.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        placeholder="Enter your work email"
                                        className="h-12 bg-background/50 border-border/50 focus:border-primary/50"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" size="lg" className="h-12 w-full text-base font-semibold shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300">
                                    Subscribe to Newsletter
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    No spam, ever. Unsubscribe anytime.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
