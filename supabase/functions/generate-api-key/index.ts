
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
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { name, design_system_id } = await req.json()
        const user = await supabaseClient.auth.getUser()

        if (!user.data.user) throw new Error('Unauthorized')

        // Generate Key
        const rawKey = `df_live_${crypto.randomUUID().replace(/-/g, '')}`

        // Hash Key
        const encoder = new TextEncoder()
        const data = encoder.encode(rawKey)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        // Store Hash
        const { error } = await supabaseClient
            .from('api_keys')
            .insert({
                user_id: user.data.user.id,
                design_system_id,
                name,
                key_hash: keyHash,
                scopes: ['read:tokens']
            })

        if (error) throw error

        return new Response(JSON.stringify({ apiKey: rawKey }), {
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
