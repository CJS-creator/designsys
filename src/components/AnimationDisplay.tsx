import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AnimationTokens } from "@/types/designSystem";
import { Play, Clock, Zap, Focus } from "lucide-react";

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
    <div className="space-y-8 p-4">
      {/* Duration Tokens */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Time & Rhythm
          </h3>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">Duration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(animations.duration).map(([key, value], idx) => (
            <div
              key={key}
              className="group space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-white/10 hover:border-white/20"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold capitalize">{key}</div>
                <div className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{value}</div>
              </div>

              <button
                onClick={() => playDuration(key)}
                className="w-full h-12 rounded-xl bg-black/40 border border-white/10 relative overflow-hidden group/btn transition-transform active:scale-95"
              >
                <div
                  className={`absolute inset-y-0 left-0 bg-primary transition-all shadow-[0_0_15px_rgba(var(--primary),0.5)]`}
                  style={{
                    width: playingDuration === key ? "100%" : "0%",
                    transitionDuration: playingDuration === key ? value : "0ms",
                    transitionTimingFunction: "linear"
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Play className={`h-4 w-4 transition-all ${playingDuration === key ? "text-white scale-125 rotate-90" : "text-muted-foreground group-hover/btn:text-primary group-hover/btn:scale-110"}`} />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Easing Curves */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Motion Curves
          </h3>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">Bezier</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(animations.easing).map(([key, value], idx) => (
            <div
              key={key}
              className="group p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6 transition-all hover:bg-white/10 hover:border-white/20 hover:-translate-y-1"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold capitalize tracking-tight">{key}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full hover:bg-primary/20 hover:text-primary"
                  onClick={() => playEasing(key)}
                >
                  <Play className={`h-4 w-4 ${playingEasing === key ? "animate-pulse text-primary" : ""}`} />
                </Button>
              </div>

              <div className="h-24 bg-black/40 rounded-xl border border-white/5 relative flex items-center group/stage">
                <div className="absolute inset-x-4 h-px bg-white/10 bottom-8" />
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-purple-500 shadow-xl absolute bottom-3 flex items-center justify-center transition-all`}
                  style={{
                    left: playingEasing === key ? "calc(100% - 3rem)" : "1rem",
                    transitionDuration: playingEasing === key ? "1s" : "0ms",
                    transitionTimingFunction: value
                  }}
                >
                  <Zap className="h-5 w-5 text-white fill-white/20" />
                </div>
              </div>

              <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <code className="text-xs text-primary/80 block break-all leading-relaxed">
                  {value}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transition Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-6 border-t border-white/5">
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Focus className="h-5 w-5 text-primary" />
            Shorthand Presets
          </h3>
          <div className="grid gap-4">
            {Object.entries(animations.transitions).map(([key, value]) => (
              <div
                key={key}
                className="group p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div>
                  <div className="text-sm font-bold capitalize mb-1">{key}</div>
                  <div className="text-xs text-muted-foreground font-mono bg-black/20 px-2 py-1 rounded inline-block">{value}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="text-xs text-primary font-bold">Copy CSS</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">Implementation Code</h3>
          <div className="relative group/code">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-50 group-hover/code:opacity-100 transition-opacity" />
            <pre className="text-[11px] font-mono p-6 bg-black/80 rounded-2xl border border-white/10 overflow-x-auto relative min-h-[200px]">
              {`<style>
  .card {
     transition: transform ${animations.transitions.all};
  }

  .card:hover {
     transform: scale(1.02) translateY(-4px);
  }

  .fade-in {
     animation: fadeIn ${animations.duration.normal} ${animations.easing.easeOut};
  }

  @keyframes fadeIn {
     from { opacity: 0; transform: translateY(10px); }
     to { opacity: 1; transform: translateY(0); }
  }
</style>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
