import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Rocket, X } from "lucide-react";

export const ExitIntentPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShown) {
                // Check local storage to ensure we don't spam
                const shownSession = localStorage.getItem("exit_intent_shown");
                if (!shownSession) {
                    setIsOpen(true);
                    setHasShown(true);
                    localStorage.setItem("exit_intent_shown", "true");
                }
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);
        return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, [hasShown]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Rocket className="w-32 h-32 -rotate-45" />
                </div>

                <DialogHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Rocket className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold">Wait! Before you go...</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Get our free "Design System Audit Checklist" sent to your inbox. It's the same updated framework we use for enterprise clients.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Simplified for demo, in real app would link to newsletter logic */}
                    <Button size="lg" className="w-full" onClick={() => setIsOpen(false)}>
                        Claim Free Checklist
                    </Button>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>
                        No thanks, I'll figure it out myself
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
