import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

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
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
                    <p className="text-lg text-muted-foreground">
                        Everything you need to know about DesignForge. Can't find the answer you're looking for? Reach out to our team.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <AccordionItem value={`item-${index}`} className="bg-card border border-border/50 rounded-2xl px-6">
                                    <AccordionTrigger className="text-left font-bold hover:no-underline py-6">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
};
