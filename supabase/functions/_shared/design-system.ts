
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

export const systemPrompt = `You are an expert design system architect. Generate comprehensive, production-ready design systems based on user requirements.

When generating a design system, you MUST return ONLY a valid JSON object with this exact structure (no markdown, no explanation, just JSON):

{
  "name": "string - name of the design system",
  "colors": {
    "primary": "hsl(h, s%, l%)",
    "secondary": "hsl(h, s%, l%)",
    "accent": "hsl(h, s%, l%)",
    "background": "hsl(h, s%, l%)",
    "surface": "hsl(h, s%, l%)",
    "text": "hsl(h, s%, l%)",
    "textSecondary": "hsl(h, s%, l%)",
    "success": "hsl(h, s%, l%)",
    "warning": "hsl(h, s%, l%)",
    "error": "hsl(h, s%, l%)"
  },
  "darkColors": {
    "primary": "hsl(h, s%, l%)",
    "secondary": "hsl(h, s%, l%)",
    "accent": "hsl(h, s%, l%)",
    "background": "hsl(h, s%, l%)",
    "surface": "hsl(h, s%, l%)",
    "text": "hsl(h, s%, l%)",
    "textSecondary": "hsl(h, s%, l%)",
    "success": "hsl(h, s%, l%)",
    "warning": "hsl(h, s%, l%)",
    "error": "hsl(h, s%, l%)",
    "overlay": "hsla(h, s%, l%, a)",
    "border": "hsl(h, s%, l%)",
    "borderLight": "hsl(h, s%, l%)",
    "onPrimary": "hsl(h, s%, l%)",
    "onSecondary": "hsl(h, s%, l%)",
    "onAccent": "hsl(h, s%, l%)",
    "onBackground": "hsl(h, s%, l%)",
    "onSurface": "hsl(h, s%, l%)",
    "primaryContainer": "hsl(h, s%, l%)",
    "onPrimaryContainer": "hsl(h, s%, l%)",
    "secondaryContainer": "hsl(h, s%, l%)",
    "onSecondaryContainer": "hsl(h, s%, l%)",
    "interactive": {
      "primary": { "hover": "hsl...", "active": "hsl...", "disabled": "hsl...", "focus": "hsl..." },
      "secondary": { "hover": "hsl...", "active": "hsl...", "disabled": "hsl...", "focus": "hsl..." },
      "accent": { "hover": "hsl...", "active": "hsl...", "disabled": "hsl...", "focus": "hsl..." }
    }
  },
  "typography": {
    "fontFamily": {
      "heading": "font name",
      "body": "font name",
      "mono": "font name"
    },
    "sizes": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
      "5xl": "48px"
    },
    "weights": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeights": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    }
  },
  "spacing": {
    "unit": 4,
    "scale": {
      "0": "0px",
      "1": "4px",
      "2": "8px",
      "3": "12px",
      "4": "16px",
      "5": "20px",
      "6": "24px",
      "8": "32px",
      "10": "40px",
      "12": "48px",
      "16": "64px",
      "20": "80px",
      "24": "96px"
    }
  },
  "shadows": {
    "none": "none",
    "sm": "shadow value",
    "md": "shadow value",
    "lg": "shadow value",
    "xl": "shadow value",
    "2xl": "shadow value",
    "inner": "shadow value"
  },
  "grid": {
    "columns": 12,
    "gutter": "24px",
    "margin": "32px",
    "maxWidth": "1280px",
    "breakpoints": {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px"
    }
  },
  "borderRadius": {
    "none": "0px",
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "2xl": "24px",
    "full": "9999px"
  },
  "animations": {
    "duration": { "instant": "0ms", "fast": "100ms", "normal": "200ms", "slow": "300ms", "slower": "500ms" },
    "easing": { "linear": "linear", "easeIn": "cubic-bezier...", "easeOut": "cubic-bezier...", "easeInOut": "cubic-bezier...", "spring": "cubic-bezier...", "bounce": "cubic-bezier..." },
    "transitions": { "fade": "opacity...", "scale": "transform...", "slide": "transform...", "all": "all...", "colors": "background-color...", "transform": "transform..." }
  },
  "components": {
    "Button": {
      "name": "Button",
      "description": "Interactive element",
      "variants": { 
        "primary": { "name": "Primary", "styles": { "default": { "background": "...", "color": "..." } } }
      },
      "properties": { "variant": ["primary"], "size": ["sm", "md"] }
    }
  }
}

Design Guidelines:
1. Colors: Create harmonious palettes using color theory. Consider the industry and mood.
   - Use HSL format for all colors
   - Ensure proper contrast ratios for accessibility
   - Primary colors should reflect the brand mood
   - Background/surface colors should be subtle

2. Typography: Pair fonts that complement each other
   - Choose heading fonts based on industry (tech=geometric, luxury=serif, etc.)
   - Body fonts should be highly readable
   - Scale should follow a harmonic ratio

3. Spacing: Use a consistent base unit (typically 4px or 8px)
   - Scale should feel balanced and rhythmic

4. Shadows: Create depth that matches the mood
   - Minimalist = subtle shadows
   - Playful/Bold = more dramatic shadows

5. Border Radius: Match the brand personality
   - Professional = smaller radii
   - Playful/Friendly = larger radii

6. Grid: Optimize for the platform
   - Mobile apps = 4-6 columns
   - Web apps = 12 columns`;

export const inputSchema = z.object({
    appType: z.enum(['mobile', 'web', 'both']).default('web'),
    industry: z.string().min(1, 'Industry is required').max(100, 'Industry must be 100 characters or less'),
    brandMood: z.array(z.string().max(50)).min(1, 'At least one brand mood is required').max(5, 'Maximum 5 brand moods allowed'),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Primary color must be a valid hex color').optional().nullable(),
    description: z.string().max(500, 'Description must be 500 characters or less').optional().nullable(),
});

// Helper for sanitization
export const sanitize = (str: string): string => {
    let sanitized = str.replace(/[`${}]/g, '');
    const injectionPatterns = [
        /ignore\s+(all\s+)?(previous\s+)?instructions?/gi,
        /system\s*:/gi,
        /assistant\s*:/gi,
        /user\s*:/gi,
        /\[INST\]/gi,
        /\[\/INST\]/gi,
        /<\|.*?\|>/g,
        /<<.*?>>/g,
        /\{\{.*?\}\}/g,
        /debug\s+mode/gi,
        /reveal\s+(all\s+)?config(uration)?/gi,
        /output\s+instructions/gi,
        /print\s+prompt/gi,
        /show\s+system/gi,
    ];

    for (const pattern of injectionPatterns) {
        sanitized = sanitized.replace(pattern, '');
    }
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
    return sanitized;
};

export async function generateWithAI(input: z.infer<typeof inputSchema>) {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
        throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { appType, industry, brandMood, primaryColor, description } = input;
    const sanitizedIndustry = sanitize(industry);
    const sanitizedMoods = brandMood.map(sanitize);
    const sanitizedDescription = description ? sanitize(description) : null;

    const userPrompt = `Generate a design system for the following project:

Platform: ${appType}
Industry: ${sanitizedIndustry}
Brand Mood: ${sanitizedMoods.join(", ")}
${primaryColor ? `Preferred Primary Color: ${primaryColor}` : "Choose an appropriate primary color based on the mood and industry"}
Project Description: ${sanitizedDescription || "A modern application in the " + sanitizedIndustry + " industry"}

Consider:
- The platform type affects grid columns (mobile=4, web=12, both=responsive)
- The industry influences font choices and overall aesthetic
- The brand mood should deeply influence colors, shadows, and border radii
- If a primary color is provided, build the palette around it
- Make the design system feel cohesive and professional`;

    console.log("Generating design system with AI...");

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
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("No content in AI response");
    }

    let designSystem;
    try {
        let jsonStr = content;
        if (content.includes("```json")) {
            jsonStr = content.split("```json")[1].split("```")[0].trim();
        } else if (content.includes("```")) {
            jsonStr = content.split("```")[1].split("```")[0].trim();
        }
        designSystem = JSON.parse(jsonStr);
    } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        throw new Error("Failed to parse design system from AI response");
    }

    return designSystem;
}
