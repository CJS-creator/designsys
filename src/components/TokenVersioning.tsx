import { useState, useEffect } from "react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, GitCompare, RotateCcw, Plus, Check, X } from "lucide-react";
import { toast } from "sonner";

interface TokenVersioningProps {
  currentSystem: GeneratedDesignSystem;
  onRestore: (system: GeneratedDesignSystem) => void;
}

interface VersionEntry {
  id: string;
  timestamp: Date;
  name: string;
  system: GeneratedDesignSystem;
  changes: string[];
}

interface DiffResult {
  path: string;
  oldValue: string;
  newValue: string;
  type: "added" | "removed" | "changed";
}

const getObjectDiff = (oldObj: Record<string, unknown>, newObj: Record<string, unknown>, path = ""): DiffResult[] => {
  const diffs: DiffResult[] = [];
  const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);

  allKeys.forEach((key) => {
    const currentPath = path ? `${path}.${key}` : key;
    const oldVal = oldObj?.[key];
    const newVal = newObj?.[key];

    if (typeof oldVal === "object" && typeof newVal === "object" && oldVal !== null && newVal !== null) {
      diffs.push(...getObjectDiff(oldVal as Record<string, unknown>, newVal as Record<string, unknown>, currentPath));
    } else if (oldVal !== newVal) {
      if (oldVal === undefined) {
        diffs.push({ path: currentPath, oldValue: "", newValue: String(newVal), type: "added" });
      } else if (newVal === undefined) {
        diffs.push({ path: currentPath, oldValue: String(oldVal), newValue: "", type: "removed" });
      } else {
        diffs.push({ path: currentPath, oldValue: String(oldVal), newValue: String(newVal), type: "changed" });
      }
    }
  });

  return diffs.slice(0, 50); // Limit to prevent performance issues
};

export const TokenVersioning = ({ currentSystem, onRestore }: TokenVersioningProps) => {
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<VersionEntry | null>(null);
  const [diffs, setDiffs] = useState<DiffResult[]>([]);

  // Load versions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("designSystemVersions");
    if (saved) {
      const parsed = JSON.parse(saved);
      setVersions(parsed.map((v: VersionEntry) => ({ ...v, timestamp: new Date(v.timestamp) })));
    }
  }, []);

  // Save versions to localStorage
  useEffect(() => {
    if (versions.length > 0) {
      localStorage.setItem("designSystemVersions", JSON.stringify(versions));
    }
  }, [versions]);

  const saveVersion = () => {
    const changes: string[] = [];
    if (versions.length > 0) {
      const lastVersion = versions[0];
      const newDiffs = getObjectDiff(lastVersion.system as unknown as Record<string, unknown>, currentSystem as unknown as Record<string, unknown>);
      changes.push(...newDiffs.slice(0, 5).map((d) => `${d.type}: ${d.path}`));
    } else {
      changes.push("Initial version");
    }

    const newVersion: VersionEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      name: `v${versions.length + 1}`,
      system: JSON.parse(JSON.stringify(currentSystem)),
      changes,
    };

    setVersions([newVersion, ...versions.slice(0, 19)]); // Keep last 20 versions
    toast.success("Version saved!", { description: `Saved as ${newVersion.name}` });
  };

  const selectVersion = (version: VersionEntry) => {
    setSelectedVersion(version);
    const currentDiffs = getObjectDiff(version.system as unknown as Record<string, unknown>, currentSystem as unknown as Record<string, unknown>);
    setDiffs(currentDiffs);
  };

  const restoreVersion = (version: VersionEntry) => {
    onRestore(version.system);
    toast.success("Version restored!", { description: `Restored to ${version.name}` });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Token Versioning
            </CardTitle>
            <CardDescription>Track changes to your design system over time</CardDescription>
          </div>
          <Button onClick={saveVersion} className="gap-2">
            <Plus className="h-4 w-4" />
            Save Version
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Version List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Version History</h3>
            <ScrollArea className="h-[400px] pr-4">
              {versions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No versions saved yet</p>
                  <p className="text-sm">Click "Save Version" to create a snapshot</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedVersion?.id === version.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => selectVersion(version)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{version.name}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {version.timestamp.toLocaleDateString()} {version.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            restoreVersion(version);
                          }}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {version.changes.slice(0, 2).join(", ")}
                        {version.changes.length > 2 && ` +${version.changes.length - 2} more`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Diff View */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              Changes from Selected Version
            </h3>
            <ScrollArea className="h-[400px] pr-4">
              {!selectedVersion ? (
                <div className="text-center py-8 text-muted-foreground">
                  <GitCompare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select a version to compare</p>
                </div>
              ) : diffs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Check className="h-12 w-12 mx-auto mb-3 text-success opacity-70" />
                  <p>No differences found</p>
                  <p className="text-sm">Current system matches this version</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {diffs.map((diff, i) => (
                    <div key={i} className="p-2 rounded-md bg-muted/50 font-mono text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        {diff.type === "added" && <Plus className="h-3 w-3 text-success" />}
                        {diff.type === "removed" && <X className="h-3 w-3 text-destructive" />}
                        {diff.type === "changed" && <GitCompare className="h-3 w-3 text-warning" />}
                        <span className="text-muted-foreground">{diff.path}</span>
                      </div>
                      {diff.type !== "added" && (
                        <div className="pl-5 text-destructive/80 line-through truncate">
                          {diff.oldValue}
                        </div>
                      )}
                      {diff.type !== "removed" && (
                        <div className="pl-5 text-success truncate">
                          {diff.newValue}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
