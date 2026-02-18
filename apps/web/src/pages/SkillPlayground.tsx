import { useState } from 'react';
import { useSkill } from '@/hooks/useSkill';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SkillPlayground = () => {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Skill Playground</h1>
            <p className="text-muted-foreground mb-8">
                Test the new modular UI/UX skills directly in the browser.
            </p>

            <Tabs defaultValue="color" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="color">Color</TabsTrigger>
                    <TabsTrigger value="typography">Typography</TabsTrigger>
                    <TabsTrigger value="style">Style Match</TabsTrigger>
                </TabsList>

                <TabsContent value="color">
                    <ColorSkillDemo />
                </TabsContent>
                <TabsContent value="typography">
                    <TypographySkillDemo />
                </TabsContent>
                <TabsContent value="style">
                    <StyleSkillDemo />
                </TabsContent>
            </Tabs>
        </div>
    );
};

const ColorSkillDemo = () => {
    const [baseColor, setBaseColor] = useState('#6366f1');
    const { execute, result, isLoading, error } = useSkill('color.generate-palette');

    const handleGenerate = () => {
        execute({ baseColor, mood: 'vibrant' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generate Palette</CardTitle>
                <CardDescription>Generates harmony based on a base color.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 mb-4 items-end">
                    <div className="grid gap-2 flex-1">
                        <Label>Base Color</Label>
                        <Input value={baseColor} onChange={(e) => setBaseColor(e.target.value)} />
                    </div>
                    <Button onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate'}
                    </Button>
                </div>

                {error && <div className="text-red-500 mb-4">{error.message}</div>}

                {result && (
                    <div className="grid gap-4">
                        <div className="grid grid-cols-5 gap-2">
                            {Object.entries(result.output.cssVariables).map(([key, value]) => (
                                <div key={key} className="space-y-1">
                                    <div className="h-16 rounded-md shadow-sm border" style={{ backgroundColor: value as string }} />
                                    <div className="text-xs text-muted-foreground truncate">{key.replace('--color-', '')}</div>
                                    <div className="text-xs font-mono truncate">{value as string}</div>
                                </div>
                            ))}
                        </div>
                        <pre className="text-xs bg-secondary p-4 rounded-md overflow-x-auto">
                            {JSON.stringify(result.output, null, 2)}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const TypographySkillDemo = () => {
    const { execute, result, isLoading } = useSkill('typography.generate-scale');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generate Typography</CardTitle>
                <CardDescription>Generates type scales and pairings.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => execute({ mood: 'modern' })} disabled={isLoading} className="mb-4">
                    {isLoading ? 'Generating...' : 'Generate Scale'}
                </Button>
                {result && (
                    <pre className="text-xs bg-secondary p-4 rounded-md overflow-x-auto">
                        {JSON.stringify(result.output, null, 2)}
                    </pre>
                )}
            </CardContent>
        </Card>
    );
}

const StyleSkillDemo = () => {
    const [desc, setDesc] = useState('');
    const { execute, result, isLoading } = useSkill('style.match-vibe');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Match Vibe</CardTitle>
                <CardDescription>Matches text description to design styles using BM25.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="e.g. A clean, minimalist tech blog..."
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => execute({ description: desc })} disabled={isLoading}>
                        {isLoading ? 'Matching...' : 'Match Vibe'}
                    </Button>
                    {result && (
                        <div className="space-y-2">
                            {result.output.map((match: any) => (
                                <div key={match.id} className="flex justify-between p-2 border rounded-md">
                                    <span className="font-medium">{match.name}</span>
                                    <span className="text-muted-foreground">{match.score.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default SkillPlayground;
