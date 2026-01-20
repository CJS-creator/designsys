import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronRight, Plus } from "lucide-react";

const faqs = [
    {
        question: "How accurate is the AI-generated design system?",
        answer: "Our AI is trained on thousands of professional design systems and follows W3C accessibility standards. While it provides a complete foundation, you have full control to fine-tune every token to match your exact vision.",
    },
    {
        question: "Which platforms can I export to?",
        answer: "DesignForge supports direct exports for CSS (Variables/Tailwind), JSON (W3C Standard), SwiftUI (iOS), and Android Compose. We are constantly adding support for more frameworks based on community feedback.",
    },
    {
        question: "Does it sync with Figma?",
        answer: "Yes! DesignForge includes a dedicated Figma Sync component that allows you to push design tokens directly to Figma Variables or pull updates from your design files.",
    },
    {
        question: "What is included in the Free plan?",
        answer: "The Free plan includes full access to the AI generation engine, unlimited local exports to CSS/JSON, and access to all standard design system components for visual preview.",
    },
    {
        question: "How do Design Audit Logs work?",
        answer: "Available in the Enterprise plan, Design Audit Logs track Every change made to your design system, providing a full historical timeline of who changed what and when.",
    },
];

export const LandingFAQ = () => {
    return (
        <section id="faq" className="py-32 bg-background relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        COMMON QUERIES
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Got Questions?</h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
                        Everything you need to know about DesignForge. Can't find the answer you're looking for? Reach out to our team.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <AccordionItem
                                    value={`item-${index}`}
                                    className="group bg-card/30 backdrop-blur-sm border border-border/50 rounded-[2rem] px-8 transition-all duration-300 hover:border-primary/30 hover:bg-card/50 overflow-hidden data-[state=open]:border-primary/50 data-[state=open]:bg-card/80 shadow-sm data-[state=open]:shadow-xl data-[state=open]:shadow-primary/5"
                                >
                                    <AccordionTrigger className="text-left font-black text-lg md:text-xl hover:no-underline py-8 transition-all group-data-[state=open]:text-primary">
                                        <div className="flex items-center gap-4">
                                            <span className="text-primary/40 group-data-[state=open]:text-primary font-mono text-sm tracking-tighter">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            {faq.question}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-8 pl-10 text-lg leading-relaxed font-medium">
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {faq.answer}
                                        </motion.div>
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/2 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        </section>
    );
};
