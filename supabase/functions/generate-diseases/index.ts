import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Complete disease list with pre-defined data for instant generation
const diseaseData = [
  // Seasonal Ailments
  { name: "Common Cold", category: "Seasonal Ailments", symptoms: ["Runny nose", "Sneezing", "Sore throat", "Cough", "Mild fever", "Fatigue", "Headache", "Body aches"], medicines: ["Aconite", "Belladonna", "Arsenicum Album", "Bryonia", "Gelsemium"] },
  { name: "Influenza", category: "Seasonal Ailments", symptoms: ["High fever", "Severe body aches", "Extreme fatigue", "Headache", "Dry cough", "Chills", "Sore throat", "Nasal congestion"], medicines: ["Gelsemium", "Bryonia", "Eupatorium Perfoliatum", "Rhus Tox", "Arsenicum Album"] },
  { name: "Strep Throat", category: "Seasonal Ailments", symptoms: ["Severe sore throat", "Painful swallowing", "Red tonsils", "White patches", "Fever", "Headache", "Swollen lymph nodes", "Body aches"], medicines: ["Belladonna", "Mercurius Solubilis", "Phytolacca", "Hepar Sulph", "Lachesis"] },
  { name: "Sinusitis", category: "Seasonal Ailments", symptoms: ["Facial pain", "Nasal congestion", "Thick discharge", "Headache", "Post-nasal drip", "Reduced smell", "Facial pressure", "Cough"], medicines: ["Kali Bichromicum", "Pulsatilla", "Silicea", "Mercurius", "Hydrastis"] },
  { name: "Gastroenteritis", category: "Seasonal Ailments", symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal cramps", "Fever", "Dehydration", "Loss of appetite", "Fatigue"], medicines: ["Arsenicum Album", "Veratrum Album", "Podophyllum", "Nux Vomica", "Ipecac"] },
  { name: "Food Poisoning", category: "Seasonal Ailments", symptoms: ["Severe nausea", "Violent vomiting", "Watery diarrhea", "Stomach cramps", "Fever", "Weakness", "Dehydration", "Chills"], medicines: ["Arsenicum Album", "Carbo Veg", "Veratrum Album", "China", "Ipecac"] },
  { name: "Conjunctivitis", category: "Seasonal Ailments", symptoms: ["Red eyes", "Itchy eyes", "Watery discharge", "Gritty feeling", "Swollen eyelids", "Light sensitivity", "Crusting", "Burning sensation"], medicines: ["Argentum Nitricum", "Euphrasia", "Pulsatilla", "Belladonna", "Apis Mellifica"] },
  { name: "Ear Infection", category: "Seasonal Ailments", symptoms: ["Ear pain", "Hearing difficulty", "Fluid drainage", "Fever", "Irritability", "Sleep problems", "Balance issues", "Headache"], medicines: ["Belladonna", "Pulsatilla", "Chamomilla", "Hepar Sulph", "Mercurius"] },
  { name: "Bronchitis", category: "Seasonal Ailments", symptoms: ["Persistent cough", "Mucus production", "Chest discomfort", "Fatigue", "Shortness of breath", "Low fever", "Wheezing", "Body aches"], medicines: ["Bryonia", "Phosphorus", "Antimonium Tartaricum", "Ipecac", "Drosera"] },
  { name: "Laryngitis", category: "Seasonal Ailments", symptoms: ["Hoarse voice", "Voice loss", "Throat pain", "Dry cough", "Tickling sensation", "Difficulty speaking", "Sore throat", "Fever"], medicines: ["Phosphorus", "Causticum", "Arum Triphyllum", "Argentum Metallicum", "Spongia"] },
  { name: "Tonsillitis", category: "Seasonal Ailments", symptoms: ["Swollen tonsils", "Severe throat pain", "Difficulty swallowing", "Fever", "White patches", "Bad breath", "Neck stiffness", "Ear pain"], medicines: ["Belladonna", "Mercurius", "Baryta Carb", "Hepar Sulph", "Phytolacca"] },
  { name: "Allergic Rhinitis", category: "Seasonal Ailments", symptoms: ["Sneezing", "Runny nose", "Itchy nose", "Nasal congestion", "Watery eyes", "Itchy eyes", "Postnasal drip", "Fatigue"], medicines: ["Allium Cepa", "Arsenicum Album", "Natrum Mur", "Sabadilla", "Wyethia"] },
  { name: "Urinary Tract Infection", category: "Seasonal Ailments", symptoms: ["Burning urination", "Frequent urination", "Urgency", "Cloudy urine", "Pelvic pain", "Blood in urine", "Strong odor", "Low fever"], medicines: ["Cantharis", "Apis Mellifica", "Berberis Vulgaris", "Staphysagria", "Sarsaparilla"] },
  { name: "Chickenpox", category: "Seasonal Ailments", symptoms: ["Itchy rash", "Blisters", "Fever", "Fatigue", "Loss of appetite", "Headache", "Body aches", "Malaise"], medicines: ["Rhus Tox", "Antimonium Crud", "Pulsatilla", "Sulphur", "Antimonium Tart"] },
  { name: "Acid Reflux", category: "Seasonal Ailments", symptoms: ["Heartburn", "Regurgitation", "Chest pain", "Difficulty swallowing", "Chronic cough", "Hoarseness", "Sour taste", "Bloating"], medicines: ["Nux Vomica", "Robinia", "Carbo Veg", "Natrum Phos", "Phosphorus"] },

  // Regional Diseases
  { name: "Dengue Fever", category: "Regional Diseases", symptoms: ["High fever", "Severe headache", "Pain behind eyes", "Joint pain", "Muscle pain", "Skin rash", "Fatigue", "Bleeding gums"], medicines: ["Eupatorium Perfoliatum", "Gelsemium", "Bryonia", "Rhus Tox", "China"] },
  { name: "Typhoid Fever", category: "Regional Diseases", symptoms: ["Sustained fever", "Weakness", "Abdominal pain", "Headache", "Loss of appetite", "Constipation or diarrhea", "Rose spots", "Enlarged spleen"], medicines: ["Baptisia", "Arsenicum Album", "Bryonia", "Rhus Tox", "Phosphoric Acid"] },
  { name: "Malaria", category: "Regional Diseases", symptoms: ["Cyclic fever", "Chills", "Sweating", "Headache", "Nausea", "Vomiting", "Muscle pain", "Fatigue"], medicines: ["China", "Natrum Mur", "Arsenicum Album", "Eupatorium Perf", "Ipecac"] },
  { name: "Hepatitis A", category: "Regional Diseases", symptoms: ["Fatigue", "Nausea", "Abdominal pain", "Loss of appetite", "Low-grade fever", "Dark urine", "Joint pain", "Jaundice"], medicines: ["Chelidonium", "Carduus Marianus", "Lycopodium", "Phosphorus", "Nux Vomica"] },
  { name: "Hepatitis C", category: "Regional Diseases", symptoms: ["Fatigue", "Fever", "Nausea", "Joint pain", "Abdominal pain", "Dark urine", "Clay-colored stool", "Jaundice"], medicines: ["Chelidonium", "Carduus Marianus", "Phosphorus", "Lycopodium", "China"] },
  { name: "Tuberculosis", category: "Regional Diseases", symptoms: ["Persistent cough", "Coughing blood", "Chest pain", "Weight loss", "Fever", "Night sweats", "Fatigue", "Loss of appetite"], medicines: ["Tuberculinum", "Phosphorus", "Arsenicum Album", "Calcarea Carb", "Silicea"] },
  { name: "Cholera", category: "Regional Diseases", symptoms: ["Profuse watery diarrhea", "Vomiting", "Severe dehydration", "Leg cramps", "Rapid heart rate", "Low blood pressure", "Thirst", "Restlessness"], medicines: ["Veratrum Album", "Camphor", "Cuprum Met", "Arsenicum Album", "Carbo Veg"] },
  { name: "Amoebiasis", category: "Regional Diseases", symptoms: ["Diarrhea", "Abdominal cramps", "Bloody stool", "Fatigue", "Weight loss", "Nausea", "Fever", "Bloating"], medicines: ["Mercurius Corrosivus", "Ipecac", "Aloe Socotrina", "Arsenicum Album", "Nux Vomica"] },
  { name: "Scabies", category: "Regional Diseases", symptoms: ["Intense itching", "Rash", "Thin burrow tracks", "Sores from scratching", "Night itching", "Skin irritation", "Blisters", "Scales"], medicines: ["Sulphur", "Psorinum", "Arsenicum Album", "Sepia", "Causticum"] },
  { name: "Heatstroke", category: "Regional Diseases", symptoms: ["High body temperature", "Confusion", "Hot dry skin", "Rapid pulse", "Headache", "Nausea", "Dizziness", "Loss of consciousness"], medicines: ["Glonoine", "Belladonna", "Natrum Carb", "Gelsemium", "Lachesis"] },

  // Chronic Diseases
  { name: "Hypertension", category: "Chronic Diseases", symptoms: ["Headaches", "Shortness of breath", "Nosebleeds", "Flushing", "Dizziness", "Chest pain", "Vision problems", "Fatigue"], medicines: ["Natrum Mur", "Lachesis", "Glonoine", "Aurum Met", "Baryta Carb"] },
  { name: "Diabetes Mellitus", category: "Chronic Diseases", symptoms: ["Frequent urination", "Excessive thirst", "Unexplained weight loss", "Fatigue", "Blurred vision", "Slow healing", "Frequent infections", "Numbness"], medicines: ["Syzygium Jambolanum", "Uranium Nitricum", "Phosphoric Acid", "Cephalandra Indica", "Gymnema Sylvestre"] },
  { name: "Asthma", category: "Chronic Diseases", symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing", "Difficulty breathing", "Rapid breathing", "Fatigue", "Anxiety"], medicines: ["Arsenicum Album", "Ipecac", "Spongia", "Natrum Sulph", "Sambucus"] },
  { name: "Obesity", category: "Chronic Diseases", symptoms: ["Excess body fat", "Shortness of breath", "Increased sweating", "Snoring", "Joint pain", "Fatigue", "Low self-esteem", "Back pain"], medicines: ["Phytolacca", "Calcarea Carb", "Graphites", "Fucus Vesiculosus", "Antimonium Crud"] },
  { name: "High Cholesterol", category: "Chronic Diseases", symptoms: ["Often asymptomatic", "Fatty deposits", "Chest pain", "Shortness of breath", "Numbness", "Cold extremities", "Fatigue", "Dizziness"], medicines: ["Cholesterinum", "Allium Sativum", "Crataegus", "Baryta Mur", "Aurum Met"] },
  { name: "Osteoarthritis", category: "Chronic Diseases", symptoms: ["Joint pain", "Stiffness", "Swelling", "Reduced flexibility", "Bone spurs", "Grating sensation", "Tenderness", "Loss of motion"], medicines: ["Rhus Tox", "Bryonia", "Calcarea Carb", "Calcarea Fluor", "Causticum"] },
  { name: "Iron Deficiency Anemia", category: "Chronic Diseases", symptoms: ["Fatigue", "Weakness", "Pale skin", "Shortness of breath", "Dizziness", "Cold hands", "Brittle nails", "Headaches"], medicines: ["Ferrum Met", "China", "Natrum Mur", "Calcarea Phos", "Phosphorus"] },
  { name: "Chronic Kidney Disease", category: "Chronic Diseases", symptoms: ["Fatigue", "Swelling", "Decreased urination", "Shortness of breath", "Nausea", "Confusion", "Chest pain", "High blood pressure"], medicines: ["Apis Mellifica", "Arsenicum Album", "Berberis Vulgaris", "Cantharis", "Solidago"] },
  { name: "Fatty Liver Disease", category: "Chronic Diseases", symptoms: ["Fatigue", "Abdominal discomfort", "Enlarged liver", "Weakness", "Weight loss", "Confusion", "Jaundice", "Swelling"], medicines: ["Chelidonium", "Lycopodium", "Carduus Marianus", "Nux Vomica", "Phosphorus"] },
  { name: "Hypothyroidism", category: "Chronic Diseases", symptoms: ["Fatigue", "Weight gain", "Cold intolerance", "Dry skin", "Constipation", "Depression", "Slow heart rate", "Memory problems"], medicines: ["Thyroidinum", "Calcarea Carb", "Graphites", "Sepia", "Lycopodium"] },
  { name: "Migraine", category: "Chronic Diseases", symptoms: ["Severe headache", "Nausea", "Light sensitivity", "Sound sensitivity", "Visual disturbances", "Vomiting", "Throbbing pain", "Dizziness"], medicines: ["Belladonna", "Natrum Mur", "Sanguinaria", "Spigelia", "Iris Versicolor"] },
  { name: "Insomnia", category: "Chronic Diseases", symptoms: ["Difficulty falling asleep", "Waking frequently", "Early waking", "Daytime fatigue", "Irritability", "Poor concentration", "Anxiety", "Headaches"], medicines: ["Coffea Cruda", "Passiflora", "Nux Vomica", "Ignatia", "Kali Phos"] },
  { name: "Sleep Apnea", category: "Chronic Diseases", symptoms: ["Loud snoring", "Breathing pauses", "Gasping during sleep", "Morning headache", "Daytime sleepiness", "Difficulty concentrating", "Mood changes", "Dry mouth"], medicines: ["Lachesis", "Opium", "Grindelia", "Ammonium Carb", "Sambucus"] },
  { name: "Hemorrhoids", category: "Chronic Diseases", symptoms: ["Rectal bleeding", "Itching", "Pain", "Swelling", "Lumps near anus", "Discomfort", "Mucus discharge", "Difficulty sitting"], medicines: ["Aesculus", "Hamamelis", "Nux Vomica", "Sulphur", "Aloe Socotrina"] },
  { name: "Peptic Ulcer", category: "Chronic Diseases", symptoms: ["Burning stomach pain", "Bloating", "Heartburn", "Nausea", "Fatty food intolerance", "Belching", "Loss of appetite", "Weight loss"], medicines: ["Argentum Nitricum", "Nux Vomica", "Kali Bich", "Phosphorus", "Anacardium"] },

  // Skin Conditions
  { name: "Acne Vulgaris", category: "Skin Conditions", symptoms: ["Whiteheads", "Blackheads", "Pimples", "Nodules", "Cysts", "Oily skin", "Scarring", "Inflammation"], medicines: ["Sulphur", "Hepar Sulph", "Kali Bromatum", "Berberis Aquifolium", "Pulsatilla"] },
  { name: "Eczema", category: "Skin Conditions", symptoms: ["Itchy skin", "Red patches", "Dry skin", "Thickened skin", "Scaly patches", "Oozing", "Crusting", "Sensitive skin"], medicines: ["Graphites", "Sulphur", "Petroleum", "Arsenicum Album", "Rhus Tox"] },
  { name: "Psoriasis", category: "Skin Conditions", symptoms: ["Red patches", "Silvery scales", "Dry cracked skin", "Itching", "Burning", "Thickened nails", "Stiff joints", "Soreness"], medicines: ["Arsenicum Album", "Graphites", "Sulphur", "Petroleum", "Sepia"] },
  { name: "Ringworm", category: "Skin Conditions", symptoms: ["Ring-shaped rash", "Itchy skin", "Red scaly patches", "Raised edges", "Clear center", "Spreading rash", "Bald patches", "Brittle nails"], medicines: ["Tellurium", "Sepia", "Sulphur", "Chrysarobinum", "Bacillinum"] },
  { name: "Urticaria", category: "Skin Conditions", symptoms: ["Raised welts", "Intense itching", "Red bumps", "Swelling", "Burning sensation", "Hives", "Skin flushing", "Angioedema"], medicines: ["Apis Mellifica", "Urtica Urens", "Rhus Tox", "Natrum Mur", "Astacus"] },
  { name: "Vitiligo", category: "Skin Conditions", symptoms: ["White patches", "Premature graying", "Loss of color", "Sensitive patches", "Spreading areas", "Symmetrical patterns", "Color loss in mucous membranes", "Eye color changes"], medicines: ["Arsenicum Sulph Flavum", "Syphilinum", "Calcarea Carb", "Sepia", "Phosphorus"] },
  { name: "Warts", category: "Skin Conditions", symptoms: ["Rough growths", "Flesh-colored bumps", "Black dots", "Flat lesions", "Clustered growths", "Cauliflower appearance", "Tender areas", "Spreading warts"], medicines: ["Thuja", "Causticum", "Nitric Acid", "Antimonium Crud", "Dulcamara"] },
  { name: "Rosacea", category: "Skin Conditions", symptoms: ["Facial redness", "Visible blood vessels", "Swollen bumps", "Eye problems", "Enlarged nose", "Flushing", "Burning sensation", "Dry appearance"], medicines: ["Carbo Animalis", "Eugenia Jambos", "Lachesis", "Sanguinaria", "Sulphur"] },
  { name: "Athlete's Foot", category: "Skin Conditions", symptoms: ["Scaly rash", "Itching", "Burning", "Blisters", "Cracking skin", "Peeling", "Discolored nails", "Odor"], medicines: ["Silicea", "Graphites", "Sulphur", "Sepia", "Arsenicum Album"] },
  { name: "Alopecia", category: "Skin Conditions", symptoms: ["Patchy hair loss", "Smooth bald spots", "Broken hairs", "Nail changes", "Widening part", "Thinning hair", "Complete baldness", "Eyebrow loss"], medicines: ["Phosphorus", "Lycopodium", "Fluoricum Acidum", "Graphites", "Arsenicum Album"] },

  // Mental Health
  { name: "Anxiety Disorder", category: "Mental Health", symptoms: ["Excessive worry", "Restlessness", "Fatigue", "Difficulty concentrating", "Irritability", "Muscle tension", "Sleep problems", "Panic attacks"], medicines: ["Aconitum Napellus", "Argentum Nitricum", "Arsenicum Album", "Gelsemium", "Ignatia"] },
  { name: "Clinical Depression", category: "Mental Health", symptoms: ["Persistent sadness", "Loss of interest", "Fatigue", "Sleep changes", "Appetite changes", "Guilt feelings", "Concentration problems", "Suicidal thoughts"], medicines: ["Aurum Metallicum", "Ignatia", "Natrum Mur", "Sepia", "Pulsatilla"] },
  { name: "Panic Disorder", category: "Mental Health", symptoms: ["Sudden intense fear", "Racing heart", "Sweating", "Trembling", "Shortness of breath", "Chest pain", "Nausea", "Dizziness"], medicines: ["Aconitum Napellus", "Argentum Nitricum", "Arsenicum Album", "Gelsemium", "Kali Arsenicosum"] },
  { name: "Bipolar Disorder", category: "Mental Health", symptoms: ["Manic episodes", "Depressive episodes", "Mood swings", "Energy changes", "Sleep changes", "Racing thoughts", "Impulsivity", "Concentration issues"], medicines: ["Aurum Met", "Hyoscyamus", "Stramonium", "Veratrum Album", "Tarentula Hispanica"] },
  { name: "OCD", category: "Mental Health", symptoms: ["Intrusive thoughts", "Compulsive behaviors", "Anxiety", "Repetitive actions", "Fear of contamination", "Need for symmetry", "Unwanted thoughts", "Ritual behaviors"], medicines: ["Arsenicum Album", "Syphilinum", "Thuja", "Natrum Mur", "Carcinosin"] },
  { name: "ADHD", category: "Mental Health", symptoms: ["Inattention", "Hyperactivity", "Impulsivity", "Difficulty focusing", "Forgetfulness", "Restlessness", "Interrupting others", "Poor organization"], medicines: ["Stramonium", "Tuberculinum", "Veratrum Album", "Tarentula Hispanica", "Hyoscyamus"] },

  // Neurological
  { name: "Alzheimer's Disease", category: "Neurological", symptoms: ["Memory loss", "Confusion", "Difficulty with tasks", "Language problems", "Disorientation", "Mood changes", "Personality changes", "Withdrawal"], medicines: ["Alumina", "Baryta Carb", "Anacardium", "Nux Moschata", "Cannabis Indica"] },
  { name: "Parkinson's Disease", category: "Neurological", symptoms: ["Tremor", "Slowed movement", "Rigid muscles", "Impaired posture", "Loss of automatic movements", "Speech changes", "Writing changes", "Balance problems"], medicines: ["Mercurius", "Zincum Met", "Agaricus", "Plumbum Met", "Causticum"] },
  { name: "Epilepsy", category: "Neurological", symptoms: ["Seizures", "Temporary confusion", "Staring spell", "Uncontrollable jerking", "Loss of consciousness", "Fear", "Anxiety", "Deja vu"], medicines: ["Cuprum Met", "Cicuta Virosa", "Bufo Rana", "Oenanthe Crocata", "Artemisia Vulgaris"] },
  { name: "Multiple Sclerosis", category: "Neurological", symptoms: ["Numbness", "Weakness", "Vision problems", "Tingling", "Fatigue", "Dizziness", "Slurred speech", "Cognitive problems"], medicines: ["Phosphorus", "Causticum", "Plumbum Met", "Argentum Nitricum", "Lathyrus"] },
  { name: "Schizophrenia", category: "Mental Health", symptoms: ["Hallucinations", "Delusions", "Disorganized thinking", "Abnormal behavior", "Flat affect", "Social withdrawal", "Cognitive difficulties", "Lack of motivation"], medicines: ["Hyoscyamus", "Stramonium", "Lachesis", "Anacardium", "Cannabis Indica"] },
  { name: "PTSD", category: "Mental Health", symptoms: ["Flashbacks", "Nightmares", "Severe anxiety", "Uncontrollable thoughts", "Avoidance", "Emotional numbness", "Irritability", "Guilt"], medicines: ["Aconitum Napellus", "Ignatia", "Staphysagria", "Natrum Mur", "Opium"] },
  { name: "Dementia", category: "Neurological", symptoms: ["Memory loss", "Communication problems", "Difficulty with complex tasks", "Disorientation", "Personality changes", "Paranoia", "Agitation", "Hallucinations"], medicines: ["Baryta Carb", "Alumina", "Anacardium", "Cannabis Indica", "Phosphorus"] },
  { name: "Autism Spectrum Disorder", category: "Neurological", symptoms: ["Social difficulties", "Communication challenges", "Repetitive behaviors", "Restricted interests", "Sensory sensitivities", "Routine preference", "Limited eye contact", "Delayed speech"], medicines: ["Carcinosin", "Baryta Carb", "Natrum Mur", "Stramonium", "Thuja"] },
  { name: "Bell's Palsy", category: "Neurological", symptoms: ["Facial weakness", "Drooping face", "Drooling", "Eye problems", "Taste changes", "Headache", "Sound sensitivity", "Jaw pain"], medicines: ["Causticum", "Aconitum Napellus", "Hypericum", "Gelsemium", "Belladonna"] },

  // Digestive
  { name: "Irritable Bowel Syndrome", category: "Digestive", symptoms: ["Abdominal pain", "Bloating", "Gas", "Diarrhea", "Constipation", "Cramping", "Mucus in stool", "Food intolerance"], medicines: ["Nux Vomica", "Lycopodium", "Colocynthis", "Argentum Nitricum", "Sulphur"] },
  { name: "Celiac Disease", category: "Digestive", symptoms: ["Diarrhea", "Bloating", "Weight loss", "Fatigue", "Anemia", "Bone loss", "Skin rash", "Mouth ulcers"], medicines: ["China", "Lycopodium", "Natrum Mur", "Calcarea Carb", "Arsenicum Album"] },
  { name: "Lactose Intolerance", category: "Digestive", symptoms: ["Bloating", "Diarrhea", "Gas", "Nausea", "Stomach cramps", "Rumbling sounds", "Urgency", "Vomiting"], medicines: ["Aethusa", "Magnesia Muriatica", "Calcarea Carb", "Natrum Carb", "China"] },
  { name: "Gallstones", category: "Digestive", symptoms: ["Sudden intense pain", "Back pain", "Right shoulder pain", "Nausea", "Vomiting", "Jaundice", "Fever", "Clay-colored stools"], medicines: ["Chelidonium", "Calcarea Carb", "Lycopodium", "Berberis Vulgaris", "Cholesterinum"] },
  { name: "Appendicitis", category: "Digestive", symptoms: ["Sudden pain", "Pain migration", "Nausea", "Vomiting", "Loss of appetite", "Low fever", "Constipation", "Abdominal swelling"], medicines: ["Belladonna", "Bryonia", "Rhus Tox", "Lachesis", "Mercurius"] },
  { name: "Chronic Constipation", category: "Digestive", symptoms: ["Infrequent stools", "Hard stools", "Straining", "Feeling of blockage", "Incomplete evacuation", "Abdominal discomfort", "Bloating", "Loss of appetite"], medicines: ["Nux Vomica", "Bryonia", "Alumina", "Opium", "Silicea"] },
  { name: "Crohn's Disease", category: "Digestive", symptoms: ["Diarrhea", "Fever", "Fatigue", "Abdominal pain", "Blood in stool", "Mouth sores", "Reduced appetite", "Weight loss"], medicines: ["Arsenicum Album", "Phosphorus", "Mercurius Corrosivus", "Nitricum Acidum", "Podophyllum"] },
  { name: "Ulcerative Colitis", category: "Digestive", symptoms: ["Diarrhea with blood", "Abdominal pain", "Rectal pain", "Urgency", "Weight loss", "Fatigue", "Fever", "Failure to grow"], medicines: ["Mercurius Corrosivus", "Phosphorus", "Aloe Socotrina", "Nitricum Acidum", "Arsenicum Album"] },
  { name: "Pancreatitis", category: "Digestive", symptoms: ["Upper abdominal pain", "Pain radiating to back", "Nausea", "Vomiting", "Tenderness", "Fever", "Rapid pulse", "Oily stools"], medicines: ["Iris Versicolor", "Phosphorus", "Conium", "Belladonna", "Arsenicum Album"] },
  { name: "Cirrhosis", category: "Digestive", symptoms: ["Fatigue", "Easy bruising", "Appetite loss", "Nausea", "Swelling in legs", "Weight loss", "Itchy skin", "Jaundice"], medicines: ["Chelidonium", "Lycopodium", "Carduus Marianus", "Phosphorus", "Arsenicum Album"] },

  // Oncology
  { name: "Breast Cancer", category: "Oncology", symptoms: ["Breast lump", "Nipple discharge", "Skin changes", "Nipple changes", "Breast pain", "Swollen lymph nodes", "Redness", "Dimpling"], medicines: ["Conium", "Phytolacca", "Carcinosin", "Asterias Rubens", "Hydrastis"] },
  { name: "Lung Cancer", category: "Oncology", symptoms: ["Persistent cough", "Coughing blood", "Shortness of breath", "Chest pain", "Hoarseness", "Weight loss", "Bone pain", "Headache"], medicines: ["Phosphorus", "Arsenicum Album", "Carcinosin", "Acalypha Indica", "Carbo Animalis"] },
  { name: "Prostate Cancer", category: "Oncology", symptoms: ["Urinary problems", "Decreased urine force", "Blood in urine", "Blood in semen", "Bone pain", "Erectile dysfunction", "Weight loss", "Leg weakness"], medicines: ["Conium", "Sabal Serrulata", "Thuja", "Carcinosin", "Chimaphila"] },
  { name: "Leukemia", category: "Oncology", symptoms: ["Fatigue", "Weakness", "Fever", "Easy bruising", "Frequent infections", "Weight loss", "Swollen lymph nodes", "Bone pain"], medicines: ["Arsenicum Album", "Phosphorus", "Carcinosin", "Natrum Mur", "Calcarea Carb"] },
  { name: "Colorectal Cancer", category: "Oncology", symptoms: ["Bowel changes", "Rectal bleeding", "Persistent discomfort", "Weakness", "Weight loss", "Feeling of incomplete evacuation", "Abdominal pain", "Iron deficiency"], medicines: ["Nitricum Acidum", "Alumen", "Hydrastis", "Carcinosin", "Arsenicum Album"] },
  { name: "Oral Cancer", category: "Oncology", symptoms: ["Mouth sores", "Mouth lump", "Mouth pain", "Difficulty chewing", "Difficulty swallowing", "Speech problems", "Loose teeth", "Jaw stiffness"], medicines: ["Nitricum Acidum", "Mercurius", "Arsenicum Album", "Hydrastis", "Kali Cyanatum"] },
  { name: "Lymphoma", category: "Oncology", symptoms: ["Swollen lymph nodes", "Fatigue", "Fever", "Night sweats", "Weight loss", "Itching", "Shortness of breath", "Coughing"], medicines: ["Arsenicum Album", "Carcinosin", "Baryta Carb", "Conium", "Iodum"] },
  { name: "Melanoma", category: "Oncology", symptoms: ["New mole", "Changing mole", "Irregular borders", "Color changes", "Diameter increase", "Evolving appearance", "Itching", "Bleeding mole"], medicines: ["Arsenicum Album", "Carcinosin", "Phosphorus", "Nitricum Acidum", "Cadmium Sulph"] },
  { name: "Ovarian Cancer", category: "Oncology", symptoms: ["Abdominal bloating", "Pelvic pain", "Eating difficulty", "Urinary urgency", "Fatigue", "Back pain", "Constipation", "Menstrual changes"], medicines: ["Apis Mellifica", "Arsenicum Album", "Carcinosin", "Conium", "Thuja"] },
  { name: "Bladder Cancer", category: "Oncology", symptoms: ["Blood in urine", "Frequent urination", "Painful urination", "Back pain", "Pelvic pain", "Unintended weight loss", "Swelling in feet", "Bone pain"], medicines: ["Cantharis", "Terebinthina", "Nitricum Acidum", "Arsenicum Album", "Carcinosin"] },

  // Musculoskeletal
  { name: "Rheumatoid Arthritis", category: "Musculoskeletal", symptoms: ["Joint tenderness", "Joint swelling", "Joint stiffness", "Fatigue", "Fever", "Weight loss", "Rheumatoid nodules", "Symmetrical involvement"], medicines: ["Rhus Tox", "Bryonia", "Causticum", "Actaea Spicata", "Calcarea Carb"] },
  { name: "Osteoporosis", category: "Musculoskeletal", symptoms: ["Back pain", "Loss of height", "Stooped posture", "Bone fractures", "Weak grip", "Brittle nails", "Receding gums", "Leg cramps"], medicines: ["Calcarea Carb", "Calcarea Phos", "Silicea", "Symphytum", "Phosphorus"] },
  { name: "Gout", category: "Musculoskeletal", symptoms: ["Intense joint pain", "Lingering discomfort", "Inflammation", "Redness", "Limited motion", "Swelling", "Warmth", "Tenderness"], medicines: ["Colchicum", "Ledum Pal", "Urtica Urens", "Benzoicum Acidum", "Berberis Vulgaris"] },
  { name: "Lupus", category: "Musculoskeletal", symptoms: ["Fatigue", "Joint pain", "Skin rashes", "Fever", "Photosensitivity", "Butterfly rash", "Raynaud's phenomenon", "Kidney problems"], medicines: ["Apis Mellifica", "Arsenicum Album", "Rhus Tox", "Phosphorus", "Sepia"] },
  { name: "Scoliosis", category: "Musculoskeletal", symptoms: ["Uneven shoulders", "Uneven waist", "One hip higher", "Rotating spine", "Back pain", "Fatigue", "Breathing difficulty", "Uneven ribs"], medicines: ["Calcarea Carb", "Phosphorus", "Silicea", "Calcarea Phos", "Symphytum"] },
  { name: "Herniated Disc", category: "Musculoskeletal", symptoms: ["Arm or leg pain", "Numbness", "Tingling", "Weakness", "Back pain", "Neck pain", "Muscle spasms", "Stiffness"], medicines: ["Rhus Tox", "Bryonia", "Hypericum", "Colocynthis", "Kali Carb"] },
  { name: "Fibromyalgia", category: "Musculoskeletal", symptoms: ["Widespread pain", "Fatigue", "Cognitive difficulties", "Sleep problems", "Headaches", "Depression", "Anxiety", "Digestive issues"], medicines: ["Rhus Tox", "Arnica", "Bryonia", "Kali Phos", "Magnesia Phos"] },
  { name: "Carpal Tunnel Syndrome", category: "Musculoskeletal", symptoms: ["Numbness", "Tingling", "Weakness", "Hand pain", "Shock-like sensations", "Dropping things", "Night symptoms", "Forearm discomfort"], medicines: ["Causticum", "Ruta", "Hypericum", "Arnica", "Rhus Tox"] },
  { name: "Sciatica", category: "Musculoskeletal", symptoms: ["Lower back pain", "Hip pain", "Burning sensation", "Leg pain", "Tingling", "Numbness", "Muscle weakness", "Difficulty moving"], medicines: ["Colocynthis", "Magnesia Phosphorica", "Rhus Tox", "Gnaphalium", "Hypericum"] },
  { name: "Muscular Dystrophy", category: "Musculoskeletal", symptoms: ["Progressive weakness", "Difficulty walking", "Frequent falls", "Trouble rising", "Learning disabilities", "Breathing problems", "Heart problems", "Scoliosis"], medicines: ["Plumbum Met", "Causticum", "Gelsemium", "Phosphorus", "Arnica"] },

  // Cardiovascular & Respiratory
  { name: "Coronary Artery Disease", category: "Cardiovascular", symptoms: ["Chest pain", "Shortness of breath", "Heart attack", "Fatigue", "Heart palpitations", "Weakness", "Dizziness", "Nausea"], medicines: ["Crataegus", "Cactus Grandiflorus", "Digitalis", "Arnica", "Aurum Met"] },
  { name: "Congestive Heart Failure", category: "Cardiovascular", symptoms: ["Shortness of breath", "Fatigue", "Swollen legs", "Rapid heartbeat", "Reduced exercise capacity", "Persistent cough", "Swelling in abdomen", "Weight gain"], medicines: ["Crataegus", "Digitalis", "Strophanthus", "Laurocerasus", "Arsenicum Album"] },
  { name: "Stroke", category: "Cardiovascular", symptoms: ["Trouble speaking", "Paralysis", "Vision problems", "Headache", "Trouble walking", "Confusion", "Numbness", "Dizziness"], medicines: ["Arnica", "Lachesis", "Opium", "Baryta Carb", "Gelsemium"] },
  { name: "Aneurysm", category: "Cardiovascular", symptoms: ["Often asymptomatic", "Pulsating feeling", "Back pain", "Deep constant pain", "Sudden severe headache", "Nausea", "Stiff neck", "Vision problems"], medicines: ["Carbo Veg", "Lachesis", "Baryta Carb", "Arnica", "Lycopus"] },
  { name: "Pneumonia", category: "Respiratory", symptoms: ["Chest pain", "Confusion", "Cough with phlegm", "Fatigue", "Fever", "Sweating", "Shortness of breath", "Nausea"], medicines: ["Phosphorus", "Bryonia", "Antimonium Tart", "Arsenicum Album", "Sulphur"] }
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

    const { batchStart = 0, batchSize = 5 } = await req.json();
    
    const diseasesToGenerate = diseaseData.slice(batchStart, batchStart + batchSize);
    
    if (diseasesToGenerate.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'All diseases have been generated', 
          total: diseaseData.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating diseases ${batchStart} to ${batchStart + diseasesToGenerate.length}`);

    // Generate all diseases in parallel for speed
    const generatePromises = diseasesToGenerate.map(async (disease) => {
      const slug = disease.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Check if already exists
      const { data: existing } = await supabase
        .from('diseases')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existing) {
        console.log(`Disease ${disease.name} already exists, skipping`);
        return { name: disease.name, status: 'skipped' };
      }

      const prompt = `Generate comprehensive homeopathic content for "${disease.name}" (${disease.category}).

Known symptoms: ${disease.symptoms.join(', ')}
Key homeopathic medicines: ${disease.medicines.join(', ')}

Return JSON with:
{
  "summary": "3-4 sentence overview of the condition",
  "overview": "7-10 paragraphs explaining the condition comprehensively - what it is, risk factors, how it develops, who it affects, prognosis",
  "causes": ["8 detailed causes with explanations"],
  "early_symptoms": ["6 early warning signs with descriptions"],
  "advanced_symptoms": ["6 advanced symptoms with descriptions"],
  "homeopathic_perspective": "7-10 paragraphs on homeopathic understanding - principles applied, constitutional considerations, remedy selection, treatment approach",
  "medicines": [
    {"name": "${disease.medicines[0]}", "indications": "2-3 paragraphs on when indicated, symptom picture, modalities", "guidance": "Potency and dosing guidance"},
    {"name": "${disease.medicines[1]}", "indications": "2-3 paragraphs", "guidance": "Potency and dosing"},
    {"name": "${disease.medicines[2]}", "indications": "2-3 paragraphs", "guidance": "Potency and dosing"},
    {"name": "${disease.medicines[3]}", "indications": "2-3 paragraphs", "guidance": "Potency and dosing"},
    {"name": "${disease.medicines[4]}", "indications": "2-3 paragraphs", "guidance": "Potency and dosing"}
  ],
  "lifestyle_tips": ["8 detailed lifestyle recommendations"],
  "when_to_consult": ["6 warning signs requiring medical attention"]
}

Return ONLY valid JSON, no markdown.`;

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
              { role: 'system', content: 'You are a medical content writer. Return only valid JSON.' },
              { role: 'user', content: prompt }
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI error for ${disease.name}:`, response.status, errorText);
          return { name: disease.name, status: 'error', error: errorText };
        }

        const data = await response.json();
        let content = data.choices[0].message.content;
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const generated = JSON.parse(content);
        
        const { error: insertError } = await supabase
          .from('diseases')
          .insert({
            slug,
            name: disease.name,
            summary: generated.summary,
            symptoms: disease.symptoms,
            category: disease.category,
            overview: generated.overview,
            causes: generated.causes,
            early_symptoms: generated.early_symptoms,
            advanced_symptoms: generated.advanced_symptoms,
            homeopathic_perspective: generated.homeopathic_perspective,
            medicines: generated.medicines,
            lifestyle_tips: generated.lifestyle_tips,
            when_to_consult: generated.when_to_consult
          });

        if (insertError) {
          console.error(`Insert error for ${disease.name}:`, insertError);
          return { name: disease.name, status: 'insert_error', error: insertError.message };
        }
        
        console.log(`Generated ${disease.name}`);
        return { name: disease.name, status: 'success' };
      } catch (parseError) {
        console.error(`Parse error for ${disease.name}:`, parseError);
        return { name: disease.name, status: 'parse_error', error: String(parseError) };
      }
    });

    const results = await Promise.all(generatePromises);

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} diseases`,
        results,
        nextBatch: batchStart + batchSize,
        totalDiseases: diseaseData.length,
        remaining: diseaseData.length - (batchStart + batchSize)
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
