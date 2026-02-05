/**
 * API Documentation Generator
 * 
 * Automatically generates documentation from TypeScript interfaces,
 * JSDoc comments, and component metadata.
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Copy,
    Download,
    Search,
    ChevronDown,
    BookOpen,
    Code,
    Menu,
    X,
} from 'lucide-react';

// Type definitions for parsed documentation
export interface PropDefinition {
    name: string;
    type: string;
    required: boolean;
    defaultValue?: string;
    description: string;
    category?: string;
}

export interface MethodDefinition {
    name: string;
    description: string;
    parameters: PropDefinition[];
    returnType: string;
    returnDescription?: string;
}

export interface EventDefinition {
    name: string;
    description: string;
    payload?: PropDefinition;
}

export interface SlotDefinition {
    name: string;
    description: string;
    fallback?: string;
}

export interface ComponentDoc {
    name: string;
    description: string;
    category: string;
    version: string;
    props: PropDefinition[];
    methods: MethodDefinition[];
    events: EventDefinition[];
    slots: SlotDefinition[];
    examples: string[];
    filePath: string;
    isDeprecated?: boolean;
    deprecationMessage?: string;
    since?: string;
    see?: string[];
}

// JSDoc tag parser
export function parseJSDocComment(comment: string): {
    description: string;
    tags: Record<string, string>;
} {
    const lines = comment.split('\n');
    let description = '';
    const tags: Record<string, string> = {};

    lines.forEach((line) => {
        const tagMatch = line.match(/@(\w+)\s+(.*)/);
        if (tagMatch) {
            tags[tagMatch[1]] = tagMatch[2].trim();
        } else {
            description += line.replace(/^\s*\*\s?/, '').trim() + ' ';
        }
    });

    return { description: description.trim(), tags };
}

// Parse TypeScript interface to props
export function parseInterfaceToProps(
    interfaceStr: string
): PropDefinition[] {
    const props: PropDefinition[] = [];

    // Match property patterns
    const propPattern = /(\w+)(\??):\s*([^;]+);/g;
    let match;

    while ((match = propPattern.exec(interfaceStr)) !== null) {
        const [, name, optional, type] = match;
        const descriptionMatch = interfaceStr.substring(match.index).match(
            /\/\*\*([^*]*(?:\*(?!\/)[^*]*)*)\*\//
        );

        let description = '';
        if (descriptionMatch) {
            const { description: desc } = parseJSDocComment(descriptionMatch[1]);
            description = desc;
        }

        props.push({
            name,
            type: type.trim(),
            required: !optional.includes('?'),
            description,
        });
    }

    return props;
}

// Generate Markdown documentation
export function generateMarkdownDoc(component: ComponentDoc): string {
    const lines: string[] = [];

    // Header
    lines.push(`# ${component.name}`);
    lines.push('');
    lines.push(`> ${component.description}`);
    lines.push('');

    // Metadata
    lines.push('## Metadata');
    lines.push('');
    lines.push(`| Property | Value |`);
    lines.push(`|----------|-------|`);
    if (component.category) lines.push(`| Category | ${component.category} |`);
    if (component.version) lines.push(`| Version | ${component.version} |`);
    if (component.since) lines.push(`| Since | ${component.since} |`);
    if (component.filePath) lines.push(`| File | \`${component.filePath}\` |`);
    lines.push('');

    // Deprecation warning
    if (component.isDeprecated) {
        lines.push(':::warning');
        lines.push(`**Deprecated:** ${component.deprecationMessage || 'This component is deprecated.'}`);
        lines.push(':::');
        lines.push('');
    }

    // Props
    if (component.props.length > 0) {
        lines.push('## Props');
        lines.push('');
        lines.push('| Name | Type | Required | Default | Description |');
        lines.push('|------|------|----------|---------|-------------|');
        component.props.forEach((prop) => {
            const required = prop.required ? 'Yes' : 'No';
            const defaultVal = prop.defaultValue || '—';
            lines.push(
                `| \`${prop.name}\` | \`${prop.type}\` | ${required} | ${defaultVal} | ${prop.description} |`
            );
        });
        lines.push('');
    }

    // Methods
    if (component.methods.length > 0) {
        lines.push('## Methods');
        lines.push('');
        component.methods.forEach((method) => {
            lines.push(`### ${method.name}`);
            lines.push('');
            lines.push(method.description);
            lines.push('');
            lines.push('**Parameters:**');
            lines.push('');
            if (method.parameters.length > 0) {
                lines.push('| Name | Type | Description |');
                lines.push('|------|------|-------------|');
                method.parameters.forEach((param) => {
                    lines.push(`| \`${param.name}\` | \`${param.type}\` | ${param.description} |`);
                });
            } else {
                lines.push('_None_');
            }
            lines.push('');
            lines.push(`**Returns:** \`${method.returnType}\``);
            if (method.returnDescription) {
                lines.push(` — ${method.returnDescription}`);
            }
            lines.push('');
        });
    }

    // Events
    if (component.events.length > 0) {
        lines.push('## Events');
        lines.push('');
        lines.push('| Name | Description | Payload |');
        lines.push('|------|-------------|---------|');
        component.events.forEach((event) => {
            const payload = event.payload
                ? `\`${event.payload.type}\` - ${event.payload.description}`
                : '—';
            lines.push(`| \`${event.name}\` | ${event.description} | ${payload} |`);
        });
        lines.push('');
    }

    // Slots
    if (component.slots.length > 0) {
        lines.push('## Slots');
        lines.push('');
        lines.push('| Name | Description | Fallback |');
        lines.push('|------|-------------|----------|');
        component.slots.forEach((slot) => {
            lines.push(`| \`${slot.name}\` | ${slot.description} | ${slot.fallback || '—'} |`);
        });
        lines.push('');
    }

    // Examples
    if (component.examples.length > 0) {
        lines.push('## Examples');
        lines.push('');
        component.examples.forEach((example, index) => {
            lines.push(`### Example ${index + 1}`);
            lines.push('');
            lines.push('```tsx');
            lines.push(example);
            lines.push('```');
            lines.push('');
        });
    }

    // See also
    if (component.see && component.see.length > 0) {
        lines.push('## See Also');
        lines.push('');
        component.see.forEach((ref) => {
            lines.push(`- ${ref}`);
        });
        lines.push('');
    }

    return lines.join('\n');
}

// Generate HTML documentation
export function generateHTMLDoc(component: ComponentDoc): string {
    const markdown = generateMarkdownDoc(component);

    // Simple markdown to HTML conversion
    const html = markdown
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/^\| (.+) \|$/gm, (_match: string, content: string) => {
            const cells = content.split(' | ').map((c: string) => `<td>${c.trim()}</td>`).join('');
            return `<tr>${cells}</tr>`;
        })
        .replace(/^(\|[-| ]+\|)$/gm, '')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gm, '<p>$1</p>');

    return `<article class="api-doc">${html}</article>`;
}

// Component documentation viewer props
export interface DocViewerProps {
    component: ComponentDoc;
    className?: string;
    showSidebar?: boolean;
}

// Prop table row component
interface PropRowProps {
    prop: PropDefinition;
}

const PropRow: React.FC<PropRowProps> = ({ prop }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div
            className={cn(
                'border-b last:border-0',
                prop.description && 'cursor-pointer hover:bg-muted/50'
            )}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center gap-2 p-3">
                <ChevronDown
                    className={cn(
                        'h-4 w-4 transition-transform',
                        !prop.description && 'invisible',
                        isExpanded && 'rotate-180'
                    )}
                />
                <code className="text-sm font-mono text-primary">{prop.name}</code>
                {prop.required && (
                    <Badge variant="destructive" className="text-xs">
                        Required
                    </Badge>
                )}
                <code className="text-xs text-muted-foreground ml-auto">
                    {prop.type}
                </code>
                {prop.defaultValue && (
                    <span className="text-xs text-muted-foreground">
                        = {prop.defaultValue}
                    </span>
                )}
            </div>
            <AnimatePresence>
                {isExpanded && prop.description && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="px-9 pb-3 text-sm text-muted-foreground">
                            {prop.description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Method signature component
interface MethodRowProps {
    method: MethodDefinition;
}

const MethodRow: React.FC<MethodRowProps> = ({ method }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div className="border rounded-lg overflow-hidden mb-4">
            <div
                className="flex items-center gap-2 p-3 bg-muted/50 cursor-pointer hover:bg-muted"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <ChevronDown
                    className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
                />
                <code className="text-sm font-mono">{method.name}</code>
                <Badge variant="outline" className="text-xs ml-auto">
                    returns {method.returnType}
                </Badge>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 space-y-3">
                            <p className="text-sm">{method.description}</p>

                            {method.parameters.length > 0 && (
                                <>
                                    <p className="text-sm font-medium">Parameters:</p>
                                    <div className="space-y-2 pl-4">
                                        {method.parameters.map((param) => (
                                            <div key={param.name} className="flex gap-2">
                                                <code className="text-sm font-mono">{param.name}</code>
                                                <code className="text-xs text-muted-foreground">
                                                    {param.type}
                                                </code>
                                                <span className="text-sm text-muted-foreground">
                                                    — {param.description}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {method.returnDescription && (
                                <p className="text-sm">
                                    <span className="font-medium">Returns:</span>{' '}
                                    {method.returnDescription}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Main documentation viewer component
export const DocViewer: React.FC<DocViewerProps> = ({
    component,
    className,
    showSidebar = true,
}) => {
    const [activeSection, setActiveSection] = React.useState('props');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const sections = [
        { id: 'props', label: 'Props', count: component.props.length },
        { id: 'methods', label: 'Methods', count: component.methods.length },
        { id: 'events', label: 'Events', count: component.events.length },
        { id: 'slots', label: 'Slots', count: component.slots.length },
        { id: 'examples', label: 'Examples', count: component.examples.length },
    ];

    const filteredProps = component.props.filter(
        (prop) =>
            prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prop.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prop.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const copyMarkdown = async () => {
        const markdown = generateMarkdownDoc(component);
        await navigator.clipboard.writeText(markdown);
    };

    const downloadHTML = () => {
        const html = generateHTMLDoc(component);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${component.name.toLowerCase()}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={cn('flex gap-6', className)}>
            {/* Sidebar */}
            {showSidebar && (
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 240, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="hidden lg:block flex-shrink-0"
                        >
                            <Card className="h-full">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">
                                        {component.category}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <nav className="space-y-1">
                                        {sections.map((section) => (
                                            <button
                                                key={section.id}
                                                className={cn(
                                                    'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors',
                                                    activeSection === section.id
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted'
                                                )}
                                                onClick={() => setActiveSection(section.id)}
                                            >
                                                <span>{section.label}</span>
                                                <Badge
                                                    variant={
                                                        activeSection === section.id
                                                            ? 'secondary'
                                                            : 'outline'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {section.count}
                                                </Badge>
                                            </button>
                                        ))}
                                    </nav>
                                </CardContent>
                            </Card>
                        </motion.aside>
                    )}
                </AnimatePresence>
            )}

            {/* Main content */}
            <div className="flex-1 min-w-0">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden"
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                >
                                    {isSidebarOpen ? (
                                        <X className="h-4 w-4" />
                                    ) : (
                                        <Menu className="h-4 w-4" />
                                    )}
                                </Button>
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        {component.name}
                                    </CardTitle>
                                    {component.isDeprecated && (
                                        <Badge variant="destructive" className="mt-2">
                                            Deprecated
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={copyMarkdown}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={downloadHTML}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2">
                            {component.description}
                        </p>

                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            {component.version && (
                                <span>v{component.version}</span>
                            )}
                            {component.since && (
                                <span>Since {component.since}</span>
                            )}
                            <code className="px-2 py-0.5 bg-muted rounded">
                                {component.filePath}
                            </code>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search props..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background"
                            />
                        </div>

                        {/* Tabs for sections */}
                        <Tabs value={activeSection} onValueChange={setActiveSection}>
                            <TabsList className="mb-4">
                                {sections.map((section) => (
                                    <TabsTrigger key={section.id} value={section.id} className="relative">
                                        {section.label}
                                        {section.count > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-2 text-xs h-5"
                                            >
                                                {section.count}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value="props">
                                <ScrollArea className="h-[400px] border rounded-lg">
                                    {filteredProps.length > 0 ? (
                                        filteredProps.map((prop) => (
                                            <PropRow key={prop.name} prop={prop} />
                                        ))
                                    ) : (
                                        <p className="p-4 text-sm text-muted-foreground">
                                            No props found matching your search.
                                        </p>
                                    )}
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="methods">
                                <div className="space-y-4">
                                    {component.methods.length > 0 ? (
                                        component.methods.map((method) => (
                                            <MethodRow key={method.name} method={method} />
                                        ))
                                    ) : (
                                        <p className="p-4 text-sm text-muted-foreground">
                                            No methods available.
                                        </p>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="events">
                                {component.events.length > 0 ? (
                                    <div className="space-y-3">
                                        {component.events.map((event) => (
                                            <div key={event.name} className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <code className="font-mono text-sm">{event.name}</code>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {event.description}
                                                </p>
                                                {event.payload && (
                                                    <div className="mt-2 text-xs text-muted-foreground">
                                                        Payload: <code>{event.payload.type}</code> —{' '}
                                                        {event.payload.description}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="p-4 text-sm text-muted-foreground">
                                        No events available.
                                    </p>
                                )}
                            </TabsContent>

                            <TabsContent value="slots">
                                {component.slots.length > 0 ? (
                                    <div className="space-y-3">
                                        {component.slots.map((slot) => (
                                            <div key={slot.name} className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <code className="font-mono text-sm">
                                                        {'<'}{slot.name}{'>'}
                                                    </code>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {slot.description}
                                                </p>
                                                {slot.fallback && (
                                                    <div className="mt-2 text-xs">
                                                        <span className="text-muted-foreground">
                                                            Fallback:
                                                        </span>{' '}
                                                        <code className="bg-muted px-1 py-0.5 rounded">
                                                            {slot.fallback}
                                                        </code>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="p-4 text-sm text-muted-foreground">
                                        No slots available.
                                    </p>
                                )}
                            </TabsContent>

                            <TabsContent value="examples">
                                {component.examples.length > 0 ? (
                                    <div className="space-y-4">
                                        {component.examples.map((example, index) => (
                                            <div key={index} className="border rounded-lg overflow-hidden">
                                                <div className="bg-muted px-4 py-2 text-sm font-medium flex items-center gap-2">
                                                    <Code className="h-4 w-4" />
                                                    Example {index + 1}
                                                </div>
                                                <pre className="p-4 overflow-auto text-sm">
                                                    <code>{example}</code>
                                                </pre>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="p-4 text-sm text-muted-foreground">
                                        No examples available.
                                    </p>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Generate component documentation from file
export async function generateDocFromFile(
    filePath: string
): Promise<ComponentDoc | null> {
    try {
        const response = await fetch(filePath);
        const content = await response.text();

        // Parse component metadata
        const nameMatch = content.match(/export\s+interface\s+(\w+)Props/);
        const descriptionMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/);

        // This is a simplified parser - in production you'd use TypeScript compiler API
        const component: ComponentDoc = {
            name: nameMatch ? nameMatch[1] : 'Unknown',
            description: descriptionMatch
                ? descriptionMatch[1]
                : 'No description available.',
            category: 'Components',
            version: '1.0.0',
            props: parseInterfaceToProps(content),
            methods: [],
            events: [],
            slots: [],
            examples: [],
            filePath,
        };

        return component;
    } catch {
        console.error('Failed to generate documentation:', filePath);
        return null;
    }
}

// Hook for managing documentation state
export function useDocumentation() {
    const [components, setComponents] = React.useState<ComponentDoc[]>([]);
    const [selectedComponent, setSelectedComponent] = React.useState<
        ComponentDoc | null
    >(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const addComponent = (component: ComponentDoc) => {
        setComponents((prev) => [...prev, component]);
    };

    const removeComponent = (name: string) => {
        setComponents((prev) => prev.filter((c) => c.name !== name));
        if (selectedComponent?.name === name) {
            setSelectedComponent(null);
        }
    };

    const generateAllDocs = async (files: string[]) => {
        setIsLoading(true);
        const docs: ComponentDoc[] = [];

        for (const file of files) {
            const doc = await generateDocFromFile(file);
            if (doc) {
                docs.push(doc);
            }
        }

        setComponents(docs);
        setIsLoading(false);
    };

    return {
        components,
        selectedComponent,
        setSelectedComponent,
        addComponent,
        removeComponent,
        generateAllDocs,
        isLoading,
    };
}
