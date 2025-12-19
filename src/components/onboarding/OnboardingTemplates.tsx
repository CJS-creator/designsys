import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { 
  ArrowRight, ArrowLeft, Check, Briefcase, ShoppingBag, 
  Heart, Gamepad2, GraduationCap, Building2, Leaf, Rocket
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations/variants";

interface Template {
  id: string;
  name: string;
  industry: string;
  mood: string[];
  icon: typeof Briefcase;
  colors: string[];
  description: string;
}

const templates: Template[] = [
  {
    id: "saas",
    name: "SaaS Product",
    industry: "Technology",
    mood: ["Modern", "Professional"],
    icon: Rocket,
    colors: ["#6366F1", "#8B5CF6", "#EC4899"],
    description: "Clean, professional design for software products",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    industry: "Retail",
    mood: ["Friendly", "Trustworthy"],
    icon: ShoppingBag,
    colors: ["#F97316", "#84CC16", "#06B6D4"],
    description: "Vibrant, conversion-focused design",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    industry: "Healthcare",
    mood: ["Calm", "Trustworthy"],
    icon: Heart,
    colors: ["#0EA5E9", "#10B981", "#6366F1"],
    description: "Calming, accessible design for health apps",
  },
  {
    id: "finance",
    name: "Finance",
    industry: "Finance",
    mood: ["Professional", "Secure"],
    icon: Building2,
    colors: ["#1E3A5F", "#0EA5E9", "#10B981"],
    description: "Trustworthy, secure design for fintech",
  },
  {
    id: "education",
    name: "Education",
    industry: "Education",
    mood: ["Friendly", "Inspiring"],
    icon: GraduationCap,
    colors: ["#8B5CF6", "#F97316", "#06B6D4"],
    description: "Engaging, accessible design for learning",
  },
  {
    id: "sustainability",
    name: "Sustainability",
    industry: "Environment",
    mood: ["Natural", "Calm"],
    icon: Leaf,
    colors: ["#10B981", "#84CC16", "#0D9488"],
    description: "Earth-toned, eco-friendly design",
  },
  {
    id: "gaming",
    name: "Gaming",
    industry: "Entertainment",
    mood: ["Bold", "Energetic"],
    icon: Gamepad2,
    colors: ["#EF4444", "#8B5CF6", "#F97316"],
    description: "Bold, dynamic design for games",
  },
  {
    id: "corporate",
    name: "Corporate",
    industry: "Business",
    mood: ["Professional", "Minimal"],
    icon: Briefcase,
    colors: ["#374151", "#6B7280", "#3B82F6"],
    description: "Clean, professional enterprise design",
  },
];

export function OnboardingTemplates() {
  const { nextStep, prevStep } = useOnboarding();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Quick-start Templates</h2>
        <p className="text-muted-foreground">
          Choose a template to get started quickly, or skip to create from scratch
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {templates.map((template) => (
          <motion.button
            key={template.id}
            variants={staggerItem}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTemplate(
              selectedTemplate === template.id ? null : template.id
            )}
            className={`
              relative p-4 rounded-xl border text-left transition-all
              ${selectedTemplate === template.id 
                ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2 ring-offset-background" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
              }
            `}
          >
            {selectedTemplate === template.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <Check className="h-4 w-4 text-primary-foreground" />
              </motion.div>
            )}

            <template.icon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">{template.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
            
            <div className="flex gap-1 mb-3">
              {template.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-border/50"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-1">
              {template.mood.map((m) => (
                <Badge key={m} variant="secondary" className="text-xs">
                  {m}
                </Badge>
              ))}
            </div>
          </motion.button>
        ))}
      </motion.div>

      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          {selectedTemplate 
            ? `Selected: ${templates.find(t => t.id === selectedTemplate)?.name}` 
            : "No template selected - you'll start with a blank canvas"
          }
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={nextStep} className="gap-2">
          {selectedTemplate ? "Use Template" : "Start Fresh"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
