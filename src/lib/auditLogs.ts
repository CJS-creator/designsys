import { supabase } from "@/integrations/supabase/client";

export interface AuditLogEntry {
    id: string;
    design_system_id: string;
    user_email: string;
    action: string;
    summary: string;
    created_at: string;
}

/**
 * Records an action in the design audit logs.
 * Note: This currently simulates a database insert if a table doesn't exist yet,
 * but is wired to Supabase for future scale.
 */
export const recordAuditLog = async (
    designSystemId: string,
    userEmail: string,
    action: string,
    summary: string
) => {
    console.log(`[Audit Log] Recording: ${action} - ${summary} by ${userEmail}`);

    try {
        const { error } = await (supabase
            .from("design_audit_logs" as any) as any)
            .insert([
                {
                    design_system_id: designSystemId,
                    user_email: userEmail,
                    action: action,
                    summary: summary,
                },
            ]);

        if (error) {
            // If table doesn't exist yet, we still log to console for development
            console.warn("Audit log insert failed (likely missing table):", error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Audit log error:", err);
        return false;
    }
};
