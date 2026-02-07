import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { monitor } from "@/lib/monitoring";

export interface OnboardingPreferences {
  experience: "beginner" | "intermediate" | "expert";
  goals: string[];
  industry: string;
  learningStyle: "visual" | "text" | "both";
}

export interface SelectedTemplate {
  id: string;
  name: string;
  industry: string;
  mood: string[];
  primaryColor: string;
  description: string;
}

interface OnboardingState {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  hasCompletedOnboarding: boolean;
  preferences: OnboardingPreferences | null;
  tooltipsShown: string[];
  selectedTemplate: SelectedTemplate | null;
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
  setSelectedTemplate: (template: SelectedTemplate | null) => void;
  trackAnalytics: (event: string, data?: Record<string, unknown>) => void;
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
  selectedTemplate: null,
};

// Analytics storage key
const ANALYTICS_KEY = "designforge_onboarding_analytics";

interface AnalyticsData {
  sessionId: string;
  startedAt: string;
  completedAt?: string;
  skippedAt?: string;
  stepTimestamps: Record<number, string>;
  events: Array<{ event: string; timestamp: string; data?: Record<string, unknown> }>;
}

const getOrCreateAnalytics = (): AnalyticsData => {
  const saved = localStorage.getItem(ANALYTICS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Fall through to create new
    }
  }
  return {
    sessionId: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    stepTimestamps: {},
    events: [],
  };
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
  }, [state.hasCompletedOnboarding, state.isActive]);

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const trackAnalytics = (event: string, data?: Record<string, unknown>) => {
    const analytics = getOrCreateAnalytics();
    analytics.events.push({
      event,
      timestamp: new Date().toISOString(),
      data,
    });
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));

    // Log for tracking - sends to analytics service if configured
    monitor.trackEvent(event, data);
  };

  const startOnboarding = () => {
    trackAnalytics("onboarding_started");
    setState(prev => ({ ...prev, isActive: true, currentStep: 0 }));
  };

  const skipOnboarding = () => {
    trackAnalytics("onboarding_skipped", { atStep: state.currentStep });
    setState(prev => ({
      ...prev,
      isActive: false,
      hasCompletedOnboarding: true
    }));
  };

  const completeOnboarding = () => {
    trackAnalytics("onboarding_completed", {
      selectedTemplate: state.selectedTemplate?.id || null,
      preferences: state.preferences
    });
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
      trackAnalytics("step_completed", { fromStep: prev.currentStep, toStep: next });
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
    trackAnalytics("step_back", { fromStep: state.currentStep });
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }));
  };

  const goToStep = (step: number) => {
    trackAnalytics("step_jumped", { fromStep: state.currentStep, toStep: step });
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
    trackAnalytics("preferences_set", { preferences: prefs });
    setState(prev => ({ ...prev, preferences: prefs }));
  };

  const setSelectedTemplate = (template: SelectedTemplate | null) => {
    trackAnalytics("template_selected", { templateId: template?.id || null });
    setState(prev => ({ ...prev, selectedTemplate: template }));
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
    localStorage.removeItem(ANALYTICS_KEY);
    trackAnalytics("onboarding_reset");
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
      setSelectedTemplate,
      trackAnalytics,
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
