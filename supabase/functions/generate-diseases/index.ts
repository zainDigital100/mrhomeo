import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// List of 120 diseases to generate
const diseaseList = [
  "Acne", "Allergic Rhinitis", "Alopecia (Hair Loss)", "Anemia", "Anxiety Disorder",
  "Arthritis", "Asthma", "Athlete's Foot", "Back Pain", "Bell's Palsy",
  "Bronchitis", "Carpal Tunnel Syndrome", "Cataracts", "Celiac Disease", "Chickenpox",
  "Chronic Fatigue Syndrome", "Cold Sores", "Common Cold", "Conjunctivitis", "Constipation",
  "COPD", "Crohn's Disease", "Cystitis", "Depression", "Dermatitis",
  "Diabetes Type 2", "Diarrhea", "Diverticulitis", "Dry Eye Syndrome", "Ear Infection",
  "Eczema", "Endometriosis", "Epilepsy", "Erectile Dysfunction", "Fibromyalgia",
  "Food Poisoning", "Frozen Shoulder", "Gallstones", "Gastritis", "GERD",
  "Gout", "Graves' Disease", "Hay Fever", "Headaches", "Heartburn",
  "Hemorrhoids", "Hepatitis", "Hernia", "High Blood Pressure", "High Cholesterol",
  "Hives", "Hyperthyroidism", "Hypothyroidism", "IBS", "Impetigo",
  "Indigestion", "Influenza", "Insomnia", "Interstitial Cystitis", "Iron Deficiency",
  "Kidney Stones", "Laryngitis", "Lupus", "Lyme Disease", "Macular Degeneration",
  "Meniere's Disease", "Menopause Symptoms", "Migraine", "Morning Sickness", "Multiple Sclerosis",
  "Nausea", "Neuralgia", "Obesity", "Osteoarthritis", "Osteoporosis",
  "Otitis Media", "Panic Disorder", "Parkinson's Disease", "PCOS", "Peptic Ulcer",
  "Peripheral Neuropathy", "Pharyngitis", "Plantar Fasciitis", "Pleurisy", "PMS",
  "Pneumonia", "Poison Ivy", "Prostatitis", "Psoriasis", "Raynaud's Disease",
  "Restless Leg Syndrome", "Rheumatoid Arthritis", "Ringworm", "Rosacea", "Sciatica",
  "Shingles", "Sinusitis", "Sleep Apnea", "Sore Throat", "Sprain",
  "Stomach Flu", "Stress", "Stroke Recovery", "Stye", "Sunburn",
  "Tendinitis", "Tennis Elbow", "Tinnitus", "Tonsillitis", "Toothache",
  "Ulcerative Colitis", "Urinary Tract Infection", "Varicose Veins", "Vertigo", "Warts",
  "Whooping Cough", "Yeast Infection"
];

const categories = [
  "Mental Health", "Neurological", "Skin Conditions", "Digestive", "Respiratory",
  "Musculoskeletal", "Immune System", "Cardiovascular", "Women's Health", "Men's Health",
  "Eye & Ear", "Infectious", "Metabolic", "Urinary"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { batchStart = 0, batchSize = 10 } = await req.json();
    
    const diseasesToGenerate = diseaseList.slice(batchStart, batchStart + batchSize);
    
    if (diseasesToGenerate.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'All diseases have been generated', 
          total: diseaseList.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating diseases ${batchStart} to ${batchStart + diseasesToGenerate.length}`);

    const results = [];

    for (const diseaseName of diseasesToGenerate) {
      // Check if already exists
      const { data: existing } = await supabase
        .from('diseases')
        .select('id')
        .eq('slug', diseaseName.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        .maybeSingle();

      if (existing) {
        console.log(`Disease ${diseaseName} already exists, skipping`);
        results.push({ name: diseaseName, status: 'skipped' });
        continue;
      }

      const prompt = `Generate comprehensive homeopathic health information for "${diseaseName}". 
      
Return a JSON object with these exact fields:
{
  "name": "${diseaseName}",
  "slug": "${diseaseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}",
  "summary": "A 1-2 sentence description of the condition",
  "symptoms": ["symptom1", "symptom2", "symptom3", "symptom4"],
  "category": "One of: Mental Health, Neurological, Skin Conditions, Digestive, Respiratory, Musculoskeletal, Immune System, Cardiovascular, Women's Health, Men's Health, Eye & Ear, Infectious, Metabolic, Urinary",
  "overview": "A detailed 3-4 sentence explanation of the condition",
  "causes": ["cause1", "cause2", "cause3", "cause4", "cause5", "cause6"],
  "early_symptoms": ["early symptom 1", "early symptom 2", "early symptom 3", "early symptom 4", "early symptom 5"],
  "advanced_symptoms": ["advanced symptom 1", "advanced symptom 2", "advanced symptom 3", "advanced symptom 4", "advanced symptom 5"],
  "homeopathic_perspective": "A paragraph explaining the homeopathic view of this condition",
  "medicines": [
    {
      "name": "Remedy Name 1",
      "indications": "Key symptoms this remedy addresses",
      "guidance": "General usage guidance"
    },
    {
      "name": "Remedy Name 2",
      "indications": "Key symptoms this remedy addresses",
      "guidance": "General usage guidance"
    },
    {
      "name": "Remedy Name 3",
      "indications": "Key symptoms this remedy addresses",
      "guidance": "General usage guidance"
    },
    {
      "name": "Remedy Name 4",
      "indications": "Key symptoms this remedy addresses",
      "guidance": "General usage guidance"
    }
  ],
  "lifestyle_tips": ["tip1", "tip2", "tip3", "tip4", "tip5", "tip6"],
  "when_to_consult": ["situation1", "situation2", "situation3", "situation4", "situation5"]
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`;

      try {
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'You are a medical content generator specializing in homeopathic health information. Generate accurate, educational content. Always return valid JSON only.'
              },
              { role: 'user', content: prompt }
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI API error for ${diseaseName}:`, response.status, errorText);
          results.push({ name: diseaseName, status: 'error', error: errorText });
          continue;
        }

        const data = await response.json();
        let content = data.choices[0].message.content;
        
        // Clean the response
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const diseaseData = JSON.parse(content);
        
        // Insert into database
        const { error: insertError } = await supabase
          .from('diseases')
          .insert({
            slug: diseaseData.slug,
            name: diseaseData.name,
            summary: diseaseData.summary,
            symptoms: diseaseData.symptoms,
            category: diseaseData.category,
            overview: diseaseData.overview,
            causes: diseaseData.causes,
            early_symptoms: diseaseData.early_symptoms,
            advanced_symptoms: diseaseData.advanced_symptoms,
            homeopathic_perspective: diseaseData.homeopathic_perspective,
            medicines: diseaseData.medicines,
            lifestyle_tips: diseaseData.lifestyle_tips,
            when_to_consult: diseaseData.when_to_consult
          });

        if (insertError) {
          console.error(`Insert error for ${diseaseName}:`, insertError);
          results.push({ name: diseaseName, status: 'insert_error', error: insertError.message });
        } else {
          console.log(`Successfully generated and inserted ${diseaseName}`);
          results.push({ name: diseaseName, status: 'success' });
        }
      } catch (parseError) {
        console.error(`Parse error for ${diseaseName}:`, parseError);
        results.push({ name: diseaseName, status: 'parse_error', error: String(parseError) });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} diseases`,
        results,
        nextBatch: batchStart + batchSize,
        totalDiseases: diseaseList.length,
        remaining: diseaseList.length - (batchStart + batchSize)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-diseases:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
