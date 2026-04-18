import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/components/TeamSettings";
import { toast } from "sonner";

export interface TeamMember {
    id: string;
    user_id: string;
    role: UserRole;
    created_at: string;
    profile?: {
        full_name: string | null;
        avatar_url: string | null;
        username: string | null;
    };
}

interface RawTeamMember {
    id: string;
    user_id: string;
    role: UserRole;
    created_at: string;
    profile: {
        full_name: string | null;
        avatar_url: string | null;
        username: string | null;
    } | null;
}

export function useTeam(designSystemId: string) {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMembers = useCallback(async () => {
        if (!designSystemId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("user_roles")
                .select(`
                    id,
                    user_id,
                    role,
                    created_at,
                    profile:profiles(full_name, avatar_url, username)
                `)
                .eq("design_system_id", designSystemId);

            if (error) throw error;

            const mapped: TeamMember[] = (data || []).map((d) => {
                const profileField = (d as { profile?: RawTeamMember["profile"] }).profile;
                return {
                    id: d.id,
                    user_id: d.user_id,
                    role: d.role as UserRole,
                    created_at: d.created_at,
                    profile: profileField ?? undefined,
                };
            });

            setMembers(mapped);
        } catch (error) {
            console.error("Error fetching team members:", error);
            toast.error("Failed to load team members");
        } finally {
            setLoading(false);
        }
    }, [designSystemId]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const updateMemberRole = async (memberId: string, newRole: UserRole) => {
        try {
            const { error } = await supabase
                .from("user_roles")
                .update({ role: newRole })
                .eq("id", memberId);

            if (error) throw error;

            setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
            toast.success("Member role updated");
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update role");
        }
    };

    const removeMember = async (memberId: string) => {
        try {
            const { error } = await supabase
                .from("user_roles")
                .delete()
                .eq("id", memberId);

            if (error) throw error;

            setMembers(prev => prev.filter(m => m.id !== memberId));
            toast.success("Member removed from team");
        } catch (error) {
            console.error("Error removing member:", error);
            toast.error("Failed to remove member");
        }
    };

    const inviteMember = async (email: string, role: UserRole) => {
        try {
            const { data, error } = await supabase.functions.invoke("invite-member", {
                body: { email, role, design_system_id: designSystemId },
            });

            if (error) {
                const msg = (data as { error?: string } | null)?.error || error.message;
                toast.error(msg || "Failed to invite member");
                return { success: false, error: msg };
            }

            await fetchMembers();
            toast.success("Member invited successfully");
            return { success: true };
        } catch (error) {
            console.error("Error inviting member:", error);
            const msg = (error as Error).message;
            toast.error(msg || "Failed to invite member");
            return { success: false, error: msg };
        }
    };

    return {
        members,
        loading,
        updateMemberRole,
        removeMember,
        inviteMember,
        refresh: fetchMembers
    };
}
