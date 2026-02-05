import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { ArrowRight, ArrowLeft, User, Target, BookOpen } from "lucide-react";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/animations/variants";

const experienceLevels = [
  { value: "beginner", label: "Beginner", description: "New to design systems" },
  { value: "intermediate", label: "Intermediate", description: "Some experience with design tokens" },
  { value: "expert", label: "Expert", description: "Experienced designer/developer" },
];

const goalOptions = [
  { id: "prototype", label: "Quick prototyping" },
  { id: "production", label: "Production-ready systems" },
  { id: "branding", label: "Brand identity work" },
  { id: "learning", label: "Learning design systems" },
  { id: "client", label: "Client projects" },
];

const learningStyles = [
  { value: "visual", label: "Visual", description: "Show me examples and previews" },
  { value: "text", label: "Text", description: "Give me detailed explanations" },
  { value: "both", label: "Both", description: "A mix of both styles" },
];

export function OnboardingPersonalization() {
  const { nextStep, prevStep, setPreferences } = useOnboarding();
  const [experience, setExperience] = useState<"beginner" | "intermediate" | "expert">("beginner");
  const [goals, setGoals] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState<"visual" | "text" | "both">("both");

  const toggleGoal = (goalId: string) => {
    setGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    setPreferences({
      experience,
      goals,
      industry: "",
      learningStyle,
    });
    nextStep();
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4"
        >
          <User className="h-8 w-8 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Let's personalize your experience</h2>
        <p className="text-muted-foreground">Help us tailor DesignForge to your needs</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Experience Level */}
        <motion.div variants={staggerItem} className="space-y-3">
          <Label className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            What's your experience level?
          </Label>
          <RadioGroup value={experience} onValueChange={(v) => setExperience(v as typeof experience)}>
            <div className="grid gap-2">
              {experienceLevels.map((level) => (
                <Label
                  key={level.value}
                  htmlFor={level.value}
                  className={`
                    flex items-center justify-between p-4 rounded-lg border cursor-pointer
                    transition-colors hover:bg-muted/50
                    ${experience === level.value ? "border-primary bg-primary/5" : "border-border"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={level.value} id={level.value} />
                    <div>
                      <span className="font-medium">{level.label}</span>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </motion.div>

        {/* Goals */}
        <motion.div variants={staggerItem} className="space-y-3">
          <Label className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            What are your goals? (Select all that apply)
          </Label>
          <div className="grid gap-2">
            {goalOptions.map((goal) => (
              <Label
                key={goal.id}
                htmlFor={goal.id}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border cursor-pointer
                  transition-colors hover:bg-muted/50
                  ${goals.includes(goal.id) ? "border-primary bg-primary/5" : "border-border"}
                `}
              >
                <Checkbox
                  id={goal.id}
                  checked={goals.includes(goal.id)}
                  onCheckedChange={() => toggleGoal(goal.id)}
                />
                <span className="font-medium">{goal.label}</span>
              </Label>
            ))}
          </div>
        </motion.div>

        {/* Learning Style */}
        <motion.div variants={staggerItem} className="space-y-3">
          <Label className="text-base">How do you prefer to learn?</Label>
          <RadioGroup value={learningStyle} onValueChange={(v) => setLearningStyle(v as typeof learningStyle)}>
            <div className="grid grid-cols-3 gap-2">
              {learningStyles.map((style) => (
                <Label
                  key={style.value}
                  htmlFor={`style-${style.value}`}
                  className={`
                    flex flex-col items-center p-4 rounded-lg border cursor-pointer text-center
                    transition-colors hover:bg-muted/50
                    ${learningStyle === style.value ? "border-primary bg-primary/5" : "border-border"}
                  `}
                >
                  <RadioGroupItem value={style.value} id={`style-${style.value}`} className="sr-only" />
                  <span className="font-medium">{style.label}</span>
                  <span className="text-xs text-muted-foreground mt-1">{style.description}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </motion.div>
      </motion.div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={handleContinue} className="gap-2">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
