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
    Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TokenListProps {
    tokens: DesignToken[];
    onEdit: (token: DesignToken) => void;
    onDelete: (tokenPath: string) => void;
    onAdd: () => void;
}

export function TokenList({ tokens, onEdit, onDelete, onAdd }: TokenListProps) {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<TokenType | "all">("all");

    const filteredTokens = tokens.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.path.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === "all" || t.type === filterType;
        return matchesSearch && matchesType;
    });

    const renderTokenValue = (token: DesignToken) => {
        switch (token.type) {
            case 'color':
                return (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded border border-border"
                            style={{ backgroundColor: token.value }}
                        />
                        <code className="text-xs uppercase">{token.value}</code>
                    </div>
                );
            case 'dimension':
            case 'spacing':
            case 'borderRadius':
                return <code className="text-xs">{token.value}</code>;
            default:
                return <span className="text-xs text-muted-foreground italic">Complex Value</span>;
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
                            <Button variant="outline" size="icon" className="shrink-0">
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
                        <div className="divide-y">
                            {filteredTokens.map((token) => (
                                <div
                                    key={token.path}
                                    className="p-4 hover:bg-primary/5 transition-colors group flex items-center justify-between"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{token.name}</span>
                                            <Badge variant="outline" className="text-[10px] h-4 px-1 capitalize">
                                                {token.type}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <code className="text-[11px] text-muted-foreground">{token.path}</code>
                                            {renderTokenValue(token)}
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                                onClick={() => onDelete(token.path)}
                                                className="gap-2 text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="h-3 w-3" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
