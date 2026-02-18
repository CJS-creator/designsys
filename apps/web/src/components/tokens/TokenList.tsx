import { useState } from "react";
import { DesignToken, TokenType } from "@/types/tokens";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Copy,
    GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reorder } from "framer-motion";

interface TokenListProps {
    tokens: DesignToken[];
    onEdit: (token: DesignToken) => void;
    onDelete: (tokenPath: string) => void;
    onAdd: () => void;
    onReorder?: (newTokens: DesignToken[]) => void;
}

import { VectorTokenSearch } from "@/lib/ai/VectorTokenSearch";

// ...

export function TokenList({ tokens, onEdit, onDelete, onAdd, onReorder }: TokenListProps) {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<TokenType | "all">("all");

    // Use Vector Search for smarter filtering
    const searchEngine = new VectorTokenSearch(tokens);
    let filteredTokens = tokens;

    if (search) {
        const results = searchEngine.search(search);
        // Map back to original tokens
        filteredTokens = results
            .map(r => tokens.find(t => t.path === r.path)!)
            .filter(Boolean);
    }

    // Apply Type Filter on top
    filteredTokens = filteredTokens.filter(t => {
        const matchesType = filterType === "all" || t.type === filterType;
        return matchesType;
    });

    const resolveValue = (token: DesignToken): any => {
        if (token.ref) {
            const refPath = token.ref.replace(/[{}]/g, '');
            const target = tokens.find(t => t.path === refPath);
            return target ? resolveValue(target) : "Invalid Ref";
        }
        return token.value;
    };

    const renderTokenValue = (token: DesignToken) => {
        const value = resolveValue(token);
        const isRef = !!token.ref;

        switch (token.type) {
            case 'color':
                return (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded border border-border shrink-0"
                            style={{ backgroundColor: typeof value === 'string' ? value : 'transparent' }}
                        />
                        <code className="text-[10px] uppercase font-mono bg-muted px-1 rounded truncate max-w-[80px]">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                        </code>
                        {isRef && (
                            <span className="text-[9px] text-muted-foreground italic truncate max-w-[60px]">
                                via {token.ref}
                            </span>
                        )}
                    </div>
                );
            case 'typography':
                const typo = value as any;
                if (!typo || typeof typo !== 'object') return null;
                return (
                    <div className="flex flex-col gap-1 max-w-[200px]">
                        <span
                            className="text-sm truncate"
                            style={{
                                fontFamily: typo.fontFamily,
                                fontSize: typo.fontSize,
                                fontWeight: typo.fontWeight,
                                lineHeight: typo.lineHeight,
                                letterSpacing: typo.letterSpacing,
                                textTransform: typo.textCase as any,
                                textDecoration: typo.textDecoration
                            }}
                        >
                            Ag The quick brown fox
                        </span>
                        <div className="flex gap-2 text-[9px] text-muted-foreground font-mono">
                            <span>{typeof typo.fontSize === 'object' ? 'Complex' : typo.fontSize}</span>
                            <span>{typeof typo.fontWeight === 'object' ? 'Complex' : typo.fontWeight}</span>
                        </div>
                    </div>
                );
            case 'spacing':
            case 'dimension':
                return (
                    <div className="flex items-center gap-2">
                        <div
                            className="h-2 bg-primary/20 rounded-full border border-primary/30"
                            style={{ width: typeof value === 'string' ? value : '0px', maxWidth: '60px' }}
                        />
                        <code className="text-[10px] font-mono bg-muted px-1 rounded shrink-0">
                            {typeof value === 'string' || typeof value === 'number' ? value : 'Structured'}
                        </code>
                    </div>
                );
            case 'border':
                const border = value as any;
                if (!border || typeof border !== 'object') return null;
                return (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-4 rounded border"
                            style={{
                                borderColor: border.color,
                                borderStyle: border.style,
                                borderWidth: border.width
                            }}
                        />
                        <code className="text-[10px] font-mono bg-muted px-1 rounded shrink-0">{border.width} {border.style}</code>
                    </div>
                );
            case 'borderRadius':
                return (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 border border-dashed border-muted-foreground/50"
                            style={{ borderRadius: typeof value === 'string' ? value : '0px' }}
                        />
                        <code className="text-[10px] font-mono bg-muted px-1 rounded shrink-0">
                            {typeof value === 'string' || typeof value === 'number' ? value : 'Structured'}
                        </code>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground italic truncate max-w-[100px]">
                            {typeof value === 'object' ? 'Structured' : value}
                        </span>
                        {isRef && (
                            <span className="text-[9px] text-muted-foreground italic truncate max-w-[60px]">
                                via {token.ref}
                            </span>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-full bg-card/50 rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        Design Tokens
                        <Badge variant="secondary" className="font-mono">
                            {tokens.length}
                        </Badge>
                    </h2>
                    <Button size="sm" onClick={onAdd} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Token
                    </Button>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tokens..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-background/50 border-border/50"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0" aria-label="Filter tokens">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setFilterType("all")}>All Types</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterType("color")}>Colors</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterType("dimension")}>Dimensions</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterType("typography")}>Typography</DropdownMenuItem>
                            {/* Add more types as needed */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-0">
                    {filteredTokens.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No tokens found matching your criteria.
                        </div>
                    ) : (
                        <Reorder.Group
                            axis="y"
                            values={filteredTokens}
                            onReorder={onReorder || (() => { })}
                            className="divide-y"
                        >
                            {filteredTokens.map((token) => (
                                <Reorder.Item
                                    key={token.path}
                                    value={token}
                                    className="p-4 hover:bg-primary/5 transition-colors group flex items-center justify-between bg-card"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <GripVertical className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground cursor-grab active:cursor-grabbing shrink-0" />
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm tracking-tight">{token.name}</span>
                                                <Badge variant="outline" className="text-[9px] h-3.5 px-1 capitalize font-bold">
                                                    {token.type}
                                                </Badge>
                                                {token.ref && (
                                                    <Badge variant="secondary" className="text-[9px] h-3.5 px-1 bg-primary/10 text-primary border-primary/20">
                                                        ALIAS
                                                    </Badge>
                                                )}
                                                {token.status && (
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[9px] h-3.5 px-1 font-bold uppercase ${token.status === 'published' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                            token.status === 'deprecated' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                                'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                                            }`}
                                                    >
                                                        {token.status}
                                                    </Badge>
                                                )}
                                                {token.syncStatus === 'changed' && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[9px] h-3.5 px-1 font-bold uppercase bg-orange-500/10 text-orange-500 border-orange-500/20"
                                                    >
                                                        Modified
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <code className="text-[11px] text-muted-foreground">{token.path}</code>
                                                {renderTokenValue(token)}
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Token options">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(token)} className="gap-2">
                                                <Edit2 className="h-3 w-3" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2">
                                                <Copy className="h-3 w-3" /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onEdit({ ...token, status: 'deprecated' })}
                                                className="gap-2 text-yellow-600 focus:text-yellow-600"
                                            >
                                                <Filter className="h-3 w-3" /> Deprecate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onDelete(token.path)}
                                                className="gap-2 text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="h-3 w-3" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
