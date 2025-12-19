import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BorderRadius } from "@/types/designSystem";
import { Circle } from "lucide-react";
import { toast } from "sonner";

interface BorderRadiusDisplayProps {
  borderRadius: BorderRadius;
}

export function BorderRadiusDisplay({ borderRadius }: BorderRadiusDisplayProps) {
  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied: ${value}`);
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Circle className="h-5 w-5 text-primary" />
          Border Radius
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
          {Object.entries(borderRadius).map(([name, value]) => (
            <button
              key={name}
              onClick={() => copyValue(value)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="h-16 w-16 bg-primary/80 transition-transform group-hover:scale-105"
                style={{ borderRadius: value }}
              />
              <div className="text-center">
                <p className="text-xs font-medium">{name}</p>
                <p className="text-xs text-muted-foreground font-mono">{value}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
