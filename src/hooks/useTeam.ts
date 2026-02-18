import { useState, useEffect } from "react";
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

export function useTeam(designSystemId: string) {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMembers = async () => {
        if (!designSystemId) return;
        setLoading(true);
        try {
            // Fetch roles along with profile information
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
            setMembers((data as any) || []);
        } catch (error) {
            console.error("Error fetching team members:", error);
            toast.error("Failed to load team members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [designSystemId]);

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

    const inviteMember = async (userId: string, role: UserRole) => {
        try {
            const { error } = await supabase
                .from("user_roles")
                .insert({
                    user_id: userId,
                    design_system_id: designSystemId,
                    role: role
                });

            if (error) throw error;

            fetchMembers(); // Refresh list
            toast.success("Member invited successfully");
        } catch (error) {
            if ((error as any).code === "23505") {
                toast.error("User is already a member of this project");
            } else {
                console.error("Error inviting member:", error);
                toast.error("Failed to invite member");
            }
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
