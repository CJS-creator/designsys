import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { X, Lightbulb } from "lucide-react";

interface OnboardingTooltipProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  showOnce?: boolean;
  delay?: number;
}

export function OnboardingTooltip({
  id,
  title,
  description,
  children,
  position = "bottom",
  showOnce = true,
  delay = 500,
}: OnboardingTooltipProps) {
  const { hasSeenTooltip, markTooltipShown, hasCompletedOnboarding } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if onboarding is complete and tooltip hasn't been seen
    if (hasCompletedOnboarding && (!showOnce || !hasSeenTooltip(id))) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [id, hasCompletedOnboarding, hasSeenTooltip, showOnce, delay]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (showOnce) {
      markTooltipShown(id);
    }
  };

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowStyles = {
    top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-popover border-x-transparent border-b-transparent",
    bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-popover border-x-transparent border-t-transparent",
    left: "right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-popover border-y-transparent border-r-transparent",
    right: "left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-popover border-y-transparent border-l-transparent",
  };

  return (
    <div className="relative inline-block">
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-50 ${positionStyles[position]}`}
          >
            <div className="w-64 p-4 rounded-lg bg-popover border border-border shadow-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm">{title}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 -mt-1 -mr-1"
                      onClick={handleDismiss}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 mt-2 text-xs"
                    onClick={handleDismiss}
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Arrow */}
            <div className={`absolute w-0 h-0 border-8 ${arrowStyles[position]}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Wrapper for highlighting elements during the tour
export function OnboardingHighlight({ 
  children, 
  active = false 
}: { 
  children: ReactNode; 
  active?: boolean;
}) {
  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
