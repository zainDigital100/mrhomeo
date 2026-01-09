import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Complete disease list with pre-defined data - organized by category
const diseaseData = [
  // ============ CARDIOVASCULAR DISEASES ============
  { name: "Hypertension", category: "Cardiovascular Diseases", symptoms: ["High blood pressure", "Headaches", "Shortness of breath", "Nosebleeds", "Flushing", "Dizziness", "Chest pain", "Vision problems"], medicines: ["Natrum Mur", "Lachesis", "Glonoine", "Aurum Met", "Baryta Carb"] },
  { name: "Hypotension", category: "Cardiovascular Diseases", symptoms: ["Low blood pressure", "Dizziness", "Fainting", "Blurred vision", "Nausea", "Fatigue", "Lack of concentration", "Cold clammy skin"], medicines: ["China", "Gelsemium", "Carbo Veg", "Arsenicum Album", "Veratrum Album"] },
  { name: "Coronary Artery Disease", category: "Cardiovascular Diseases", symptoms: ["Chest pain", "Shortness of breath", "Fatigue", "Heart palpitations", "Weakness", "Nausea", "Sweating", "Pain radiating to arm"], medicines: ["Cactus Grandiflorus", "Crataegus", "Digitalis", "Arnica", "Aurum Met"] },
  { name: "Atherosclerosis", category: "Cardiovascular Diseases", symptoms: ["Chest pain", "Leg pain when walking", "Numbness in extremities", "Weakness", "Fatigue", "Coldness in limbs", "Erectile dysfunction", "Kidney problems"], medicines: ["Baryta Carb", "Plumbum Met", "Crataegus", "Aurum Met", "Secale Cor"] },
  { name: "Myocardial Infarction", category: "Cardiovascular Diseases", symptoms: ["Severe chest pain", "Shortness of breath", "Cold sweats", "Nausea", "Vomiting", "Pain in left arm", "Anxiety", "Fatigue"], medicines: ["Cactus Grandiflorus", "Arnica", "Digitalis", "Aconite", "Arsenicum Album"] },
  { name: "Angina Pectoris", category: "Cardiovascular Diseases", symptoms: ["Chest pain", "Squeezing sensation", "Pain radiating to arm", "Shortness of breath", "Nausea", "Fatigue", "Dizziness", "Sweating"], medicines: ["Cactus Grandiflorus", "Spigelia", "Latrodectus Mactans", "Crataegus", "Arnica"] },
  { name: "Heart Failure", category: "Cardiovascular Diseases", symptoms: ["Shortness of breath", "Fatigue", "Swelling in legs", "Rapid heartbeat", "Persistent cough", "Reduced exercise tolerance", "Swelling in abdomen", "Sudden weight gain"], medicines: ["Digitalis", "Crataegus", "Strophanthus", "Arsenicum Album", "Carbo Veg"] },
  { name: "Cardiomyopathy", category: "Cardiovascular Diseases", symptoms: ["Breathlessness", "Swelling of legs", "Fatigue", "Irregular heartbeat", "Dizziness", "Fainting", "Chest discomfort", "Bloating"], medicines: ["Crataegus", "Arsenicum Album", "Kali Carb", "Phosphorus", "Lachesis"] },
  { name: "Arrhythmia", category: "Cardiovascular Diseases", symptoms: ["Heart palpitations", "Fluttering in chest", "Racing heartbeat", "Slow heartbeat", "Chest pain", "Shortness of breath", "Dizziness", "Fainting"], medicines: ["Digitalis", "Naja", "Lachesis", "Spigelia", "Cactus Grandiflorus"] },
  { name: "Atrial Fibrillation", category: "Cardiovascular Diseases", symptoms: ["Irregular heartbeat", "Heart palpitations", "Shortness of breath", "Weakness", "Fatigue", "Dizziness", "Chest pain", "Reduced exercise capacity"], medicines: ["Digitalis", "Kali Carb", "Lachesis", "Naja", "Crataegus"] },
  { name: "Ventricular Tachycardia", category: "Cardiovascular Diseases", symptoms: ["Fast heart rate", "Dizziness", "Shortness of breath", "Chest discomfort", "Palpitations", "Fainting", "Anxiety", "Sweating"], medicines: ["Digitalis", "Naja", "Lachesis", "Iberis", "Crataegus"] },
  { name: "Congenital Heart Disease", category: "Cardiovascular Diseases", symptoms: ["Cyanosis", "Poor weight gain", "Shortness of breath", "Fatigue", "Heart murmur", "Swelling", "Poor feeding", "Frequent respiratory infections"], medicines: ["Calcarea Carb", "Phosphorus", "Laurocerasus", "Digitalis", "Arsenicum Album"] },
  { name: "Rheumatic Heart Disease", category: "Cardiovascular Diseases", symptoms: ["Heart murmur", "Chest pain", "Shortness of breath", "Fatigue", "Swelling", "Fever", "Joint pain", "Skin nodules"], medicines: ["Rhus Tox", "Bryonia", "Aurum Met", "Lachesis", "Spigelia"] },
  { name: "Endocarditis", category: "Cardiovascular Diseases", symptoms: ["Fever", "Chills", "Night sweats", "Fatigue", "Aching joints", "Shortness of breath", "Heart murmur", "Petechiae"], medicines: ["Aurum Met", "Arsenicum Album", "Lachesis", "Kali Carb", "Phosphorus"] },
  { name: "Myocarditis", category: "Cardiovascular Diseases", symptoms: ["Chest pain", "Fatigue", "Shortness of breath", "Rapid heartbeat", "Fever", "Swelling in legs", "Lightheadedness", "Flu-like symptoms"], medicines: ["Arsenicum Album", "Phosphorus", "Bryonia", "Cactus Grandiflorus", "Digitalis"] },
  { name: "Pericarditis", category: "Cardiovascular Diseases", symptoms: ["Sharp chest pain", "Pain worse when lying down", "Fever", "Shortness of breath", "Palpitations", "Cough", "Fatigue", "Swelling in legs"], medicines: ["Spigelia", "Bryonia", "Colchicum", "Cactus Grandiflorus", "Arsenicum Album"] },
  { name: "Mitral Valve Prolapse", category: "Cardiovascular Diseases", symptoms: ["Heart palpitations", "Chest pain", "Fatigue", "Dizziness", "Shortness of breath", "Anxiety", "Migraine headaches", "Irregular heartbeat"], medicines: ["Lachesis", "Naja", "Digitalis", "Crataegus", "Spigelia"] },
  { name: "Aortic Stenosis", category: "Cardiovascular Diseases", symptoms: ["Chest pain", "Shortness of breath", "Fatigue", "Dizziness", "Fainting", "Heart palpitations", "Swollen ankles", "Reduced exercise tolerance"], medicines: ["Aurum Met", "Crataegus", "Digitalis", "Baryta Carb", "Phosphorus"] },
  { name: "Pulmonary Hypertension", category: "Cardiovascular Diseases", symptoms: ["Shortness of breath", "Fatigue", "Dizziness", "Chest pressure", "Racing pulse", "Swelling in ankles", "Bluish lips", "Reduced exercise tolerance"], medicines: ["Laurocerasus", "Digitalis", "Arsenicum Album", "Phosphorus", "Crataegus"] },
  { name: "Peripheral Artery Disease", category: "Cardiovascular Diseases", symptoms: ["Leg pain when walking", "Leg numbness", "Coldness in lower leg", "Sores that won't heal", "Shiny skin on legs", "Weak pulse in legs", "Erectile dysfunction", "Slow-growing toenails"], medicines: ["Secale Cor", "Arsenicum Album", "Plumbum Met", "Carbo Veg", "Baryta Carb"] },
  { name: "Deep Vein Thrombosis", category: "Cardiovascular Diseases", symptoms: ["Leg swelling", "Leg pain", "Warmth in affected area", "Red or discolored skin", "Tenderness", "Cramping pain", "Visible surface veins", "Heaviness in leg"], medicines: ["Hamamelis", "Vipera", "Arnica", "Bothrops", "Lachesis"] },
  { name: "Varicose Veins", category: "Cardiovascular Diseases", symptoms: ["Visible twisted veins", "Aching legs", "Heavy feeling in legs", "Burning sensation", "Muscle cramping", "Swelling", "Itching around veins", "Skin discoloration"], medicines: ["Hamamelis", "Pulsatilla", "Calcarea Fluor", "Fluoric Acid", "Vipera"] },
  { name: "Stroke", category: "Cardiovascular Diseases", symptoms: ["Sudden numbness", "Confusion", "Trouble speaking", "Vision problems", "Difficulty walking", "Severe headache", "Loss of balance", "Facial drooping"], medicines: ["Arnica", "Baryta Carb", "Gelsemium", "Opium", "Plumbum Met"] },
  { name: "Transient Ischemic Attack", category: "Cardiovascular Diseases", symptoms: ["Temporary weakness", "Numbness on one side", "Slurred speech", "Vision problems", "Dizziness", "Confusion", "Difficulty walking", "Loss of balance"], medicines: ["Arnica", "Gelsemium", "Baryta Carb", "Bothrops", "Phosphorus"] },
  { name: "Cardiogenic Shock", category: "Cardiovascular Diseases", symptoms: ["Rapid breathing", "Severe shortness of breath", "Rapid heartbeat", "Loss of consciousness", "Weak pulse", "Cold hands and feet", "Confusion", "Sweating"], medicines: ["Arsenicum Album", "Carbo Veg", "Camphora", "Digitalis", "Antimonium Tart"] },
  { name: "Hypertrophic Cardiomyopathy", category: "Cardiovascular Diseases", symptoms: ["Shortness of breath", "Chest pain", "Fainting", "Heart palpitations", "Fatigue", "Dizziness", "Swelling in legs", "Heart murmur"], medicines: ["Crataegus", "Phosphorus", "Lachesis", "Arsenicum Album", "Aurum Met"] },
  { name: "Dilated Cardiomyopathy", category: "Cardiovascular Diseases", symptoms: ["Fatigue", "Shortness of breath", "Swelling in legs", "Weight gain", "Irregular heartbeat", "Dizziness", "Blood clots", "Fainting"], medicines: ["Digitalis", "Crataegus", "Kali Carb", "Arsenicum Album", "Phosphorus"] },
  { name: "Bradycardia", category: "Cardiovascular Diseases", symptoms: ["Slow heartbeat", "Fatigue", "Dizziness", "Weakness", "Shortness of breath", "Confusion", "Fainting", "Chest discomfort"], medicines: ["Digitalis", "Tabacum", "Gelsemium", "Naja", "Kali Carb"] },
  { name: "Tachycardia", category: "Cardiovascular Diseases", symptoms: ["Rapid heartbeat", "Shortness of breath", "Dizziness", "Chest pain", "Palpitations", "Fainting", "Lightheadedness", "Anxiety"], medicines: ["Aconite", "Digitalis", "Cactus Grandiflorus", "Spigelia", "Naja"] },
  { name: "Long QT Syndrome", category: "Cardiovascular Diseases", symptoms: ["Fainting during exercise", "Fainting during emotional stress", "Seizures", "Heart palpitations", "Sudden death risk", "Drowning near-miss", "Dizziness", "Fluttering in chest"], medicines: ["Digitalis", "Lachesis", "Naja", "Spigelia", "Crataegus"] },

  // ============ NEUROLOGICAL DISEASES ============
  { name: "Alzheimer's Disease", category: "Neurological Diseases", symptoms: ["Memory loss", "Difficulty thinking", "Confusion", "Personality changes", "Depression", "Social withdrawal", "Mood swings", "Difficulty with tasks"], medicines: ["Baryta Carb", "Alumina", "Anacardium", "Kali Phos", "Lycopodium"] },
  { name: "Parkinson's Disease", category: "Neurological Diseases", symptoms: ["Tremor", "Slowed movement", "Rigid muscles", "Impaired posture", "Loss of automatic movements", "Speech changes", "Writing changes", "Balance problems"], medicines: ["Mercurius", "Zincum Met", "Agaricus", "Rhus Tox", "Plumbum Met"] },
  { name: "Epilepsy", category: "Neurological Diseases", symptoms: ["Seizures", "Temporary confusion", "Staring spells", "Uncontrollable jerking", "Loss of consciousness", "Fear", "Anxiety", "Déjà vu"], medicines: ["Cuprum Met", "Cicuta", "Bufo Rana", "Oenanthe", "Artemisia Vulgaris"] },
  { name: "Multiple Sclerosis", category: "Neurological Diseases", symptoms: ["Numbness", "Tingling", "Weakness", "Vision problems", "Fatigue", "Dizziness", "Slurred speech", "Bladder issues"], medicines: ["Phosphorus", "Plumbum Met", "Causticum", "Nux Vomica", "Gelsemium"] },
  { name: "Migraine", category: "Neurological Diseases", symptoms: ["Severe headache", "Nausea", "Light sensitivity", "Sound sensitivity", "Visual disturbances", "Vomiting", "Throbbing pain", "Dizziness"], medicines: ["Belladonna", "Natrum Mur", "Sanguinaria", "Spigelia", "Iris Versicolor"] },
  { name: "Tension Headache", category: "Neurological Diseases", symptoms: ["Dull aching head pain", "Sensation of tightness", "Tenderness on scalp", "Neck pain", "Shoulder pain", "Difficulty sleeping", "Fatigue", "Irritability"], medicines: ["Gelsemium", "Nux Vomica", "Bryonia", "Natrum Mur", "Ignatia"] },
  { name: "Cluster Headache", category: "Neurological Diseases", symptoms: ["Excruciating pain", "One-sided headache", "Pain around eye", "Restlessness", "Tearing", "Stuffy nose", "Drooping eyelid", "Sweating on forehead"], medicines: ["Spigelia", "Sanguinaria", "Belladonna", "Coffea Cruda", "Arsenicum Album"] },
  { name: "Cerebral Palsy", category: "Neurological Diseases", symptoms: ["Muscle stiffness", "Floppiness", "Poor coordination", "Tremors", "Difficulty walking", "Difficulty swallowing", "Delayed motor skills", "Speech difficulties"], medicines: ["Causticum", "Plumbum Met", "Zincum Met", "Helleborus", "Cuprum Met"] },
  { name: "Amyotrophic Lateral Sclerosis", category: "Neurological Diseases", symptoms: ["Muscle weakness", "Twitching", "Slurred speech", "Difficulty swallowing", "Muscle cramps", "Stiff muscles", "Breathing difficulty", "Fatigue"], medicines: ["Plumbum Met", "Phosphorus", "Gelsemium", "Causticum", "Lathyrus Sativus"] },
  { name: "Huntington's Disease", category: "Neurological Diseases", symptoms: ["Involuntary movements", "Cognitive decline", "Psychiatric problems", "Poor coordination", "Difficulty speaking", "Difficulty swallowing", "Personality changes", "Memory lapses"], medicines: ["Agaricus", "Tarentula Hispanica", "Stramonium", "Hyoscyamus", "Zincum Met"] },
  { name: "Dementia", category: "Neurological Diseases", symptoms: ["Memory loss", "Communication difficulties", "Reasoning problems", "Confusion", "Personality changes", "Anxiety", "Depression", "Inappropriate behavior"], medicines: ["Baryta Carb", "Alumina", "Kali Phos", "Phosphoric Acid", "Anacardium"] },
  { name: "Bell's Palsy", category: "Neurological Diseases", symptoms: ["Sudden facial weakness", "Drooping face", "Difficulty smiling", "Eye won't close", "Drooling", "Pain around jaw", "Headache", "Taste changes"], medicines: ["Causticum", "Aconite", "Gelsemium", "Hypericum", "Cadmium Sulph"] },
  { name: "Peripheral Neuropathy", category: "Neurological Diseases", symptoms: ["Numbness", "Tingling", "Burning pain", "Sensitivity to touch", "Muscle weakness", "Loss of coordination", "Sharp pain", "Muscle wasting"], medicines: ["Arsenicum Album", "Phosphorus", "Plumbum Met", "Hypericum", "Oxalic Acid"] },
  { name: "Trigeminal Neuralgia", category: "Neurological Diseases", symptoms: ["Severe facial pain", "Electric shock sensation", "Pain triggered by touch", "Pain triggered by chewing", "Facial spasms", "Pain in jaw", "Pain in teeth", "Pain episodes"], medicines: ["Spigelia", "Magnesia Phos", "Colocynthis", "Verbascum", "Arsenicum Album"] },
  { name: "Guillain-Barré Syndrome", category: "Neurological Diseases", symptoms: ["Weakness in legs", "Tingling in extremities", "Difficulty walking", "Difficulty with facial movements", "Double vision", "Difficulty speaking", "Rapid heart rate", "Blood pressure changes"], medicines: ["Gelsemium", "Causticum", "Plumbum Met", "Phosphorus", "Conium"] },
  { name: "Myasthenia Gravis", category: "Neurological Diseases", symptoms: ["Drooping eyelids", "Double vision", "Difficulty speaking", "Difficulty swallowing", "Weakness in arms", "Weakness in legs", "Fatigue", "Difficulty breathing"], medicines: ["Gelsemium", "Conium", "Causticum", "Curare", "Plumbum Met"] },
  { name: "Brain Tumor", category: "Neurological Diseases", symptoms: ["Persistent headaches", "Seizures", "Vision problems", "Hearing problems", "Confusion", "Personality changes", "Balance problems", "Nausea"], medicines: ["Conium", "Phosphorus", "Plumbum Met", "Baryta Carb", "Calcarea Carb"] },
  { name: "Encephalitis", category: "Neurological Diseases", symptoms: ["Headache", "Fever", "Confusion", "Seizures", "Stiff neck", "Light sensitivity", "Drowsiness", "Weakness"], medicines: ["Belladonna", "Helleborus", "Stramonium", "Zincum Met", "Cicuta"] },
  { name: "Meningitis", category: "Neurological Diseases", symptoms: ["Severe headache", "Stiff neck", "High fever", "Nausea", "Vomiting", "Light sensitivity", "Confusion", "Skin rash"], medicines: ["Belladonna", "Apis Mellifica", "Helleborus", "Zincum Met", "Cicuta"] },
  { name: "Hydrocephalus", category: "Neurological Diseases", symptoms: ["Large head", "Bulging fontanel", "Vomiting", "Sleepiness", "Irritability", "Seizures", "Poor feeding", "Downward gaze"], medicines: ["Helleborus", "Calcarea Carb", "Apis Mellifica", "Zincum Met", "Mercurius"] },
  { name: "Narcolepsy", category: "Neurological Diseases", symptoms: ["Excessive daytime sleepiness", "Sudden muscle weakness", "Sleep paralysis", "Hallucinations", "Disrupted nighttime sleep", "Automatic behaviors", "Memory problems", "Depression"], medicines: ["Nux Moschata", "Opium", "Phosphoric Acid", "Gelsemium", "Coffea Cruda"] },
  { name: "Insomnia", category: "Neurological Diseases", symptoms: ["Difficulty falling asleep", "Waking frequently", "Early waking", "Daytime fatigue", "Irritability", "Poor concentration", "Anxiety", "Headaches"], medicines: ["Coffea Cruda", "Passiflora", "Nux Vomica", "Ignatia", "Kali Phos"] },
  { name: "Restless Leg Syndrome", category: "Neurological Diseases", symptoms: ["Urge to move legs", "Uncomfortable sensations", "Symptoms worse at rest", "Relief with movement", "Evening worsening", "Nighttime leg twitching", "Sleep disruption", "Daytime sleepiness"], medicines: ["Zincum Met", "Rhus Tox", "Arsenicum Album", "Causticum", "Tarentula Hispanica"] },
  { name: "Ataxia", category: "Neurological Diseases", symptoms: ["Poor coordination", "Unsteady walk", "Difficulty with fine motor tasks", "Slurred speech", "Difficulty swallowing", "Eye movement abnormalities", "Tremor", "Fatigue"], medicines: ["Gelsemium", "Alumina", "Argentum Nitricum", "Causticum", "Plumbum Met"] },
  { name: "Spinal Cord Injury", category: "Neurological Diseases", symptoms: ["Loss of movement", "Loss of sensation", "Loss of bowel control", "Loss of bladder control", "Spasms", "Pain", "Difficulty breathing", "Sexual dysfunction"], medicines: ["Hypericum", "Arnica", "Nux Vomica", "Causticum", "Phosphorus"] },
  { name: "Sciatica", category: "Neurological Diseases", symptoms: ["Lower back pain", "Pain radiating down leg", "Numbness in leg", "Tingling sensation", "Muscle weakness", "Pain worsened by sitting", "Sharp shooting pain", "Difficulty standing"], medicines: ["Colocynthis", "Magnesia Phos", "Rhus Tox", "Bryonia", "Gnaphalium"] },
  { name: "Vertigo", category: "Neurological Diseases", symptoms: ["Spinning sensation", "Loss of balance", "Nausea", "Vomiting", "Sweating", "Headache", "Ringing in ears", "Abnormal eye movements"], medicines: ["Cocculus", "Conium", "Phosphorus", "Gelsemium", "Bryonia"] },
  { name: "Tinnitus", category: "Neurological Diseases", symptoms: ["Ringing in ears", "Buzzing sound", "Roaring sound", "Clicking sound", "Hearing loss", "Dizziness", "Ear fullness", "Concentration problems"], medicines: ["China", "Kali Iod", "Graphites", "Salicylic Acid", "Carbo Veg"] },
  { name: "Post-Concussion Syndrome", category: "Neurological Diseases", symptoms: ["Headaches", "Dizziness", "Fatigue", "Irritability", "Anxiety", "Insomnia", "Memory problems", "Concentration difficulties"], medicines: ["Natrum Sulph", "Arnica", "Hypericum", "Cicuta", "Helleborus"] },

  // ============ RESPIRATORY DISEASES ============
  { name: "Asthma", category: "Respiratory Diseases", symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing", "Difficulty breathing", "Rapid breathing", "Fatigue", "Anxiety"], medicines: ["Arsenicum Album", "Ipecac", "Spongia", "Natrum Sulph", "Sambucus"] },
  { name: "Chronic Bronchitis", category: "Respiratory Diseases", symptoms: ["Persistent cough", "Mucus production", "Wheezing", "Shortness of breath", "Chest discomfort", "Fatigue", "Frequent respiratory infections", "Cyanosis"], medicines: ["Antimonium Tart", "Bryonia", "Phosphorus", "Stannum", "Hepar Sulph"] },
  { name: "Emphysema", category: "Respiratory Diseases", symptoms: ["Shortness of breath", "Chronic cough", "Wheezing", "Chest tightness", "Reduced exercise capacity", "Barrel-shaped chest", "Weight loss", "Fatigue"], medicines: ["Antimonium Tart", "Carbo Veg", "Senega", "Lobelia", "Grindelia"] },
  { name: "COPD", category: "Respiratory Diseases", symptoms: ["Chronic cough", "Shortness of breath", "Wheezing", "Chest tightness", "Frequent respiratory infections", "Fatigue", "Weight loss", "Swelling in ankles"], medicines: ["Antimonium Tart", "Carbo Veg", "Phosphorus", "Arsenicum Album", "Senega"] },
  { name: "Pneumonia", category: "Respiratory Diseases", symptoms: ["High fever", "Cough with phlegm", "Chest pain", "Shortness of breath", "Fatigue", "Chills", "Nausea", "Confusion"], medicines: ["Phosphorus", "Bryonia", "Antimonium Tartaricum", "Arsenicum Album", "Sulphur"] },
  { name: "Tuberculosis", category: "Respiratory Diseases", symptoms: ["Persistent cough", "Coughing blood", "Chest pain", "Weight loss", "Fever", "Night sweats", "Fatigue", "Loss of appetite"], medicines: ["Tuberculinum", "Phosphorus", "Arsenicum Album", "Calcarea Carb", "Silicea"] },
  { name: "Bronchiectasis", category: "Respiratory Diseases", symptoms: ["Chronic cough", "Large amounts of sputum", "Shortness of breath", "Wheezing", "Coughing blood", "Chest pain", "Fatigue", "Weight loss"], medicines: ["Stannum", "Phosphorus", "Arsenicum Album", "Silicea", "Hepar Sulph"] },
  { name: "Pulmonary Fibrosis", category: "Respiratory Diseases", symptoms: ["Shortness of breath", "Dry cough", "Fatigue", "Unexplained weight loss", "Aching muscles", "Aching joints", "Clubbing of fingers", "Chest discomfort"], medicines: ["Phosphorus", "Arsenicum Album", "Silicea", "Stannum", "Bryonia"] },
  { name: "Lung Cancer", category: "Respiratory Diseases", symptoms: ["Persistent cough", "Coughing blood", "Shortness of breath", "Chest pain", "Hoarseness", "Weight loss", "Bone pain", "Headache"], medicines: ["Phosphorus", "Arsenicum Album", "Carcinosin", "Kali Carb", "Spongia"] },
  { name: "Pleural Effusion", category: "Respiratory Diseases", symptoms: ["Shortness of breath", "Chest pain", "Dry cough", "Fever", "Difficulty breathing when lying down", "Sharp chest pain", "Rapid breathing", "Fatigue"], medicines: ["Bryonia", "Apis Mellifica", "Arsenicum Album", "Sulphur", "Lycopodium"] },
  { name: "Pulmonary Embolism", category: "Respiratory Diseases", symptoms: ["Sudden shortness of breath", "Sharp chest pain", "Cough with bloody sputum", "Rapid heartbeat", "Dizziness", "Leg swelling", "Clammy skin", "Anxiety"], medicines: ["Bothrops", "Lachesis", "Arsenicum Album", "Crotalus Horridus", "Phosphorus"] },
  { name: "Sleep Apnea", category: "Respiratory Diseases", symptoms: ["Loud snoring", "Breathing pauses", "Gasping during sleep", "Morning headache", "Daytime sleepiness", "Difficulty concentrating", "Mood changes", "Dry mouth"], medicines: ["Lachesis", "Opium", "Grindelia", "Ammonium Carb", "Sambucus"] },
  { name: "Acute Respiratory Distress Syndrome", category: "Respiratory Diseases", symptoms: ["Severe shortness of breath", "Rapid breathing", "Low blood oxygen", "Confusion", "Extreme fatigue", "Low blood pressure", "Bluish skin", "Rapid heartbeat"], medicines: ["Antimonium Tart", "Arsenicum Album", "Carbo Veg", "Phosphorus", "Ipecac"] },
  { name: "Influenza", category: "Respiratory Diseases", symptoms: ["High fever", "Severe body aches", "Extreme fatigue", "Headache", "Dry cough", "Chills", "Sore throat", "Nasal congestion"], medicines: ["Gelsemium", "Bryonia", "Eupatorium Perfoliatum", "Rhus Tox", "Arsenicum Album"] },
  { name: "COVID-19", category: "Respiratory Diseases", symptoms: ["Fever", "Dry cough", "Fatigue", "Loss of taste", "Loss of smell", "Shortness of breath", "Body aches", "Headache"], medicines: ["Arsenicum Album", "Bryonia", "Gelsemium", "Camphora", "Phosphorus"] },
  { name: "Common Cold", category: "Respiratory Diseases", symptoms: ["Runny nose", "Sneezing", "Sore throat", "Cough", "Mild fever", "Fatigue", "Headache", "Body aches"], medicines: ["Aconite", "Belladonna", "Arsenicum Album", "Bryonia", "Gelsemium"] },
  { name: "Sinusitis", category: "Respiratory Diseases", symptoms: ["Facial pain", "Nasal congestion", "Thick discharge", "Headache", "Post-nasal drip", "Reduced smell", "Facial pressure", "Cough"], medicines: ["Kali Bichromicum", "Pulsatilla", "Silicea", "Mercurius", "Hydrastis"] },
  { name: "Pharyngitis", category: "Respiratory Diseases", symptoms: ["Sore throat", "Painful swallowing", "Red throat", "Swollen tonsils", "Fever", "Headache", "Body aches", "Hoarse voice"], medicines: ["Belladonna", "Mercurius", "Phytolacca", "Hepar Sulph", "Lachesis"] },
  { name: "Laryngitis", category: "Respiratory Diseases", symptoms: ["Hoarse voice", "Weak voice", "Loss of voice", "Tickling in throat", "Dry throat", "Dry cough", "Sore throat", "Fever"], medicines: ["Phosphorus", "Causticum", "Hepar Sulph", "Argentum Met", "Spongia"] },
  { name: "Tonsillitis", category: "Respiratory Diseases", symptoms: ["Swollen tonsils", "Severe throat pain", "Difficulty swallowing", "Fever", "White patches", "Bad breath", "Neck stiffness", "Ear pain"], medicines: ["Belladonna", "Mercurius", "Baryta Carb", "Hepar Sulph", "Phytolacca"] },
  { name: "Whooping Cough", category: "Respiratory Diseases", symptoms: ["Severe coughing fits", "Whooping sound", "Vomiting after coughing", "Exhaustion", "Runny nose", "Mild fever", "Nasal congestion", "Red face during coughing"], medicines: ["Drosera", "Pertussinum", "Ipecac", "Coccus Cacti", "Corallium Rubrum"] },
  { name: "Cystic Fibrosis", category: "Respiratory Diseases", symptoms: ["Persistent cough", "Thick mucus", "Frequent lung infections", "Wheezing", "Poor growth", "Fatty stool", "Salty skin", "Nasal polyps"], medicines: ["Phosphorus", "Antimonium Tart", "Kali Carb", "Silicea", "Spongia"] },
  { name: "Pneumoconiosis", category: "Respiratory Diseases", symptoms: ["Chronic cough", "Shortness of breath", "Chest pain", "Reduced lung function", "Fatigue", "Weight loss", "Respiratory failure", "Cyanosis"], medicines: ["Silicea", "Phosphorus", "Arsenicum Album", "Stannum", "Kali Carb"] },
  { name: "Silicosis", category: "Respiratory Diseases", symptoms: ["Shortness of breath", "Chronic cough", "Fatigue", "Chest pain", "Fever", "Weight loss", "Night sweats", "Bluish skin"], medicines: ["Silicea", "Phosphorus", "Tuberculinum", "Arsenicum Album", "Calcarea Carb"] },
  { name: "Asbestosis", category: "Respiratory Diseases", symptoms: ["Shortness of breath", "Persistent dry cough", "Chest tightness", "Chest pain", "Loss of appetite", "Clubbing of fingers", "Crackling sound when breathing", "Fatigue"], medicines: ["Silicea", "Phosphorus", "Arsenicum Album", "Stannum", "Bryonia"] },

  // ============ GASTROINTESTINAL DISEASES ============
  { name: "Gastritis", category: "Gastrointestinal Diseases", symptoms: ["Upper abdominal pain", "Nausea", "Vomiting", "Bloating", "Loss of appetite", "Indigestion", "Hiccups", "Dark stools"], medicines: ["Nux Vomica", "Arsenicum Album", "Phosphorus", "Carbo Veg", "Lycopodium"] },
  { name: "Peptic Ulcer Disease", category: "Gastrointestinal Diseases", symptoms: ["Burning stomach pain", "Bloating", "Heartburn", "Nausea", "Fatty food intolerance", "Belching", "Loss of appetite", "Weight loss"], medicines: ["Argentum Nitricum", "Nux Vomica", "Kali Bich", "Phosphorus", "Anacardium"] },
  { name: "GERD", category: "Gastrointestinal Diseases", symptoms: ["Heartburn", "Regurgitation", "Chest pain", "Difficulty swallowing", "Chronic cough", "Hoarseness", "Sour taste", "Bloating"], medicines: ["Nux Vomica", "Robinia", "Carbo Veg", "Natrum Phos", "Phosphorus"] },
  { name: "Irritable Bowel Syndrome", category: "Gastrointestinal Diseases", symptoms: ["Abdominal pain", "Bloating", "Gas", "Diarrhea", "Constipation", "Cramping", "Mucus in stool", "Food intolerance"], medicines: ["Nux Vomica", "Lycopodium", "Argentum Nitricum", "Carbo Veg", "Asafoetida"] },
  { name: "Crohn's Disease", category: "Gastrointestinal Diseases", symptoms: ["Diarrhea", "Abdominal pain", "Blood in stool", "Weight loss", "Fatigue", "Fever", "Mouth sores", "Reduced appetite"], medicines: ["Arsenicum Album", "Phosphorus", "Mercurius Corrosivus", "Podophyllum", "Aloe"] },
  { name: "Ulcerative Colitis", category: "Gastrointestinal Diseases", symptoms: ["Bloody diarrhea", "Abdominal pain", "Urgency", "Weight loss", "Fatigue", "Fever", "Rectal pain", "Anemia"], medicines: ["Mercurius Corrosivus", "Aloe Socotrina", "Arsenicum Album", "Phosphorus", "Nux Vomica"] },
  { name: "Celiac Disease", category: "Gastrointestinal Diseases", symptoms: ["Diarrhea", "Bloating", "Gas", "Fatigue", "Weight loss", "Anemia", "Osteoporosis", "Skin rash"], medicines: ["China", "Lycopodium", "Calcarea Carb", "Silicea", "Natrum Mur"] },
  { name: "Lactose Intolerance", category: "Gastrointestinal Diseases", symptoms: ["Bloating", "Diarrhea", "Gas", "Abdominal cramps", "Nausea", "Rumbling stomach", "Urgency to defecate", "Flatulence"], medicines: ["Magnesia Mur", "Natrum Carb", "Calcarea Carb", "China", "Lycopodium"] },
  { name: "Hepatitis A", category: "Gastrointestinal Diseases", symptoms: ["Fatigue", "Nausea", "Abdominal pain", "Loss of appetite", "Low-grade fever", "Dark urine", "Joint pain", "Jaundice"], medicines: ["Chelidonium", "Carduus Marianus", "Lycopodium", "Phosphorus", "Nux Vomica"] },
  { name: "Hepatitis B", category: "Gastrointestinal Diseases", symptoms: ["Fatigue", "Abdominal pain", "Dark urine", "Joint pain", "Fever", "Nausea", "Vomiting", "Jaundice"], medicines: ["Chelidonium", "Lycopodium", "Phosphorus", "China", "Arsenicum Album"] },
  { name: "Hepatitis C", category: "Gastrointestinal Diseases", symptoms: ["Fatigue", "Fever", "Nausea", "Joint pain", "Abdominal pain", "Dark urine", "Clay-colored stool", "Jaundice"], medicines: ["Chelidonium", "Carduus Marianus", "Phosphorus", "Lycopodium", "China"] },
  { name: "Fatty Liver Disease", category: "Gastrointestinal Diseases", symptoms: ["Fatigue", "Abdominal discomfort", "Enlarged liver", "Weakness", "Weight loss", "Confusion", "Jaundice", "Swelling"], medicines: ["Chelidonium", "Lycopodium", "Carduus Marianus", "Nux Vomica", "Phosphorus"] },
  { name: "Cirrhosis", category: "Gastrointestinal Diseases", symptoms: ["Fatigue", "Easy bruising", "Loss of appetite", "Nausea", "Swelling in legs", "Weight loss", "Confusion", "Jaundice"], medicines: ["Chelidonium", "Carduus Marianus", "Lycopodium", "Phosphorus", "Arsenicum Album"] },
  { name: "Gallstones", category: "Gastrointestinal Diseases", symptoms: ["Sudden intense pain", "Back pain", "Shoulder pain", "Nausea", "Vomiting", "Indigestion", "Bloating", "Jaundice"], medicines: ["Chelidonium", "Berberis Vulgaris", "Carduus Marianus", "Lycopodium", "Calcarea Carb"] },
  { name: "Cholecystitis", category: "Gastrointestinal Diseases", symptoms: ["Severe abdominal pain", "Pain radiating to shoulder", "Nausea", "Vomiting", "Fever", "Abdominal tenderness", "Bloating", "Jaundice"], medicines: ["Chelidonium", "Berberis Vulgaris", "Cardus Marianus", "China", "Nux Vomica"] },
  { name: "Pancreatitis", category: "Gastrointestinal Diseases", symptoms: ["Upper abdominal pain", "Pain radiating to back", "Nausea", "Vomiting", "Tenderness", "Fever", "Rapid pulse", "Oily stool"], medicines: ["Iris Versicolor", "Conium", "Phosphorus", "Spongia", "Belladonna"] },
  { name: "Appendicitis", category: "Gastrointestinal Diseases", symptoms: ["Sudden abdominal pain", "Pain near navel", "Nausea", "Vomiting", "Loss of appetite", "Low fever", "Constipation", "Abdominal swelling"], medicines: ["Iris Tenax", "Belladonna", "Bryonia", "Rhus Tox", "Lachesis"] },
  { name: "Constipation", category: "Gastrointestinal Diseases", symptoms: ["Infrequent bowel movements", "Hard stools", "Straining", "Bloating", "Abdominal discomfort", "Feeling of incomplete evacuation", "Loss of appetite", "Fatigue"], medicines: ["Nux Vomica", "Bryonia", "Alumina", "Opium", "Silicea"] },
  { name: "Diarrhea", category: "Gastrointestinal Diseases", symptoms: ["Loose watery stools", "Abdominal cramps", "Urgency", "Nausea", "Bloating", "Fever", "Dehydration", "Weakness"], medicines: ["Arsenicum Album", "Podophyllum", "Veratrum Album", "China", "Aloe"] },
  { name: "Hemorrhoids", category: "Gastrointestinal Diseases", symptoms: ["Rectal bleeding", "Itching", "Pain", "Swelling", "Lumps near anus", "Discomfort", "Mucus discharge", "Difficulty sitting"], medicines: ["Aesculus", "Hamamelis", "Nux Vomica", "Sulphur", "Aloe Socotrina"] },
  { name: "Anal Fissure", category: "Gastrointestinal Diseases", symptoms: ["Pain during bowel movements", "Bright red blood", "Visible tear", "Itching", "Burning sensation", "Muscle spasms", "Pain lasting hours", "Skin tag near tear"], medicines: ["Nitric Acid", "Ratanhia", "Graphites", "Paeonia", "Silicea"] },
  { name: "Colorectal Cancer", category: "Gastrointestinal Diseases", symptoms: ["Blood in stool", "Bowel changes", "Abdominal discomfort", "Unexplained weight loss", "Fatigue", "Weakness", "Narrow stool", "Incomplete evacuation"], medicines: ["Alumina", "Nitric Acid", "Arsenicum Album", "Hydrastis", "Carcinosin"] },
  { name: "Stomach Cancer", category: "Gastrointestinal Diseases", symptoms: ["Poor appetite", "Weight loss", "Abdominal pain", "Heartburn", "Nausea", "Vomiting", "Feeling full quickly", "Blood in stool"], medicines: ["Arsenicum Album", "Phosphorus", "Carcinosin", "Ornithogalum", "Hydrastis"] },
  { name: "Esophageal Cancer", category: "Gastrointestinal Diseases", symptoms: ["Difficulty swallowing", "Weight loss", "Chest pain", "Heartburn", "Coughing", "Hoarseness", "Vomiting", "Bone pain"], medicines: ["Condurango", "Arsenicum Album", "Phosphorus", "Carcinosin", "Hydrastis"] },
  { name: "Liver Cancer", category: "Gastrointestinal Diseases", symptoms: ["Weight loss", "Loss of appetite", "Upper abdominal pain", "Nausea", "Vomiting", "Weakness", "Enlarged liver", "Jaundice"], medicines: ["Chelidonium", "Carcinosin", "Phosphorus", "Arsenicum Album", "Lycopodium"] },
  { name: "Hiatal Hernia", category: "Gastrointestinal Diseases", symptoms: ["Heartburn", "Regurgitation", "Difficulty swallowing", "Chest pain", "Belching", "Feeling full quickly", "Shortness of breath", "Vomiting blood"], medicines: ["Nux Vomica", "Carbo Veg", "Robinia", "Natrum Phos", "Lycopodium"] },
  { name: "Diverticulitis", category: "Gastrointestinal Diseases", symptoms: ["Abdominal pain", "Fever", "Nausea", "Constipation", "Diarrhea", "Bloating", "Rectal bleeding", "Abdominal tenderness"], medicines: ["Bryonia", "Colocynthis", "Belladonna", "Nux Vomica", "Arsenicum Album"] },
  { name: "Food Poisoning", category: "Gastrointestinal Diseases", symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal cramps", "Fever", "Weakness", "Headache", "Dehydration"], medicines: ["Arsenicum Album", "Veratrum Album", "Carbo Veg", "Podophyllum", "China"] },
  { name: "Dyspepsia", category: "Gastrointestinal Diseases", symptoms: ["Upper abdominal discomfort", "Bloating", "Early fullness", "Nausea", "Belching", "Heartburn", "Acidic taste", "Loss of appetite"], medicines: ["Nux Vomica", "Carbo Veg", "Lycopodium", "Pulsatilla", "China"] },
  { name: "Intestinal Obstruction", category: "Gastrointestinal Diseases", symptoms: ["Severe abdominal pain", "Cramping", "Vomiting", "Inability to pass gas", "Inability to defecate", "Bloating", "Abdominal swelling", "Loss of appetite"], medicines: ["Opium", "Plumbum Met", "Raphanus", "Nux Vomica", "Lycopodium"] },

  // ============ ENDOCRINE & METABOLIC DISEASES ============
  { name: "Diabetes Mellitus Type 1", category: "Endocrine Diseases", symptoms: ["Frequent urination", "Extreme thirst", "Unexplained weight loss", "Extreme hunger", "Fatigue", "Blurred vision", "Irritability", "Ketones in urine"], medicines: ["Syzygium Jambolanum", "Phosphoric Acid", "Uranium Nitricum", "Insulinum", "Gymnema Sylvestre"] },
  { name: "Diabetes Mellitus Type 2", category: "Endocrine Diseases", symptoms: ["Frequent urination", "Excessive thirst", "Unexplained weight loss", "Fatigue", "Blurred vision", "Slow healing", "Frequent infections", "Numbness"], medicines: ["Syzygium Jambolanum", "Uranium Nitricum", "Phosphoric Acid", "Cephalandra Indica", "Gymnema Sylvestre"] },
  { name: "Gestational Diabetes", category: "Endocrine Diseases", symptoms: ["Increased thirst", "Frequent urination", "Fatigue", "Nausea", "Blurred vision", "Frequent infections", "Sugar in urine", "Weight gain"], medicines: ["Syzygium Jambolanum", "Phosphoric Acid", "Pulsatilla", "Sepia", "Phosphorus"] },
  { name: "Hypoglycemia", category: "Endocrine Diseases", symptoms: ["Shakiness", "Sweating", "Hunger", "Dizziness", "Rapid heartbeat", "Confusion", "Irritability", "Anxiety"], medicines: ["Argentum Nitricum", "Phosphorus", "Lycopodium", "Sulphur", "Arsenicum Album"] },
  { name: "Hyperthyroidism", category: "Endocrine Diseases", symptoms: ["Weight loss", "Rapid heartbeat", "Increased appetite", "Nervousness", "Tremor", "Sweating", "Heat intolerance", "Fatigue"], medicines: ["Iodum", "Natrum Mur", "Thyroidinum", "Lachesis", "Spongia"] },
  { name: "Hypothyroidism", category: "Endocrine Diseases", symptoms: ["Fatigue", "Weight gain", "Cold intolerance", "Dry skin", "Constipation", "Depression", "Slow heart rate", "Memory problems"], medicines: ["Thyroidinum", "Calcarea Carb", "Graphites", "Sepia", "Lycopodium"] },
  { name: "Goiter", category: "Endocrine Diseases", symptoms: ["Swelling in neck", "Difficulty swallowing", "Difficulty breathing", "Coughing", "Hoarseness", "Tight feeling in throat", "Dizziness", "Neck vein distension"], medicines: ["Iodum", "Spongia", "Fucus Vesiculosus", "Bromium", "Thyroidinum"] },
  { name: "Hashimoto's Thyroiditis", category: "Endocrine Diseases", symptoms: ["Fatigue", "Weight gain", "Cold sensitivity", "Joint pain", "Muscle aches", "Constipation", "Dry skin", "Hair loss"], medicines: ["Thyroidinum", "Calcarea Carb", "Natrum Mur", "Sepia", "Graphites"] },
  { name: "Graves' Disease", category: "Endocrine Diseases", symptoms: ["Anxiety", "Irritability", "Heat sensitivity", "Weight loss", "Tremor", "Rapid heartbeat", "Bulging eyes", "Thick red skin on shins"], medicines: ["Iodum", "Natrum Mur", "Thyroidinum", "Phosphorus", "Lachesis"] },
  { name: "Cushing Syndrome", category: "Endocrine Diseases", symptoms: ["Weight gain", "Fatty deposits on face", "Pink stretch marks", "Slow healing", "Acne", "Fatigue", "Muscle weakness", "Depression"], medicines: ["Phosphorus", "Arsenicum Album", "Natrum Mur", "Lycopodium", "Calcarea Carb"] },
  { name: "Addison's Disease", category: "Endocrine Diseases", symptoms: ["Extreme fatigue", "Weight loss", "Darkened skin", "Low blood pressure", "Salt craving", "Muscle weakness", "Nausea", "Depression"], medicines: ["Arsenicum Album", "Natrum Mur", "Phosphorus", "China", "Calcarea Carb"] },
  { name: "Polycystic Ovary Syndrome", category: "Endocrine Diseases", symptoms: ["Irregular periods", "Excess androgen", "Polycystic ovaries", "Weight gain", "Acne", "Hair loss", "Hirsutism", "Infertility"], medicines: ["Pulsatilla", "Sepia", "Lachesis", "Calcarea Carb", "Thuja"] },
  { name: "Metabolic Syndrome", category: "Endocrine Diseases", symptoms: ["Large waist circumference", "High blood pressure", "High blood sugar", "High triglycerides", "Low HDL cholesterol", "Fatigue", "Increased thirst", "Frequent urination"], medicines: ["Calcarea Carb", "Lycopodium", "Phosphorus", "Sulphur", "Graphites"] },
  { name: "Obesity", category: "Endocrine Diseases", symptoms: ["Excess body fat", "Shortness of breath", "Increased sweating", "Snoring", "Joint pain", "Fatigue", "Low self-esteem", "Back pain"], medicines: ["Phytolacca", "Calcarea Carb", "Graphites", "Fucus Vesiculosus", "Antimonium Crud"] },
  { name: "Hyperlipidemia", category: "Endocrine Diseases", symptoms: ["No direct symptoms", "Fatty deposits on skin", "Chest pain", "Heart attack risk", "Stroke risk", "Peripheral artery disease", "Xanthomas", "Arcus senilis"], medicines: ["Cholesterinum", "Crataegus", "Allium Sativum", "Baryta Carb", "Plumbum Met"] },
  { name: "Osteoporosis", category: "Endocrine Diseases", symptoms: ["Back pain", "Loss of height", "Stooped posture", "Bone fractures", "Brittle bones", "Receding gums", "Weak grip strength", "Brittle nails"], medicines: ["Calcarea Carb", "Calcarea Phos", "Symphytum", "Silicea", "Phosphorus"] },
  { name: "Osteomalacia", category: "Endocrine Diseases", symptoms: ["Bone pain", "Muscle weakness", "Difficulty walking", "Bone fractures", "Muscle cramps", "Numbness", "Tingling around mouth", "Irregular heart rhythms"], medicines: ["Calcarea Carb", "Calcarea Phos", "Phosphorus", "Silicea", "Symphytum"] },
  { name: "Rickets", category: "Endocrine Diseases", symptoms: ["Delayed growth", "Bone pain", "Muscle weakness", "Bowed legs", "Thickened wrists and ankles", "Soft skull", "Dental problems", "Spinal curvature"], medicines: ["Calcarea Carb", "Calcarea Phos", "Silicea", "Phosphorus", "Sulphur"] },
  { name: "Gout", category: "Endocrine Diseases", symptoms: ["Intense joint pain", "Swelling", "Redness", "Warmth", "Limited motion", "Tophi formation", "Fever", "Night attacks"], medicines: ["Colchicum", "Benzoic Acid", "Ledum Pal", "Urtica Urens", "Lycopodium"] },
  { name: "Hyperparathyroidism", category: "Endocrine Diseases", symptoms: ["Bone pain", "Kidney stones", "Fatigue", "Depression", "Forgetfulness", "Nausea", "Loss of appetite", "Increased thirst"], medicines: ["Calcarea Carb", "Phosphorus", "Silicea", "Lycopodium", "Sulphur"] },
  { name: "Hypoparathyroidism", category: "Endocrine Diseases", symptoms: ["Muscle cramps", "Tingling", "Numbness", "Fatigue", "Dry skin", "Brittle nails", "Hair loss", "Seizures"], medicines: ["Calcarea Carb", "Magnesia Phos", "Phosphorus", "Silicea", "Zincum Met"] },
  { name: "Acromegaly", category: "Endocrine Diseases", symptoms: ["Enlarged hands", "Enlarged feet", "Coarsened facial features", "Oily skin", "Sweating", "Fatigue", "Joint pain", "Headaches"], medicines: ["Thyroidinum", "Phosphorus", "Baryta Carb", "Calcarea Carb", "Silicea"] },
  { name: "Gigantism", category: "Endocrine Diseases", symptoms: ["Excessive height", "Large hands", "Large feet", "Coarse facial features", "Headaches", "Excessive sweating", "Weakness", "Delayed puberty"], medicines: ["Thyroidinum", "Phosphorus", "Calcarea Carb", "Baryta Carb", "Silicea"] },
  { name: "Pheochromocytoma", category: "Endocrine Diseases", symptoms: ["High blood pressure", "Severe headaches", "Excessive sweating", "Rapid heartbeat", "Tremor", "Pallor", "Shortness of breath", "Anxiety"], medicines: ["Adrenaline", "Phosphorus", "Arsenicum Album", "Glonoine", "Lachesis"] },
  { name: "Diabetes Insipidus", category: "Endocrine Diseases", symptoms: ["Extreme thirst", "Large volumes of dilute urine", "Dehydration", "Dry skin", "Weakness", "Fatigue", "Weight loss", "Constipation"], medicines: ["Phosphoric Acid", "Natrum Mur", "Uranium Nitricum", "Lac Defloratum", "Acetic Acid"] },

  // ============ MUSCULOSKELETAL DISEASES ============
  { name: "Arthritis", category: "Musculoskeletal Diseases", symptoms: ["Joint pain", "Swelling", "Stiffness", "Decreased range of motion", "Redness", "Warmth", "Fatigue", "Weight loss"], medicines: ["Rhus Tox", "Bryonia", "Calcarea Carb", "Causticum", "Colchicum"] },
  { name: "Osteoarthritis", category: "Musculoskeletal Diseases", symptoms: ["Joint pain", "Stiffness", "Swelling", "Reduced flexibility", "Bone spurs", "Grating sensation", "Tenderness", "Loss of motion"], medicines: ["Rhus Tox", "Bryonia", "Calcarea Carb", "Calcarea Fluor", "Causticum"] },
  { name: "Rheumatoid Arthritis", category: "Musculoskeletal Diseases", symptoms: ["Joint swelling", "Joint tenderness", "Morning stiffness", "Fatigue", "Fever", "Weight loss", "Nodules under skin", "Symmetrical joint involvement"], medicines: ["Rhus Tox", "Bryonia", "Actaea Spicata", "Causticum", "Calcarea Carb"] },
  { name: "Psoriatic Arthritis", category: "Musculoskeletal Diseases", symptoms: ["Joint pain", "Swelling", "Stiffness", "Scaly skin patches", "Nail changes", "Eye inflammation", "Fatigue", "Reduced range of motion"], medicines: ["Rhus Tox", "Sulphur", "Arsenicum Album", "Graphites", "Radium Bromatum"] },
  { name: "Ankylosing Spondylitis", category: "Musculoskeletal Diseases", symptoms: ["Back pain", "Stiffness", "Neck pain", "Fatigue", "Eye inflammation", "Stooped posture", "Difficulty breathing", "Loss of appetite"], medicines: ["Aesculus", "Rhus Tox", "Kali Carb", "Calcarea Fluor", "Medorrhinum"] },
  { name: "Scoliosis", category: "Musculoskeletal Diseases", symptoms: ["Uneven shoulders", "Uneven waist", "One hip higher", "Rotating spine", "Back pain", "Uneven ribs", "Fatigue", "Breathing difficulties"], medicines: ["Calcarea Carb", "Phosphorus", "Silicea", "Calcarea Phos", "Sulphur"] },
  { name: "Kyphosis", category: "Musculoskeletal Diseases", symptoms: ["Rounded upper back", "Back pain", "Stiffness", "Fatigue", "Difficulty standing straight", "Tenderness in spine", "Tight hamstrings", "Breathing difficulties"], medicines: ["Calcarea Carb", "Phosphorus", "Silicea", "Sulphur", "Calcarea Phos"] },
  { name: "Lordosis", category: "Musculoskeletal Diseases", symptoms: ["Exaggerated inward curve", "Prominent buttocks", "Low back pain", "Difficulty lying flat", "Abdominal protrusion", "Numbness", "Tingling", "Muscle spasms"], medicines: ["Calcarea Carb", "Phosphorus", "Rhus Tox", "Aesculus", "Calcarea Fluor"] },
  { name: "Back Pain", category: "Musculoskeletal Diseases", symptoms: ["Muscle ache", "Shooting pain", "Pain radiating down leg", "Limited flexibility", "Difficulty standing", "Pain worsened by lifting", "Pain improved by rest", "Stiffness"], medicines: ["Rhus Tox", "Bryonia", "Arnica", "Hypericum", "Kali Carb"] },
  { name: "Neck Pain", category: "Musculoskeletal Diseases", symptoms: ["Stiffness", "Sharp pain", "Pain worsened by movement", "Headache", "Numbness", "Tingling in arms", "Muscle spasms", "Difficulty turning head"], medicines: ["Rhus Tox", "Lachnanthes", "Cimicifuga", "Bryonia", "Causticum"] },
  { name: "Tendinitis", category: "Musculoskeletal Diseases", symptoms: ["Pain near joint", "Tenderness", "Mild swelling", "Pain worsened by movement", "Stiffness", "Weakness", "Crepitus", "Limited range of motion"], medicines: ["Rhus Tox", "Ruta Graveolens", "Arnica", "Bryonia", "Causticum"] },
  { name: "Bursitis", category: "Musculoskeletal Diseases", symptoms: ["Joint pain", "Swelling", "Warmth", "Redness", "Pain with movement", "Stiffness", "Tenderness", "Limited range of motion"], medicines: ["Rhus Tox", "Ruta Graveolens", "Sticta", "Bryonia", "Kali Mur"] },
  { name: "Carpal Tunnel Syndrome", category: "Musculoskeletal Diseases", symptoms: ["Numbness in hand", "Tingling in fingers", "Pain in wrist", "Weakness", "Dropping things", "Burning sensation", "Symptoms worse at night", "Shock-like sensation"], medicines: ["Causticum", "Hypericum", "Ruta Graveolens", "Rhus Tox", "Plumbum Met"] },
  { name: "Tennis Elbow", category: "Musculoskeletal Diseases", symptoms: ["Elbow pain", "Pain radiating to forearm", "Weak grip", "Pain when lifting", "Pain when gripping", "Tenderness", "Stiffness", "Difficulty turning doorknobs"], medicines: ["Ruta Graveolens", "Rhus Tox", "Arnica", "Bryonia", "Bellis Perennis"] },
  { name: "Frozen Shoulder", category: "Musculoskeletal Diseases", symptoms: ["Shoulder pain", "Stiffness", "Limited range of motion", "Pain worsened at night", "Difficulty sleeping", "Pain with movement", "Gradual onset", "Difficulty reaching back"], medicines: ["Rhus Tox", "Sanguinaria", "Ferrum Met", "Bryonia", "Causticum"] },
  { name: "Muscle Strain", category: "Musculoskeletal Diseases", symptoms: ["Pain", "Swelling", "Bruising", "Limited movement", "Muscle spasms", "Weakness", "Stiffness", "Cramping"], medicines: ["Arnica", "Rhus Tox", "Ruta Graveolens", "Bryonia", "Bellis Perennis"] },
  { name: "Ligament Tear", category: "Musculoskeletal Diseases", symptoms: ["Pain at time of injury", "Swelling", "Bruising", "Instability", "Difficulty bearing weight", "Popping sensation", "Limited range of motion", "Tenderness"], medicines: ["Arnica", "Ruta Graveolens", "Rhus Tox", "Strontium Carb", "Calcarea Carb"] },
  { name: "Bone Fracture", category: "Musculoskeletal Diseases", symptoms: ["Intense pain", "Swelling", "Bruising", "Deformity", "Inability to move limb", "Tenderness", "Numbness", "Bone protruding"], medicines: ["Symphytum", "Arnica", "Calcarea Phos", "Ruta Graveolens", "Silicea"] },
  { name: "Dislocation", category: "Musculoskeletal Diseases", symptoms: ["Visible deformity", "Intense pain", "Swelling", "Inability to move joint", "Bruising", "Numbness", "Tingling", "Weakness"], medicines: ["Arnica", "Rhus Tox", "Ruta Graveolens", "Bryonia", "Calcarea Carb"] },
  { name: "Fibromyalgia", category: "Musculoskeletal Diseases", symptoms: ["Widespread pain", "Fatigue", "Cognitive difficulties", "Sleep problems", "Headaches", "Depression", "Anxiety", "Digestive issues"], medicines: ["Rhus Tox", "Arnica", "Bryonia", "Causticum", "Kali Phos"] },
  { name: "Myositis", category: "Musculoskeletal Diseases", symptoms: ["Muscle weakness", "Muscle pain", "Fatigue", "Difficulty swallowing", "Difficulty breathing", "Falling", "Tripping", "Skin rash"], medicines: ["Arnica", "Rhus Tox", "Bryonia", "Gelsemium", "Phosphorus"] },
  { name: "Polymyalgia Rheumatica", category: "Musculoskeletal Diseases", symptoms: ["Aching and stiffness", "Pain in shoulders", "Pain in neck", "Pain in upper arms", "Pain in hips", "Fatigue", "Malaise", "Depression"], medicines: ["Rhus Tox", "Bryonia", "Colchicum", "Ledum Pal", "Phytolacca"] },
  { name: "Paget's Disease", category: "Musculoskeletal Diseases", symptoms: ["Bone pain", "Enlarged or deformed bones", "Fractures", "Arthritis", "Hearing loss", "Headaches", "Tingling", "Numbness"], medicines: ["Calcarea Carb", "Phosphorus", "Silicea", "Calcarea Fluor", "Symphytum"] },
  { name: "Osteomyelitis", category: "Musculoskeletal Diseases", symptoms: ["Bone pain", "Fever", "Chills", "Swelling", "Redness", "Warmth", "Fatigue", "Irritability"], medicines: ["Silicea", "Hepar Sulph", "Phosphorus", "Calcarea Carb", "Aurum Met"] },

  // ============ INFECTIOUS DISEASES ============
  { name: "Malaria", category: "Infectious Diseases", symptoms: ["Cyclic fever", "Chills", "Sweating", "Headache", "Nausea", "Vomiting", "Muscle pain", "Fatigue"], medicines: ["China", "Natrum Mur", "Arsenicum Album", "Eupatorium Perf", "Ipecac"] },
  { name: "Dengue Fever", category: "Infectious Diseases", symptoms: ["High fever", "Severe headache", "Pain behind eyes", "Joint pain", "Muscle pain", "Skin rash", "Fatigue", "Bleeding gums"], medicines: ["Eupatorium Perfoliatum", "Gelsemium", "Bryonia", "Rhus Tox", "China"] },
  { name: "Chikungunya", category: "Infectious Diseases", symptoms: ["High fever", "Joint pain", "Muscle pain", "Headache", "Fatigue", "Nausea", "Skin rash", "Joint swelling"], medicines: ["Eupatorium Perf", "Rhus Tox", "Bryonia", "Polyporus", "Gelsemium"] },
  { name: "Zika Virus", category: "Infectious Diseases", symptoms: ["Mild fever", "Rash", "Joint pain", "Red eyes", "Muscle pain", "Headache", "Fatigue", "Malaise"], medicines: ["Eupatorium Perf", "Rhus Tox", "Bryonia", "Gelsemium", "Arsenicum Album"] },
  { name: "Ebola", category: "Infectious Diseases", symptoms: ["Fever", "Severe headache", "Muscle pain", "Weakness", "Fatigue", "Diarrhea", "Vomiting", "Unexplained bleeding"], medicines: ["Arsenicum Album", "Crotalus Horridus", "Phosphorus", "Lachesis", "Pyrogenium"] },
  { name: "HIV/AIDS", category: "Infectious Diseases", symptoms: ["Rapid weight loss", "Recurring fever", "Night sweats", "Extreme fatigue", "Swollen lymph nodes", "Diarrhea", "Mouth sores", "Pneumonia"], medicines: ["Arsenicum Album", "Carcinosin", "Thuja", "Natrum Mur", "Phosphorus"] },
  { name: "Syphilis", category: "Infectious Diseases", symptoms: ["Painless sore", "Skin rash", "Fever", "Swollen lymph nodes", "Sore throat", "Patchy hair loss", "Headaches", "Muscle aches"], medicines: ["Mercurius", "Syphilinum", "Aurum Met", "Nitric Acid", "Kali Iod"] },
  { name: "Gonorrhea", category: "Infectious Diseases", symptoms: ["Painful urination", "Discharge", "Increased urination", "Sore throat", "Pain during intercourse", "Testicular pain", "Pelvic pain", "Eye discharge"], medicines: ["Medorrhinum", "Thuja", "Mercurius", "Cannabis Sativa", "Pulsatilla"] },
  { name: "Chlamydia", category: "Infectious Diseases", symptoms: ["Painful urination", "Discharge", "Pain during intercourse", "Bleeding between periods", "Testicular pain", "Rectal pain", "Lower abdominal pain", "Often asymptomatic"], medicines: ["Medorrhinum", "Sepia", "Pulsatilla", "Thuja", "Natrum Mur"] },
  { name: "Typhoid Fever", category: "Infectious Diseases", symptoms: ["Sustained fever", "Weakness", "Abdominal pain", "Headache", "Loss of appetite", "Constipation or diarrhea", "Rose spots", "Enlarged spleen"], medicines: ["Baptisia", "Arsenicum Album", "Bryonia", "Rhus Tox", "Phosphoric Acid"] },
  { name: "Cholera", category: "Infectious Diseases", symptoms: ["Profuse watery diarrhea", "Vomiting", "Severe dehydration", "Leg cramps", "Rapid heart rate", "Low blood pressure", "Thirst", "Restlessness"], medicines: ["Veratrum Album", "Camphor", "Cuprum Met", "Arsenicum Album", "Carbo Veg"] },
  { name: "Plague", category: "Infectious Diseases", symptoms: ["Fever", "Chills", "Headache", "Muscle aches", "Swollen lymph nodes", "Weakness", "Bleeding", "Abdominal pain"], medicines: ["Arsenicum Album", "Crotalus Horridus", "Lachesis", "Pyrogenium", "Baptisia"] },
  { name: "Tetanus", category: "Infectious Diseases", symptoms: ["Jaw stiffness", "Muscle spasms", "Painful stiffness", "Difficulty swallowing", "Fever", "Sweating", "High blood pressure", "Rapid heart rate"], medicines: ["Hypericum", "Ledum Pal", "Cicuta", "Angustura Vera", "Strychninum"] },
  { name: "Rabies", category: "Infectious Diseases", symptoms: ["Fever", "Headache", "Anxiety", "Confusion", "Agitation", "Hallucinations", "Hydrophobia", "Excessive salivation"], medicines: ["Hydrophobinum", "Belladonna", "Stramonium", "Lachesis", "Cantharis"] },
  { name: "Measles", category: "Infectious Diseases", symptoms: ["High fever", "Cough", "Runny nose", "Red eyes", "Skin rash", "Koplik spots", "Light sensitivity", "Malaise"], medicines: ["Pulsatilla", "Bryonia", "Euphrasia", "Aconite", "Belladonna"] },
  { name: "Mumps", category: "Infectious Diseases", symptoms: ["Swollen salivary glands", "Fever", "Headache", "Muscle aches", "Fatigue", "Loss of appetite", "Pain while chewing", "Jaw tenderness"], medicines: ["Belladonna", "Mercurius", "Pulsatilla", "Phytolacca", "Pilocarpus"] },
  { name: "Rubella", category: "Infectious Diseases", symptoms: ["Mild fever", "Rash", "Swollen lymph nodes", "Headache", "Red eyes", "Joint pain", "Runny nose", "General discomfort"], medicines: ["Pulsatilla", "Belladonna", "Aconite", "Rhus Tox", "Bryonia"] },
  { name: "Chickenpox", category: "Infectious Diseases", symptoms: ["Itchy rash", "Blisters", "Fever", "Fatigue", "Loss of appetite", "Headache", "Body aches", "Malaise"], medicines: ["Rhus Tox", "Antimonium Crud", "Pulsatilla", "Sulphur", "Antimonium Tart"] },
  { name: "Shingles", category: "Infectious Diseases", symptoms: ["Painful rash", "Burning sensation", "Sensitivity to touch", "Itching", "Fluid-filled blisters", "Fever", "Headache", "Fatigue"], medicines: ["Rhus Tox", "Ranunculus Bulbosus", "Mezereum", "Arsenicum Album", "Variolinum"] },
  { name: "Leprosy", category: "Infectious Diseases", symptoms: ["Skin lesions", "Numbness", "Muscle weakness", "Eye problems", "Nasal congestion", "Nosebleeds", "Enlarged nerves", "Deformities"], medicines: ["Hydrocotyle", "Arsenicum Album", "Syphilinum", "Sulphur", "Sepia"] },
  { name: "Leishmaniasis", category: "Infectious Diseases", symptoms: ["Skin sores", "Fever", "Weight loss", "Enlarged spleen", "Enlarged liver", "Anemia", "Weakness", "Swollen lymph nodes"], medicines: ["Arsenicum Album", "Silicea", "Hepar Sulph", "Mercurius", "Sulphur"] },
  { name: "Amoebiasis", category: "Infectious Diseases", symptoms: ["Diarrhea", "Bloody stool", "Abdominal cramps", "Fatigue", "Weight loss", "Fever", "Flatulence", "Rectal pain"], medicines: ["Mercurius Corrosivus", "Ipecac", "Arsenicum Album", "Aloe", "Podophyllum"] },
  { name: "Giardiasis", category: "Infectious Diseases", symptoms: ["Watery diarrhea", "Fatigue", "Abdominal cramps", "Bloating", "Nausea", "Weight loss", "Foul-smelling stool", "Gas"], medicines: ["Arsenicum Album", "China", "Carbo Veg", "Podophyllum", "Sulphur"] },
  { name: "Ascariasis", category: "Infectious Diseases", symptoms: ["Cough", "Wheezing", "Abdominal pain", "Vomiting", "Diarrhea", "Visible worms in stool", "Intestinal blockage", "Weight loss"], medicines: ["Cina", "Santoninum", "Spigelia", "Teucrium", "Sulphur"] },
  { name: "Hookworm Infection", category: "Infectious Diseases", symptoms: ["Itchy rash at entry site", "Diarrhea", "Abdominal pain", "Fatigue", "Anemia", "Weight loss", "Loss of appetite", "Protein deficiency"], medicines: ["China", "Ferrum Met", "Arsenicum Album", "Cina", "Spigelia"] },
  { name: "Filariasis", category: "Infectious Diseases", symptoms: ["Swelling in limbs", "Swelling in genitals", "Fever", "Skin thickening", "Pain in affected area", "Lymphedema", "Chyluria", "Fatigue"], medicines: ["Arsenicum Album", "Apis Mellifica", "Thiosinaminum", "Silicea", "Sulphur"] },
  { name: "Schistosomiasis", category: "Infectious Diseases", symptoms: ["Rash", "Itchy skin", "Fever", "Chills", "Cough", "Muscle aches", "Abdominal pain", "Blood in stool or urine"], medicines: ["Arsenicum Album", "Mercurius", "Cantharis", "Phosphorus", "Sulphur"] },
  { name: "Scabies", category: "Infectious Diseases", symptoms: ["Intense itching", "Rash", "Thin burrow tracks", "Sores from scratching", "Night itching", "Skin irritation", "Blisters", "Scales"], medicines: ["Sulphur", "Psorinum", "Arsenicum Album", "Sepia", "Causticum"] },
  { name: "Ringworm", category: "Infectious Diseases", symptoms: ["Ring-shaped rash", "Itchy skin", "Red scaly patches", "Raised edges", "Clear center", "Spreading rash", "Bald patches", "Brittle nails"], medicines: ["Tellurium", "Sepia", "Sulphur", "Chrysarobinum", "Bacillinum"] },

  // ============ MENTAL HEALTH DISORDERS ============
  { name: "Depression", category: "Mental Health", symptoms: ["Persistent sadness", "Loss of interest", "Fatigue", "Sleep problems", "Appetite changes", "Guilt feelings", "Difficulty concentrating", "Thoughts of death"], medicines: ["Ignatia", "Natrum Mur", "Aurum Met", "Sepia", "Arsenicum Album"] },
  { name: "Major Depressive Disorder", category: "Mental Health", symptoms: ["Deep sadness", "Hopelessness", "Worthlessness", "Fatigue", "Sleep disturbances", "Appetite changes", "Concentration problems", "Suicidal thoughts"], medicines: ["Aurum Met", "Ignatia", "Natrum Mur", "Sepia", "Phosphoric Acid"] },
  { name: "Anxiety Disorder", category: "Mental Health", symptoms: ["Excessive worry", "Restlessness", "Fatigue", "Difficulty concentrating", "Irritability", "Muscle tension", "Sleep problems", "Sweating"], medicines: ["Argentum Nitricum", "Aconite", "Arsenicum Album", "Gelsemium", "Phosphorus"] },
  { name: "Panic Disorder", category: "Mental Health", symptoms: ["Sudden terror", "Racing heart", "Sweating", "Trembling", "Shortness of breath", "Chest pain", "Feeling of choking", "Fear of dying"], medicines: ["Aconite", "Argentum Nitricum", "Arsenicum Album", "Ignatia", "Phosphorus"] },
  { name: "Phobia", category: "Mental Health", symptoms: ["Intense fear", "Avoidance behavior", "Panic when exposed", "Knowing fear is irrational", "Rapid heartbeat", "Shortness of breath", "Trembling", "Sweating"], medicines: ["Argentum Nitricum", "Phosphorus", "Gelsemium", "Lycopodium", "Stramonium"] },
  { name: "Obsessive-Compulsive Disorder", category: "Mental Health", symptoms: ["Unwanted thoughts", "Repetitive behaviors", "Fear of contamination", "Need for symmetry", "Aggressive thoughts", "Excessive checking", "Counting", "Hand washing"], medicines: ["Arsenicum Album", "Syphilinum", "Thuja", "Argentum Nitricum", "Natrum Mur"] },
  { name: "Post-Traumatic Stress Disorder", category: "Mental Health", symptoms: ["Flashbacks", "Nightmares", "Severe anxiety", "Uncontrollable thoughts", "Emotional numbness", "Avoidance", "Hypervigilance", "Startle response"], medicines: ["Ignatia", "Natrum Mur", "Staphysagria", "Opium", "Stramonium"] },
  { name: "Bipolar Disorder", category: "Mental Health", symptoms: ["Manic episodes", "Depressive episodes", "Mood swings", "Increased energy", "Reduced sleep need", "Racing thoughts", "Impulsivity", "Irritability"], medicines: ["Aurum Met", "Ignatia", "Hyoscyamus", "Stramonium", "Belladonna"] },
  { name: "Schizophrenia", category: "Mental Health", symptoms: ["Hallucinations", "Delusions", "Disorganized thinking", "Abnormal motor behavior", "Reduced emotions", "Social withdrawal", "Cognitive difficulties", "Paranoia"], medicines: ["Hyoscyamus", "Stramonium", "Lachesis", "Veratrum Album", "Cannabis Indica"] },
  { name: "Schizoaffective Disorder", category: "Mental Health", symptoms: ["Hallucinations", "Delusions", "Depressed mood", "Manic behavior", "Disorganized thinking", "Impaired functioning", "Social problems", "Speech difficulties"], medicines: ["Hyoscyamus", "Stramonium", "Lachesis", "Aurum Met", "Veratrum Album"] },
  { name: "Attention Deficit Hyperactivity Disorder", category: "Mental Health", symptoms: ["Inattention", "Hyperactivity", "Impulsivity", "Difficulty focusing", "Forgetfulness", "Fidgeting", "Interrupting others", "Restlessness"], medicines: ["Stramonium", "Tuberculinum", "Tarentula Hispanica", "Veratrum Album", "Hyoscyamus"] },
  { name: "Autism Spectrum Disorder", category: "Mental Health", symptoms: ["Social difficulties", "Communication challenges", "Repetitive behaviors", "Restricted interests", "Sensory sensitivities", "Routine dependence", "Delayed speech", "Eye contact avoidance"], medicines: ["Carcinosin", "Baryta Carb", "Natrum Mur", "Tuberculinum", "Thuja"] },
  { name: "Eating Disorder", category: "Mental Health", symptoms: ["Preoccupation with food", "Distorted body image", "Fear of gaining weight", "Extreme dieting", "Binge eating", "Purging", "Excessive exercise", "Social withdrawal"], medicines: ["Natrum Mur", "Ignatia", "Pulsatilla", "Arsenicum Album", "China"] },
  { name: "Anorexia Nervosa", category: "Mental Health", symptoms: ["Extreme weight loss", "Fear of gaining weight", "Distorted body image", "Restrictive eating", "Excessive exercise", "Denial of hunger", "Fatigue", "Hair thinning"], medicines: ["Natrum Mur", "Ignatia", "Arsenicum Album", "China", "Pulsatilla"] },
  { name: "Bulimia Nervosa", category: "Mental Health", symptoms: ["Binge eating", "Purging", "Fear of weight gain", "Self-induced vomiting", "Laxative abuse", "Fasting", "Excessive exercise", "Swollen cheeks"], medicines: ["Natrum Mur", "Ignatia", "Pulsatilla", "Nux Vomica", "Ipecac"] },
  { name: "Substance Use Disorder", category: "Mental Health", symptoms: ["Craving", "Loss of control", "Tolerance", "Withdrawal symptoms", "Neglecting responsibilities", "Continued use despite problems", "Social isolation", "Risky behaviors"], medicines: ["Nux Vomica", "Sulphur", "Avena Sativa", "Staphysagria", "Arsenicum Album"] },
  { name: "Alcohol Dependence", category: "Mental Health", symptoms: ["Strong cravings", "Loss of control", "Withdrawal symptoms", "Tolerance", "Neglecting activities", "Continued drinking despite problems", "Tremors", "Anxiety"], medicines: ["Nux Vomica", "Sulphur", "Arsenicum Album", "Quercus", "Avena Sativa"] },
  { name: "Personality Disorder", category: "Mental Health", symptoms: ["Distorted thinking", "Problematic emotional responses", "Impulse control issues", "Interpersonal difficulties", "Unstable self-image", "Chronic emptiness", "Intense anger", "Paranoid thoughts"], medicines: ["Natrum Mur", "Lachesis", "Hyoscyamus", "Stramonium", "Anacardium"] },
  { name: "Dissociative Disorder", category: "Mental Health", symptoms: ["Memory gaps", "Detachment from self", "Blurred sense of identity", "Emotional numbness", "Feeling unreal", "Distorted perceptions", "Depression", "Anxiety"], medicines: ["Cannabis Indica", "Anacardium", "Stramonium", "Hyoscyamus", "Phosphorus"] },

  // ============ EYE, EAR, SKIN & OTHER DISEASES ============
  { name: "Cataract", category: "Eye Diseases", symptoms: ["Clouded vision", "Dim vision", "Faded colors", "Sensitivity to light", "Halos around lights", "Night vision problems", "Double vision", "Frequent prescription changes"], medicines: ["Calcarea Fluor", "Cineraria", "Phosphorus", "Silicea", "Causticum"] },
  { name: "Glaucoma", category: "Eye Diseases", symptoms: ["Gradual vision loss", "Tunnel vision", "Severe eye pain", "Nausea", "Vomiting", "Blurred vision", "Halos around lights", "Red eyes"], medicines: ["Phosphorus", "Spigelia", "Physostigma", "Gelsemium", "Prunus Spinosa"] },
  { name: "Macular Degeneration", category: "Eye Diseases", symptoms: ["Blurred central vision", "Distorted vision", "Dark spots", "Difficulty reading", "Difficulty recognizing faces", "Need for brighter light", "Faded colors", "Visual hallucinations"], medicines: ["Phosphorus", "Ruta Graveolens", "Gelsemium", "Argentum Nitricum", "Silicea"] },
  { name: "Myopia", category: "Eye Diseases", symptoms: ["Blurry distance vision", "Squinting", "Eye strain", "Headaches", "Difficulty seeing while driving", "Need to sit close to screen", "Excessive blinking", "Eye rubbing"], medicines: ["Physostigma", "Ruta Graveolens", "Phosphorus", "Jaborandi", "Natrum Mur"] },
  { name: "Hyperopia", category: "Eye Diseases", symptoms: ["Difficulty seeing close objects", "Eye strain", "Headaches", "Squinting", "Fatigue after reading", "Burning eyes", "Aching in or around eyes", "Difficulty concentrating"], medicines: ["Ruta Graveolens", "Argentum Nitricum", "Phosphorus", "Calcarea Fluor", "Sepia"] },
  { name: "Astigmatism", category: "Eye Diseases", symptoms: ["Blurred vision at all distances", "Eye strain", "Headaches", "Difficulty driving at night", "Squinting", "Eye discomfort", "Difficulty seeing fine details", "Halos around lights"], medicines: ["Physostigma", "Ruta Graveolens", "Argentum Nitricum", "Phosphorus", "Gelsemium"] },
  { name: "Conjunctivitis", category: "Eye Diseases", symptoms: ["Red eyes", "Itchy eyes", "Watery discharge", "Gritty feeling", "Swollen eyelids", "Light sensitivity", "Crusting", "Burning sensation"], medicines: ["Argentum Nitricum", "Euphrasia", "Pulsatilla", "Belladonna", "Apis Mellifica"] },
  { name: "Retinal Detachment", category: "Eye Diseases", symptoms: ["Floaters", "Light flashes", "Blurred vision", "Gradually reducing peripheral vision", "Shadow over visual field", "Sudden vision changes", "Curtain-like shadow", "No pain"], medicines: ["Gelsemium", "Phosphorus", "Aurum Met", "Plumbum Met", "Nux Vomica"] },
  { name: "Dry Eye Syndrome", category: "Eye Diseases", symptoms: ["Stinging eyes", "Burning sensation", "Scratchy feeling", "Stringy mucus", "Light sensitivity", "Eye redness", "Difficulty wearing contacts", "Watery eyes"], medicines: ["Argentum Nitricum", "Alumina", "Natrum Mur", "Pulsatilla", "Sulphur"] },
  { name: "Otitis Media", category: "Ear Diseases", symptoms: ["Ear pain", "Hearing difficulty", "Fluid drainage", "Fever", "Irritability", "Sleep problems", "Balance issues", "Headache"], medicines: ["Belladonna", "Pulsatilla", "Chamomilla", "Hepar Sulph", "Mercurius"] },
  { name: "Otitis Externa", category: "Ear Diseases", symptoms: ["Ear pain", "Itching", "Discharge", "Redness", "Swelling", "Feeling of fullness", "Temporary hearing loss", "Pain when moving ear"], medicines: ["Hepar Sulph", "Tellurium", "Mercurius", "Graphites", "Sulphur"] },
  { name: "Hearing Loss", category: "Ear Diseases", symptoms: ["Muffled speech", "Difficulty understanding words", "Asking others to repeat", "Need to turn up volume", "Withdrawal from conversations", "Tinnitus", "Difficulty hearing consonants", "Avoiding social settings"], medicines: ["Graphites", "Kali Mur", "Chininum Sulph", "Phosphorus", "Verbascum"] },
  { name: "Meniere's Disease", category: "Ear Diseases", symptoms: ["Vertigo", "Tinnitus", "Hearing loss", "Ear fullness", "Nausea", "Vomiting", "Sweating", "Loss of balance"], medicines: ["Chininum Sulph", "Salicylic Acid", "Conium", "Phosphorus", "Cocculus"] },
  { name: "Acne Vulgaris", category: "Skin Diseases", symptoms: ["Whiteheads", "Blackheads", "Pimples", "Nodules", "Cysts", "Oily skin", "Scarring", "Inflammation"], medicines: ["Sulphur", "Hepar Sulph", "Kali Bromatum", "Berberis Aquifolium", "Pulsatilla"] },
  { name: "Eczema", category: "Skin Diseases", symptoms: ["Itchy skin", "Red patches", "Dry skin", "Thickened skin", "Scaly patches", "Oozing", "Crusting", "Sensitive skin"], medicines: ["Graphites", "Sulphur", "Petroleum", "Arsenicum Album", "Rhus Tox"] },
  { name: "Psoriasis", category: "Skin Diseases", symptoms: ["Red patches", "Silvery scales", "Dry cracked skin", "Itching", "Burning", "Thickened nails", "Stiff joints", "Soreness"], medicines: ["Arsenicum Album", "Graphites", "Sulphur", "Petroleum", "Sepia"] },
  { name: "Dermatitis", category: "Skin Diseases", symptoms: ["Itchy skin", "Red rash", "Dry skin", "Blisters", "Swelling", "Cracking", "Scaling", "Oozing"], medicines: ["Graphites", "Sulphur", "Rhus Tox", "Petroleum", "Arsenicum Album"] },
  { name: "Urticaria", category: "Skin Diseases", symptoms: ["Raised welts", "Itching", "Red or skin-colored bumps", "Burning", "Stinging", "Swelling", "Blanching when pressed", "Variable sizes"], medicines: ["Apis Mellifica", "Urtica Urens", "Rhus Tox", "Arsenicum Album", "Natrum Mur"] },
  { name: "Vitiligo", category: "Skin Diseases", symptoms: ["White patches", "Premature graying", "Loss of color", "Sensitive patches", "Spreading areas", "Symmetrical patterns", "Color loss in mucous membranes", "Eye color changes"], medicines: ["Arsenicum Sulph Flavum", "Syphilinum", "Calcarea Carb", "Sepia", "Phosphorus"] },
  { name: "Alopecia Areata", category: "Skin Diseases", symptoms: ["Patchy hair loss", "Round bald spots", "Smooth bald patches", "Hair breaking off", "Exclamation mark hairs", "White hairs regrowing", "Nail pitting", "Nail ridges"], medicines: ["Arsenicum Album", "Phosphorus", "Fluoric Acid", "Lycopodium", "Silicea"] },
  { name: "Melanoma", category: "Skin Diseases", symptoms: ["Unusual mole", "Changing mole", "Asymmetrical mole", "Irregular borders", "Color changes", "Diameter increase", "Evolving appearance", "Itching"], medicines: ["Arsenicum Album", "Carcinosin", "Phosphorus", "Thuja", "Radium Bromatum"] },
  { name: "Basal Cell Carcinoma", category: "Skin Diseases", symptoms: ["Pearly bump", "Flat flesh-colored lesion", "Brown scar-like lesion", "Bleeding sore that heals", "Recurring sore", "Waxy bump", "Raised edges", "Central depression"], medicines: ["Arsenicum Album", "Hydrastis", "Phosphorus", "Thuja", "Silicea"] },
  { name: "Squamous Cell Carcinoma", category: "Skin Diseases", symptoms: ["Firm red nodule", "Flat sore with scaly crust", "New sore on old scar", "Rough scaly patch on lip", "Red sore in mouth", "Wart-like sore", "Raised area with central depression", "Bleeding lesion"], medicines: ["Arsenicum Album", "Hydrastis", "Nitric Acid", "Phosphorus", "Carcinosin"] },

  // ============ AUTOIMMUNE & BLOOD DISEASES ============
  { name: "Lupus", category: "Autoimmune Diseases", symptoms: ["Butterfly rash", "Fatigue", "Joint pain", "Fever", "Skin lesions", "Photosensitivity", "Kidney problems", "Hair loss"], medicines: ["Arsenicum Album", "Natrum Mur", "Phosphorus", "Sepia", "Sulphur"] },
  { name: "Scleroderma", category: "Autoimmune Diseases", symptoms: ["Hardened skin", "Raynaud's phenomenon", "Digestive problems", "Heartburn", "Shortness of breath", "Fatigue", "Joint pain", "Skin tightening"], medicines: ["Silicea", "Graphites", "Rhus Tox", "Phosphorus", "Arsenicum Album"] },
  { name: "Sjogren's Syndrome", category: "Autoimmune Diseases", symptoms: ["Dry eyes", "Dry mouth", "Joint pain", "Fatigue", "Swollen salivary glands", "Dry skin", "Vaginal dryness", "Persistent cough"], medicines: ["Natrum Mur", "Alumina", "Pulsatilla", "Bryonia", "Phosphorus"] },
  { name: "Vasculitis", category: "Autoimmune Diseases", symptoms: ["Fever", "Headache", "Fatigue", "Weight loss", "General aches", "Night sweats", "Numbness", "Weakness"], medicines: ["Arsenicum Album", "Phosphorus", "Lachesis", "Secale Cor", "Mercurius"] },
  { name: "Anemia", category: "Blood Disorders", symptoms: ["Fatigue", "Weakness", "Pale skin", "Shortness of breath", "Dizziness", "Cold hands", "Brittle nails", "Headaches"], medicines: ["Ferrum Met", "China", "Natrum Mur", "Calcarea Phos", "Phosphorus"] },
  { name: "Iron Deficiency Anemia", category: "Blood Disorders", symptoms: ["Extreme fatigue", "Weakness", "Pale skin", "Chest pain", "Shortness of breath", "Headache", "Dizziness", "Cold hands and feet"], medicines: ["Ferrum Met", "China", "Calcarea Phos", "Natrum Mur", "Phosphorus"] },
  { name: "Sickle Cell Disease", category: "Blood Disorders", symptoms: ["Fatigue", "Pain crises", "Swelling", "Frequent infections", "Delayed growth", "Vision problems", "Jaundice", "Pale skin"], medicines: ["Crotalus Horridus", "Lachesis", "Phosphorus", "Arsenicum Album", "Natrum Mur"] },
  { name: "Thalassemia", category: "Blood Disorders", symptoms: ["Fatigue", "Weakness", "Pale skin", "Facial bone deformities", "Slow growth", "Dark urine", "Yellow skin", "Enlarged spleen"], medicines: ["Ferrum Met", "China", "Natrum Mur", "Arsenicum Album", "Phosphorus"] },
  { name: "Leukemia", category: "Blood Disorders", symptoms: ["Fatigue", "Fever", "Frequent infections", "Weight loss", "Swollen lymph nodes", "Easy bleeding", "Bone pain", "Night sweats"], medicines: ["Arsenicum Album", "Phosphorus", "Carcinosin", "Natrum Mur", "Thuja"] },
  { name: "Lymphoma", category: "Blood Disorders", symptoms: ["Swollen lymph nodes", "Fatigue", "Fever", "Night sweats", "Weight loss", "Itching", "Shortness of breath", "Chest pain"], medicines: ["Arsenicum Album", "Conium", "Phytolacca", "Baryta Carb", "Carcinosin"] },
  { name: "Multiple Myeloma", category: "Blood Disorders", symptoms: ["Bone pain", "Fatigue", "Frequent infections", "Weight loss", "Weakness", "Excessive thirst", "Nausea", "Confusion"], medicines: ["Phosphorus", "Arsenicum Album", "Carcinosin", "Symphytum", "Calcarea Carb"] },

  // ============ UROLOGICAL DISEASES ============
  { name: "Kidney Stones", category: "Urological Diseases", symptoms: ["Severe side pain", "Radiating pain", "Painful urination", "Pink urine", "Cloudy urine", "Nausea", "Frequent urination", "Fever"], medicines: ["Berberis Vulgaris", "Lycopodium", "Cantharis", "Sarsaparilla", "Ocimum Canum"] },
  { name: "Chronic Kidney Disease", category: "Urological Diseases", symptoms: ["Fatigue", "Swelling", "Decreased urination", "Shortness of breath", "Nausea", "Confusion", "Chest pain", "High blood pressure"], medicines: ["Apis Mellifica", "Arsenicum Album", "Berberis Vulgaris", "Cantharis", "Solidago"] },
  { name: "Acute Kidney Injury", category: "Urological Diseases", symptoms: ["Decreased urine output", "Fluid retention", "Shortness of breath", "Fatigue", "Confusion", "Nausea", "Weakness", "Irregular heartbeat"], medicines: ["Cantharis", "Arsenicum Album", "Apis Mellifica", "Terebinthina", "Phosphorus"] },
  { name: "Urinary Tract Infection", category: "Urological Diseases", symptoms: ["Burning urination", "Frequent urination", "Urgency", "Cloudy urine", "Pelvic pain", "Blood in urine", "Strong odor", "Low fever"], medicines: ["Cantharis", "Apis Mellifica", "Berberis Vulgaris", "Staphysagria", "Sarsaparilla"] },
  { name: "Prostate Cancer", category: "Urological Diseases", symptoms: ["Frequent urination", "Weak urine flow", "Blood in urine", "Erectile dysfunction", "Bone pain", "Weight loss", "Fatigue", "Pelvic discomfort"], medicines: ["Conium", "Sabal Serrulata", "Thuja", "Carcinosin", "Arsenicum Album"] },
  { name: "Benign Prostatic Hyperplasia", category: "Urological Diseases", symptoms: ["Frequent urination", "Urgency", "Difficulty starting urination", "Weak urine stream", "Dribbling", "Incomplete emptying", "Straining", "Nocturia"], medicines: ["Sabal Serrulata", "Conium", "Chimaphila", "Clematis", "Thuja"] },
  { name: "Erectile Dysfunction", category: "Urological Diseases", symptoms: ["Difficulty getting erection", "Difficulty maintaining erection", "Reduced sexual desire", "Anxiety about performance", "Relationship stress", "Low self-esteem", "Depression", "Embarrassment"], medicines: ["Agnus Castus", "Lycopodium", "Caladium", "Nuphar Luteum", "Selenium"] },
  { name: "Infertility", category: "Urological Diseases", symptoms: ["Unable to conceive", "Irregular menstrual cycles", "Hormonal imbalances", "Painful periods", "Low sperm count", "Erectile dysfunction", "Ejaculation problems", "Testicular swelling"], medicines: ["Sepia", "Pulsatilla", "Natrum Carb", "Agnus Castus", "Lycopodium"] },

  // ============ GYNECOLOGICAL DISEASES ============
  { name: "Endometriosis", category: "Gynecological Diseases", symptoms: ["Painful periods", "Pelvic pain", "Pain during intercourse", "Heavy periods", "Infertility", "Fatigue", "Bloating", "Nausea"], medicines: ["Sepia", "Pulsatilla", "Sabina", "Cimicifuga", "Nux Vomica"] },
  { name: "Ovarian Cyst", category: "Gynecological Diseases", symptoms: ["Pelvic pain", "Bloating", "Feeling of fullness", "Pressure on bladder", "Irregular periods", "Pain during intercourse", "Nausea", "Breast tenderness"], medicines: ["Apis Mellifica", "Lachesis", "Lycopodium", "Palladium", "Thuja"] },
  { name: "Cervical Cancer", category: "Gynecological Diseases", symptoms: ["Abnormal bleeding", "Bleeding after intercourse", "Pelvic pain", "Pain during intercourse", "Watery discharge", "Blood-tinged discharge", "Foul-smelling discharge", "Leg pain"], medicines: ["Carcinosin", "Arsenicum Album", "Phosphorus", "Hydrastis", "Kreosotum"] },
  { name: "Breast Cancer", category: "Gynecological Diseases", symptoms: ["Breast lump", "Breast changes", "Nipple discharge", "Nipple changes", "Skin changes", "Breast pain", "Swelling", "Redness"], medicines: ["Conium", "Phytolacca", "Carcinosin", "Asterias Rubens", "Phosphorus"] },
  { name: "Testicular Cancer", category: "Gynecological Diseases", symptoms: ["Lump in testicle", "Swelling", "Heaviness in scrotum", "Dull ache in abdomen", "Back pain", "Breast growth", "Breast tenderness", "Early puberty signs"], medicines: ["Conium", "Carcinosin", "Clematis", "Spongia", "Aurum Met"] },

  // ============ ENVIRONMENTAL & NUTRITIONAL CONDITIONS ============
  { name: "Heat Stroke", category: "Environmental Conditions", symptoms: ["High body temperature", "Altered mental state", "Hot dry skin", "Nausea", "Rapid breathing", "Racing heart rate", "Headache", "Flushing"], medicines: ["Belladonna", "Glonoine", "Natrum Carb", "Gelsemium", "Cuprum Met"] },
  { name: "Hypothermia", category: "Environmental Conditions", symptoms: ["Shivering", "Slurred speech", "Slow breathing", "Weak pulse", "Confusion", "Drowsiness", "Loss of coordination", "Red cold skin"], medicines: ["Camphora", "Carbo Veg", "Arsenicum Album", "Veratrum Album", "Aconite"] },
  { name: "Dehydration", category: "Environmental Conditions", symptoms: ["Extreme thirst", "Dry mouth", "Less urination", "Dark urine", "Fatigue", "Dizziness", "Confusion", "Rapid heartbeat"], medicines: ["China", "Arsenicum Album", "Veratrum Album", "Phosphoric Acid", "Carbo Veg"] },
  { name: "Malnutrition", category: "Nutritional Disorders", symptoms: ["Weight loss", "Fatigue", "Dizziness", "Depressed immune function", "Dry skin", "Slow wound healing", "Muscle wasting", "Bloating"], medicines: ["China", "Arsenicum Album", "Calcarea Carb", "Phosphorus", "Natrum Mur"] },
  { name: "Vitamin D Deficiency", category: "Nutritional Disorders", symptoms: ["Bone pain", "Muscle weakness", "Fatigue", "Depression", "Impaired wound healing", "Bone loss", "Hair loss", "Muscle pain"], medicines: ["Calcarea Carb", "Calcarea Phos", "Phosphorus", "Silicea", "Symphytum"] },
  { name: "Vitamin B12 Deficiency", category: "Nutritional Disorders", symptoms: ["Fatigue", "Weakness", "Pale skin", "Tingling in hands and feet", "Balance problems", "Depression", "Confusion", "Mouth ulcers"], medicines: ["Phosphorus", "Arsenicum Album", "Natrum Mur", "Picric Acid", "Plumbum Met"] },
  { name: "Food Allergy", category: "Allergic Conditions", symptoms: ["Hives", "Itching", "Swelling", "Abdominal pain", "Diarrhea", "Nausea", "Vomiting", "Anaphylaxis"], medicines: ["Apis Mellifica", "Urtica Urens", "Arsenicum Album", "Pulsatilla", "Natrum Mur"] },
  { name: "Drug Allergy", category: "Allergic Conditions", symptoms: ["Skin rash", "Hives", "Itching", "Fever", "Swelling", "Shortness of breath", "Runny nose", "Watery eyes"], medicines: ["Apis Mellifica", "Urtica Urens", "Sulphur", "Arsenicum Album", "Nux Vomica"] },
  { name: "Anaphylaxis", category: "Allergic Conditions", symptoms: ["Skin reactions", "Low blood pressure", "Constricted airways", "Weak rapid pulse", "Nausea", "Vomiting", "Dizziness", "Loss of consciousness"], medicines: ["Apis Mellifica", "Carbo Veg", "Arsenicum Album", "Camphora", "Aconite"] },
  { name: "Motion Sickness", category: "Environmental Conditions", symptoms: ["Nausea", "Vomiting", "Dizziness", "Sweating", "Pale skin", "Headache", "Increased salivation", "Fatigue"], medicines: ["Cocculus", "Tabacum", "Petroleum", "Sepia", "Nux Vomica"] },
  { name: "Altitude Sickness", category: "Environmental Conditions", symptoms: ["Headache", "Fatigue", "Dizziness", "Nausea", "Shortness of breath", "Rapid heartbeat", "Difficulty sleeping", "Loss of appetite"], medicines: ["Coca", "Arsenicum Album", "Carbo Veg", "Gelsemium", "Phosphorus"] },
  { name: "Chronic Fatigue Syndrome", category: "Systemic Diseases", symptoms: ["Extreme fatigue", "Sleep problems", "Difficulty concentrating", "Muscle pain", "Headaches", "Sore throat", "Tender lymph nodes", "Joint pain"], medicines: ["Gelsemium", "Phosphoric Acid", "Kali Phos", "China", "Arsenicum Album"] },

  // ============ RARE & GENETIC DISEASES ============
  { name: "Wilson's Disease", category: "Genetic Diseases", symptoms: ["Fatigue", "Abdominal pain", "Jaundice", "Tremors", "Difficulty speaking", "Difficulty swallowing", "Personality changes", "Kayser-Fleischer rings"], medicines: ["Cuprum Met", "Chelidonium", "Phosphorus", "Arsenicum Album", "Lycopodium"] },
  { name: "Hemochromatosis", category: "Genetic Diseases", symptoms: ["Joint pain", "Fatigue", "Abdominal pain", "Diabetes symptoms", "Liver disease", "Bronze skin color", "Loss of sex drive", "Heart problems"], medicines: ["Ferrum Met", "Chelidonium", "Lycopodium", "Phosphorus", "Arsenicum Album"] },
  { name: "Sarcoidosis", category: "Systemic Diseases", symptoms: ["Fatigue", "Swollen lymph nodes", "Weight loss", "Joint pain", "Dry mouth", "Nosebleeds", "Skin abnormalities", "Shortness of breath"], medicines: ["Silicea", "Phosphorus", "Arsenicum Album", "Calcarea Carb", "Tuberculinum"] },
  { name: "Lyme Disease", category: "Infectious Diseases", symptoms: ["Bull's-eye rash", "Fever", "Chills", "Fatigue", "Body aches", "Headache", "Neck stiffness", "Swollen lymph nodes"], medicines: ["Ledum Pal", "Arsenicum Album", "Rhus Tox", "Bryonia", "Aurum Arsenicum"] },
  { name: "Marfan Syndrome", category: "Genetic Diseases", symptoms: ["Tall and slender build", "Long arms and fingers", "Chest abnormalities", "Scoliosis", "Flat feet", "Crowded teeth", "Heart murmur", "Extreme nearsightedness"], medicines: ["Calcarea Fluor", "Calcarea Phos", "Phosphorus", "Silicea", "Sulphur"] },
  { name: "Down Syndrome", category: "Genetic Diseases", symptoms: ["Flattened face", "Small head", "Short neck", "Protruding tongue", "Upward slanting eyes", "Unusual shaped ears", "Poor muscle tone", "Short height"], medicines: ["Baryta Carb", "Calcarea Carb", "Thyroidinum", "Tuberculinum", "Carcinosin"] },
  { name: "Diabetic Ketoacidosis", category: "Endocrine Diseases", symptoms: ["Excessive thirst", "Frequent urination", "Nausea", "Vomiting", "Abdominal pain", "Weakness", "Fruity breath", "Confusion"], medicines: ["Phosphoric Acid", "Arsenicum Album", "Syzygium", "Uranium Nitricum", "Carbo Veg"] },
  { name: "Sepsis", category: "Infectious Diseases", symptoms: ["Fever", "Rapid heart rate", "Rapid breathing", "Confusion", "Low blood pressure", "Decreased urination", "Skin discoloration", "Extreme weakness"], medicines: ["Arsenicum Album", "Pyrogenium", "Baptisia", "Lachesis", "Carbo Veg"] },
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

    let created = 0;
    let skipped = 0;
    let errors = 0;

    // Process diseases in batches to avoid overwhelming the database
    const batchSize = 20;
    for (let i = 0; i < diseaseData.length; i += batchSize) {
      const batch = diseaseData.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (disease) => {
        const slug = createSlug(disease.name);
        
        try {
          // Check if disease already exists
          const { data: existing } = await supabase
            .from('diseases')
            .select('id')
            .eq('slug', slug)
            .single();

          if (existing) {
            console.log(`Disease ${disease.name} already exists, skipping...`);
            return { status: 'skipped', name: disease.name };
          }

          const content = generateDiseaseContent(disease);
          
          const diseaseRecord = {
            name: disease.name,
            slug: slug,
            category: disease.category,
            summary: `Comprehensive guide to ${disease.name} including symptoms, causes, and homeopathic treatment options with remedies like ${disease.medicines.slice(0, 3).join(", ")}.`,
            symptoms: disease.symptoms,
            overview: content.overview,
            homeopathic_perspective: content.homeopathic_perspective,
            causes: content.causes,
            early_symptoms: content.early_symptoms,
            advanced_symptoms: content.advanced_symptoms,
            when_to_consult: content.when_to_consult,
            lifestyle_tips: content.lifestyle_tips,
            medicines: disease.medicines.map((med, index) => ({
              name: med,
              description: `${med} is a valuable homeopathic remedy for ${disease.name}. It is particularly indicated when specific symptom patterns match the remedy picture.`,
              indications: disease.symptoms.slice(index % disease.symptoms.length, (index % disease.symptoms.length) + 3),
              potency: index === 0 ? "30C, 200C" : index === 1 ? "6C, 30C" : "30C",
              dosage: "As directed by a qualified homeopathic practitioner"
            }))
          };

          const { error: insertError } = await supabase
            .from('diseases')
            .insert(diseaseRecord);

          if (insertError) {
            console.error(`Error inserting ${disease.name}:`, insertError);
            return { status: 'error', name: disease.name, error: insertError };
          }

          console.log(`Successfully created: ${disease.name}`);
          return { status: 'created', name: disease.name };
        } catch (err) {
          console.error(`Error processing ${disease.name}:`, err);
          return { status: 'error', name: disease.name, error: err };
        }
      });

      const results = await Promise.all(batchPromises);
      
      results.forEach(result => {
        if (result.status === 'created') created++;
        else if (result.status === 'skipped') skipped++;
        else errors++;
      });

      console.log(`Batch ${Math.floor(i / batchSize) + 1} complete. Progress: ${i + batch.length}/${diseaseData.length}`);
    }

    console.log(`Disease generation complete. Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Disease generation complete`,
        stats: { total: diseaseData.length, created, skipped, errors }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in generate-diseases function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
