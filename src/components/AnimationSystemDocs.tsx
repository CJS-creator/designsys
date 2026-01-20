import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MotionWrapper } from "@/components/animations/MotionWrapper";
import { LoadingSpinner, ProgressBar, Skeleton } from "@/components/animations/LoadingSpinner";
import { InteractiveButton, InteractiveCard, FeedbackIcon, Typewriter } from "@/components/animations/MicroInteractions";
import { StaggerList, StaggerGrid } from "@/components/animations/StaggerList";
import { duration, easing, easingCSS, springs, transitions } from "@/lib/animations/constants";
import { fadeUp, scale, pop, slideLeft, modal, overlay } from "@/lib/animations/variants";
import { Play, Zap, Clock, Sparkles, Eye, Accessibility, Gauge, Code, Book, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnimationSystemDocs() {
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [listItems, setListItems] = useState(["Item 1", "Item 2", "Item 3"]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Animation System
          </CardTitle>
          <CardDescription>
            A comprehensive animation system built with Framer Motion and CSS transitions
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="timing" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="timing"><Clock className="h-4 w-4 mr-1" /> Timing</TabsTrigger>
          <TabsTrigger value="transitions"><Sparkles className="h-4 w-4 mr-1" /> Transitions</TabsTrigger>
          <TabsTrigger value="loading"><Play className="h-4 w-4 mr-1" /> Loading</TabsTrigger>
          <TabsTrigger value="micro"><Eye className="h-4 w-4 mr-1" /> Micro</TabsTrigger>
          <TabsTrigger value="accessibility"><Accessibility className="h-4 w-4 mr-1" /> A11y</TabsTrigger>
          <TabsTrigger value="performance"><Gauge className="h-4 w-4 mr-1" /> Performance</TabsTrigger>
          <TabsTrigger value="guidelines"><Book className="h-4 w-4 mr-1" /> Guidelines</TabsTrigger>
        </TabsList>

        {/* Timing & Easing */}
        <TabsContent value="timing">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Duration Tokens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(duration).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50">
                    <div>
                      <span className="font-medium capitalize">{key}</span>
                      <span className="text-muted-foreground ml-2 font-mono text-sm">{value}s</span>
                    </div>
                    <motion.div
                      className="w-8 h-8 bg-primary rounded"
                      animate={{ x: [0, 50, 0] }}
                      transition={{ duration: value, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Easing Curves</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(easingCSS).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{key}</span>
                      <code className="text-xs text-muted-foreground">{value}</code>
                    </div>
                    <div className="h-6 bg-muted rounded relative overflow-hidden">
                      <motion.div
                        className="absolute h-full w-4 bg-primary rounded"
                        animate={{ left: ["0%", "100%", "0%"] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: easing[key as keyof typeof easing]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Spring Configurations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(springs).map(([key, config]) => (
                    <motion.div
                      key={key}
                      className="p-4 rounded-lg bg-muted/20 border border-border/50 text-center cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", ...config }}
                    >
                      <div className="font-medium capitalize mb-1">{key}</div>
                      <div className="text-xs text-muted-foreground">
                        stiff: {config.stiffness}, damp: {config.damping}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transition Patterns */}
        <TabsContent value="transitions">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Entrance Animations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {["fade", "fadeUp", "fadeDown", "fadeLeft", "fadeRight", "scale", "scaleUp", "pop"].map((anim) => (
                  <MotionWrapper key={anim} animation={anim as "fade" | "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "scaleUp" | "pop"} className="p-4 rounded-lg bg-muted/20 border border-border/50">
                    <span className="font-medium capitalize">{anim}</span>
                  </MotionWrapper>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modal & Overlay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => setShowModal(true)}>Open Modal Demo</Button>

                <AnimatePresence>
                  {showModal && (
                    <>
                      <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        variants={overlay}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={() => setShowModal(false)}
                      />
                      <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                        variants={modal}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="bg-card p-6 rounded-lg shadow-xl max-w-md w-full mx-4 pointer-events-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Modal Animation</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            This modal uses spring physics for a natural feel.
                          </p>
                          <Button onClick={() => setShowModal(false)}>Close</Button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h4 className="font-medium mb-2">Stagger List</h4>
                  <StaggerList staggerDelay={0.1}>
                    {["First item", "Second item", "Third item"].map((item) => (
                      <div key={item} className="p-2 bg-muted/50 rounded">{item}</div>
                    ))}
                  </StaggerList>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Loading Animations */}
        <TabsContent value="loading">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spinner Variants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6">
                  {(["spinner", "dots", "pulse", "bars"] as const).map((variant) => (
                    <div key={variant} className="flex flex-col items-center gap-2">
                      <LoadingSpinner variant={variant} size="lg" />
                      <span className="text-sm text-muted-foreground capitalize">{variant}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress Bar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressBar progress={progress} showLabel />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 20))}>+20%</Button>
                  <Button size="sm" variant="outline" onClick={() => setProgress(0)}>Reset</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Skeleton Loaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 p-4 bg-muted/20 rounded-lg">
                  <Skeleton variant="circular" width={48} height={48} />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="rectangular" height={80} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Micro-interactions */}
        <TabsContent value="micro">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interactive Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {(["default", "lift", "bounce", "glow"] as const).map((variant) => (
                    <InteractiveButton
                      key={variant}
                      variant={variant}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                    >
                      {variant}
                    </InteractiveButton>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feedback Icons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  {(["success", "error", "warning", "info"] as const).map((type) => (
                    <div key={type} className="flex flex-col items-center gap-2">
                      <FeedbackIcon type={type} size="lg" />
                      <span className="text-xs capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interactive Card</CardTitle>
              </CardHeader>
              <CardContent>
                <InteractiveCard className="p-4">
                  <h4 className="font-medium mb-2">Hover me!</h4>
                  <p className="text-sm text-muted-foreground">
                    This card lifts and shows a shadow on hover.
                  </p>
                </InteractiveCard>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Typewriter Effect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/20 rounded-lg font-mono">
                  <Typewriter text="Hello, I'm typing character by character..." delay={0.08} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Accessibility */}
        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reduced Motion Support</CardTitle>
              <CardDescription>
                All animations respect the user's prefers-reduced-motion setting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                  <h4 className="font-medium mb-3">Standard Motion</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Full spring animations</li>
                    <li>• Staggered list reveals</li>
                    <li>• Scale and position transforms</li>
                    <li>• Continuous loading indicators</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                  <h4 className="font-medium mb-3">Reduced Motion</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Instant opacity transitions</li>
                    <li>• No transform animations</li>
                    <li>• Static loading states</li>
                    <li>• Immediate feedback</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Usage
                </h4>
                <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                  {`import { useReducedMotion } from "@/hooks/useReducedMotion";

function MyComponent() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={prefersReducedMotion 
        ? { opacity: 1 } 
        : { opacity: 1, y: 0, scale: 1 }
      }
    />
  );
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Considerations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <Badge className="bg-green-500/20 text-green-600 mb-2">Do</Badge>
                  <ul className="text-sm space-y-1">
                    <li>• Use transform & opacity</li>
                    <li>• Use will-change sparingly</li>
                    <li>• Batch DOM updates</li>
                    <li>• Use layout prop wisely</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <Badge className="bg-red-500/20 text-red-600 mb-2">Don't</Badge>
                  <ul className="text-sm space-y-1">
                    <li>• Animate width/height</li>
                    <li>• Use layout on large lists</li>
                    <li>• Animate box-shadow</li>
                    <li>• Over-animate everything</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <Badge className="bg-amber-500/20 text-amber-600 mb-2">Tips</Badge>
                  <ul className="text-sm space-y-1">
                    <li>• Use exit animations</li>
                    <li>• Prefer CSS transitions</li>
                    <li>• Use AnimatePresence</li>
                    <li>• Test on low-end devices</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guidelines */}
        <TabsContent value="guidelines">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Animation Principles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Purpose", desc: "Every animation should have a clear purpose - guiding attention, providing feedback, or improving perceived performance." },
                  { title: "Duration", desc: "Keep animations short (150-500ms). Longer animations can feel sluggish. Use faster animations for micro-interactions." },
                  { title: "Easing", desc: "Use ease-out for entrances (elements arriving), ease-in for exits (elements leaving), and ease-in-out for state changes." },
                  { title: "Consistency", desc: "Use consistent timing and easing across similar interactions to build user expectations and muscle memory." },
                  { title: "Subtlety", desc: "Animations should enhance, not distract. If users notice the animation more than the content, it's too much." },
                  { title: "Accessibility", desc: "Always respect prefers-reduced-motion. Provide instant alternatives for all animated content." },
                ].map((principle, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/20 border border-border/50">
                    <h4 className="font-medium mb-2">{principle.title}</h4>
                    <p className="text-sm text-muted-foreground">{principle.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
