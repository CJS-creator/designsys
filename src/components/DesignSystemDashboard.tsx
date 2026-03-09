import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Folder,
  Trash2,
  Loader2,
  FolderOpen,
  Share2,
  Copy,
  Pencil,
  Check,
  X,
  Clock,
  Palette,
} from "lucide-react";

interface SavedDesign {
  id: string;
  name: string;
  description: string | null;
  design_system_data: GeneratedDesignSystem;
  created_at: string;
  updated_at: string;
}

interface DesignSystemDashboardProps {
  onLoad: (system: GeneratedDesignSystem) => void;
  currentSystem?: GeneratedDesignSystem | null;
  onSave?: () => void;
}

export const DesignSystemDashboard = ({ onLoad, currentSystem, onSave }: DesignSystemDashboardProps) => {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SavedDesign | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const fetchDesigns = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("design_systems")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      toast.error("Failed to load designs", { description: error.message });
    } else {
      setDesigns(
        (data || []).map((d) => ({
          id: d.id,
          name: d.name,
          description: d.description,
          design_system_data: d.design_system_data as unknown as GeneratedDesignSystem,
          created_at: d.created_at,
          updated_at: d.updated_at,
        }))
      );
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchDesigns();
  }, [user, fetchDesigns]);

  const handleRename = async (id: string) => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    const { error } = await supabase
      .from("design_systems")
      .update({ name: editName.trim() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to rename", { description: error.message });
    } else {
      toast.success("Renamed successfully");
      setDesigns((prev) => prev.map((d) => (d.id === id ? { ...d, name: editName.trim() } : d)));
    }
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from("design_systems")
      .delete()
      .eq("id", deleteTarget.id);

    if (error) {
      toast.error("Failed to delete", { description: error.message });
    } else {
      toast.success("Design system deleted");
      setDesigns((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  const handleDuplicate = async (design: SavedDesign) => {
    if (!user) return;
    setDuplicatingId(design.id);
    const { error } = await supabase.from("design_systems").insert({
      user_id: user.id,
      name: `${design.name} (Copy)`,
      description: design.description,
      design_system_data: design.design_system_data as unknown as Json,
    });

    if (error) {
      toast.error("Failed to duplicate", { description: error.message });
    } else {
      toast.success("Design system duplicated");
      fetchDesigns();
    }
    setDuplicatingId(null);
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!", {
      description: "Share this link with anyone to show your design system.",
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Folder className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold mb-1">Sign in to view your designs</h3>
        <p className="text-sm text-muted-foreground">Create an account to save and manage design systems.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Folder className="h-6 w-6 text-primary" />
            My Design Systems
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {designs.length} design system{designs.length !== 1 ? "s" : ""}
          </p>
        </div>
        {currentSystem && onSave && (
          <Button onClick={onSave} size="sm">
            Save Current
          </Button>
        )}
      </div>

      {designs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/50">
          <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No saved designs yet</h3>
          <p className="text-sm text-muted-foreground max-w-[300px] mb-6">
            Generate your first design system to see it safely stored here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {designs.map((design) => {
            const colors = design.design_system_data?.colors;
            const isEditing = editingId === design.id;

            return (
              <Card
                key={design.id}
                className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                onClick={() => {
                  if (!isEditing) onLoad({ ...design.design_system_data, id: design.id });
                }}
              >
                {/* Color bar */}
                <div className="h-2 flex">
                  {colors && (
                    <>
                      <div className="flex-1" style={{ backgroundColor: colors.primary }} />
                      <div className="flex-1" style={{ backgroundColor: colors.secondary }} />
                      <div className="flex-1" style={{ backgroundColor: colors.accent }} />
                    </>
                  )}
                  {!colors && <div className="flex-1 bg-primary/20" />}
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-7 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRename(design.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => handleRename(design.id)}>
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setEditingId(null)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{design.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock className="h-3 w-3" />
                          {formatDate(design.updated_at)}
                        </div>
                      </div>
                    )}

                    {!isEditing && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label="Rename"
                          onClick={() => {
                            setEditingId(design.id);
                            setEditName(design.name);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label="Duplicate"
                          disabled={duplicatingId === design.id}
                          onClick={() => handleDuplicate(design)}
                        >
                          {duplicatingId === design.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Share" onClick={() => handleShare(design.id)}>
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          aria-label="Delete"
                          onClick={() => setDeleteTarget(design)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Font info */}
                  {design.design_system_data?.typography && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Palette className="h-3 w-3" />
                      <span className="truncate">
                        {design.design_system_data.typography.headingFont} / {design.design_system_data.typography.bodyFont}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the design system and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
