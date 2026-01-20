import { useState, useEffect } from "react";
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
  "other",
];

const EXAMPLE_PROMPTS = [
  "A fintech dashboard for managing crypto assets...",
  "A meditation app with calming nature sounds...",
  "A high-energy fitness tracker for pro athletes...",
  "A luxury e-commerce store for handmade jewelry...",
  "A minimalist portfolio for a photography studio...",
];

const SUGGESTION_CHIPS = [
  { label: "SaaS Startup", industry: "technology", mood: ["modern", "professional"], desc: "A clean, B2B SaaS dashboard for analytics." },
  { label: "Health App", industry: "healthcare", mood: ["calm", "friendly"], desc: "A patient-facing mobile app for tracking wellness." },
  { label: "E-Commerce", industry: "ecommerce", mood: ["bold", "energetic"], desc: "A vibrant marketplace for trendy sneakers." },
  { label: "Portfolio", industry: "creative", mood: ["minimalist", "elegant"], desc: "A sleek portfolio site for a UX designer." },
];

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

export function DesignSystemForm({ onGenerate, isLoading, initialValues }: DesignSystemFormProps) {
  const [appType, setAppType] = useState<"mobile" | "web" | "both">(initialValues?.appType || "web");
  const [industry, setIndustry] = useState(initialValues?.industry || "");
  const [brandMood, setBrandMood] = useState<string[]>(initialValues?.brandMood || []);
  const [primaryColor, setPrimaryColor] = useState(initialValues?.primaryColor || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [progress, setProgress] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

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
    if (brandMood.includes(mood)) {
      setBrandMood(brandMood.filter((m) => m !== mood));
    } else if (brandMood.length < 3) {
      setBrandMood([...brandMood, mood]);
    }
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
    onGenerate({
      appType,
      industry,
      brandMood,
      primaryColor: primaryColor || undefined,
      description,
    });
  };

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-white">
          <Brain className="h-6 w-6 text-primary" />
          Design Requirements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* App Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-neutral-200">Platform Type</Label>
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
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${appType === value
                    ? "border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                    : "border-white/10 bg-white/5 text-neutral-400 hover:border-white/20 hover:bg-white/10"
                    }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-3">
            <Label htmlFor="industry" className="text-base font-medium text-neutral-200">
              Industry
            </Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white focus:ring-primary/50">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind} className="capitalize focus:bg-white/10 focus:text-white">
                    {ind.charAt(0).toUpperCase() + ind.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Mood */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-neutral-200">
              Brand Mood <span className="text-neutral-500 text-sm">(Select up to 3)</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <Badge
                  key={mood}
                  variant={brandMood.includes(mood) ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all duration-200 capitalize ${brandMood.includes(mood)
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                    : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white hover:border-white/20"
                    }`}
                  onClick={() => toggleMood(mood)}
                >
                  {mood}
                </Badge>
              ))}
            </div>
          </div>

          {/* Primary Color */}
          <div className="space-y-3">
            <Label htmlFor="primaryColor" className="text-base font-medium text-neutral-200">
              Primary Brand Color{" "}
              <span className="text-neutral-500 text-sm">(Optional)</span>
            </Label>
            <div className="flex gap-3">
              <div className="relative group/picker">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg blur opacity-20 group-hover/picker:opacity-40 transition-opacity" />
                <Input
                  type="color"
                  id="colorPicker"
                  value={primaryColor || "#6366f1"}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-12 w-16 cursor-pointer border-white/10 bg-black p-1 relative z-10"
                />
              </div>
              <Input
                type="text"
                placeholder="#6366f1"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-12 flex-1 font-mono bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-base font-medium text-neutral-200">
                Project Description
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary hover:bg-primary/10 h-7"
                onClick={handleRandomPrompt}
                title="Fill with random idea"
              >
                <Dice5 className="h-4 w-4 mr-1.5" />
                Surprise Me
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder={EXAMPLE_PROMPTS[placeholderIndex]}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 resize-none bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:ring-primary/50 transition-all"
            />

            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs text-neutral-500 flex items-center mr-1">
                <Lightbulb className="h-3 w-3 mr-1" />
                Quick Start:
              </span>
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleSuggestionClick(chip)}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 text-neutral-400 hover:text-primary transition-all"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-6 pt-4">
            <MovingBorderButton
              borderRadius="0.75rem"
              className="bg-black text-white dark:bg-slate-900 border-neutral-200 dark:border-slate-800"
              containerClassName="w-full h-14"
              disabled={brandMood.length === 0 || isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold"><NumberTicker value={progress} />%</span>
                  <span className="text-neutral-300">Generating System...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Brain className="h-5 w-5" />
                  Generate Design System
                </div>
              )}
            </MovingBorderButton>

            {brandMood.length === 0 && !isLoading && (
              <p className="text-sm text-red-400 text-center animate-pulse">
                Please select at least one brand mood to proceed
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
