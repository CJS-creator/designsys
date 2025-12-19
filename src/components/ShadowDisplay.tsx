import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShadowScale } from "@/types/designSystem";
import { Layers } from "lucide-react";
import { toast } from "sonner";

interface ShadowDisplayProps {
  shadows: ShadowScale;
}

export function ShadowDisplay({ shadows }: ShadowDisplayProps) {
  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Shadow copied!");
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Shadows
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(shadows).map(([name, value]) => (
            <button
              key={name}
              onClick={() => copyValue(value)}
              className="flex flex-col items-center gap-3 group"
            >
              <div
                className="h-20 w-20 bg-card rounded-xl transition-transform group-hover:scale-105"
                style={{ boxShadow: value }}
              />
              <div className="text-center">
                <p className="text-sm font-medium capitalize">{name}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
