import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are an expert design system architect. Generate comprehensive, production-ready design systems based on user requirements.

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

// Input validation schema
const inputSchema = z.object({
  appType: z.enum(['mobile', 'web', 'both']).default('web'),
  industry: z.string().min(1, 'Industry is required').max(100, 'Industry must be 100 characters or less'),
  brandMood: z.array(z.string().max(50)).min(1, 'At least one brand mood is required').max(5, 'Maximum 5 brand moods allowed'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Primary color must be a valid hex color').optional().nullable(),
  description: z.string().max(500, 'Description must be 500 characters or less').optional().nullable(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    let rawInput;
    try {
      rawInput = await req.json();
    } catch {
      console.error("Failed to parse request body as JSON");
      return new Response(JSON.stringify({ 
        error: "Invalid JSON in request body" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validationResult = inputSchema.safeParse(rawInput);
    if (!validationResult.success) {
      console.error("Input validation failed:", validationResult.error.errors);
      return new Response(JSON.stringify({ 
        error: "Invalid input",
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { appType, industry, brandMood, primaryColor, description } = validationResult.data;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Sanitize inputs for AI prompt (escape special characters)
    const sanitize = (str: string) => str.replace(/[`${}]/g, '');
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
    console.log("Input:", { appType, industry: sanitizedIndustry, brandMood: sanitizedMoods, primaryColor, description: sanitizedDescription ? sanitizedDescription.substring(0, 50) + '...' : null });

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
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again in a moment." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Usage limit reached. Please add credits to continue." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received:", content.substring(0, 200) + "...");

    // Parse the JSON from the response
    let designSystem;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      let jsonStr = content;
      if (content.includes("```json")) {
        jsonStr = content.split("```json")[1].split("```")[0].trim();
      } else if (content.includes("```")) {
        jsonStr = content.split("```")[1].split("```")[0].trim();
      }
      designSystem = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse design system from AI response");
    }

    console.log("Design system generated successfully:", designSystem.name);

    return new Response(JSON.stringify({ designSystem }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-design-system function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
