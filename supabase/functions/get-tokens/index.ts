
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing Authorization header')
        }

        const apiKey = authHeader.replace('Bearer ', '').trim()

        // Hash the key to look it up (since we store hashes)
        const encoder = new TextEncoder()
        const data = encoder.encode(apiKey)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        // Create Supabase Admin client to bypass RLS for the lookup
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Verify Key
        const { data: keyData, error: keyError } = await supabaseClient
            .from('api_keys')
            .select('design_system_id, scopes')
            .eq('key_hash', keyHash)
            .maybeSingle()

        if (keyError || !keyData) {
            return new Response(JSON.stringify({ error: 'Invalid API Key' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        // Fetch Tokens
        const { data: tokens, error: tokensError } = await supabaseClient
            .from('design_tokens')
            .select('*')
            .eq('design_system_id', keyData.design_system_id)

        if (tokensError) throw tokensError

        // Optional: Transform to W3C format (simplified here)
        const formattedTokens = tokens.reduce((acc, token) => {
            acc[token.name] = {
                $value: token.value,
                $type: token.token_type,
                $description: token.description
            }
            return acc
        }, {})

        return new Response(JSON.stringify(formattedTokens, null, 2), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
