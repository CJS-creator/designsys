import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles, MessageSquare, Hand, Laugh, Heart, Rocket } from "lucide-react";

interface Reaction {
    id: string;
    emoji: string;
    user_email: string;
    x: number;
    y: number;
}

interface LiveFeedbackProps {
    channelId: string;
    currentUser: unknown;
}

const EMOJIS = [
    { icon: Sparkles, color: "text-yellow-400", label: "Wow" },
    { icon: Heart, color: "text-red-500", label: "Love" },
    { icon: Rocket, color: "text-blue-500", label: "Fire" },
    { icon: Hand, color: "text-orange-400", label: "High Five" },
    { icon: Laugh, color: "text-green-500", label: "Ha" },
];

export const LiveFeedback = ({ channelId, currentUser }: LiveFeedbackProps) => {
    const [reactions, setReactions] = useState<Reaction[]>([]);

    useEffect(() => {
        if (!channelId) return;

        const channel = supabase.channel(`design-collaboration-${channelId}`);

        channel
            .on("broadcast", { event: "reaction" }, ({ payload }) => {
                const newReaction: Reaction = {
                    id: Math.random().toString(36).substring(2, 9),
                    ...payload,
                };

                setReactions((prev) => [...prev, newReaction]);

                // Remove reaction after 3 seconds
                setTimeout(() => {
                    setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
                }, 3000);
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [channelId]);

    const sendReaction = useCallback((EmojiIcon: React.ComponentType<{ className?: string }>) => {
        if (!channelId || !currentUser) return;

        const payload = {
            emoji: EmojiIcon.name, // Sending icon name
            user_email: (currentUser as { email: string }).email,
            x: Math.random() * 80 + 10, // Avoid edge of screen
            y: Math.random() * 80 + 10,
        };

        const channel = supabase.channel(`design-collaboration-${channelId}`);
        channel.send({
            type: "broadcast",
            event: "reaction",
            payload,
        });

        // Also show locally
        const localReaction: Reaction = {
            id: Math.random().toString(36).substring(2, 9),
            ...payload,
        };
        setReactions((prev) => [...prev, localReaction]);
        setTimeout(() => {
            setReactions((prev) => prev.filter((r) => r.id !== localReaction.id));
        }, 3000);
    }, [channelId, currentUser]);

    return (
        <>
            {/* Reaction Display Area (Floating Layer) */}
            <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
                <AnimatePresence>
                    {reactions.map((r) => {
                        const Icon = EMOJIS.find(e => e.icon.name === r.emoji)?.icon || Sparkles;
                        const color = EMOJIS.find(e => e.icon.name === r.emoji)?.color || "text-primary";

                        return (
                            <motion.div
                                key={r.id}
                                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                                animate={{ opacity: 1, scale: 1.2, y: -100 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                style={{ left: `${r.x}%`, top: `${r.y}%` }}
                                className="absolute flex flex-col items-center gap-1"
                            >
                                <div className={`p-2 rounded-full bg-background/50 backdrop-blur-sm border shadow-sm ${color}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-bold bg-background/80 px-1.5 py-0.5 rounded border whitespace-nowrap">
                                    {r.user_email.split('@')[0]}
                                </span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Reaction Controls */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 bg-background/80 backdrop-blur-md border rounded-2xl p-2 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-1.5">
                    {EMOJIS.map((emoji, idx) => (
                        <TooltipProvider key={idx}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-9 w-9 rounded-xl hover:bg-muted ${emoji.color}`}
                                        onClick={() => sendReaction(emoji.icon)}
                                    >
                                        <emoji.icon className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    <p className="text-xs">{emoji.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
                <div className="h-px bg-border mx-1" />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="h-9 w-9 flex items-center justify-center text-muted-foreground">
                                <MessageSquare className="h-4 w-4" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p className="text-xs text-center">Live Reactions<br />Shared with team</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </>
    );
};
