
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, inputSchema, generateWithAI } from "../_shared/design-system.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let rawInput;
    try {
      rawInput = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validationResult = inputSchema.safeParse(rawInput);
    if (!validationResult.success) {
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

    const designSystem = await generateWithAI(validationResult.data);

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
