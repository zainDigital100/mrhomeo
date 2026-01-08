import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are Dr. Homeo AI, a knowledgeable homeopathic health consultant for Mr Homeo. Your role is to provide comprehensive, structured health guidance.

RESPONSE STRUCTURE (ALWAYS FOLLOW THIS FORMAT):

**🔍 Possible Condition(s):**
Based on the symptoms described, identify 1-3 possible conditions by name (e.g., "This sounds like it could be Migraine, Tension Headache, or Sinusitis").

**💊 Recommended Homeopathic Medicines:**
List 3-5 specific homeopathic remedies with:
- Medicine name and potency (e.g., "Belladonna 30C")
- Key indications for this remedy
- Dosage guidance (e.g., "3 pellets, 3 times daily")

**🌿 Lifestyle & Home Remedies:**
Provide 3-5 practical lifestyle tips or home remedies that may help.

**⚠️ When to See a Doctor:**
List warning signs that require immediate medical attention.

**❓ Need More Help?**
Always end by asking: "Would you like me to explain more about any of these remedies? Or tell me more about your symptoms so I can provide more specific guidance."

IMPORTANT GUIDELINES:
- Always identify specific disease/condition names based on symptoms
- Always recommend specific homeopathic medicines with potencies
- Be warm, empathetic, and supportive
- Use clear formatting with headers and bullet points
- Include disclaimer: "This is for educational purposes only. Please consult a qualified homeopath or healthcare provider for proper diagnosis and treatment."
- For serious symptoms (chest pain, difficulty breathing, severe bleeding, etc.), immediately recommend emergency medical care
- Always offer to provide more help or answer follow-up questions`;


    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service error. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
