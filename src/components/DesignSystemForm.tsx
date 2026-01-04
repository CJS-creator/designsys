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
import { Brain, Smartphone, Monitor, Layers } from "lucide-react";

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

  const toggleMood = (mood: string) => {
    if (brandMood.includes(mood)) {
      setBrandMood(brandMood.filter((m) => m !== mood));
    } else if (brandMood.length < 3) {
      setBrandMood([...brandMood, mood]);
    }
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
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Brain className="h-6 w-6 text-primary" />
          Design Requirements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* App Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Platform Type</Label>
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
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    appType === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/50"
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
            <Label htmlFor="industry" className="text-base font-medium">
              Industry
            </Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind} className="capitalize">
                    {ind.charAt(0).toUpperCase() + ind.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Mood */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Brand Mood <span className="text-muted-foreground text-sm">(Select up to 3)</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <Badge
                  key={mood}
                  variant={brandMood.includes(mood) ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all duration-200 capitalize ${
                    brandMood.includes(mood)
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-primary/10 hover:text-primary hover:border-primary"
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
            <Label htmlFor="primaryColor" className="text-base font-medium">
              Primary Brand Color{" "}
              <span className="text-muted-foreground text-sm">(Optional)</span>
            </Label>
            <div className="flex gap-3">
              <div className="relative">
                <Input
                  type="color"
                  id="colorPicker"
                  value={primaryColor || "#6366f1"}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-12 w-16 cursor-pointer border-2 p-1"
                />
              </div>
              <Input
                type="text"
                placeholder="#6366f1"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-12 flex-1 font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-medium">
              Project Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your app, its purpose, and target audience..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="space-y-2">
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-semibold"
              disabled={!industry || brandMood.length === 0 || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  AI is analyzing your requirements...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Generate with AI
                </div>
              )}
            </Button>
            {(!industry || brandMood.length === 0) && !isLoading && (
              <p className="text-sm text-muted-foreground text-center">
                {!industry && !brandMood.length 
                  ? "Please select an industry and at least one brand mood"
                  : !industry 
                    ? "Please select an industry" 
                    : "Please select at least one brand mood"}
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
