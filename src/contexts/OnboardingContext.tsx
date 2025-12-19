import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface OnboardingPreferences {
  experience: "beginner" | "intermediate" | "expert";
  goals: string[];
  industry: string;
  learningStyle: "visual" | "text" | "both";
}

interface OnboardingState {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  hasCompletedOnboarding: boolean;
  preferences: OnboardingPreferences | null;
  tooltipsShown: string[];
}

interface OnboardingContextType extends OnboardingState {
  startOnboarding: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  setPreferences: (prefs: OnboardingPreferences) => void;
  markTooltipShown: (tooltipId: string) => void;
  hasSeenTooltip: (tooltipId: string) => boolean;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = "designforge_onboarding";
const TOTAL_STEPS = 5;

const defaultState: OnboardingState = {
  isActive: false,
  currentStep: 0,
  totalSteps: TOTAL_STEPS,
  completedSteps: [],
  hasCompletedOnboarding: false,
  preferences: null,
  tooltipsShown: [],
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...defaultState, ...JSON.parse(saved) };
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  // Auto-show onboarding for first-time users
  useEffect(() => {
    if (!state.hasCompletedOnboarding && !state.isActive) {
      const hasVisited = localStorage.getItem("designforge_visited");
      if (!hasVisited) {
        localStorage.setItem("designforge_visited", "true");
        setState(prev => ({ ...prev, isActive: true }));
      }
    }
  }, []);

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const startOnboarding = () => {
    setState(prev => ({ ...prev, isActive: true, currentStep: 0 }));
  };

  const skipOnboarding = () => {
    setState(prev => ({ 
      ...prev, 
      isActive: false, 
      hasCompletedOnboarding: true 
    }));
  };

  const completeOnboarding = () => {
    setState(prev => ({ 
      ...prev, 
      isActive: false, 
      hasCompletedOnboarding: true,
      completedSteps: Array.from({ length: TOTAL_STEPS }, (_, i) => i)
    }));
  };

  const nextStep = () => {
    setState(prev => {
      const next = Math.min(prev.currentStep + 1, prev.totalSteps - 1);
      return { 
        ...prev, 
        currentStep: next,
        completedSteps: prev.completedSteps.includes(prev.currentStep) 
          ? prev.completedSteps 
          : [...prev.completedSteps, prev.currentStep]
      };
    });
  };

  const prevStep = () => {
    setState(prev => ({ 
      ...prev, 
      currentStep: Math.max(prev.currentStep - 1, 0) 
    }));
  };

  const goToStep = (step: number) => {
    setState(prev => ({ 
      ...prev, 
      currentStep: Math.max(0, Math.min(step, prev.totalSteps - 1)) 
    }));
  };

  const markStepComplete = (step: number) => {
    setState(prev => ({
      ...prev,
      completedSteps: prev.completedSteps.includes(step) 
        ? prev.completedSteps 
        : [...prev.completedSteps, step]
    }));
  };

  const setPreferences = (prefs: OnboardingPreferences) => {
    setState(prev => ({ ...prev, preferences: prefs }));
  };

  const markTooltipShown = (tooltipId: string) => {
    setState(prev => ({
      ...prev,
      tooltipsShown: prev.tooltipsShown.includes(tooltipId) 
        ? prev.tooltipsShown 
        : [...prev.tooltipsShown, tooltipId]
    }));
  };

  const hasSeenTooltip = (tooltipId: string) => {
    return state.tooltipsShown.includes(tooltipId);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("designforge_visited");
    setState({ ...defaultState, isActive: true });
  };

  return (
    <OnboardingContext.Provider value={{
      ...state,
      startOnboarding,
      skipOnboarding,
      completeOnboarding,
      nextStep,
      prevStep,
      goToStep,
      markStepComplete,
      setPreferences,
      markTooltipShown,
      hasSeenTooltip,
      resetOnboarding,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
