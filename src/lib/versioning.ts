import { supabase } from "@/integrations/supabase/client";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

export interface VersionSnapshot {
    id: string;
    design_system_id: string;
    version_number: number;
    snapshot_data: unknown;
    created_at: string;
    created_by: string;
}

/**
 * Creates a new snapshot of the current design system state
 */
export async function createSnapshot(
    designSystemId: string,
    versionName: string,
    data: GeneratedDesignSystem,
    userId: string
) {
    try {
        // Get next version number
        const { count } = await supabase
            .from("design_system_versions")
            .select("id", { count: "exact", head: true })
            .eq("design_system_id", designSystemId);

        const nextVersion = (count || 0) + 1;

        const { error } = await supabase
            .from("design_system_versions")
            .insert({
                design_system_id: designSystemId,
                version_number: nextVersion,
                name: versionName,
                snapshot_data: data as unknown as Json,
                created_by: userId,
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
export function diffSnapshots(oldSnapshot: unknown, newSnapshot: unknown) {
    const diffs: Array<{ path: string; old: unknown; new: unknown; type: string }> = [];

    const oldTokens = (oldSnapshot as Record<string, unknown>)?.tokens || {};
    const newTokens = (newSnapshot as Record<string, unknown>)?.tokens || {};

    const oldObj = oldTokens as Record<string, unknown>;
    const newObj = newTokens as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    allKeys.forEach(key => {
        if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
            diffs.push({
                path: key,
                old: oldObj[key],
                new: newObj[key],
                type: !oldObj[key] ? 'added' : !newObj[key] ? 'removed' : 'updated'
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

        // 2. Get next version number
        const { count } = await supabase
            .from("design_system_versions")
            .select("id", { count: "exact", head: true })
            .eq("design_system_id", request.design_system_id);

        const nextVersion = (count || 0) + 1;

        // 3. Create the version record
        const { data: version, error: versionError } = await supabase
            .from("design_system_versions")
            .insert({
                design_system_id: request.design_system_id,
                version_number: nextVersion,
                name: `v${nextVersion}`,
                description: request.description,
                snapshot_data: (request.design_systems as Record<string, unknown>)?.design_system_data as Json,
                created_by: request.requester_id,
                is_published: true,
                published_at: new Date().toISOString()
            })
            .select()
            .single();

        if (versionError) throw versionError;

        // 4. Create entries in version_changelog from approval_changes
        const changes = (request as Record<string, unknown>).changes as Array<Record<string, unknown>> | undefined;
        if (changes && changes.length > 0) {
            const changelogEntries = changes.map((change) => ({
                version_id: version.id,
                token_path: change.token_path as string,
                old_value: change.old_value as string | null,
                new_value: change.new_value as string | null,
                change_type: change.change_type as string,
            }));

            const { error: logError } = await supabase
                .from("version_changelog")
                .insert(changelogEntries);

            if (logError) throw logError;
        }

        // 5. Mark request as published
        const { error: updateError } = await supabase
            .from("approval_requests")
            .update({ status: 'published' as const, updated_at: new Date().toISOString() })
            .eq("id", requestId);

        if (updateError) throw updateError;

        toast.success(`Version v${nextVersion} published!`);
        return true;
    } catch (error) {
        console.error("Error publishing version:", error);
        toast.error("Failed to publish version");
        return false;
    }
}