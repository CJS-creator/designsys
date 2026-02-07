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
import { motion } from "framer-motion";

const Landing = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
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
