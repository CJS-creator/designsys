import { supabase } from "@/integrations/supabase/client";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { toast } from "sonner";

export interface VersionSnapshot {
    id: string;
    design_system_id: string;
    version_number: string;
    snapshot: any;
    created_at: string;
    created_by: string;
}

/**
 * Creates a new snapshot of the current design system state
 */
export async function createSnapshot(
    designSystemId: string,
    version: string,
    data: GeneratedDesignSystem,
    userId: string
) {
    try {
        const { error } = await supabase
            .from("design_system_versions")
            .insert({
                design_system_id: designSystemId,
                version_number: version,
                snapshot: data as any,
                created_by: userId
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error creating snapshot:", error);
        return false;
    }
}

/**
 * Compares two design system snapshots and returns the differences
 */
export function diffSnapshots(oldSnapshot: any, newSnapshot: any) {
    const diffs: any[] = [];

    // Simple implementation for tokens
    // In a real app, this would be a deep recursive diff
    const oldTokens = oldSnapshot?.tokens || {};
    const newTokens = newSnapshot?.tokens || {};

    const allKeys = new Set([...Object.keys(oldTokens), ...Object.keys(newTokens)]);

    allKeys.forEach(key => {
        if (JSON.stringify(oldTokens[key]) !== JSON.stringify(newTokens[key])) {
            diffs.push({
                path: key,
                old: oldTokens[key],
                new: newTokens[key],
                type: !oldTokens[key] ? 'added' : !newTokens[key] ? 'removed' : 'updated'
            });
        }
    });

    return diffs;
}

/**
 * Publishes an approved request into a new system version
 */
export async function publishApprovedVersion(requestId: string) {
    try {
        // 1. Fetch the request and its changes
        const { data: request, error: reqError } = await supabase
            .from("approval_requests")
            .select(`
                *,
                changes:approval_changes(*),
                design_systems(design_system_data)
            `)
            .eq("id", requestId)
            .single();

        if (reqError) throw reqError;

        // 2. Create the version record
        const { data: version, error: versionError } = await supabase
            .from("design_system_versions")
            .insert({
                design_system_id: request.design_system_id,
                version_number: request.version_number,
                description: request.description,
                snapshot: (request.design_systems as any).design_system_data,
                created_by: request.author_id,
                is_published: true,
                published_at: new Date().toISOString()
            })
            .select()
            .single();

        if (versionError) throw versionError;

        // 3. Create entries in version_changelog from approval_changes
        if (request.changes && request.changes.length > 0) {
            const changelogEntries = request.changes.map((change: any) => ({
                version_id: version.id,
                design_system_id: request.design_system_id,
                action: change.change_type, // Assuming change_type is added, removed, updated
                token_path: change.token_path,
                old_value: change.old_value,
                new_value: change.new_value
            }));

            const { error: logError } = await supabase
                .from("version_changelog")
                .insert(changelogEntries);

            if (logError) throw logError;
        }

        // 4. Mark request as published
        const { error: updateError } = await supabase
            .from("approval_requests")
            .update({ status: 'PUBLISHED', updated_at: new Date().toISOString() })
            .eq("id", requestId);

        if (updateError) throw updateError;

        toast.success(`Version ${request.version_number} published!`);
        return true;
    } catch (error) {
        console.error("Error publishing version:", error);
        toast.error("Failed to publish version");
        return false;
    }
}
