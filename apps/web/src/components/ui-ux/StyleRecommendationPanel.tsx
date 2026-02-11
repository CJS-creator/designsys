import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Search,
    Sparkles,

    Check,
    AlertTriangle,
    Palette,
    Type,
    Layout,
    Code,
    RefreshCw
} from 'lucide-react';
import {
    generateDesignSystem,
    type DesignSystemRecommendation
} from '@/lib/ui-ux-search';

interface StyleRecommendationPanelProps {
    industry?: string;
    productType?: string;
    brandMood?: string[];
    onApply?: (recommendation: DesignSystemRecommendation) => void;
}

export function StyleRecommendationPanel({
    industry = 'SaaS',
    productType = 'General',
    brandMood = ['modern'],
    onApply
}: StyleRecommendationPanelProps) {
    const [recommendation, setRecommendation] = useState<DesignSystemRecommendation | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const [selectedIndustry, setSelectedIndustry] = useState(industry);
    const [selectedMood, setSelectedMood] = useState(brandMood.join(', '));



    const industries = [
        'SaaS', 'E-commerce', 'Fintech', 'Healthcare', 'Education',
        'Gaming', 'Finance', 'Real Estate', 'Travel', 'Food',
        'Fitness', 'Entertainment', 'Portfolio', 'Dashboard'
    ];

    const generate = async () => {
        setLoading(true);
        try {
            const result = await generateDesignSystem({
                industry: selectedIndustry,
                productType,
                brandMood: selectedMood.split(',').map(m => m.trim()).filter(Boolean)
            });
            setRecommendation(result);
        } catch (error) {
            console.error('Failed to generate recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    useEffect(() => {
        generate();
    }, [selectedIndustry, selectedMood]);

    if (loading && !recommendation) {
        return (
            <Card className="animate-pulse">
                <CardContent className="py-10">
                    <div className="flex items-center justify-center gap-2">
                        <Sparkles className="h-5 w-5 animate-spin" />
                        <span>Analyzing {selectedIndustry} design patterns...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!recommendation) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Search Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Find Style Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Industry</Label>
                        <select
                            className="w-full p-2 border rounded-md bg-background"
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                        >
                            {industries.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Brand Mood</Label>
                        <Input
                            value={selectedMood}
                            onChange={(e) => setSelectedMood(e.target.value)}
                            placeholder="modern, minimalist, playful"
                        />
                    </div>
                    <div className="flex items-end">
                        <Button onClick={generate} className="w-full gap-2" disabled={loading}>
                            {loading ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                            Generate
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Style Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Layout className="h-5 w-5 text-primary" />
                            Recommended Style
                        </CardTitle>
                        <CardDescription>
                            {recommendation.style.category} • {recommendation.style.era}
                        </CardDescription>
                    </div>
                    <Badge variant="secondary">
                        Score: {recommendation.style.score.toFixed(2)}
                    </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-xl font-bold">{recommendation.style.name}</h3>
                        <p className="text-muted-foreground">
                            {recommendation.style.keywords.slice(0, 5).join(', ')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Performance</p>
                            <Badge variant="outline">{recommendation.style.performance}</Badge>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Accessibility</p>
                            <Badge variant="outline">{recommendation.style.accessibility}</Badge>
                        </div>
                    </div>

                    {recommendation.style.bestFor.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2">Best For:</p>
                            <div className="flex flex-wrap gap-2">
                                {recommendation.style.bestFor.map((item, i) => (
                                    <Badge key={i} variant="outline">{item}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {recommendation.style.doNotUseFor.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2 text-amber-600">Avoid For:</p>
                            <div className="flex flex-wrap gap-2">
                                {recommendation.style.doNotUseFor.map((item, i) => (
                                    <Badge key={i} variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {recommendation.style.cssKeywords.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Code className="h-4 w-4" />
                                CSS Keywords:
                            </p>
                            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                                <div className="flex flex-wrap gap-2">
                                    {recommendation.style.cssKeywords.slice(0, 10).map((kw, i) => (
                                        <button
                                            key={i}
                                            onClick={() => copyToClipboard(kw, `css-${i}`)}
                                            className="px-2 py-1 bg-background rounded border hover:bg-accent flex items-center gap-1 text-xs"
                                        >
                                            {copied === `css-${i}` ? <Check className="h-3 w-3" /> : null}
                                            {kw}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Colors Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Recommended Colors
                    </CardTitle>
                    <CardDescription>{recommendation.colors.productType}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Primary', value: recommendation.colors.primary, color: recommendation.colors.primary },
                            { label: 'Secondary', value: recommendation.colors.secondary, color: recommendation.colors.secondary },
                            { label: 'CTA', value: recommendation.colors.cta, color: recommendation.colors.cta },
                            { label: 'Background', value: recommendation.colors.background, color: recommendation.colors.background },
                            { label: 'Text', value: recommendation.colors.text, color: recommendation.colors.text },
                            { label: 'Border', value: recommendation.colors.border, color: recommendation.colors.border },
                        ].map((color) => (
                            <div key={color.label} className="space-y-1">
                                <div
                                    className="h-12 rounded-lg border shadow-sm"
                                    style={{ backgroundColor: color.color }}
                                />
                                <p className="text-xs font-medium">{color.label}</p>
                                <p className="text-xs font-mono text-muted-foreground">{color.value}</p>
                            </div>
                        ))}
                    </div>
                    {recommendation.colors.notes && (
                        <p className="text-sm text-muted-foreground mt-4">
                            {recommendation.colors.notes}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Typography Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Type className="h-5 w-5" />
                        Typography Pairing
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-lg font-bold">{recommendation.typography.name}</h3>
                        <p className="text-muted-foreground">{recommendation.typography.category}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Heading Font</p>
                            <p className="text-lg font-semibold">{recommendation.typography.headingFont}</p>
                            <p className="text-xs text-muted-foreground">{recommendation.typography.mood.join(', ')}</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Body Font</p>
                            <p className="text-lg">{recommendation.typography.bodyFont}</p>
                        </div>
                    </div>

                    {recommendation.typography.cssImport && (
                        <div>
                            <p className="text-sm font-medium mb-1">CSS Import:</p>
                            <div className="bg-muted p-3 rounded-lg">
                                <code className="text-xs block bg-background p-2 rounded overflow-x-auto">
                                    {recommendation.typography.cssImport}
                                </code>
                            </div>
                        </div>
                    )}

                    {recommendation.typography.tailwindConfig && (
                        <div>
                            <p className="text-sm font-medium mb-1">Tailwind Config:</p>
                            <div className="bg-muted p-3 rounded-lg">
                                <code className="text-xs block bg-background p-2 rounded overflow-x-auto">
                                    {recommendation.typography.tailwindConfig}
                                </code>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Anti-Patterns */}
            {recommendation.antiPatterns.length > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-700">
                            <AlertTriangle className="h-5 w-5" />
                            Anti-Patterns to Avoid
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {[...new Set(recommendation.antiPatterns)].slice(0, 5).map((pattern, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="text-amber-600 mt-1">•</span>
                                    {pattern}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Checklist */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        Pre-delivery Checklist
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {recommendation.checklist.slice(0, 8).map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Action Button */}
            {onApply && (
                <Button onClick={() => onApply(recommendation)} className="w-full" size="lg">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Apply Recommendations
                </Button>
            )}
        </div>
    );
}
