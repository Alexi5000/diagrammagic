import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Allowed origins for CORS - restrict to known domains
const ALLOWED_ORIGINS = [
  'https://diagrammagic.lovable.app',
  'https://id-preview--3d9d05ed-b95f-4de8-89b0-997cac5537a1.lovable.app',
  'http://localhost:8080',
  'http://localhost:5173',
];

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Helper to get CORS headers with validated origin
function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Credentials': 'true',
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - no token provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate the user's JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;
    console.log('Authenticated user:', userId);

    // Parse request body
    const { prompt } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate prompt length (3-1000 chars)
    if (prompt.length < 3 || prompt.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Prompt must be between 3 and 1000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get OpenAI API key from secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sending request to OpenAI API');

    // Call OpenAI API
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a diagram expert specializing in creating Mermaid syntax diagrams. 
            When given a request, respond ONLY with valid Mermaid syntax code surrounded by backticks like this: \`mermaid code here\`.
            Do not include any explanations, markdown code blocks, or anything else outside the backticks.
            Ensure the diagram is clean, well-organized, and correctly formatted.`
          },
          {
            role: 'user',
            content: `Create a Mermaid diagram based on this description: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      const errorMessage = errorData.error?.message || `OpenAI API request failed with status ${openaiResponse.status}`;
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await openaiResponse.json();
    const generatedText = data.choices[0]?.message?.content?.trim();

    if (!generatedText) {
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract content between backticks using regex
    const backtickPattern = /`(.*?)`/gs;
    const backtickMatch = [...generatedText.matchAll(backtickPattern)];
    
    let diagram: string;
    if (backtickMatch.length > 0) {
      // Join all backtick content with newlines if there are multiple matches
      diagram = backtickMatch.map(match => match[1]).join('\n');
    } else {
      // Fallback to the entire response if no backticks found
      diagram = generatedText;
    }

    console.log('Successfully generated diagram');

    return new Response(
      JSON.stringify({ diagram }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
