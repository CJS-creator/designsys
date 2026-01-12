import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Copy, Check, Filter } from "lucide-react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { toast } from "sonner";

interface TokenSearchProps {
  designSystem: GeneratedDesignSystem;
}

interface Token {
  category: string;
  name: string;
  value: string;
  path: string;
}

type TokenCategory = "all" | "colors" | "typography" | "spacing" | "shadows" | "borderRadius" | "animations";

const categoryLabels: Record<TokenCategory, string> = {
  all: "All Tokens",
  colors: "Colors",
  typography: "Typography",
  spacing: "Spacing",
  shadows: "Shadows",
  borderRadius: "Border Radius",
  animations: "Animations",
};

export function TokenSearch({ designSystem }: TokenSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory>("all");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Flatten all tokens into searchable format
  const allTokens = useMemo(() => {
    const tokens: Token[] = [];

    // Helper function to flatten nested objects
    const flattenObject = (obj: Record<string, unknown>, category: string, prefix = ""): void => {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          flattenObject(value as Record<string, unknown>, category, path);
        } else {
          tokens.push({
            category,
            name: key,
            value: String(value),
            path: `${category}.${path}`,
          });
        }
      }
    };

    // Colors
    flattenObject(designSystem.colors as unknown as Record<string, unknown>, "colors");
    if (designSystem.darkColors) {
      flattenObject(designSystem.darkColors as unknown as Record<string, unknown>, "colors", "dark");
    }

    // Typography
    flattenObject(designSystem.typography as unknown as Record<string, unknown>, "typography");

    // Spacing
    flattenObject(designSystem.spacing as unknown as Record<string, unknown>, "spacing");

    // Shadows
    flattenObject(designSystem.shadows as unknown as Record<string, unknown>, "shadows");

    // Border Radius
    flattenObject(designSystem.borderRadius as unknown as Record<string, unknown>, "borderRadius");

    // Animations
    flattenObject(designSystem.animations as unknown as Record<string, unknown>, "animations");

    return tokens;
  }, [designSystem]);

  // Filter tokens based on search and category
  const filteredTokens = useMemo(() => {
    return allTokens.filter((token) => {
      const matchesSearch =
        searchQuery === "" ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.path.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || token.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allTokens, searchQuery, selectedCategory]);

  // Group filtered tokens by category
  const groupedTokens = useMemo(() => {
    const groups: Record<string, Token[]> = {};
    for (const token of filteredTokens) {
      if (!groups[token.category]) {
        groups[token.category] = [];
      }
      groups[token.category].push(token);
    }
    return groups;
  }, [filteredTokens]);

  const copyToken = (token: Token) => {
    navigator.clipboard.writeText(token.value);
    setCopiedToken(token.path);
    toast.success(`Copied: ${token.value}`);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const categories: TokenCategory[] = ["all", "colors", "typography", "spacing", "shadows", "borderRadius", "animations"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Token Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens by name, value, or path..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Filter className="h-4 w-4 text-muted-foreground self-center mr-1" />
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {categoryLabels[category]}
              {category !== "all" && (
                <Badge variant="secondary" className="ml-2">
                  {allTokens.filter((t) => t.category === category).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Found {filteredTokens.length} token{filteredTokens.length !== 1 ? "s" : ""}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Token Results */}
        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
          {Object.entries(groupedTokens).map(([category, tokens]) => (
            <div key={category} className="space-y-2">
              <h3 className="font-semibold capitalize flex items-center gap-2">
                {categoryLabels[category as TokenCategory] || category}
                <Badge variant="outline">{tokens.length}</Badge>
              </h3>
              <div className="grid gap-2">
                {tokens.map((token) => (
                  <button
                    key={token.path}
                    onClick={() => copyToken(token)}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left group"
                  >
                    {/* Color preview for color tokens */}
                    {token.category === "colors" && token.value.startsWith("#") && (
                      <div
                        className="w-8 h-8 rounded-md border shrink-0"
                        style={{ backgroundColor: token.value }}
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm truncate">{token.path}</span>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {token.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono truncate">
                        {token.value}
                      </p>
                    </div>

                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedToken === token.path ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredTokens.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No tokens found matching your search.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
