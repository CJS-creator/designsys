import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { monitor } from "./monitoring";

export type AnalyticsEvent =
    | "design_generated"
    | "token_updated"
    | "exported_css"
    | "exported_json"
    | "exported_tailwind"
    | "exported_flutter"
    | "exported_swiftui"
    | "exported_kotlin"
    | "doc_page_viewed"
    | "theme_switched"
    | "approval_request_created"
    | "approval_request_published"
    | "approval_request_rejected";

type AnalyticsMetadata = Record<string, Json>;

export async function trackEvent(
    designSystemId: string,
    eventType: AnalyticsEvent,
    metadata: AnalyticsMetadata = {}
) {
    try {
        const { error } = await supabase.from("analytics_events").insert({
            design_system_id: designSystemId,
            event_type: eventType,
            metadata: metadata as Json,
        });
        if (error) throw error;
    } catch (err) {
        monitor.error("Failed to track analytics event", err as Error);
    }
}
