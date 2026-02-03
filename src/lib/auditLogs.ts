import { supabase } from "@/integrations/supabase/client";
import { monitor } from "./monitoring";

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
 */
export const recordAuditLog = async (
    designSystemId: string,
    userEmail: string,
    action: string,
    summary: string
) => {
    monitor.info(`[Audit Log] Recording: ${action}`, { summary, userEmail });

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
            monitor.warn("Audit log insert failed", { error: error.message });
            return false;
        }
        return true;
    } catch (err) {
        monitor.error("Audit log exception", err as Error);
        return false;
    }
};
