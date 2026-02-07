
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders, inputSchema, generateWithAI } from "../_shared/design-system.ts";

// Helper to hash key (match client side logic)
async function hashKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // 1. Authenticate Request
        const apiKey = req.headers.get("x-api-key");
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "Missing x-api-key header" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const keyHash = await hashKey(apiKey);

        // Init Admin Client to check keys
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { data: keyData, error: keyError } = await supabaseAdmin
            .from("api_keys")
            .select("id, user_id, last_used_at")
            .eq("key_hash", keyHash)
            .single();

        if (keyError || !keyData) {
            return new Response(JSON.stringify({ error: "Invalid API Key" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Update last used asynchronously (fire and forget to not block)
        supabaseAdmin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id).then();

        // 2. Rate Limiting (Simple Check using Supabase for now)
        // For MVP, we'll skip complex rate limiting (Redis/Upstash) and rely on edge function limits
        // or we could add a simple counter in a DB table if needed.
        // Proceeding without for now as per plan focus on "Productization" first.

        // 3. Routing
        const url = new URL(req.url);
        const path = url.pathname.replace("/v1-api", ""); // Strip prefix if routing via rewrite, or use relative

        // Supabase routing: https://project.functions.supabase.co/v1-api/v1/generate
        // Path inside function will be /v1/generate

        if (path === "/v1/generate" || path === "/generate") { // Handle both just in case
            let rawInput;
            try {
                rawInput = await req.json();
            } catch {
                return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders });
            }

            const result = inputSchema.safeParse(rawInput);
            if (!result.success) {
                return new Response(JSON.stringify({
                    error: "Invalid input",
                    details: result.error.errors
                }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
            }

            const designSystem = await generateWithAI(result.data);
            return new Response(JSON.stringify({
                success: true,
                data: designSystem
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ error: "Not Found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("API Gateway Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
