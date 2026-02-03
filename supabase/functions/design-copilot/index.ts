// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are a world-class Design System Architect and AI Design Copilot.
Your goal is to help users maintain, audit, and expand their design systems.

Available Actions:
1. "audit": Analyze a list of design tokens for redundancy (near-duplicate values), naming inconsistencies, and missing semantic layers. Provide specific suggestions for consolidation.
2. "generate-theme": Create a new brand theme (e.g., Dark Mode) based on an existing set of tokens.
3. "expand-palette": Generate a balanced color scale (shades/tints) from a single color.
4. "fix-accessibility": Suggest color adjustments to meet WCAG contrast requirements.

RESPONSE FORMAT:
You MUST return ONLY a JSON object. No markdown, no explanations outside the JSON.

Example Audit Response:
{
  "suggestions": [
    {
      "type": "consolidate",
      "newName": "brand.primary",
      "tokensToAlias": ["button.bg", "header.icon"],
      "reason": "Both tokens share the exact same brand blue color."
    }
  ]
}

Example Theme Response:
{
  "themeName": "Dark Mode",
  "overrides": [
    { "path": "color.bg", "value": "#0f172a" },
    { "path": "color.text", "value": "#f8fafc" }
  ]
}`;

const inputSchema = z.object({
    action: z.enum(['audit', 'generate-theme', 'expand-palette', 'fix-accessibility']),
    tokens: z.array(z.any()),
    context: z.record(z.any()).optional(),
});

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const rawInput = await req.json();
        const validation = inputSchema.safeParse(rawInput);

        if (!validation.success) {
            return new Response(JSON.stringify({ error: "Invalid input", details: validation.error }), { status: 400, headers: corsHeaders });
        }

        const { action, tokens, context } = validation.data;
        // @ts-ignore: Deno global
        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

        const userPrompt = `Action: ${action}
Tokens: ${JSON.stringify(tokens)}
Context: ${JSON.stringify(context || {})}

Please perform the requested action and return the appropriate JSON response.`;

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-exp",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                response_format: { type: "json_object" }
            }),
        });

        const data = await response.json();
        const content = data.choices[0].message.content;

        return new Response(content, {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
});
