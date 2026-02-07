const allowedOrigins = [
    'https://designforgene.lovable.app',
    'https://id-preview--13534042-5c4f-4d72-a4c7-b863a7464c49.lovable.app',
    'http://localhost:5173', // Local development
    'http://localhost:3000' // Local development
];

export const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(Deno.env.get('ORIGIN') || '') ? Deno.env.get('ORIGIN')! : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
