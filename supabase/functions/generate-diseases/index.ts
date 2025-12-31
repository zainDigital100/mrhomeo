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

      const prompt = `Generate very comprehensive and detailed homeopathic health information for "${diseaseName}". 
      
Write EXTENSIVE content with 7-10 paragraphs for each text field. Be thorough and educational.

Return a JSON object with these exact fields:
{
  "name": "${diseaseName}",
  "slug": "${diseaseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}",
  "summary": "A detailed 4-5 sentence description of the condition, covering what it is, who it affects, and its general impact on health and quality of life.",
  "symptoms": ["symptom1", "symptom2", "symptom3", "symptom4", "symptom5", "symptom6", "symptom7", "symptom8"],
  "category": "One of: Mental Health, Neurological, Skin Conditions, Digestive, Respiratory, Musculoskeletal, Immune System, Cardiovascular, Women's Health, Men's Health, Eye & Ear, Infectious, Metabolic, Urinary",
  "overview": "Write 7-10 detailed paragraphs (each 3-4 sentences) explaining this condition comprehensively. Cover: what the condition is, its medical classification, how common it is, risk factors, age groups affected, how it develops over time, its relationship to other conditions, the body systems involved, prognosis, and general medical understanding. Make this a complete educational article about the condition.",
  "causes": ["Detailed cause 1 with explanation", "Detailed cause 2 with explanation", "Detailed cause 3 with explanation", "Detailed cause 4 with explanation", "Detailed cause 5 with explanation", "Detailed cause 6 with explanation", "Detailed cause 7 with explanation", "Detailed cause 8 with explanation"],
  "early_symptoms": ["Early symptom 1 with detailed description", "Early symptom 2 with detailed description", "Early symptom 3 with detailed description", "Early symptom 4 with detailed description", "Early symptom 5 with detailed description", "Early symptom 6 with detailed description"],
  "advanced_symptoms": ["Advanced symptom 1 with detailed description", "Advanced symptom 2 with detailed description", "Advanced symptom 3 with detailed description", "Advanced symptom 4 with detailed description", "Advanced symptom 5 with detailed description", "Advanced symptom 6 with detailed description"],
  "homeopathic_perspective": "Write 7-10 detailed paragraphs explaining the homeopathic understanding and approach to this condition. Cover: the fundamental homeopathic principles applied, how homeopathy views the root cause vs symptoms, the concept of vital force and its role, individual constitution considerations, miasmatic understanding if relevant, the holistic approach taken, how remedy selection works, expectations for treatment, aggravations and healing responses, and the role of lifestyle in homeopathic treatment.",
  "medicines": [
    {
      "name": "Remedy Name 1",
      "indications": "Write 2-3 detailed paragraphs about when this remedy is indicated, the specific symptom picture, patient constitution type, modalities (what makes it better/worse), mental and emotional symptoms, and characteristic features that distinguish this remedy.",
      "guidance": "Detailed guidance on potency selection, dosing frequency, what to expect, duration of treatment, and signs of improvement."
    },
    {
      "name": "Remedy Name 2",
      "indications": "Write 2-3 detailed paragraphs about when this remedy is indicated, the specific symptom picture, patient constitution type, modalities, mental and emotional symptoms, and characteristic features.",
      "guidance": "Detailed guidance on potency, dosing, expectations, duration, and signs of improvement."
    },
    {
      "name": "Remedy Name 3",
      "indications": "Write 2-3 detailed paragraphs about when this remedy is indicated, the specific symptom picture, patient constitution type, modalities, mental and emotional symptoms, and characteristic features.",
      "guidance": "Detailed guidance on potency, dosing, expectations, duration, and signs of improvement."
    },
    {
      "name": "Remedy Name 4",
      "indications": "Write 2-3 detailed paragraphs about when this remedy is indicated, the specific symptom picture, patient constitution type, modalities, mental and emotional symptoms, and characteristic features.",
      "guidance": "Detailed guidance on potency, dosing, expectations, duration, and signs of improvement."
    },
    {
      "name": "Remedy Name 5",
      "indications": "Write 2-3 detailed paragraphs about when this remedy is indicated, the specific symptom picture, patient constitution type, modalities, mental and emotional symptoms, and characteristic features.",
      "guidance": "Detailed guidance on potency, dosing, expectations, duration, and signs of improvement."
    }
  ],
  "lifestyle_tips": ["Detailed lifestyle tip 1 with explanation of why it helps", "Detailed lifestyle tip 2 with explanation", "Detailed lifestyle tip 3 with explanation", "Detailed lifestyle tip 4 with explanation", "Detailed lifestyle tip 5 with explanation", "Detailed lifestyle tip 6 with explanation", "Detailed lifestyle tip 7 with explanation", "Detailed lifestyle tip 8 with explanation"],
  "when_to_consult": ["Detailed warning sign 1 requiring medical attention", "Detailed warning sign 2", "Detailed warning sign 3", "Detailed warning sign 4", "Detailed warning sign 5", "Detailed warning sign 6"]
}

IMPORTANT: 
- Write extensive, educational content - each overview and homeopathic_perspective should be 7-10 paragraphs long
- Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text
- Make the content suitable for a professional medical education website`;

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
