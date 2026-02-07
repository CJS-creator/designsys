import { supabase } from "@/integrations/supabase/client";
import { monitor } from "./monitoring";

export type AICopilotAction = 'audit' | 'generate-theme' | 'expand-palette' | 'fix-accessibility';

export interface AISuggestion {
    type: 'consolidate' | 'rename' | 'new-token';
    newName: string;
    tokensToAlias?: string[];
    reason: string;
    value?: any;
}

export interface AIThemeResult {
    themeName: string;
    overrides: { path: string, value: any }[];
}

export async function runAICopilot(action: AICopilotAction, tokens: any[], context?: any) {
    try {
        const { data, error } = await supabase.functions.invoke('design-copilot', {
            body: { action, tokens, context }
        });

        if (error) throw error;
        return data;
    } catch (error) {
        monitor.error("AI Copilot Error", error as Error);
        throw error;
    }
}
