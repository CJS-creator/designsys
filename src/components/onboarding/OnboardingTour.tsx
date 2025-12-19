import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { 
  ArrowRight, ArrowLeft, Palette, Type, Grid3X3, 
  Sun, Moon, Download, Eye, Play, Layers
} from "lucide-react";
import { fadeUp, scale } from "@/lib/animations/variants";

interface TourStep {
  id: string;
  title: string;
  description: string;
  visual: "colors" | "typography" | "components" | "export" | "preview";
  icon: typeof Palette;
  tips: string[];
}

const tourSteps: TourStep[] = [
  {
    id: "colors",
    title: "Smart Color Generation",
    description: "Our AI analyzes your industry and brand mood to create harmonious color palettes with proper contrast ratios.",
    visual: "colors",
    icon: Palette,
    tips: [
      "Colors include primary, secondary, and accent variants",
      "Automatic dark mode colors are generated",
      "All colors pass WCAG accessibility guidelines",
    ],
  },
  {
    id: "typography",
    title: "Professional Typography",
    description: "Get perfectly paired fonts with a complete scale of sizes, weights, and line heights.",
    visual: "typography",
    icon: Type,
    tips: [
      "Font pairings based on design best practices",
      "Includes heading, body, and mono fonts",
      "Responsive sizing for all screen sizes",
    ],
  },
  {
    id: "components",
    title: "Component Library",
    description: "Preview how your design system looks on real UI components with animations applied.",
    visual: "components",
    icon: Layers,
    tips: [
      "Buttons, forms, cards, and more",
      "Interactive states included",
      "Dark mode preview available",
    ],
  },
  {
    id: "export",
    title: "Export Anywhere",
    description: "Download your design system in multiple formats for any platform or tool.",
    visual: "export",
    icon: Download,
    tips: [
      "CSS Variables for vanilla projects",
      "Tailwind config for utility-first workflows",
      "Figma tokens for design tools",
    ],
  },
];

function TourVisual({ type }: { type: TourStep["visual"] }) {
  const visuals = {
    colors: (
      <div className="flex gap-2 justify-center">
        {["bg-primary", "bg-secondary", "bg-accent", "bg-muted"].map((color, i) => (
          <motion.div
            key={color}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            className={`w-12 h-12 rounded-lg ${color}`}
          />
        ))}
      </div>
    ),
    typography: (
      <div className="text-center space-y-2">
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Heading
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg"
        >
          Body text
        </motion.p>
        <motion.code 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-mono bg-muted px-2 py-1 rounded"
        >
          monospace
        </motion.code>
      </div>
    ),
    components: (
      <div className="flex flex-wrap gap-2 justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <Button size="sm">Button</Button>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
          <Button size="sm" variant="secondary">Secondary</Button>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
          <Button size="sm" variant="outline">Outline</Button>
        </motion.div>
      </div>
    ),
    export: (
      <div className="flex gap-3 justify-center">
        {["CSS", "Tailwind", "JSON"].map((format, i) => (
          <motion.div
            key={format}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="px-3 py-2 bg-muted rounded-lg text-sm font-mono"
          >
            {format}
          </motion.div>
        ))}
      </div>
    ),
    preview: (
      <div className="flex gap-4 justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <Sun className="h-5 w-5" />
          <span className="text-sm">Light</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <Moon className="h-5 w-5" />
          <span className="text-sm">Dark</span>
        </motion.div>
      </div>
    ),
  };

  return (
    <div className="h-24 flex items-center justify-center">
      {visuals[type]}
    </div>
  );
}

export function OnboardingTour() {
  const { nextStep, prevStep } = useOnboarding();
  const [tourIndex, setTourIndex] = useState(0);
  const currentTour = tourSteps[tourIndex];

  const handleNext = () => {
    if (tourIndex < tourSteps.length - 1) {
      setTourIndex(prev => prev + 1);
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (tourIndex > 0) {
      setTourIndex(prev => prev - 1);
    } else {
      prevStep();
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          Feature {tourIndex + 1} of {tourSteps.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTour.id}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="text-center"
        >
          <motion.div
            variants={scale}
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4"
          >
            <currentTour.icon className="h-8 w-8 text-primary" />
          </motion.div>

          <h2 className="text-2xl font-bold mb-2">{currentTour.title}</h2>
          <p className="text-muted-foreground mb-6">{currentTour.description}</p>

          <div className="p-6 rounded-xl bg-card border border-border/50 mb-6">
            <TourVisual type={currentTour.visual} />
          </div>

          <div className="space-y-2 text-left bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" /> Pro Tips:
            </p>
            <ul className="space-y-1">
              {currentTour.tips.map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-1">•</span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrev} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={handleNext} className="gap-2">
          {tourIndex < tourSteps.length - 1 ? (
            <>Next <ArrowRight className="h-4 w-4" /></>
          ) : (
            <>Continue <ArrowRight className="h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
