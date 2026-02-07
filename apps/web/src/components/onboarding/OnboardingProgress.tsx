import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

const steps = [
  { id: 0, label: "Welcome" },
  { id: 1, label: "Tour" },
  { id: 2, label: "Personalize" },
  { id: 3, label: "Templates" },
  { id: 4, label: "Complete" },
];

export function OnboardingProgress() {
  const { currentStep, completedSteps, goToStep } = useOnboarding();

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isComplete = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const isClickable = isComplete || step.id <= currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <motion.button
              whileHover={isClickable ? { scale: 1.1 } : undefined}
              whileTap={isClickable ? { scale: 0.95 } : undefined}
              onClick={() => isClickable && goToStep(step.id)}
              disabled={!isClickable}
              className={`
                relative flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium
                transition-colors duration-200
                ${isCurrent 
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background" 
                  : isComplete 
                    ? "bg-primary/20 text-primary cursor-pointer" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }
              `}
            >
              {isComplete && !isCurrent ? (
                <Check className="h-4 w-4" />
              ) : (
                step.id + 1
              )}
            </motion.button>
            
            {index < steps.length - 1 && (
              <div 
                className={`w-8 h-0.5 mx-1 transition-colors duration-200 ${
                  completedSteps.includes(step.id) ? "bg-primary/50" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function OnboardingProgressBar() {
  const { currentStep, totalSteps } = useOnboarding();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
