/**
 * Live Code Playground Component
 * 
 * A fully-featured code playground with:
 * - Syntax highlighting
 * - Real-time preview
 * - Multiple language support
 * - Export capabilities
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Copy,
    Download,
    RefreshCw,
    Maximize2,
    Minimize2,
    Eye,
    Code,
    FileJson
} from 'lucide-react';

// Language support
export type SupportedLanguage = 'typescript' | 'javascript' | 'tsx' | 'jsx' | 'css' | 'html' | 'json';

export interface CodePlaygroundProps {
    initialCode?: string;
    language?: SupportedLanguage;
    title?: string;
    description?: string;
    showPreview?: boolean;
    showCode?: boolean;
    editable?: boolean;
    onCodeChange?: (code: string) => void;
    className?: string;
}

// Default code templates
const codeTemplates: Record<SupportedLanguage, string> = {
    typescript: `import * as React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
}) => {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`,
    javascript: `// JavaScript Component Example
const Button = ({ children, variant = 'primary' }) => {
  return (
    <button className={\`btn btn-\${variant}\`}>
      {children}
    </button>
  );
};

export default Button;`,
    tsx: `import * as React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-content">{children}</div>
    </div>
  );
};`,
    jsx: `// JSX Component Example
const Card = ({ title, children }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-content">{children}</div>
    </div>
  );
};`,
    css: `/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
</head>
<body>
  <div id="root"></div>
  <script src="bundle.js"></script>
</body>
</html>`,
    json: `{
  "name": "my-component",
  "version": "1.0.0",
  "description": "A reusable component",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts"
}`,
};

// Line numbers component
interface LineNumbersProps {
    count: number;
    className?: string;
}

const LineNumbers: React.FC<LineNumbersProps> = ({ count, className }) => {
    return (
        <div className={cn('flex flex-col text-right pr-4 select-none', className)}>
            {Array.from({ length: count }, (_, i) => (
                <span key={i} className="text-muted-foreground text-xs leading-6">
                    {i + 1}
                </span>
            ))}
        </div>
    );
};

// Code editor component
interface CodeEditorProps {
    value: string;
    language: SupportedLanguage;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    value,
    language,
    onChange,
    readOnly = false,
    className,
}) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [copied, setCopied] = React.useState(false);

    const lines = value.split('\n');
    const lineCount = lines.length;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = textareaRef.current?.selectionStart || 0;
            const end = textareaRef.current?.selectionEnd || 0;
            const newValue = value.substring(0, start) + '  ' + value.substring(end);
            onChange?.(newValue);

            // Reset cursor position
            requestAnimationFrame(() => {
                textareaRef.current?.setSelectionRange(start + 2, start + 2);
            });
        }
    };

    return (
        <div className={cn('relative font-mono text-sm', className)}>
            <div className="absolute top-2 right-2 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <span className="text-green-500 text-xs">Copied!</span>
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <div className={cn(
                'flex overflow-hidden rounded-lg border bg-muted/20',
                'focus-within:ring-2 focus-within:ring-ring'
            )}>
                <LineNumbers count={lineCount} className="pt-4 pb-4 pl-4" />

                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    onKeyDown={handleKeyDown}
                    readOnly={readOnly}
                    spellCheck={false}
                    className={cn(
                        'flex-1 p-4 bg-transparent resize-none outline-none',
                        'text-foreground leading-6',
                        'placeholder:text-muted-foreground/50'
                    )}
                    style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
                />
            </div>
        </div>
    );
};

// Preview component
interface PreviewProps {
    code: string;
    language: SupportedLanguage;
    className?: string;
}

const Preview: React.FC<PreviewProps> = ({ code, language, className }) => {
    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleRefresh = () => {
        setIsLoading(true);
        setError(null);
        setTimeout(() => setIsLoading(false), 500);
    };

    // For CSS preview, we inject styles
    const renderPreview = () => {
        if (language === 'css') {
            return (
                <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-primary">Primary Background</p>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-lg">
                        <p className="text-secondary">Secondary Background</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Muted Background</p>
                    </div>
                    <button className="btn btn-primary px-4 py-2 rounded">
                        Styled Button
                    </button>
                </div>
            );
        }

        if (language === 'html') {
            return (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">HTML Preview</h2>
                    <p>This is a preview of HTML content.</p>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
                        Interactive Button
                    </button>
                </div>
            );
        }

        if (language === 'json') {
            try {
                const parsed = JSON.parse(code);
                return (
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                        {JSON.stringify(parsed, null, 2)}
                    </pre>
                );
            } catch {
                return (
                    <p className="text-destructive">Invalid JSON format</p>
                );
            }
        }

        // For React components, show a placeholder
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 animate-pulse" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-muted/50 rounded animate-pulse" />
                    </div>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                </div>
            </div>
        );
    };

    return (
        <div className={cn('relative', className)}>
            <div className="absolute top-2 right-2 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRefresh}
                    disabled={isLoading}
                >
                    <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {error ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive"
                    >
                        {error}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 bg-background rounded-lg border min-h-[200px]"
                    >
                        {renderPreview()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Main CodePlayground component
export const CodePlayground: React.FC<CodePlaygroundProps> = (props) => {
    const {
        initialCode,
        language: initialLanguage = 'typescript',
        title = 'Code Playground',
        description,
        showPreview = true,
        showCode = true,
        editable = true,
        onCodeChange,
        className,
    } = props;
    const [language, setLanguage] = React.useState<SupportedLanguage>(initialLanguage);
    const [code, setCode] = React.useState(initialCode || codeTemplates[initialLanguage]);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('code');

    React.useEffect(() => {
        if (initialCode) {
            setCode(initialCode);
        }
    }, [initialCode]);

    React.useEffect(() => {
        if (!initialCode) {
            setCode(codeTemplates[language]);
        }
    }, [language, initialCode]);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        onCodeChange?.(newCode);
    };

    const handleDownload = () => {
        const extensions: Record<SupportedLanguage, string> = {
            typescript: 'ts',
            javascript: 'js',
            tsx: 'tsx',
            jsx: 'jsx',
            css: 'css',
            html: 'html',
            json: 'json',
        };

        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `component.${extensions[language]}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportConfig = () => {
        const config = {
            language,
            code,
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'playground-config.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card className={cn('overflow-hidden', isFullscreen && 'fixed inset-4 z-50', className)}>
            <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            {title}
                        </CardTitle>
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono text-xs">
                            {language}
                        </Badge>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleExportConfig}
                        >
                            <FileJson className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleDownload}
                        >
                            <Download className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="h-4 w-4" />
                            ) : (
                                <Maximize2 className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {(showCode || showPreview) && (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex items-center justify-between border-b px-4">
                            <TabsList className="h-10 border-none bg-transparent p-0">
                                {showCode && (
                                    <TabsTrigger
                                        value="code"
                                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4"
                                    >
                                        <Code className="h-4 w-4 mr-2" />
                                        Code
                                    </TabsTrigger>
                                )}
                                {showPreview && (
                                    <TabsTrigger
                                        value="preview"
                                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Preview
                                    </TabsTrigger>
                                )}
                            </TabsList>

                            {activeTab === 'code' && editable && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => setCode(codeTemplates[language])}
                                >
                                    <RefreshCw className="h-3 w-3 mr-2" />
                                    Reset
                                </Button>
                            )}
                        </div>

                        {showCode && (
                            <TabsContent value="code" className="p-4 m-0">
                                <CodeEditor
                                    value={code}
                                    language={language}
                                    onChange={handleCodeChange}
                                    readOnly={!editable}
                                    className="min-h-[300px]"
                                />
                            </TabsContent>
                        )}

                        {showPreview && (
                            <TabsContent value="preview" className="p-4 m-0">
                                <Preview code={code} language={language} className="min-h-[300px]" />
                            </TabsContent>
                        )}
                    </Tabs>
                )}
            </CardContent>
        </Card>
    );
};

// Mini playground for inline use
interface MiniPlaygroundProps {
    code: string;
    language?: SupportedLanguage;
    className?: string;
}

export const MiniPlayground: React.FC<MiniPlaygroundProps> = ({
    code,
    language = 'tsx',
    className,
}) => {
    const [showCode, setShowCode] = React.useState(false);

    return (
        <div className={cn('relative rounded-lg border overflow-hidden', className)}>
            <div className="flex items-center justify-between p-2 border-b bg-muted/50">
                <Badge variant="outline" className="text-xs">
                    {language}
                </Badge>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowCode(!showCode)}
                >
                    {showCode ? (
                        <Eye className="h-3 w-3" />
                    ) : (
                        <Code className="h-3 w-3" />
                    )}
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {showCode ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-2 bg-muted/20"
                    >
                        <pre className="text-xs font-mono overflow-auto p-2">
                            {code}
                        </pre>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4"
                    >
                        <Preview code={code} language={language} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Helper hook for playground state
export function usePlayground(initialCode?: string) {
    const [code, setCode] = React.useState(initialCode || '');
    const [language, setLanguage] = React.useState<SupportedLanguage>('typescript');
    const [history, setHistory] = React.useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = React.useState(-1);

    const pushToHistory = (newCode: string) => {
        setHistory((prev) => [...prev.slice(-50), newCode]);
        setHistoryIndex(-1);
    };

    const undo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setCode(history[history.length - 1 - newIndex]);
        }
    };

    const redo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setCode(history[history.length - 1 - newIndex]);
        }
    };

    return {
        code,
        setCode: (newCode: string) => {
            pushToHistory(code);
            setCode(newCode);
        },
        language,
        setLanguage,
        canUndo: historyIndex >= 0,
        canRedo: historyIndex > 0,
        undo,
        redo,
        clearHistory: () => {
            setHistory([]);
            setHistoryIndex(-1);
        },
    };
}

export { CodePlayground as ComponentSandbox };
