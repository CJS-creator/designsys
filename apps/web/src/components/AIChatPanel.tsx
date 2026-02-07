import React, { useState, useRef, useEffect } from "react";
import { monitor } from "@/lib/monitoring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, User, Bot, Minimize2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    isUpdating?: boolean;
}

interface AIChatPanelProps {
    designSystem: GeneratedDesignSystem;
    onUpdate: (updatedSystem: GeneratedDesignSystem) => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ designSystem, onUpdate }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: `Hi! I'm your Design Assistant. I can help you tweak your design system. Try saying "make the primary color more vibrant" or "increase all border radii".`,
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isProcessing) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsProcessing(true);

        try {
            // Call the iterative editor logic (Phase 7.3)
            const { data, error } = await supabase.functions.invoke("generate-design-system", {
                body: {
                    // Pass the current system as context for iteration
                    currentSystem: designSystem,
                    instruction: input,
                    mode: "edit"
                },
            });

            if (error) throw error;

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.message || "I've updated the design system based on your request. How does it look?",
                timestamp: new Date(),
            };

            if (data.designSystem) {
                onUpdate(data.designSystem);
                toast.success("Design system updated iteratively!");
            }

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err: any) {
            monitor.error("Chat update failed", err as Error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm sorry, I encountered an error while processing that update. Please try again.",
                timestamp: new Date(),
            }]);
            toast.error("Failed to iterate design system");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={cn(
            "fixed bottom-6 right-6 z-50 transition-all duration-500",
            isMinimized ? "w-14 h-14" : "w-80 md:w-96 h-[500px]"
        )}>
            <AnimatePresence>
                {isMinimized ? (
                    <motion.button
                        layoutId="chat-panel"
                        onClick={() => setIsMinimized(false)}
                        className="w-14 h-14 rounded-full bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                        <Sparkles className="h-6 w-6" />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
                        />
                    </motion.button>
                ) : (
                    <motion.div
                        layoutId="chat-panel"
                        className="w-full h-full bg-card border-2 border-primary/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary/5 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold leading-none">Design Assistant</p>
                                    <p className="text-[10px] text-muted-foreground">Iterative AI Engine</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsMinimized(true)} aria-label="Minimize chat">
                                    <Minimize2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
                            {messages.map((msg) => (
                                <div key={msg.id} className={cn(
                                    "flex gap-2 max-w-[85%]",
                                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}>
                                    <div className={cn(
                                        "w-6 h-6 rounded-full shrink-0 mt-1 flex items-center justify-center",
                                        msg.role === "user" ? "bg-muted border border-border" : "bg-primary/20"
                                    )}>
                                        {msg.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3 text-primary" />}
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-xs leading-relaxed",
                                        msg.role === "user" ? "bg-primary text-white" : "bg-card border border-border shadow-sm"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isProcessing && (
                                <div className="flex gap-2 mr-auto max-w-[85%]">
                                    <div className="w-6 h-6 rounded-full shrink-0 bg-primary/20 flex items-center justify-center animate-pulse">
                                        <Bot className="h-3 w-3 text-primary" />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-2">
                                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                        <span className="text-xs text-muted-foreground italic">Redesigning...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-card border-t border-border">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Iterate your design..."
                                    className="rounded-xl border-border/50 bg-muted/30 focus-visible:ring-primary/30"
                                    disabled={isProcessing}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="rounded-xl shrink-0"
                                    disabled={isProcessing || !input.trim()}
                                    aria-label="Send message"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                            <p className="text-[9px] text-muted-foreground text-center mt-2 opacity-60 font-medium">
                                Changes are applied directly to the current state.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
