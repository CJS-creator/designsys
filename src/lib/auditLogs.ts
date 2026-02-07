import { supabase } from "@/integrations/supabase/client";
import { monitor } from "./monitoring";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "PUBLISH" | "ARCHIVE" | "RESTORE";
export type EntityType = "TOKEN" | "BRAND" | "GROUP" | "SYSTEM";

export interface AuditLogEntry {
    design_system_id: string;
    action: AuditAction;
    entity_type: EntityType;
    entity_id?: string;
    old_value?: any;
    new_value?: any;
    metadata?: any;
}

/**
 * Records an action in the design audit logs.
 */
export const recordAuditLog = async (entry: AuditLogEntry) => {
    monitor.info(`[Audit Log] ${entry.action} on ${entry.entity_type}`, {
        entity_id: entry.entity_id,
        summary: entry.metadata?.summary
    });

    try {
        const { error } = await supabase
            .from("audit_logs" as any)
            .insert([
                {
                    design_system_id: entry.design_system_id,
                    action: entry.action,
                    entity_type: entry.entity_type,
                    entity_id: entry.entity_id,
                    old_value: entry.old_value,
                    new_value: entry.new_value,
                    metadata: entry.metadata,
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
