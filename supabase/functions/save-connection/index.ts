import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";



serve(async (req: Request) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        // Get the User to verify ownership
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) throw new Error('Unauthorized');

        const { type, designSystemId, token, ...extra } = await req.json();

        if (!designSystemId || !token) {
            throw new Error('Missing designSystemId or token');
        }

        // Initialize Admin Client to perform the Encryption/RPC
        const adminClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Call the secure RPC
        const { data: secretId, error: rpcError } = await adminClient.rpc('store_connection_secret', {
            p_design_system_id: designSystemId,
            p_user_id: user.id,
            p_type: type,
            p_token: token,
            p_metadata: extra
        });

        if (rpcError) {
            console.error("RPC Error:", rpcError);
            throw new Error("Failed to store connection securely: " + rpcError.message);
        }

        return new Response(
            JSON.stringify({ success: true, secretId }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
