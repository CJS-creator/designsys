
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/design-system.ts";

const adaptationSystemPrompt = `You are a specialized Design System Adaptation Engine.
Your goal is to MODIFY an existing foundation based on specific user requirements.
You must return a JSON object containing ONLY the specific fields that need to change to meet the requirements.
Do NOT return the full design system.

Focus on these properties if relevant to the request:
1. Colors: Shift primary/secondary hues to match the Description/Mood.
2. Typography: Switch font families or scale (e.g. "playful" -> rounded fonts).
3. BorderRadius: Adjust for "friendly" (rounded) vs "serious" (square).
4. Spacing: Adjust density for "data-heavy" (compact) vs "marketing" (spacious).

Output strictly valid JSON. Example of a valid response:
{
  "colors": { "primary": "hsl(210, 100%, 50%)" },
  "borderRadius": { "md": "8px" }
}`;

serve(async (req: Request) => {
    // CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { description, brandMood, config } = await req.json();

        // OPTIMIZATION: Check flags to reduce token usage
        // If config says "skip colors", we add that to the prompt
        let promptConstraints = "";
        if (config?.featureFlags?.usePatternForColors) {
            promptConstraints += "\n- DO NOT modify colors.";
        }
        if (config?.featureFlags?.usePatternForTypography) {
            promptConstraints += "\n- DO NOT modify typography.";
        }

        const userPrompt = `Adaptation Request:
    Description: ${description || "N/A"}
    Brand Mood: ${brandMood ? brandMood.join(", ") : "N/A"}
    
    Constraints:${promptConstraints}
    
    Return ONLY the JSON adaptation.`;

        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        if (!LOVABLE_API_KEY) {
            throw new Error("LOVABLE_API_KEY is not configured");
        }

        // A/B Testing Logic
        // Select variant A or B
        const variant = Math.random() < 0.5 ? 'A' : 'B';
        let systemPrompt = adaptationSystemPrompt;
        let temperature = 0.7;

        if (variant === 'B') {
            // Variant B: More focus on emotional resonance and higher creativity
            systemPrompt = adaptationSystemPrompt.replace(
                "Modify an existing foundation based on specific user requirements.",
                "Creatively reinterpret the design foundation to strongly evoke the requested Brand Mood."
            ) + "\n\nIn Variant B, take slightly more risks with color saturation and font pairings.";
            temperature = 0.85;
        }

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: temperature,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "{}";

        // Parse JSON from code block if present
        let jsonStr = content;
        if (content.includes("```json")) {
            jsonStr = content.split("```json")[1].split("```")[0].trim();
        } else if (content.includes("```")) {
            jsonStr = content.split("```")[1].split("```")[0].trim();
        }

        let adaptation;
        try {
            adaptation = JSON.parse(jsonStr);
        } catch {
            // Fallback to empty if parse fails
            adaptation = {};
        }

        return new Response(JSON.stringify({
            adaptation,
            meta: {
                ab_variant: variant,
                model: "google/gemini-2.5-flash"
            }
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in generate-design-adaptation:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
