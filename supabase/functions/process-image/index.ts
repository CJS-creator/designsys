import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const inputSchema = z.object({
    image: z.string().min(1, "Image data is required"), // base64 string
    options: z.object({
        colorCount: z.number().optional().default(5),
        extractMood: z.boolean().optional().default(true),
        accessibilityCheck: z.boolean().optional().default(true),
    }).optional().default({}),
});

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        let rawInput;
        try {
            rawInput = await req.json();
        } catch {
            return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders });
        }

        const validationResult = inputSchema.safeParse(rawInput);
        if (!validationResult.success) {
            return new Response(JSON.stringify({ error: "Invalid input", details: validationResult.error }), { status: 400, headers: corsHeaders });
        }

        const { image, options } = validationResult.data;
        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY Config Missing");

        // Vision Prompt
        const systemPrompt = `You are an expert UI/UX Designer with perfect color vision.
    Analyze the provided image and extract a design system foundation.
    Return ONLY valid JSON.
    Structure:
    {
      "colors": [
        { "hex": "#RRGGBB", "name": "string", "usage": "primary|secondary|accent|background|surface" }
      ],
      "mood": {
        "primary": "string (e.g. professional, playful)",
        "secondary": "string",
        "confidence": number (0-1)
      },
      "accessibility": {
        "compliant": boolean,
        "issues": ["string description of contrast issues if any"]
      }
    }`;

        const userPrompt = `Extract ${options.colorCount} colors, mood, and check accessibility. Image is attached.`;

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-exp", // or gpt-4o if available/preferred
                messages: [
                    { role: "system", content: systemPrompt },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: userPrompt },
                            { type: "image_url", image_url: { url: image } }
                        ]
                    }
                ],
            }),
        });

        if (!response.ok) throw new Error(`AI API Error: ${response.status}`);

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) throw new Error("No content from AI");

        let result;
        try {
            let jsonStr = content;
            if (content.includes("```json")) {
                jsonStr = content.split("```json")[1].split("```")[0].trim();
            } else if (content.includes("```")) {
                jsonStr = content.split("```")[1].split("```")[0].trim();
            }
            result = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Parse Error", content);
            throw new Error("Failed to parse AI response");
        }

        return new Response(JSON.stringify({ success: true, data: result }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
