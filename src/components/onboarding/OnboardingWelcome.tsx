import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Sparkles, Palette, Zap, Download, ArrowRight, FastForward } from "lucide-react";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/animations/variants";

const features = [
  {
    icon: Palette,
    title: "AI-Powered Colors",
    description: "Generate harmonious color palettes tailored to your industry and brand mood",
  },
  {
    icon: Zap,
    title: "Complete Systems",
    description: "Get typography, spacing, shadows, and more in seconds",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Download as CSS, Tailwind, SCSS, or design tokens",
  },
];

export function OnboardingWelcome() {
  const { nextStep, skipOnboarding } = useOnboarding();

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="text-center max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6"
      >
        <Sparkles className="h-10 w-10 text-primary" />
      </motion.div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Welcome to DesignForge
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
        Create beautiful, comprehensive design systems in seconds with the power of AI.
      </p>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-4 mb-8"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={staggerItem}
            className="p-4 rounded-xl bg-card border border-border/50 text-left"
          >
            <feature.icon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button size="lg" onClick={nextStep} className="gap-2">
          Get Started <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="lg" onClick={skipOnboarding} className="gap-2 text-muted-foreground">
          <FastForward className="h-4 w-4" /> Skip Tour
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Takes about 2 minutes • You can always restart from settings
      </p>
    </motion.div>
  );
}
