import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingLogos } from "@/components/landing/LandingLogos";
import { LandingDemo } from "@/components/landing/LandingDemo";
import { LandingComparison } from "@/components/landing/LandingComparison";
import { LandingStats } from "@/components/landing/LandingStats";
import { LandingVideo } from "@/components/landing/LandingVideo";
import { LandingNewsletter } from "@/components/landing/LandingNewsletter";
import { ExitIntentPopup } from "@/components/landing/ExitIntentPopup";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

const FAQ_LD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        { "@type": "Question", name: "How accurate is the AI-generated design system?", acceptedAnswer: { "@type": "Answer", text: "Our AI is trained on thousands of professional design systems and follows W3C accessibility standards. While it provides a complete foundation, you have full control to fine-tune every token to match your exact vision." } },
        { "@type": "Question", name: "Which platforms can I export to?", acceptedAnswer: { "@type": "Answer", text: "DesignForge supports direct exports for CSS (Variables/Tailwind), JSON (W3C Standard), SwiftUI (iOS), and Android Compose. We are constantly adding support for more frameworks based on community feedback." } },
        { "@type": "Question", name: "Does it sync with Figma?", acceptedAnswer: { "@type": "Answer", text: "Yes! DesignForge includes a dedicated Figma Sync component that allows you to push design tokens directly to Figma Variables or pull updates from your design files." } },
        { "@type": "Question", name: "What is included in the Free plan?", acceptedAnswer: { "@type": "Answer", text: "The Free plan includes full access to the AI generation engine, unlimited local exports to CSS/JSON, and access to all standard design system components for visual preview." } },
        { "@type": "Question", name: "How do Design Audit Logs work?", acceptedAnswer: { "@type": "Answer", text: "Available in the Enterprise plan, Design Audit Logs track every change made to your design system, providing a full historical timeline of who changed what and when." } },
    ],
};

const Landing = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <SEO
                title="DesignForge — AI-Powered Design System Generator"
                description="Turn natural-language prompts into production-ready design tokens, CSS variables, and Tailwind configs in seconds with DesignForge."
                path="/"
                jsonLd={FAQ_LD}
            />
            <LandingHeader />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <ExitIntentPopup />
                <LandingHero />
                <LandingLogos />
                <LandingStats />
                <LandingFeatures />
                <LandingVideo />
                <LandingComparison />
                <LandingHowItWorks />
                <LandingDemo />
                <LandingTestimonials />
                <LandingPricing />
                <LandingFAQ />
                <LandingNewsletter />
                <LandingCTA />
                <LandingFooter />
            </motion.div>
        </div>
    );
};

export default Landing;
