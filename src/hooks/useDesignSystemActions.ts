import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedDesignSystem, DesignSystemInput } from "@/types/designSystem";
import { toast } from "sonner";
import { monitor } from "@/lib/monitoring";
import { generateDesignSystemWithAI, generateDesignSystemFallback } from "@/lib/generateDesignSystem";
import { DesignRegressionEngine } from "@/lib/ai/regressionEngine";
import { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

export function useDesignSystemActions(
  designSystem: GeneratedDesignSystem | null,
  setDesignSystem: (ds: GeneratedDesignSystem | null) => void,
  setThemedDesignSystem: (ds: GeneratedDesignSystem | null) => void,
  injectVariables: (ds: GeneratedDesignSystem) => void
) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = useCallback(async (input: DesignSystemInput) => {
    setIsLoading(true);
    try {
      const generatedSystem = await generateDesignSystemWithAI(input);
      
      if (designSystem) {
        const report = DesignRegressionEngine.compare(designSystem, generatedSystem);
        if (DesignRegressionEngine.isBreaking(report)) {
          toast.warning("Significant visual shifts detected", {
            description: `${report.changes.length} major changes found in typography/colors.`,
          });
          monitor.info("Visual regression detected", report);
        }
      }

      setDesignSystem(generatedSystem);
      setThemedDesignSystem(generatedSystem);
      injectVariables(generatedSystem);
      toast.success("AI-powered design system generated!");
    } catch (error) {
      monitor.error("AI generation failed, using fallback", error as Error);
      const fallbackSystem = generateDesignSystemFallback(input);
      setDesignSystem(fallbackSystem);
      toast.warning("Generated with fallback algorithm", {
        description: error instanceof Error ? error.message : "AI generation unavailable",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setDesignSystem, setThemedDesignSystem, injectVariables]);

  const handleSave = useCallback(async () => {
    if (!user) {
      toast.error("Sign in to save your design system");
      return;
    }
    if (!designSystem) return;

    const toastId = toast.loading("Saving design...");

    const snapshotVersion = async (designSystemId: string) => {
      try {
        const { data: latest } = await supabase
          .from("design_system_versions")
          .select("version_number")
          .eq("design_system_id", designSystemId)
          .order("version_number", { ascending: false })
          .limit(1)
          .maybeSingle();

        const nextNumber = (latest?.version_number ?? 0) + 1;

        await supabase.from("design_system_versions").insert({
          design_system_id: designSystemId,
          version_number: nextNumber,
          name: `Auto-snapshot v${nextNumber}`,
          description: `Automatic snapshot taken on ${new Date().toLocaleString()}`,
          snapshot_data: designSystem as unknown as Json,
          created_by: user.id,
        });
      } catch (e) {
        monitor.warn("Failed to create version snapshot");
      }
    };

    try {
      if (designSystem.id) {
        const { error } = await supabase
          .from("design_systems")
          .update({
            name: designSystem.name,
            design_system_data: designSystem as unknown as Json,
          })
          .eq("id", designSystem.id);

        if (error) throw error;
        await snapshotVersion(designSystem.id);
        toast.success("Design updated!", { id: toastId });
      } else {
        const { data, error } = await supabase.from("design_systems").insert({
          user_id: user.id,
          name: designSystem.name,
          description: `Generated styles`,
          design_system_data: designSystem as unknown as Json,
        }).select("id").single();

        if (error) throw error;
        setDesignSystem({ ...designSystem, id: data.id });
        await snapshotVersion(data.id);
        toast.success("Design saved!", { id: toastId });
      }
    } catch (error: any) {
      toast.error("Failed to save", { id: toastId, description: error.message });
    }
  }, [designSystem, user, setDesignSystem]);

  return {
    isLoading,
    handleGenerate,
    handleSave,
  };
}
