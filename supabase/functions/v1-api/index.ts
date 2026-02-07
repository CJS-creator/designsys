import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders, inputSchema, generateWithAI } from "../_shared/design-system.ts";
import { openApiSpec } from "./openapi.ts";

// Helper to hash key (match client side logic)
async function hashKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Basic Rate Limiter (In-Memory, Per Instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const LIMIT = 100; // Requests
const WINDOW = 60 * 1000; // 1 Minute

function checkRateLimit(keyHash: string): boolean {
    const now = Date.now();
    const limitData = rateLimitMap.get(keyHash) || { count: 0, resetTime: now + WINDOW };

    if (now > limitData.resetTime) {
        // Reset
        limitData.count = 1;
        limitData.resetTime = now + WINDOW;
    } else {
        limitData.count++;
    }

    rateLimitMap.set(keyHash, limitData);
    return limitData.count <= LIMIT;
}

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);
        const path = url.pathname.replace("/v1-api", "");

        // Endpoint: GET /v1/docs (OpenAPI Spec) - Public Access
        if ((path === "/v1/docs" || path === "/docs" || path === "/openapi.json") && req.method === "GET") {
            return new Response(JSON.stringify(openApiSpec), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 1. Authenticate Request
        const apiKey = req.headers.get("x-api-key");
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "Missing x-api-key header" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const keyHash = await hashKey(apiKey);

        // 2. Rate Limiting
        if (!checkRateLimit(keyHash)) {
            return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
                status: 429,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Init Admin Client to check keys
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // 3. Validate Key & Scopes
        const { data: keyData, error: keyError } = await supabaseAdmin
            .from("api_keys")
            .select("id, user_id, last_used_at, design_system_id, scopes")
            .eq("key_hash", keyHash)
            .single();

        if (keyError || !keyData) {
            return new Response(JSON.stringify({ error: "Invalid API Key" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Update last used asynchronously (fire and forget)
        supabaseAdmin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id).then();

        // 4. Routing & Logic

        // Endpoint: GET /v1/tokens
        if ((path === "/v1/tokens" || path === "/tokens") && req.method === "GET") {
            // Check Scope
            if (!keyData.scopes?.includes("tokens:read")) {
                return new Response(JSON.stringify({ error: "Insufficient permissions. Required: tokens:read" }), {
                    status: 403,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // Fetch tokens for this design system
            const { data: tokens, error: tokensError } = await supabaseAdmin
                .from("design_tokens")
                .select("*")
                .eq("design_system_id", keyData.design_system_id);

            if (tokensError) {
                return new Response(JSON.stringify({ error: "Failed to fetch tokens" }), {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            return new Response(JSON.stringify({
                success: true,
                meta: {
                    design_system_id: keyData.design_system_id,
                    count: tokens.length
                },
                data: tokens
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Endpoint: POST /v1/generate (Previous functionality)
        if ((path === "/v1/generate" || path === "/generate") && req.method === "POST") {
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
