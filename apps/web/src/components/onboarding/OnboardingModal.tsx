import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingProgress, OnboardingProgressBar } from "./OnboardingProgress";
import { OnboardingWelcome } from "./OnboardingWelcome";
import { OnboardingTour } from "./OnboardingTour";
import { OnboardingPersonalization } from "./OnboardingPersonalization";
import { OnboardingTemplates } from "./OnboardingTemplates";
import { OnboardingCelebration } from "./OnboardingCelebration";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const steps = [
  { id: 0, component: OnboardingWelcome },
  { id: 1, component: OnboardingTour },
  { id: 2, component: OnboardingPersonalization },
  { id: 3, component: OnboardingTemplates },
  { id: 4, component: OnboardingCelebration },
];

export function OnboardingModal() {
  const { isActive, currentStep, skipOnboarding } = useOnboarding();

  if (!isActive) return null;

  const CurrentStepComponent = steps[currentStep]?.component || OnboardingWelcome;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={skipOnboarding}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-2xl shadow-2xl"
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={skipOnboarding}
            aria-label="Close onboarding"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Progress */}
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <div className="mb-8">
                <OnboardingProgress />
              </div>
            )}

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentStepComponent />
              </motion.div>
            </AnimatePresence>

            {/* Progress bar at bottom */}
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <div className="mt-8 pt-6 border-t border-border">
                <OnboardingProgressBar />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
