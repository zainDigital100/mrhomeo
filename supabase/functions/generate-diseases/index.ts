import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Complete disease list with pre-defined data - exactly 100 conditions
const diseaseData = [
  // Infectious Diseases (1-17)
  { name: "Common Cold", category: "Infectious Diseases", symptoms: ["Runny nose", "Sneezing", "Sore throat", "Cough", "Mild fever", "Fatigue", "Headache", "Body aches"], medicines: ["Aconite", "Belladonna", "Arsenicum Album", "Bryonia", "Gelsemium"] },
  { name: "Influenza (The Flu)", category: "Infectious Diseases", symptoms: ["High fever", "Severe body aches", "Extreme fatigue", "Headache", "Dry cough", "Chills", "Sore throat", "Nasal congestion"], medicines: ["Gelsemium", "Bryonia", "Eupatorium Perfoliatum", "Rhus Tox", "Arsenicum Album"] },
  { name: "COVID-19", category: "Infectious Diseases", symptoms: ["Fever", "Dry cough", "Fatigue", "Loss of taste", "Loss of smell", "Shortness of breath", "Body aches", "Headache"], medicines: ["Arsenicum Album", "Bryonia", "Gelsemium", "Camphora", "Phosphorus"] },
  { name: "Strep Throat", category: "Infectious Diseases", symptoms: ["Severe sore throat", "Painful swallowing", "Red tonsils", "White patches", "Fever", "Headache", "Swollen lymph nodes", "Body aches"], medicines: ["Belladonna", "Mercurius Solubilis", "Phytolacca", "Hepar Sulph", "Lachesis"] },
  { name: "Sinusitis", category: "Infectious Diseases", symptoms: ["Facial pain", "Nasal congestion", "Thick discharge", "Headache", "Post-nasal drip", "Reduced smell", "Facial pressure", "Cough"], medicines: ["Kali Bichromicum", "Pulsatilla", "Silicea", "Mercurius", "Hydrastis"] },
  { name: "Pneumonia", category: "Infectious Diseases", symptoms: ["High fever", "Cough with phlegm", "Chest pain", "Shortness of breath", "Fatigue", "Chills", "Nausea", "Confusion"], medicines: ["Phosphorus", "Bryonia", "Antimonium Tartaricum", "Arsenicum Album", "Sulphur"] },
  { name: "Bronchitis", category: "Infectious Diseases", symptoms: ["Persistent cough", "Mucus production", "Chest discomfort", "Fatigue", "Shortness of breath", "Low fever", "Wheezing", "Body aches"], medicines: ["Bryonia", "Phosphorus", "Antimonium Tartaricum", "Ipecac", "Drosera"] },
  { name: "Tuberculosis (TB)", category: "Infectious Diseases", symptoms: ["Persistent cough", "Coughing blood", "Chest pain", "Weight loss", "Fever", "Night sweats", "Fatigue", "Loss of appetite"], medicines: ["Tuberculinum", "Phosphorus", "Arsenicum Album", "Calcarea Carb", "Silicea"] },
  { name: "Malaria", category: "Infectious Diseases", symptoms: ["Cyclic fever", "Chills", "Sweating", "Headache", "Nausea", "Vomiting", "Muscle pain", "Fatigue"], medicines: ["China", "Natrum Mur", "Arsenicum Album", "Eupatorium Perf", "Ipecac"] },
  { name: "Dengue Fever", category: "Infectious Diseases", symptoms: ["High fever", "Severe headache", "Pain behind eyes", "Joint pain", "Muscle pain", "Skin rash", "Fatigue", "Bleeding gums"], medicines: ["Eupatorium Perfoliatum", "Gelsemium", "Bryonia", "Rhus Tox", "China"] },
  { name: "Typhoid Fever", category: "Infectious Diseases", symptoms: ["Sustained fever", "Weakness", "Abdominal pain", "Headache", "Loss of appetite", "Constipation or diarrhea", "Rose spots", "Enlarged spleen"], medicines: ["Baptisia", "Arsenicum Album", "Bryonia", "Rhus Tox", "Phosphoric Acid"] },
  { name: "Cholera", category: "Infectious Diseases", symptoms: ["Profuse watery diarrhea", "Vomiting", "Severe dehydration", "Leg cramps", "Rapid heart rate", "Low blood pressure", "Thirst", "Restlessness"], medicines: ["Veratrum Album", "Camphor", "Cuprum Met", "Arsenicum Album", "Carbo Veg"] },
  { name: "Hepatitis A", category: "Infectious Diseases", symptoms: ["Fatigue", "Nausea", "Abdominal pain", "Loss of appetite", "Low-grade fever", "Dark urine", "Joint pain", "Jaundice"], medicines: ["Chelidonium", "Carduus Marianus", "Lycopodium", "Phosphorus", "Nux Vomica"] },
  { name: "Hepatitis B", category: "Infectious Diseases", symptoms: ["Fatigue", "Abdominal pain", "Dark urine", "Joint pain", "Fever", "Nausea", "Vomiting", "Jaundice"], medicines: ["Chelidonium", "Lycopodium", "Phosphorus", "China", "Arsenicum Album"] },
  { name: "Hepatitis C", category: "Infectious Diseases", symptoms: ["Fatigue", "Fever", "Nausea", "Joint pain", "Abdominal pain", "Dark urine", "Clay-colored stool", "Jaundice"], medicines: ["Chelidonium", "Carduus Marianus", "Phosphorus", "Lycopodium", "China"] },
  { name: "HIV/AIDS", category: "Infectious Diseases", symptoms: ["Rapid weight loss", "Recurring fever", "Night sweats", "Extreme fatigue", "Swollen lymph nodes", "Diarrhea", "Mouth sores", "Pneumonia"], medicines: ["Arsenicum Album", "Carcinosin", "Thuja", "Natrum Mur", "Phosphorus"] },
  { name: "Asthma", category: "Respiratory Diseases", symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing", "Difficulty breathing", "Rapid breathing", "Fatigue", "Anxiety"], medicines: ["Arsenicum Album", "Ipecac", "Spongia", "Natrum Sulph", "Sambucus"] },

  // Metabolic & Chronic Diseases (18-24)
  { name: "Diabetes Mellitus (Type 2)", category: "Metabolic Diseases", symptoms: ["Frequent urination", "Excessive thirst", "Unexplained weight loss", "Fatigue", "Blurred vision", "Slow healing", "Frequent infections", "Numbness"], medicines: ["Syzygium Jambolanum", "Uranium Nitricum", "Phosphoric Acid", "Cephalandra Indica", "Gymnema Sylvestre"] },
  { name: "Hypertension (High Blood Pressure)", category: "Cardiovascular Diseases", symptoms: ["Headaches", "Shortness of breath", "Nosebleeds", "Flushing", "Dizziness", "Chest pain", "Vision problems", "Fatigue"], medicines: ["Natrum Mur", "Lachesis", "Glonoine", "Aurum Met", "Baryta Carb"] },
  { name: "Obesity", category: "Metabolic Diseases", symptoms: ["Excess body fat", "Shortness of breath", "Increased sweating", "Snoring", "Joint pain", "Fatigue", "Low self-esteem", "Back pain"], medicines: ["Phytolacca", "Calcarea Carb", "Graphites", "Fucus Vesiculosus", "Antimonium Crud"] },
  { name: "Migraine", category: "Neurological Diseases", symptoms: ["Severe headache", "Nausea", "Light sensitivity", "Sound sensitivity", "Visual disturbances", "Vomiting", "Throbbing pain", "Dizziness"], medicines: ["Belladonna", "Natrum Mur", "Sanguinaria", "Spigelia", "Iris Versicolor"] },
  { name: "Epilepsy", category: "Neurological Diseases", symptoms: ["Seizures", "Temporary confusion", "Staring spells", "Uncontrollable jerking", "Loss of consciousness", "Fear", "Anxiety", "Déjà vu"], medicines: ["Cuprum Met", "Cicuta", "Bufo Rana", "Oenanthe", "Artemisia Vulgaris"] },
  { name: "Alzheimer's Disease", category: "Neurological Diseases", symptoms: ["Memory loss", "Difficulty thinking", "Confusion", "Personality changes", "Depression", "Social withdrawal", "Mood swings", "Difficulty with tasks"], medicines: ["Baryta Carb", "Alumina", "Anacardium", "Kali Phos", "Lycopodium"] },
  { name: "Parkinson's Disease", category: "Neurological Diseases", symptoms: ["Tremor", "Slowed movement", "Rigid muscles", "Impaired posture", "Loss of automatic movements", "Speech changes", "Writing changes", "Balance problems"], medicines: ["Mercurius", "Zincum Met", "Agaricus", "Rhus Tox", "Plumbum Met"] },

  // Neurological & Mental Health (25-33)
  { name: "Multiple Sclerosis", category: "Neurological Diseases", symptoms: ["Numbness", "Tingling", "Weakness", "Vision problems", "Fatigue", "Dizziness", "Slurred speech", "Bladder issues"], medicines: ["Phosphorus", "Plumbum Met", "Causticum", "Nux Vomica", "Gelsemium"] },
  { name: "Clinical Depression", category: "Mental Health", symptoms: ["Persistent sadness", "Loss of interest", "Fatigue", "Sleep problems", "Appetite changes", "Guilt feelings", "Difficulty concentrating", "Thoughts of death"], medicines: ["Ignatia", "Natrum Mur", "Aurum Met", "Sepia", "Arsenicum Album"] },
  { name: "Generalized Anxiety Disorder", category: "Mental Health", symptoms: ["Excessive worry", "Restlessness", "Fatigue", "Difficulty concentrating", "Irritability", "Muscle tension", "Sleep problems", "Sweating"], medicines: ["Argentum Nitricum", "Aconite", "Arsenicum Album", "Gelsemium", "Phosphorus"] },
  { name: "Bipolar Disorder", category: "Mental Health", symptoms: ["Manic episodes", "Depressive episodes", "Mood swings", "Increased energy", "Reduced sleep need", "Racing thoughts", "Impulsivity", "Irritability"], medicines: ["Aurum Met", "Ignatia", "Hyoscyamus", "Stramonium", "Belladonna"] },
  { name: "Schizophrenia", category: "Mental Health", symptoms: ["Hallucinations", "Delusions", "Disorganized thinking", "Abnormal motor behavior", "Reduced emotions", "Social withdrawal", "Cognitive difficulties", "Paranoia"], medicines: ["Hyoscyamus", "Stramonium", "Lachesis", "Veratrum Album", "Cannabis Indica"] },
  { name: "Autism Spectrum Disorder", category: "Mental Health", symptoms: ["Social difficulties", "Communication challenges", "Repetitive behaviors", "Restricted interests", "Sensory sensitivities", "Routine dependence", "Delayed speech", "Eye contact avoidance"], medicines: ["Carcinosin", "Baryta Carb", "Natrum Mur", "Tuberculinum", "Thuja"] },
  { name: "ADHD", category: "Mental Health", symptoms: ["Inattention", "Hyperactivity", "Impulsivity", "Difficulty focusing", "Forgetfulness", "Fidgeting", "Interrupting others", "Restlessness"], medicines: ["Stramonium", "Tuberculinum", "Tarentula Hispanica", "Veratrum Album", "Hyoscyamus"] },
  { name: "Insomnia", category: "Mental Health", symptoms: ["Difficulty falling asleep", "Waking frequently", "Early waking", "Daytime fatigue", "Irritability", "Poor concentration", "Anxiety", "Headaches"], medicines: ["Coffea Cruda", "Passiflora", "Nux Vomica", "Ignatia", "Kali Phos"] },
  { name: "Sleep Apnea", category: "Sleep Disorders", symptoms: ["Loud snoring", "Breathing pauses", "Gasping during sleep", "Morning headache", "Daytime sleepiness", "Difficulty concentrating", "Mood changes", "Dry mouth"], medicines: ["Lachesis", "Opium", "Grindelia", "Ammonium Carb", "Sambucus"] },

  // Musculoskeletal Diseases (34-38)
  { name: "Osteoarthritis", category: "Musculoskeletal Diseases", symptoms: ["Joint pain", "Stiffness", "Swelling", "Reduced flexibility", "Bone spurs", "Grating sensation", "Tenderness", "Loss of motion"], medicines: ["Rhus Tox", "Bryonia", "Calcarea Carb", "Calcarea Fluor", "Causticum"] },
  { name: "Rheumatoid Arthritis", category: "Musculoskeletal Diseases", symptoms: ["Joint swelling", "Joint tenderness", "Morning stiffness", "Fatigue", "Fever", "Weight loss", "Nodules under skin", "Symmetrical joint involvement"], medicines: ["Rhus Tox", "Bryonia", "Actaea Spicata", "Causticum", "Calcarea Carb"] },
  { name: "Osteoporosis", category: "Musculoskeletal Diseases", symptoms: ["Back pain", "Loss of height", "Stooped posture", "Bone fractures", "Brittle bones", "Receding gums", "Weak grip strength", "Brittle nails"], medicines: ["Calcarea Carb", "Calcarea Phos", "Symphytum", "Silicea", "Phosphorus"] },
  { name: "Gout", category: "Musculoskeletal Diseases", symptoms: ["Intense joint pain", "Swelling", "Redness", "Warmth", "Limited motion", "Tophi formation", "Fever", "Night attacks"], medicines: ["Colchicum", "Benzoic Acid", "Ledum Pal", "Urtica Urens", "Lycopodium"] },
  { name: "Lupus (Systemic Lupus Erythematosus)", category: "Autoimmune Diseases", symptoms: ["Butterfly rash", "Fatigue", "Joint pain", "Fever", "Skin lesions", "Photosensitivity", "Kidney problems", "Hair loss"], medicines: ["Arsenicum Album", "Natrum Mur", "Phosphorus", "Sepia", "Sulphur"] },

  // Skin Diseases (39-45)
  { name: "Psoriasis", category: "Skin Diseases", symptoms: ["Red patches", "Silvery scales", "Dry cracked skin", "Itching", "Burning", "Thickened nails", "Stiff joints", "Soreness"], medicines: ["Arsenicum Album", "Graphites", "Sulphur", "Petroleum", "Sepia"] },
  { name: "Eczema (Atopic Dermatitis)", category: "Skin Diseases", symptoms: ["Itchy skin", "Red patches", "Dry skin", "Thickened skin", "Scaly patches", "Oozing", "Crusting", "Sensitive skin"], medicines: ["Graphites", "Sulphur", "Petroleum", "Arsenicum Album", "Rhus Tox"] },
  { name: "Acne Vulgaris", category: "Skin Diseases", symptoms: ["Whiteheads", "Blackheads", "Pimples", "Nodules", "Cysts", "Oily skin", "Scarring", "Inflammation"], medicines: ["Sulphur", "Hepar Sulph", "Kali Bromatum", "Berberis Aquifolium", "Pulsatilla"] },
  { name: "Vitiligo", category: "Skin Diseases", symptoms: ["White patches", "Premature graying", "Loss of color", "Sensitive patches", "Spreading areas", "Symmetrical patterns", "Color loss in mucous membranes", "Eye color changes"], medicines: ["Arsenicum Sulph Flavum", "Syphilinum", "Calcarea Carb", "Sepia", "Phosphorus"] },
  { name: "Scabies", category: "Skin Diseases", symptoms: ["Intense itching", "Rash", "Thin burrow tracks", "Sores from scratching", "Night itching", "Skin irritation", "Blisters", "Scales"], medicines: ["Sulphur", "Psorinum", "Arsenicum Album", "Sepia", "Causticum"] },
  { name: "Ringworm (Tinea Corporis)", category: "Skin Diseases", symptoms: ["Ring-shaped rash", "Itchy skin", "Red scaly patches", "Raised edges", "Clear center", "Spreading rash", "Bald patches", "Brittle nails"], medicines: ["Tellurium", "Sepia", "Sulphur", "Chrysarobinum", "Bacillinum"] },
  { name: "Athlete's Foot", category: "Skin Diseases", symptoms: ["Scaly rash", "Itching", "Stinging", "Burning", "Blisters", "Cracking skin", "Raw skin", "Discoloration"], medicines: ["Silicea", "Graphites", "Sulphur", "Thuja", "Sepia"] },

  // Gastrointestinal Diseases (46-60)
  { name: "Gastroesophageal Reflux Disease (GERD)", category: "Gastrointestinal Diseases", symptoms: ["Heartburn", "Regurgitation", "Chest pain", "Difficulty swallowing", "Chronic cough", "Hoarseness", "Sour taste", "Bloating"], medicines: ["Nux Vomica", "Robinia", "Carbo Veg", "Natrum Phos", "Phosphorus"] },
  { name: "Peptic Ulcer Disease", category: "Gastrointestinal Diseases", symptoms: ["Burning stomach pain", "Bloating", "Heartburn", "Nausea", "Fatty food intolerance", "Belching", "Loss of appetite", "Weight loss"], medicines: ["Argentum Nitricum", "Nux Vomica", "Kali Bich", "Phosphorus", "Anacardium"] },
  { name: "Irritable Bowel Syndrome (IBS)", category: "Gastrointestinal Diseases", symptoms: ["Abdominal pain", "Bloating", "Gas", "Diarrhea", "Constipation", "Cramping", "Mucus in stool", "Food intolerance"], medicines: ["Nux Vomica", "Lycopodium", "Argentum Nitricum", "Carbo Veg", "Asafoetida"] },
  { name: "Crohn's Disease", category: "Gastrointestinal Diseases", symptoms: ["Diarrhea", "Abdominal pain", "Blood in stool", "Weight loss", "Fatigue", "Fever", "Mouth sores", "Reduced appetite"], medicines: ["Arsenicum Album", "Phosphorus", "Mercurius Corrosivus", "Podophyllum", "Aloe"] },
  { name: "Ulcerative Colitis", category: "Gastrointestinal Diseases", symptoms: ["Bloody diarrhea", "Abdominal pain", "Urgency", "Weight loss", "Fatigue", "Fever", "Rectal pain", "Anemia"], medicines: ["Mercurius Corrosivus", "Aloe Socotrina", "Arsenicum Album", "Phosphorus", "Nux Vomica"] },
  { name: "Celiac Disease", category: "Gastrointestinal Diseases", symptoms: ["Diarrhea", "Bloating", "Gas", "Fatigue", "Weight loss", "Anemia", "Osteoporosis", "Skin rash"], medicines: ["China", "Lycopodium", "Calcarea Carb", "Silicea", "Natrum Mur"] },
  { name: "Gallstones", category: "Gastrointestinal Diseases", symptoms: ["Sudden intense pain", "Back pain", "Shoulder pain", "Nausea", "Vomiting", "Indigestion", "Bloating", "Jaundice"], medicines: ["Chelidonium", "Berberis Vulgaris", "Carduus Marianus", "Lycopodium", "Calcarea Carb"] },
  { name: "Kidney Stones", category: "Urological Diseases", symptoms: ["Severe side pain", "Radiating pain", "Painful urination", "Pink urine", "Cloudy urine", "Nausea", "Frequent urination", "Fever"], medicines: ["Berberis Vulgaris", "Lycopodium", "Cantharis", "Sarsaparilla", "Ocimum Canum"] },
  { name: "Chronic Kidney Disease", category: "Urological Diseases", symptoms: ["Fatigue", "Swelling", "Decreased urination", "Shortness of breath", "Nausea", "Confusion", "Chest pain", "High blood pressure"], medicines: ["Apis Mellifica", "Arsenicum Album", "Berberis Vulgaris", "Cantharis", "Solidago"] },
  { name: "Urinary Tract Infection (UTI)", category: "Urological Diseases", symptoms: ["Burning urination", "Frequent urination", "Urgency", "Cloudy urine", "Pelvic pain", "Blood in urine", "Strong odor", "Low fever"], medicines: ["Cantharis", "Apis Mellifica", "Berberis Vulgaris", "Staphysagria", "Sarsaparilla"] },
  { name: "Cirrhosis of the Liver", category: "Gastrointestinal Diseases", symptoms: ["Fatigue", "Easy bruising", "Loss of appetite", "Nausea", "Swelling in legs", "Weight loss", "Confusion", "Jaundice"], medicines: ["Chelidonium", "Carduus Marianus", "Lycopodium", "Phosphorus", "Arsenicum Album"] },
  { name: "Fatty Liver Disease", category: "Gastrointestinal Diseases", symptoms: ["Fatigue", "Abdominal discomfort", "Enlarged liver", "Weakness", "Weight loss", "Confusion", "Jaundice", "Swelling"], medicines: ["Chelidonium", "Lycopodium", "Carduus Marianus", "Nux Vomica", "Phosphorus"] },
  { name: "Pancreatitis", category: "Gastrointestinal Diseases", symptoms: ["Upper abdominal pain", "Pain radiating to back", "Nausea", "Vomiting", "Tenderness", "Fever", "Rapid pulse", "Oily stool"], medicines: ["Iris Versicolor", "Conium", "Phosphorus", "Spongia", "Belladonna"] },
  { name: "Appendicitis", category: "Gastrointestinal Diseases", symptoms: ["Sudden abdominal pain", "Pain near navel", "Nausea", "Vomiting", "Loss of appetite", "Low fever", "Constipation", "Abdominal swelling"], medicines: ["Iris Tenax", "Belladonna", "Bryonia", "Rhus Tox", "Lachesis"] },
  { name: "Hemorrhoids (Piles)", category: "Gastrointestinal Diseases", symptoms: ["Rectal bleeding", "Itching", "Pain", "Swelling", "Lumps near anus", "Discomfort", "Mucus discharge", "Difficulty sitting"], medicines: ["Aesculus", "Hamamelis", "Nux Vomica", "Sulphur", "Aloe Socotrina"] },

  // Blood Disorders (61-65)
  { name: "Anemia (Iron Deficiency)", category: "Blood Disorders", symptoms: ["Fatigue", "Weakness", "Pale skin", "Shortness of breath", "Dizziness", "Cold hands", "Brittle nails", "Headaches"], medicines: ["Ferrum Met", "China", "Natrum Mur", "Calcarea Phos", "Phosphorus"] },
  { name: "Sickle Cell Anemia", category: "Blood Disorders", symptoms: ["Fatigue", "Pain crises", "Swelling", "Frequent infections", "Delayed growth", "Vision problems", "Jaundice", "Pale skin"], medicines: ["Crotalus Horridus", "Lachesis", "Phosphorus", "Arsenicum Album", "Natrum Mur"] },
  { name: "Thalassemia", category: "Blood Disorders", symptoms: ["Fatigue", "Weakness", "Pale skin", "Facial bone deformities", "Slow growth", "Dark urine", "Yellow skin", "Enlarged spleen"], medicines: ["Ferrum Met", "China", "Natrum Mur", "Arsenicum Album", "Phosphorus"] },
  { name: "Hemophilia", category: "Blood Disorders", symptoms: ["Excessive bleeding", "Deep bruises", "Joint pain", "Spontaneous bleeding", "Blood in urine", "Blood in stool", "Prolonged bleeding", "Swelling"], medicines: ["Phosphorus", "Lachesis", "Crotalus Horridus", "Hamamelis", "Arnica"] },
  { name: "Leukemia", category: "Cancer", symptoms: ["Fatigue", "Fever", "Frequent infections", "Weight loss", "Swollen lymph nodes", "Easy bleeding", "Bone pain", "Night sweats"], medicines: ["Arsenicum Album", "Phosphorus", "Carcinosin", "Natrum Mur", "Thuja"] },

  // Cancers (66-75)
  { name: "Lymphoma", category: "Cancer", symptoms: ["Swollen lymph nodes", "Fatigue", "Fever", "Night sweats", "Weight loss", "Itching", "Shortness of breath", "Chest pain"], medicines: ["Arsenicum Album", "Conium", "Phytolacca", "Baryta Carb", "Carcinosin"] },
  { name: "Melanoma (Skin Cancer)", category: "Cancer", symptoms: ["Unusual mole", "Changing mole", "Asymmetrical mole", "Irregular borders", "Color changes", "Diameter increase", "Evolving appearance", "Itching"], medicines: ["Arsenicum Album", "Carcinosin", "Phosphorus", "Thuja", "Radium Bromatum"] },
  { name: "Breast Cancer", category: "Cancer", symptoms: ["Breast lump", "Breast changes", "Nipple discharge", "Nipple changes", "Skin changes", "Breast pain", "Swelling", "Redness"], medicines: ["Conium", "Phytolacca", "Carcinosin", "Asterias Rubens", "Phosphorus"] },
  { name: "Lung Cancer", category: "Cancer", symptoms: ["Persistent cough", "Coughing blood", "Shortness of breath", "Chest pain", "Hoarseness", "Weight loss", "Bone pain", "Headache"], medicines: ["Phosphorus", "Arsenicum Album", "Carcinosin", "Kali Carb", "Spongia"] },
  { name: "Prostate Cancer", category: "Cancer", symptoms: ["Frequent urination", "Weak urine flow", "Blood in urine", "Erectile dysfunction", "Bone pain", "Weight loss", "Fatigue", "Pelvic discomfort"], medicines: ["Conium", "Sabal Serrulata", "Thuja", "Carcinosin", "Arsenicum Album"] },
  { name: "Colorectal Cancer", category: "Cancer", symptoms: ["Blood in stool", "Bowel changes", "Abdominal discomfort", "Unexplained weight loss", "Fatigue", "Weakness", "Narrow stool", "Incomplete evacuation"], medicines: ["Alumina", "Nitric Acid", "Arsenicum Album", "Hydrastis", "Carcinosin"] },
  { name: "Oral Cancer", category: "Cancer", symptoms: ["Mouth sores", "Mouth pain", "White patches", "Red patches", "Difficulty chewing", "Difficulty swallowing", "Numbness", "Loose teeth"], medicines: ["Arsenicum Album", "Mercurius", "Nitric Acid", "Hydrastis", "Carcinosin"] },
  { name: "Pancreatic Cancer", category: "Cancer", symptoms: ["Jaundice", "Abdominal pain", "Back pain", "Weight loss", "Loss of appetite", "Nausea", "Blood clots", "New diabetes"], medicines: ["Phosphorus", "Conium", "Arsenicum Album", "Carcinosin", "Iris Versicolor"] },
  { name: "Ovarian Cancer", category: "Cancer", symptoms: ["Abdominal bloating", "Pelvic pain", "Feeling full quickly", "Urinary symptoms", "Fatigue", "Back pain", "Menstrual changes", "Weight loss"], medicines: ["Arsenicum Album", "Apis Mellifica", "Conium", "Carcinosin", "Lachesis"] },
  { name: "Glioblastoma", category: "Cancer", symptoms: ["Persistent headaches", "Seizures", "Memory problems", "Personality changes", "Nausea", "Vision problems", "Speech difficulties", "Weakness"], medicines: ["Phosphorus", "Conium", "Plumbum Met", "Carcinosin", "Baryta Carb"] },

  // Endocrine Diseases (76-79)
  { name: "Hypothyroidism", category: "Endocrine Diseases", symptoms: ["Fatigue", "Weight gain", "Cold intolerance", "Dry skin", "Constipation", "Depression", "Slow heart rate", "Memory problems"], medicines: ["Thyroidinum", "Calcarea Carb", "Graphites", "Sepia", "Lycopodium"] },
  { name: "Hyperthyroidism", category: "Endocrine Diseases", symptoms: ["Weight loss", "Rapid heartbeat", "Increased appetite", "Nervousness", "Tremor", "Sweating", "Heat intolerance", "Fatigue"], medicines: ["Iodum", "Natrum Mur", "Thyroidinum", "Lachesis", "Spongia"] },
  { name: "Polycystic Ovary Syndrome (PCOS)", category: "Endocrine Diseases", symptoms: ["Irregular periods", "Excess androgen", "Polycystic ovaries", "Weight gain", "Acne", "Hair loss", "Hirsutism", "Infertility"], medicines: ["Pulsatilla", "Sepia", "Lachesis", "Calcarea Carb", "Thuja"] },
  { name: "Endometriosis", category: "Endocrine Diseases", symptoms: ["Painful periods", "Pelvic pain", "Pain during intercourse", "Heavy periods", "Infertility", "Fatigue", "Bloating", "Nausea"], medicines: ["Sepia", "Pulsatilla", "Sabina", "Cimicifuga", "Nux Vomica"] },

  // Eye Diseases (80-83)
  { name: "Cataracts", category: "Eye Diseases", symptoms: ["Clouded vision", "Dim vision", "Faded colors", "Sensitivity to light", "Halos around lights", "Night vision problems", "Double vision", "Frequent prescription changes"], medicines: ["Calcarea Fluor", "Cineraria", "Phosphorus", "Silicea", "Causticum"] },
  { name: "Glaucoma", category: "Eye Diseases", symptoms: ["Gradual vision loss", "Tunnel vision", "Severe eye pain", "Nausea", "Vomiting", "Blurred vision", "Halos around lights", "Red eyes"], medicines: ["Phosphorus", "Spigelia", "Physostigma", "Gelsemium", "Prunus Spinosa"] },
  { name: "Macular Degeneration", category: "Eye Diseases", symptoms: ["Blurred central vision", "Distorted vision", "Dark spots", "Difficulty reading", "Difficulty recognizing faces", "Need for brighter light", "Faded colors", "Visual hallucinations"], medicines: ["Phosphorus", "Ruta Graveolens", "Gelsemium", "Argentum Nitricum", "Silicea"] },
  { name: "Conjunctivitis (Pink Eye)", category: "Eye Diseases", symptoms: ["Red eyes", "Itchy eyes", "Watery discharge", "Gritty feeling", "Swollen eyelids", "Light sensitivity", "Crusting", "Burning sensation"], medicines: ["Argentum Nitricum", "Euphrasia", "Pulsatilla", "Belladonna", "Apis Mellifica"] },

  // Ear Nose Throat (84-85)
  { name: "Otitis Media (Ear Infection)", category: "ENT Diseases", symptoms: ["Ear pain", "Hearing difficulty", "Fluid drainage", "Fever", "Irritability", "Sleep problems", "Balance issues", "Headache"], medicines: ["Belladonna", "Pulsatilla", "Chamomilla", "Hepar Sulph", "Mercurius"] },
  { name: "Tonsillitis", category: "ENT Diseases", symptoms: ["Swollen tonsils", "Severe throat pain", "Difficulty swallowing", "Fever", "White patches", "Bad breath", "Neck stiffness", "Ear pain"], medicines: ["Belladonna", "Mercurius", "Baryta Carb", "Hepar Sulph", "Phytolacca"] },

  // Serious Infectious Diseases (86-97)
  { name: "Meningitis", category: "Infectious Diseases", symptoms: ["Severe headache", "Stiff neck", "High fever", "Nausea", "Vomiting", "Light sensitivity", "Confusion", "Skin rash"], medicines: ["Belladonna", "Apis Mellifica", "Helleborus", "Zincum Met", "Cicuta"] },
  { name: "Encephalitis", category: "Infectious Diseases", symptoms: ["Headache", "Fever", "Confusion", "Seizures", "Stiff neck", "Light sensitivity", "Drowsiness", "Weakness"], medicines: ["Belladonna", "Helleborus", "Stramonium", "Zincum Met", "Cicuta"] },
  { name: "Sepsis", category: "Infectious Diseases", symptoms: ["Fever", "Rapid heart rate", "Rapid breathing", "Confusion", "Low blood pressure", "Decreased urination", "Skin discoloration", "Extreme weakness"], medicines: ["Arsenicum Album", "Pyrogenium", "Baptisia", "Lachesis", "Carbo Veg"] },
  { name: "Tetanus", category: "Infectious Diseases", symptoms: ["Jaw stiffness", "Muscle spasms", "Painful stiffness", "Difficulty swallowing", "Fever", "Sweating", "High blood pressure", "Rapid heart rate"], medicines: ["Hypericum", "Ledum Pal", "Cicuta", "Angustura Vera", "Strychninum"] },
  { name: "Rabies", category: "Infectious Diseases", symptoms: ["Fever", "Headache", "Anxiety", "Confusion", "Agitation", "Hallucinations", "Hydrophobia", "Excessive salivation"], medicines: ["Hydrophobinum", "Belladonna", "Stramonium", "Lachesis", "Cantharis"] },
  { name: "Polio", category: "Infectious Diseases", symptoms: ["Fever", "Fatigue", "Headache", "Stiff neck", "Limb pain", "Muscle weakness", "Paralysis", "Breathing difficulty"], medicines: ["Gelsemium", "Lathyrus Sativus", "Plumbum Met", "Causticum", "Phosphorus"] },
  { name: "Measles", category: "Infectious Diseases", symptoms: ["High fever", "Cough", "Runny nose", "Red eyes", "Skin rash", "Koplik spots", "Light sensitivity", "Malaise"], medicines: ["Pulsatilla", "Bryonia", "Euphrasia", "Aconite", "Belladonna"] },
  { name: "Mumps", category: "Infectious Diseases", symptoms: ["Swollen salivary glands", "Fever", "Headache", "Muscle aches", "Fatigue", "Loss of appetite", "Pain while chewing", "Jaw tenderness"], medicines: ["Belladonna", "Mercurius", "Pulsatilla", "Phytolacca", "Pilocarpus"] },
  { name: "Rubella", category: "Infectious Diseases", symptoms: ["Mild fever", "Rash", "Swollen lymph nodes", "Headache", "Red eyes", "Joint pain", "Runny nose", "General discomfort"], medicines: ["Pulsatilla", "Belladonna", "Aconite", "Rhus Tox", "Bryonia"] },
  { name: "Chickenpox", category: "Infectious Diseases", symptoms: ["Itchy rash", "Blisters", "Fever", "Fatigue", "Loss of appetite", "Headache", "Body aches", "Malaise"], medicines: ["Rhus Tox", "Antimonium Crud", "Pulsatilla", "Sulphur", "Antimonium Tart"] },
  { name: "Zika Virus", category: "Infectious Diseases", symptoms: ["Mild fever", "Rash", "Joint pain", "Red eyes", "Muscle pain", "Headache", "Fatigue", "Malaise"], medicines: ["Eupatorium Perf", "Rhus Tox", "Bryonia", "Gelsemium", "Arsenicum Album"] },
  { name: "Ebola Virus Disease", category: "Infectious Diseases", symptoms: ["Fever", "Severe headache", "Muscle pain", "Weakness", "Fatigue", "Diarrhea", "Vomiting", "Unexplained bleeding"], medicines: ["Arsenicum Album", "Crotalus Horridus", "Phosphorus", "Lachesis", "Pyrogenium"] },

  // Rare & Genetic Diseases (98-100)
  { name: "Lyme Disease", category: "Infectious Diseases", symptoms: ["Bull's-eye rash", "Fever", "Chills", "Fatigue", "Body aches", "Headache", "Neck stiffness", "Swollen lymph nodes"], medicines: ["Ledum Pal", "Arsenicum Album", "Rhus Tox", "Bryonia", "Aurum Arsenicum"] },
  { name: "ALS (Lou Gehrig's Disease)", category: "Neurological Diseases", symptoms: ["Muscle weakness", "Twitching", "Slurred speech", "Difficulty swallowing", "Muscle cramps", "Stiff muscles", "Breathing difficulty", "Fatigue"], medicines: ["Plumbum Met", "Phosphorus", "Gelsemium", "Causticum", "Lathyrus Sativus"] },
  { name: "Cystic Fibrosis", category: "Genetic Diseases", symptoms: ["Persistent cough", "Thick mucus", "Frequent lung infections", "Wheezing", "Poor growth", "Fatty stool", "Salty skin", "Nasal polyps"], medicines: ["Phosphorus", "Antimonium Tart", "Kali Carb", "Silicea", "Spongia"] },
];

// Generate detailed content for each disease
function generateDiseaseContent(disease: any) {
  const overviewParagraphs = [
    `${disease.name} is a significant health condition that affects millions of people worldwide. Understanding this condition is crucial for proper management and treatment. The disease manifests through various symptoms that can range from mild to severe, depending on individual factors and the stage of the condition.`,
    `From a medical perspective, ${disease.name} falls under the category of ${disease.category}. This classification helps healthcare providers in determining the appropriate diagnostic and treatment approaches. The condition has been studied extensively, and our understanding continues to evolve with ongoing research.`,
    `The onset of ${disease.name} can be gradual or sudden, depending on various factors including genetic predisposition, environmental triggers, and lifestyle choices. Early recognition of symptoms is vital for timely intervention and better outcomes.`,
    `Patients with ${disease.name} often experience a combination of physical and emotional challenges. The symptoms can significantly impact daily activities, work productivity, and overall quality of life. A comprehensive approach to treatment addresses both the physical symptoms and the psychological aspects of living with this condition.`,
    `Risk factors for developing ${disease.name} include both modifiable and non-modifiable elements. While some individuals may be genetically predisposed to the condition, lifestyle modifications can often help reduce the risk or manage the severity of symptoms.`,
    `Diagnosis of ${disease.name} typically involves a thorough clinical evaluation, including detailed history taking and physical examination. Additional diagnostic tests may be required to confirm the diagnosis and rule out other conditions with similar presentations.`,
    `The prognosis for ${disease.name} varies significantly based on multiple factors, including early detection, adherence to treatment protocols, and individual response to therapy. Many patients can achieve significant improvement with proper management.`,
    `Living with ${disease.name} requires ongoing attention to health maintenance and regular follow-up with healthcare providers. Patient education plays a crucial role in empowering individuals to actively participate in their care and make informed decisions about their treatment options.`,
    `Research continues to advance our understanding of ${disease.name}, with new therapeutic approaches and management strategies emerging regularly. Patients are encouraged to stay informed about the latest developments and discuss new treatment options with their healthcare providers.`,
    `Community support and patient advocacy groups can provide valuable resources for those affected by ${disease.name}. Connecting with others who share similar experiences can offer emotional support and practical guidance for navigating the challenges of living with this condition.`
  ];

  const homeopathicParagraphs = [
    `Homeopathy offers a unique and individualized approach to treating ${disease.name}, focusing on the whole person rather than just the disease symptoms. This holistic perspective considers the patient's physical, emotional, and mental state when selecting appropriate remedies.`,
    `The homeopathic treatment of ${disease.name} is based on the principle of "like cures like," where substances that can produce symptoms similar to the disease in healthy individuals are used in highly diluted forms to stimulate the body's natural healing response.`,
    `Key homeopathic remedies for ${disease.name} include ${disease.medicines.join(", ")}. Each of these remedies has specific indications based on the individual's unique symptom picture, constitution, and overall health status.`,
    `${disease.medicines[0]} is often considered when patients present with acute symptoms and a sudden onset. This remedy is particularly suited for individuals who experience intense symptoms that may worsen with certain triggers specific to their constitution.`,
    `${disease.medicines[1]} may be indicated for patients whose symptoms have a gradual onset and are accompanied by specific modalities such as aggravation from movement or relief from rest. The emotional state and temperament of the patient also guide the selection of this remedy.`,
    `Constitutional treatment in homeopathy goes beyond symptomatic relief, aiming to address the underlying susceptibility that predisposes an individual to ${disease.name}. This deeper approach can lead to long-lasting improvement and enhanced overall vitality.`,
    `The selection of the correct homeopathic remedy requires careful case-taking, including detailed inquiry into the nature, location, and characteristics of symptoms, as well as factors that aggravate or ameliorate them. Mental and emotional symptoms are equally important in remedy selection.`,
    `Homeopathic treatment for ${disease.name} may be used alongside conventional medical care, particularly in chronic or severe cases. Communication between healthcare providers ensures coordinated and safe patient care.`,
    `Response to homeopathic treatment can vary, with some patients experiencing rapid improvement while others may require more time and potentially different remedies. Regular follow-up allows for adjustment of the treatment plan based on the patient's response.`,
    `Prevention and health maintenance are important aspects of homeopathic care for ${disease.name}. Lifestyle recommendations, dietary modifications, and constitutional support can help prevent recurrence and promote overall well-being.`
  ];

  return {
    overview: overviewParagraphs.join("\n\n"),
    homeopathic_perspective: homeopathicParagraphs.join("\n\n"),
    causes: [
      "Genetic factors and family history",
      "Environmental triggers and exposures",
      "Lifestyle factors including diet and stress",
      "Immune system dysfunction",
      "Underlying health conditions",
      "Age-related changes",
      "Infectious agents or pathogens"
    ],
    early_symptoms: disease.symptoms.slice(0, 4),
    advanced_symptoms: disease.symptoms.slice(4),
    when_to_consult: [
      "Symptoms persist or worsen despite home care",
      "New or unusual symptoms develop",
      "Symptoms interfere with daily activities",
      "Signs of complications appear",
      "Need for professional guidance on treatment options"
    ],
    lifestyle_tips: [
      "Maintain a balanced and nutritious diet",
      "Exercise regularly as appropriate for your condition",
      "Get adequate rest and quality sleep",
      "Manage stress through relaxation techniques",
      "Stay hydrated with plenty of water",
      "Avoid known triggers and irritants",
      "Follow prescribed treatment protocols",
      "Keep regular follow-up appointments"
    ]
  };
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Starting disease generation for ${diseaseData.length} diseases...`);

    // Process all diseases in parallel for speed
    const diseasePromises = diseaseData.map(async (disease) => {
      const slug = createSlug(disease.name);
      
      // Check if disease already exists
      const { data: existing } = await supabase
        .from('diseases')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existing) {
        console.log(`Disease ${disease.name} already exists, skipping...`);
        return { skipped: true, name: disease.name };
      }

      const content = generateDiseaseContent(disease);
      
      const diseaseRecord = {
        name: disease.name,
        slug: slug,
        category: disease.category,
        summary: `Comprehensive guide to ${disease.name} including symptoms, causes, and homeopathic treatment options with remedies like ${disease.medicines.slice(0, 3).join(", ")}.`,
        symptoms: disease.symptoms,
        overview: content.overview,
        causes: content.causes,
        early_symptoms: content.early_symptoms,
        advanced_symptoms: content.advanced_symptoms,
        homeopathic_perspective: content.homeopathic_perspective,
        medicines: disease.medicines.map((med: string, index: number) => ({
          name: med,
          potency: index === 0 ? "30C, 200C" : "30C",
          indication: `Indicated for ${disease.name} with characteristic symptoms`
        })),
        when_to_consult: content.when_to_consult,
        lifestyle_tips: content.lifestyle_tips
      };

      const { error } = await supabase.from('diseases').insert(diseaseRecord);
      
      if (error) {
        console.error(`Error inserting ${disease.name}:`, error);
        return { error: true, name: disease.name, message: error.message };
      }
      
      console.log(`Successfully created: ${disease.name}`);
      return { success: true, name: disease.name };
    });

    const results = await Promise.all(diseasePromises);
    
    const successful = results.filter(r => r.success).length;
    const skipped = results.filter(r => r.skipped).length;
    const errors = results.filter(r => r.error);

    console.log(`Generation complete: ${successful} created, ${skipped} skipped, ${errors.length} errors`);

    return new Response(
      JSON.stringify({ 
        message: `Disease generation complete`,
        created: successful,
        skipped: skipped,
        errors: errors.length,
        total: diseaseData.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-diseases function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
