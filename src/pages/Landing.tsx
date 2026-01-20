import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";

const Landing = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <LandingHero />
                <LandingFeatures />
                <LandingHowItWorks />
                <LandingTestimonials />
                <LandingPricing />
                <LandingFAQ />
                <LandingCTA />
                <LandingFooter />
            </motion.div>
        </div>
    );
};

export default Landing;
