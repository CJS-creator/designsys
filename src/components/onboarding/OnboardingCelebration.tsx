import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { PartyPopper, Sparkles, ArrowRight, BookOpen, Palette, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { staggerContainer, staggerItem } from "@/lib/animations/variants";

const nextSteps = [
  {
    icon: Palette,
    title: "Create Your First Design System",
    description: "Fill in the form and let AI generate a complete system for you",
    action: "Start Creating",
  },
  {
    icon: BookOpen,
    title: "Explore the Animation System",
    description: "Learn about our built-in animation tokens and components",
    action: "View Docs",
  },
  {
    icon: Zap,
    title: "Browse Component Library",
    description: "See all UI components styled with your design system",
    action: "View Components",
  },
];

export function OnboardingCelebration() {
  const { completeOnboarding, preferences } = useOnboarding();
  const [hasConfetti, setHasConfetti] = useState(false);

  useEffect(() => {
    if (!hasConfetti) {
      setHasConfetti(true);
      
      // Fire confetti
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [hasConfetti]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="max-w-2xl mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6"
      >
        <PartyPopper className="h-12 w-12 text-primary" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl md:text-4xl font-bold mb-4"
      >
        You're All Set! 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-muted-foreground mb-8"
      >
        Welcome to DesignForge! You're ready to create beautiful design systems.
      </motion.p>

      {preferences && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm mb-8"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span>
            Personalized for {preferences.experience} level • {preferences.learningStyle} learning
          </span>
        </motion.div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-4 mb-8"
      >
        {nextSteps.map((step, index) => (
          <motion.div
            key={step.title}
            variants={staggerItem}
            whileHover={{ y: -4 }}
            className="p-6 rounded-xl bg-card border border-border/50 text-left"
          >
            <step.icon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
            <Button variant="outline" size="sm" className="w-full">
              {step.action}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <Button size="lg" onClick={completeOnboarding} className="gap-2">
        Start Creating <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        You can restart this tour anytime from the settings
      </p>
    </motion.div>
  );
}
