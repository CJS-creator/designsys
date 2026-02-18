import { useState, useEffect } from "react";
import { monitor } from "@/lib/monitoring";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DesignSystemInput } from "@/types/designSystem";
import { Brain, Smartphone, Monitor, Layers, Dice5, Sparkles, Lightbulb } from "lucide-react";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { NumberTicker } from "@/components/ui/number-ticker";
import { toast } from "sonner";

const moods = [
  "modern",
  "playful",
  "professional",
  "elegant",
  "minimalist",
  "bold",
  "calm",
  "energetic",
  "luxurious",
  "friendly",
];

const industries = [
  "technology",
  "healthcare",
  "finance",
  "education",
  "ecommerce",
  "creative",
  "food",
  "travel",
  "fitness",
  "wellness",
  "other",
];

const EXAMPLE_PROMPTS = [
  "A fintech dashboard for managing crypto assets with real-time market data...",
  "A meditation app with calming nature sounds and guided breathing exercises...",
  "A high-energy fitness tracker for athletes with workout plans and progress tracking...",
  "A luxury e-commerce store for handmade jewelry with virtual try-on features...",
  "A minimalist portfolio for a photography studio showcasing creative work...",
  "A healthcare app for patients to book appointments and view medical records...",
];

const SUGGESTION_CHIPS = [
  { label: "SaaS Startup", industry: "technology", mood: ["modern", "professional"], desc: "A clean, B2B SaaS dashboard for analytics.", hint: "Tech • Modern + Professional" },
  { label: "Health App", industry: "healthcare", mood: ["calm", "friendly"], desc: "A patient-facing mobile app for tracking wellness.", hint: "Healthcare • Calm + Friendly" },
  { label: "E-Commerce", industry: "ecommerce", mood: ["bold", "energetic"], desc: "A vibrant marketplace for trendy sneakers.", hint: "Ecommerce • Bold + Energetic" },
  { label: "Portfolio", industry: "creative", mood: ["minimalist", "elegant"], desc: "A sleek portfolio site for a UX designer.", hint: "Creative • Minimalist + Elegant" },
];

const INDUSTRY_MOOD_SUGGESTIONS: Record<string, string[]> = {
  technology: ["modern", "professional", "minimalist"],
  healthcare: ["calm", "professional", "friendly"],
  finance: ["professional", "elegant", "calm"],
  education: ["friendly", "calm", "professional"],
  ecommerce: ["bold", "energetic", "modern"],
  creative: ["bold", "elegant", "playful"],
  food: ["playful", "friendly", "energetic"],
  travel: ["energetic", "friendly", "bold"],
  fitness: ["energetic", "bold", "modern"],
  wellness: ["calm", "friendly", "elegant"],
  other: ["modern", "professional", "friendly"],
};

const COLOR_MAP: Record<string, string> = {
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#22c55e",
  purple: "#8b5cf6",
  orange: "#f97316",
  pink: "#ec4899",
  indigo: "#6366f1",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  yellow: "#eab308",
  emerald: "#10b981",
  slate: "#64748b",
  zinc: "#71717a",
  neutral: "#737373",
  stone: "#78716c",
  amber: "#f59e0b",
  lime: "#84cc16",
  sky: "#0ea5e9",
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
  rose: "#f43f5e",
};

interface InitialFormValues {
  appType?: "mobile" | "web" | "both";
  industry?: string;
  brandMood?: string[];
  primaryColor?: string;
  description?: string;
}

interface DesignSystemFormProps {
  onGenerate: (input: DesignSystemInput) => void;
  isLoading: boolean;
  initialValues?: InitialFormValues;
}

const FORM_STORAGE_KEY = 'designsys-form-state';

// XSS prevention: Sanitize input to prevent script injection
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate hex color format
const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};



// Form validation helper
interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

const validateForm = (
  industry: string,
  brandMood: string[],
  primaryColor: string,
  description: string
): FormValidation => {
  const errors: Record<string, string> = {};

  // Industry validation
  if (!industry || industry.trim() === '') {
    errors.industry = 'Please select an industry';
  }

  // Brand mood validation (at least 1 required)
  if (brandMood.length === 0) {
    errors.brandMood = 'Please select at least one brand mood';
  }

  // Primary color validation (if provided)
  if (primaryColor && !isValidHexColor(primaryColor)) {
    errors.primaryColor = 'Please enter a valid hex color (#RRGGBB or #RGB)';
  }

  // Description validation
  if (description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  // XSS prevention: Check for potentially dangerous patterns
  const dangerousPatterns = [
    /<script[\s>]/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(description)) {
      errors.description = 'Description contains invalid characters';
      break;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export function DesignSystemForm({ onGenerate, isLoading, initialValues }: DesignSystemFormProps) {
  // Load from localStorage or use initialValues
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          appType: parsed.appType || initialValues?.appType || "web",
          industry: parsed.industry || initialValues?.industry || "",
          brandMood: parsed.brandMood || initialValues?.brandMood || [],
          primaryColor: parsed.primaryColor || initialValues?.primaryColor || "",
          description: parsed.description || initialValues?.description || ""
        };
      }
    } catch (error) {
      monitor.error('Failed to load saved form state', error as Error);
    }
    return {
      appType: initialValues?.appType || "web",
      industry: initialValues?.industry || "",
      brandMood: initialValues?.brandMood || [],
      primaryColor: initialValues?.primaryColor || "",
      description: initialValues?.description || ""
    };
  };

  const savedState = loadSavedState();
  const [appType, setAppType] = useState<"mobile" | "web" | "both">(savedState.appType);
  const [industry, setIndustry] = useState(savedState.industry);
  const [brandMood, setBrandMood] = useState<string[]>(savedState.brandMood);
  const [primaryColor, setPrimaryColor] = useState(savedState.primaryColor);
  const [description, setDescription] = useState(savedState.description);
  const [progress, setProgress] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Save form state to localStorage whenever it changes
  useEffect(() => {
    const formState = {
      appType,
      industry,
      brandMood,
      primaryColor,
      description
    };
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formState));
    } catch (error) {
      monitor.error('Failed to save form state', error as Error);
    }
  }, [appType, industry, brandMood, primaryColor, description]);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % EXAMPLE_PROMPTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update form when initialValues change (template selected)
  useEffect(() => {
    if (initialValues) {
      if (initialValues.appType) setAppType(initialValues.appType);
      if (initialValues.industry) setIndustry(initialValues.industry);
      if (initialValues.brandMood) setBrandMood(initialValues.brandMood);
      if (initialValues.primaryColor) setPrimaryColor(initialValues.primaryColor);
      if (initialValues.description) setDescription(initialValues.description);
    }
  }, [initialValues]);

  // Advanced Intent Analysis (NLP-lite)
  useEffect(() => {
    if (!description || description.length < 10) return;

    const timer = setTimeout(() => {
      const lowerDesc = description.toLowerCase();
      let detectedChanges = false;

      // 1. Detect Industry
      if (!industry) {
        const foundIndustry = industries.find(ind => lowerDesc.includes(ind));
        if (foundIndustry) {
          setIndustry(foundIndustry);
          detectedChanges = true;
        }
      }

      // 2. Detect Moods (up to 3)
      const currentMoods = [...brandMood];
      if (currentMoods.length < 3) {
        moods.forEach(mood => {
          if (lowerDesc.includes(mood) && !currentMoods.includes(mood) && currentMoods.length < 3) {
            currentMoods.push(mood);
            detectedChanges = true;
          }
        });
        if (detectedChanges) setBrandMood(currentMoods);
      }

      // 3. Detect Colors
      if (!primaryColor) {
        // Find named colors
        const foundColorName = Object.keys(COLOR_MAP).find(color => lowerDesc.includes(color));
        if (foundColorName) {
          setPrimaryColor(COLOR_MAP[foundColorName]);
          detectedChanges = true;
        }

        // Detect Hex codes
        const hexMatch = lowerDesc.match(/#[0-9a-f]{6}/i);
        if (hexMatch) {
          setPrimaryColor(hexMatch[0]);
          detectedChanges = true;
        }
      }

      if (detectedChanges) {
        toast.success("AI detected your intent!", {
          description: "We've auto-filled some fields based on your description.",
          icon: <Sparkles className="h-4 w-4 text-primary" />,
          duration: 3000,
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [description, industry, brandMood, primaryColor]);

  // Simulated progress for loading state
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 1 : prev));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isLoading]);

  const toggleMood = (mood: string) => {
    // Use functional update to ensure latest state
    setBrandMood(prev => {
      if (prev.includes(mood)) {
        return prev.filter((m) => m !== mood);
      } else if (prev.length < 3) {
        return [...prev, mood];
      } else {
        // Show feedback when limit reached
        toast.info("Maximum 3 moods selected. Deselect one to choose another.", {
          icon: "ℹ️"
        });
        return prev;
      }
    });
  };

  const handleRandomPrompt = () => {
    const randomChip = SUGGESTION_CHIPS[Math.floor(Math.random() * SUGGESTION_CHIPS.length)];
    setIndustry(randomChip.industry);
    setBrandMood(randomChip.mood);
    setDescription(randomChip.desc);
    toast.info("Random inspiration applied!", { icon: "🎲" });
  };

  const handleSuggestionClick = (chip: typeof SUGGESTION_CHIPS[0]) => {
    setIndustry(chip.industry);
    setBrandMood(chip.mood);
    setDescription(chip.desc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous validation errors
    setValidationErrors({});

    // Validate form
    const validation = validateForm(industry, brandMood, primaryColor, description);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);

      // Show first error as toast
      const firstError = Object.values(validation.errors)[0];
      toast.error("Form Validation Failed", {
        description: firstError
      });

      return;
    }

    // Sanitize description before submission
    const sanitizedDescription = sanitizeInput(description);

    onGenerate({
      appType,
      industry,
      brandMood,
      primaryColor: primaryColor || undefined,
      description: sanitizedDescription,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <Card className="border-border/50 bg-card/95 backdrop-blur-xl shadow-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
          <Brain className="h-6 w-6 text-primary animate-pulse" />
          Design Requirements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="show"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* App Type */}
          <motion.div variants={itemVariants} className="space-y-3">
            <Label className="text-base font-medium text-foreground">Platform Type</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "mobile", icon: Smartphone, label: "Mobile" },
                { value: "web", icon: Monitor, label: "Web" },
                { value: "both", icon: Layers, label: "Both" },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAppType(value as typeof appType)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 group/btn ${appType === value
                    ? "bg-primary/10 border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                    : "bg-muted/50 border-border hover:border-primary/50 hover:bg-muted hover:shadow-md"
                    }`}
                >
                  <Icon className={`h-7 w-7 transition-all duration-300 ${appType === value ? "text-primary" : "text-muted-foreground group-hover/btn:text-foreground"
                    }`} />
                  <span className={`text-sm font-semibold transition-all duration-300 ${appType === value ? "text-primary" : "text-muted-foreground group-hover/btn:text-foreground"
                    }`}>{label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Industry */}
          <motion.div variants={itemVariants} className="space-y-3">
            <Label htmlFor="industry" className="text-base font-medium text-foreground">
              Industry
            </Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="h-12 bg-background border-2 border-input text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all rounded-xl hover:border-primary/50 hover:shadow-sm font-medium">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-xl border-2 border-border text-popover-foreground rounded-xl shadow-2xl">
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind} className="capitalize focus:bg-primary/10 focus:text-primary cursor-pointer py-3 rounded-lg my-1 font-medium transition-colors">
                    {ind.charAt(0).toUpperCase() + ind.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.industry && (
              <p className="text-xs text-destructive mt-1">{validationErrors.industry}</p>
            )}
          </motion.div>

          {/* Brand Mood */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Label className="text-base font-medium text-foreground">
                Brand Mood
              </Label>
              <span className="text-neutral-500 text-sm whitespace-nowrap">({brandMood.length}/3 selected)</span>
              {industry && INDUSTRY_MOOD_SUGGESTIONS[industry] && (
                <span className="text-xs text-primary/80 flex items-center gap-1 ml-auto flex-shrink-0">
                  <Lightbulb className="h-3 w-3 flex-shrink-0" />
                  <span className="hidden sm:inline">Suggested:</span>
                  <span className="sm:hidden">:</span>
                  {INDUSTRY_MOOD_SUGGESTIONS[industry].slice(0, 3).map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => {
                const isSuggested = industry && INDUSTRY_MOOD_SUGGESTIONS[industry]?.includes(mood);
                return (
                  <Badge
                    key={mood}
                    variant={brandMood.includes(mood) ? "default" : "outline"}
                    className={`cursor-pointer px-5 py-2.5 text-sm transition-all duration-200 capitalize rounded-full select-none font-medium
                      ${brandMood.includes(mood)
                        ? "bg-primary text-primary-foreground hover:bg-primary/80 shadow-lg shadow-primary/20 scale-[1.02] active:scale-[0.98] border-transparent"
                        : isSuggested
                          ? "bg-primary/5 border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98]"
                          : "bg-muted/50 border-2 border-border text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    onClick={() => toggleMood(mood)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {mood}
                  </Badge>
                );
              })}
            </div>
            {validationErrors.brandMood && (
              <p className="text-xs text-destructive mt-1">{validationErrors.brandMood}</p>
            )}
          </motion.div>

          {/* Primary Color */}
          <motion.div variants={itemVariants} className="space-y-3">
            <Label htmlFor="primaryColor" className="text-base font-medium text-foreground">
              Primary Brand Color{" "}
              <span className="text-neutral-500 text-sm font-normal">(Optional - AI will suggest if empty)</span>
            </Label>
            <p className="text-xs text-muted-foreground -mt-1">
              Your brand color will influence the generated palette. Leave empty for AI-suggested colors.
            </p>
            <div className="flex gap-3 items-center w-full">
              <div className="relative group/picker cursor-pointer shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-xl blur opacity-20 group-hover/picker:opacity-40 transition-opacity" />
                <div className="h-12 w-16 overflow-hidden rounded-xl border border-border ring-2 ring-transparent group-hover/picker:ring-primary/20 transition-all relative z-10 bg-card">
                  <Input
                    type="color"
                    id="colorPicker"
                    aria-label="Pick brand color"
                    value={primaryColor || "#6366f1"}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-[150%] w-[150%] -translate-x-[25%] -translate-y-[25%] p-0 border-0 cursor-pointer opacity-0 absolute inset-0"
                  />
                  {/* Visual preview swatch */}
                  <div
                    className="h-full w-full rounded-xl transition-all duration-200"
                    style={{ backgroundColor: primaryColor || "#6366f1" }}
                  />
                </div>
              </div>
              <Input
                type="text"
                placeholder="#6366f1"
                aria-label="Enter hex color code"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-12 flex-1 font-mono bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all rounded-xl hover:bg-muted/30"
              />
            </div>
            {/* Color validation feedback */}
            {primaryColor && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(primaryColor) && (
              <p className="text-xs text-destructive">Invalid hex color format. Use #RRGGBB or #RGB format.</p>
            )}
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-base font-medium text-foreground">
                Project Description
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary hover:bg-primary/10 h-7 rounded-full text-xs touch-target"
                onClick={handleRandomPrompt}
                title="Fill with random idea"
                aria-label="Randomize description"
              >
                <Dice5 className="h-3 w-3 mr-1.5" />
                Surprise Me
              </Button>
            </div>
            <div className="relative group/textarea">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl opacity-0 group-focus-within/textarea:opacity-100 transition-opacity duration-500 blur" />
              <Textarea
                id="description"
                placeholder={EXAMPLE_PROMPTS[placeholderIndex]}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-24 max-h-32 resize-y bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary relative z-10 rounded-xl transition-all hover:border-primary/50 hover:shadow-sm"
              />
            </div>

            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs text-neutral-500 flex items-center mr-1">
                <Lightbulb className="h-3 w-3 mr-1 text-yellow-500" />
                Quick Start:
              </span>
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleSuggestionClick(chip)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 text-neutral-400 hover:text-primary transition-all hover:scale-105 active:scale-95 min-h-9"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="space-y-6 pt-4">
            <MovingBorderButton
              borderRadius="0.75rem"
              className="bg-black text-white dark:bg-slate-900 border-neutral-200 dark:border-slate-800 font-bold tracking-wide"
              containerClassName="w-full h-14"
              disabled={brandMood.length === 0 || isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                      <NumberTicker value={progress} />%
                    </span>
                    <div className="absolute -inset-4 bg-primary/20 blur-lg rounded-full animate-pulse" />
                  </div>
                  <span className="text-neutral-300 font-medium tracking-tight">Constructing System...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  Generate Design System
                </div>
              )}
            </MovingBorderButton>

            {brandMood.length === 0 && !isLoading && (
              <p className="text-sm text-red-400 text-center animate-pulse flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Select a mood to proceed
              </p>
            )}
          </motion.div>
        </motion.form>
      </CardContent>
    </Card>
  );
}
