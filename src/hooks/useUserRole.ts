import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/components/TeamSettings";
import { supabase } from "@/integrations/supabase/client";

// Module-level cache to store roles across component mounts
const roleCache: Record<string, UserRole | null> = {};

/**
 * useUserRole hook - Fetches the user's role for a specific design system
 * Optimized with client-side caching.
 */
export function useUserRole(designSystemId: string) {
    const { user } = useAuth();
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !designSystemId) {
            setRole(null);
            setLoading(false);
            return;
        }

        const cacheKey = `${user.id}:${designSystemId}`;
        if (roleCache[cacheKey] !== undefined) {
            setRole(roleCache[cacheKey]);
            setLoading(false);
            return;
        }

        const fetchRole = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("user_roles")
                    .select("role")
                    .eq("user_id", user.id)
                    .eq("design_system_id", designSystemId)
                    .maybeSingle();

                if (error) throw error;
                const userRole = (data?.role as UserRole) || null;
                roleCache[cacheKey] = userRole;
                setRole(userRole);
            } catch (error) {
                console.error("Error fetching user role", error);
                setRole(null);
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, [user, designSystemId]);

    return { role, loading };
}
