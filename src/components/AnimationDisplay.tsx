import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimationTokens } from "@/types/designSystem";
import { Play, Clock, Zap } from "lucide-react";

interface AnimationDisplayProps {
  animations: AnimationTokens;
}

export function AnimationDisplay({ animations }: AnimationDisplayProps) {
  const [playingDuration, setPlayingDuration] = useState<string | null>(null);
  const [playingEasing, setPlayingEasing] = useState<string | null>(null);

  const playDuration = (key: string) => {
    setPlayingDuration(key);
    setTimeout(() => setPlayingDuration(null), 2000);
  };

  const playEasing = (key: string) => {
    setPlayingEasing(key);
    setTimeout(() => setPlayingEasing(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Animation Tokens
        </CardTitle>
        <CardDescription>Duration, easing curves, and transition presets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Duration Tokens */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Duration
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(animations.duration).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="text-sm font-medium capitalize">{key}</div>
                <div className="text-xs text-muted-foreground font-mono">{value}</div>
                <button
                  onClick={() => playDuration(key)}
                  className="w-full h-8 rounded-md border border-border/50 bg-muted/20 relative overflow-hidden"
                >
                  <div
                    className={`absolute inset-y-0 left-0 bg-primary/80 transition-all ${
                      playingDuration === key ? "w-full" : "w-0"
                    }`}
                    style={{
                      transitionDuration: playingDuration === key ? value : "0ms"
                    }}
                  />
                  <Play className="h-3 w-3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Easing Curves */}
        <div className="space-y-4">
          <h3 className="font-semibold">Easing Curves</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(animations.easing).map(([key, value]) => (
              <div key={key} className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{key}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => playEasing(key)}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground font-mono break-all">
                  {value}
                </div>
                <div className="h-8 relative border-b border-border/50">
                  <div
                    className={`w-4 h-4 rounded-full bg-primary absolute bottom-0 ${
                      playingEasing === key ? "translate-x-full" : "translate-x-0"
                    }`}
                    style={{
                      transition: playingEasing === key ? `transform 1s ${value}` : "none",
                      left: playingEasing === key ? "calc(100% - 1rem)" : "0"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transition Presets */}
        <div className="space-y-4">
          <h3 className="font-semibold">Transition Presets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(animations.transitions).map(([key, value]) => (
              <div
                key={key}
                className="p-4 rounded-lg border border-border/50 bg-muted/20 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium capitalize">{key}</div>
                  <div className="text-xs text-muted-foreground font-mono">{value}</div>
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  transition: {value};
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Example */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
          <h4 className="font-medium text-sm mb-3">Usage Example</h4>
          <pre className="text-xs font-mono overflow-x-auto p-3 bg-background rounded">
{`.button {
  transition: ${animations.transitions.all};
}

.button:hover {
  transform: scale(1.05);
}

.fade-in {
  animation: fadeIn ${animations.duration.normal} ${animations.easing.easeOut};
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
