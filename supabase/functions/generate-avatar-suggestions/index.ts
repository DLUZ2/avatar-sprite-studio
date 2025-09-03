import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Faça sugestões de personalização para um avatar 3D cartoon/fofo baseado na seguinte descrição: ${prompt}. 
            Responda apenas com um JSON válido no formato:
            {
              "suggestions": {
                "bodyType": "sphere|cube|cylinder",
                "eyeStyle": "dots|large|sleepy",
                "mouthStyle": "smile|neutral|excited", 
                "hairStyle": "spiky|curly|straight|bald|ponytail|messy",
                "accessory": "glasses|hat|bow|antenna|none",
                "bodyColor": "#hex_color",
                "hairColor": "#hex_color",
                "accessoryColor": "#hex_color"
              },
              "description": "Breve descrição do avatar sugerido"
            }`
          }]
        }]
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response from Gemini
    let suggestions;
    try {
      suggestions = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', generatedText);
      throw new Error('Invalid response format from AI');
    }

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-avatar-suggestions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});