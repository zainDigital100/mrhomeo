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
    const { messages, images } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Use vision-capable model when images are present
    const hasImages = images && images.length > 0;
    const model = hasImages ? 'google/gemini-2.5-flash' : 'google/gemini-2.5-flash';

    const systemPrompt = hasImages 
      ? `You are Dr. Homeo AI, a knowledgeable homeopathic health consultant for Mr Homeo. You have the ability to analyze medical reports, prescriptions, lab results, X-rays, and other medical images.

WHEN ANALYZING IMAGES:

**📋 Image Analysis Summary:**
Describe what you see in each image (report type, key findings, values, etc.)

**🔍 Key Findings:**
- List the most important medical findings from the image(s)
- Highlight any abnormal values or concerning results
- Note the date and source of the report if visible

**💊 Homeopathic Recommendations:**
Based on the findings, suggest 3-5 specific homeopathic remedies with:
- Medicine name and potency (e.g., "Arsenicum Album 30C")
- Key indications for this remedy
- Dosage guidance

**🌿 Lifestyle & Dietary Suggestions:**
Provide 3-5 practical tips based on the findings.

**⚠️ Important Considerations:**
List any warning signs or when to seek immediate medical attention.

**❓ Need More Information?**
Ask if the patient wants more details or has additional symptoms to share.

IMPORTANT GUIDELINES:
- Always acknowledge you're analyzing medical documents/images
- Be thorough but clear in your explanations
- Use medical terminology but explain in simple terms
- Always include disclaimer: "This analysis is for educational purposes only. Please consult your healthcare provider for proper diagnosis and treatment."
- For critical/emergency findings, immediately recommend seeking medical care`
      : `You are Dr. Homeo AI, a knowledgeable homeopathic health consultant for Mr Homeo. Your role is to provide comprehensive, structured health guidance.

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

    // Build messages array with image support
    const formattedMessages = messages.map((msg: any, index: number) => {
      // If this is the last user message and we have images, include them
      if (msg.role === 'user' && index === messages.length - 1 && hasImages) {
        const content: any[] = [];
        
        // Add images first
        for (const img of images) {
          content.push({
            type: 'image_url',
            image_url: {
              url: `data:${img.mimeType};base64,${img.base64}`
            }
          });
        }
        
        // Add text content
        content.push({
          type: 'text',
          text: msg.content || 'Please analyze these medical images/reports and provide insights.'
        });
        
        return { role: msg.role, content };
      }
      
      return msg;
    });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...formattedMessages,
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
