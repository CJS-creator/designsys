
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Terminal } from "lucide-react";
import { toast } from "sonner";

export function APIDocs() {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Code copied to clipboard");
    };

    const curlExample = `curl -X POST "https://your-project-ref.functions.supabase.co/v1-api/v1/generate" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "industry": "Fintech",
    "brandMood": ["Trustworthy", "Modern"],
    "appType": "web"
  }'`;

    const jsExample = `const response = await fetch("https://your-project-ref.functions.supabase.co/v1-api/v1/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_API_KEY"
  },
  body: JSON.stringify({
    industry: "Fintech",
    brandMood: ["Trustworthy", "Modern"],
    appType: "web"
  })
});

const data = await response.json();
console.log(data.designSystem);`;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">API Reference</h2>
                    <p className="text-sm text-muted-foreground">
                        Documentation for the DesignSys REST API.
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <a href="/api-spec.yaml" download="designsys-openapi.yaml">
                        <Download className="mr-2 h-4 w-4" /> Download OpenAPI Spec
                    </a>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-mono flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded text-sm">POST</span>
                        /v1/generate
                    </CardTitle>
                    <CardDescription>
                        Generate a complete design system based on prompt inputs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs defaultValue="curl" className="w-full">
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                            <TabsTrigger
                                value="curl"
                                className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                cURL
                            </TabsTrigger>
                            <TabsTrigger
                                value="js"
                                className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                            >
                                JavaScript
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="curl" className="mt-4">
                            <div className="relative rounded-md bg-muted p-4 font-mono text-sm overflow-x-auto">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-2 top-2 h-6 w-6"
                                    onClick={() => copyToClipboard(curlExample)}
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                                <div className="whitespace-pre">{curlExample}</div>
                            </div>
                        </TabsContent>
                        <TabsContent value="js" className="mt-4">
                            <div className="relative rounded-md bg-muted p-4 font-mono text-sm overflow-x-auto">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-2 top-2 h-6 w-6"
                                    onClick={() => copyToClipboard(jsExample)}
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                                <div className="whitespace-pre">{jsExample}</div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="space-y-4">
                        <h4 className="text-sm font-medium">Request Body</h4>
                        <div className="border rounded-md divide-y">
                            <div className="grid grid-cols-3 p-3 text-sm">
                                <div className="font-mono font-medium">industry</div>
                                <div className="text-muted-foreground">string (required)</div>
                                <div className="text-muted-foreground">Target industry (e.g. "Healthcare")</div>
                            </div>
                            <div className="grid grid-cols-3 p-3 text-sm">
                                <div className="font-mono font-medium">brandMood</div>
                                <div className="text-muted-foreground">string[] (required)</div>
                                <div className="text-muted-foreground">Array of mood keywords</div>
                            </div>
                            <div className="grid grid-cols-3 p-3 text-sm">
                                <div className="font-mono font-medium">appType</div>
                                <div className="text-muted-foreground">enum (optional)</div>
                                <div className="text-muted-foreground">"mobile", "web", or "both"</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
