import { useState, useEffect } from "react";
import { monitor } from "@/lib/monitoring";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { recordAuditLog } from "@/lib/auditLogs";

export interface BrandTheme {
    id: string;
    design_system_id: string;
    name: string;
    mode: 'light' | 'dark' | 'high-contrast';
    tokens_override: Record<string, any>;
    is_default: boolean;
}

export function useBrands(designSystemId?: string) {
    const [brands, setBrands] = useState<BrandTheme[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeBrandId, setActiveBrandId] = useState<string | null>(null);

    const fetchBrands = async () => {
        if (!designSystemId) return;
        setLoading(true);
        try {
            const { data, error } = await (supabase
                .from("brand_themes" as any) as any)
                .select("*")
                .eq("design_system_id", designSystemId);

            if (error) throw error;

            const formattedBrands: BrandTheme[] = (data || []).map((row: any) => ({
                id: row.id,
                design_system_id: row.design_system_id,
                name: row.name,
                mode: row.mode as any,
                tokens_override: row.tokens_override as Record<string, any>,
                is_default: row.is_default
            }));

            setBrands(formattedBrands);

            // Set default active brand
            if (!activeBrandId && formattedBrands.length > 0) {
                const defaultBrand = formattedBrands.find((b: BrandTheme) => b.is_default) || formattedBrands[0];
                setActiveBrandId(defaultBrand.id);
            }
        } catch (error: any) {
            monitor.error("Error fetching brands", error as Error);
            // toast.error("Failed to load brands");
        } finally {
            setLoading(false);
        }
    };

    const createBrand = async (name: string, mode: string = 'light') => {
        if (!designSystemId) return;
        try {
            const { data, error } = await (supabase
                .from("brand_themes" as any) as any)
                .insert({
                    design_system_id: designSystemId,
                    name,
                    mode,
                    is_default: brands.length === 0
                })
                .select()
                .single();

            if (error) throw error;

            // Audit
            recordAuditLog({
                design_system_id: designSystemId,
                action: "CREATE",
                entity_type: "BRAND",
                entity_id: data.id,
                metadata: { name, mode, summary: `Created brand ${name} (${mode})` }
            });

            toast.success("Brand created");
            fetchBrands();
            return data;
        } catch (error: any) {
            toast.error("Failed to create brand");
        }
    };

    useEffect(() => {
        fetchBrands();
    }, [designSystemId]);

    const activeBrand = brands.find(b => b.id === activeBrandId) || null;

    return {
        brands,
        activeBrand,
        setActiveBrandId,
        loading,
        createBrand,
        refresh: fetchBrands
    };
}
