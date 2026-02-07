import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
    code: string;
    language?: string;
    className?: string;
}

export function CodeViewer({ code, language = "tsx", className }: CodeViewerProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("relative rounded-lg border bg-muted/50", className)}>
            <div className="absolute right-2 top-2 z-10">
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 hover:bg-background/50"
                    onClick={copyToClipboard}
                    aria-label={copied ? "Copied to clipboard" : "Copy code"}
                >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
            </div>
            <ScrollArea className="max-h-[300px] w-full rounded-lg p-4">
                <pre className="font-mono text-xs">
                    <code className={`language-${language}`}>{code}</code>
                </pre>
            </ScrollArea>
        </div>
    );
}
