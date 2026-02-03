import { supabase } from "@/integrations/supabase/client";
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
    | "theme_switched";

export async function trackEvent(
    designSystemId: string,
    eventType: AnalyticsEvent,
    metadata: any = {}
) {
    try {
        const { error } = await (supabase as any).from("analytics_events").insert([
            {
                design_system_id: designSystemId,
                event_type: eventType,
                metadata
            }
        ]);
        if (error) throw error;
    } catch (err) {
        monitor.error("Failed to track analytics event", err as Error);
    }
}
