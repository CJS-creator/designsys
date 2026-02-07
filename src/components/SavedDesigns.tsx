import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Folder, Trash2, Download, Loader2, FolderOpen, Share2 } from "lucide-react";

interface SavedDesign {
  id: string;
  name: string;
  description: string | null;
  design_system_data: GeneratedDesignSystem;
  created_at: string;
}

interface SavedDesignsProps {
  onLoad: (system: GeneratedDesignSystem) => void;
  currentSystem?: GeneratedDesignSystem | null;
}

export const SavedDesigns = ({ onLoad, currentSystem }: SavedDesignsProps) => {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDesigns = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from("design_systems")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load designs", { description: error.message });
    } else {
      setDesigns((data || []).map(d => ({
        id: d.id,
        name: d.name,
        description: d.description,
        design_system_data: d.design_system_data as unknown as GeneratedDesignSystem,
        created_at: d.created_at,
      })));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDesigns();
    }
  }, [user, fetchDesigns]);

  const saveCurrentDesign = async () => {
    if (!user || !currentSystem) return;

    setIsSaving(true);
    const { error } = await supabase.from("design_systems").insert({
      user_id: user.id,
      name: currentSystem.name,
      description: `Generated design system`,
      design_system_data: currentSystem as unknown as Json,
    });

    if (error) {
      toast.error("Failed to save design", { description: error.message });
    } else {
      toast.success("Design system saved!");
      fetchDesigns();
    }
    setIsSaving(false);
  };

  const deleteDesign = async (id: string) => {
    const { error } = await supabase
      .from("design_systems")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete", { description: error.message });
    } else {
      toast.success("Design deleted");
      setDesigns((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!", {
      description: "Share this link with anyone to show your design system.",
    });
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Saved Designs
          </CardTitle>
          <CardDescription>Sign in to save and manage your design systems</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Please sign in to access your saved designs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Saved Designs
        </CardTitle>
        <CardDescription>Your saved design systems</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentSystem && (
          <Button onClick={saveCurrentDesign} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Save Current Design
              </>
            )}
          </Button>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : designs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/50">
            <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No saved designs yet</h3>
            <p className="text-sm text-muted-foreground max-w-[250px] mb-6">
              Generate your first design system to see it safely stored here.
            </p>
            {!currentSystem && (
              <Button
                variant="outline"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover-lift"
              >
                Create New System
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {designs.map((design) => (
              <div
                key={design.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{design.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(design.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLoad(design.design_system_data)}
                  >
                    Load
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Share design system"
                    onClick={() => handleShare(design.id)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete design system"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteDesign(design.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
