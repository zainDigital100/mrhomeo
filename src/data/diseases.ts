export interface Disease {
  id: string;
  name: string;
  summary: string;
  symptoms: string[];
  category: string;
  overview: string;
  causes: string[];
  earlySymptoms: string[];
  advancedSymptoms: string[];
  homeopathicPerspective: string;
  medicines: {
    name: string;
    indications: string;
    guidance: string;
  }[];
  lifestyleTips: string[];
  whenToConsult: string[];
}

export const diseases: Disease[] = [
  {
    id: "anxiety",
    name: "Anxiety Disorder",
    summary: "A condition characterized by excessive worry, nervousness, and fear that affects daily life.",
    symptoms: ["Restlessness", "Rapid heartbeat", "Difficulty concentrating", "Sleep problems"],
    category: "Mental Health",
    overview: "Anxiety disorders are among the most common mental health conditions, characterized by persistent feelings of worry, fear, or nervousness that can interfere with daily activities. Unlike occasional anxiety, which is a normal response to stress, anxiety disorders involve excessive and prolonged anxiety that doesn't go away and may worsen over time.",
    causes: [
      "Genetic predisposition and family history",
      "Brain chemistry imbalances",
      "Traumatic life experiences",
      "Chronic stress or major life changes",
      "Underlying health conditions",
      "Substance use or withdrawal"
    ],
    earlySymptoms: [
      "Persistent worry about everyday matters",
      "Feeling on edge or restless",
      "Difficulty relaxing",
      "Irritability",
      "Trouble falling asleep"
    ],
    advancedSymptoms: [
      "Panic attacks with chest pain and shortness of breath",
      "Avoidance of social situations",
      "Severe sleep disturbances",
      "Physical symptoms like trembling and sweating",
      "Inability to control worrying thoughts"
    ],
    homeopathicPerspective: "Homeopathy views anxiety as a manifestation of the whole person's imbalance rather than just a mental condition. Treatment focuses on understanding the individual's unique experience of anxiety, including triggers, accompanying physical symptoms, and emotional patterns. The goal is to restore balance to the vital force and strengthen the person's natural coping mechanisms.",
    medicines: [
      {
        name: "Aconitum Napellus",
        indications: "Sudden onset anxiety, panic attacks, fear of death, restlessness with rapid heartbeat",
        guidance: "Particularly suited for anxiety that comes on suddenly, often after a fright or shock. The person may feel extremely fearful and restless."
      },
      {
        name: "Argentum Nitricum",
        indications: "Anticipatory anxiety, fear of heights, impulsive behavior, digestive upset with anxiety",
        guidance: "Helpful for people who experience anxiety before events like exams, interviews, or public speaking, often accompanied by diarrhea."
      },
      {
        name: "Gelsemium",
        indications: "Stage fright, trembling, weakness, drowsiness with anxiety, anticipation anxiety",
        guidance: "Suited for anxiety that causes weakness and trembling, particularly before performances or important events."
      },
      {
        name: "Arsenicum Album",
        indications: "Anxiety about health, restlessness, perfectionism, fear at night, need for reassurance",
        guidance: "For individuals who are anxious about their health, very particular and orderly, and feel worse at night."
      }
    ],
    lifestyleTips: [
      "Practice deep breathing exercises and meditation daily",
      "Maintain regular sleep schedule with 7-8 hours of rest",
      "Limit caffeine and alcohol consumption",
      "Exercise regularly to release tension",
      "Connect with supportive friends and family",
      "Consider journaling to process anxious thoughts"
    ],
    whenToConsult: [
      "Anxiety significantly interferes with work or relationships",
      "Experiencing frequent panic attacks",
      "Having thoughts of self-harm",
      "Unable to control worry despite self-help measures",
      "Physical symptoms like chest pain or severe headaches"
    ]
  },
  {
    id: "migraine",
    name: "Migraine",
    summary: "Intense, recurring headaches often accompanied by nausea, light sensitivity, and visual disturbances.",
    symptoms: ["Throbbing head pain", "Nausea", "Light sensitivity", "Visual auras"],
    category: "Neurological",
    overview: "Migraines are complex neurological conditions that cause intense, debilitating headaches typically affecting one side of the head. They can last from hours to days and are often accompanied by sensory disturbances, nausea, and extreme sensitivity to light and sound. Migraines are more than just headaches; they're a neurological event that can significantly impact quality of life.",
    causes: [
      "Hormonal changes, especially in women",
      "Certain foods and food additives",
      "Stress and emotional triggers",
      "Changes in sleep patterns",
      "Environmental factors like weather changes",
      "Genetic factors - migraines often run in families"
    ],
    earlySymptoms: [
      "Prodrome symptoms: mood changes, food cravings",
      "Neck stiffness",
      "Increased thirst and urination",
      "Frequent yawning",
      "Visual aura with zigzag patterns or blind spots"
    ],
    advancedSymptoms: [
      "Severe, pulsating pain on one or both sides of head",
      "Extreme sensitivity to light, sound, and smells",
      "Nausea and vomiting",
      "Blurred vision",
      "Lightheadedness, sometimes leading to fainting"
    ],
    homeopathicPerspective: "Homeopathic treatment of migraines focuses on the individual's unique symptom pattern, including the location and type of pain, triggers, accompanying symptoms, and what provides relief. Rather than suppressing symptoms, homeopathy aims to reduce the frequency and intensity of migraines by addressing the underlying constitutional imbalance.",
    medicines: [
      {
        name: "Belladonna",
        indications: "Sudden onset, throbbing pain, worse from light, noise, and motion, face may be flushed",
        guidance: "Suited for intense, violent headaches that come on suddenly, particularly right-sided, with a feeling of fullness in the head."
      },
      {
        name: "Natrum Muriaticum",
        indications: "Headaches from sun exposure, grief or emotional stress, hammering pain, worse in morning",
        guidance: "Helpful for headaches triggered by emotional suppression, sun exposure, or during menstruation."
      },
      {
        name: "Sanguinaria",
        indications: "Right-sided migraine, pain starting from neck, better after vomiting, worse from fasting",
        guidance: "Particularly indicated for right-sided headaches that begin at the back of the head and settle over the right eye."
      },
      {
        name: "Iris Versicolor",
        indications: "Migraine with nausea and vomiting, blurred vision before headache, weekend headaches",
        guidance: "Suited for migraines accompanied by significant nausea and vomiting of bile, often occurring during rest periods."
      }
    ],
    lifestyleTips: [
      "Keep a migraine diary to identify triggers",
      "Maintain consistent sleep and meal schedules",
      "Stay hydrated and avoid trigger foods",
      "Practice stress management techniques",
      "Create a dark, quiet space for rest during attacks",
      "Consider regular gentle exercise when symptom-free"
    ],
    whenToConsult: [
      "New or different headache pattern",
      "Headache after head injury",
      "Sudden, severe 'thunderclap' headache",
      "Headache with fever, stiff neck, or confusion",
      "Migraines becoming more frequent or severe"
    ]
  },
  {
    id: "eczema",
    name: "Eczema (Atopic Dermatitis)",
    summary: "A chronic skin condition causing itchy, inflamed, and dry patches of skin.",
    symptoms: ["Itchy skin", "Dry patches", "Red inflammation", "Skin cracking"],
    category: "Skin Conditions",
    overview: "Eczema, or atopic dermatitis, is a chronic inflammatory skin condition that causes the skin to become itchy, red, dry, and cracked. It commonly begins in childhood but can occur at any age. Eczema is not contagious but can significantly impact quality of life due to persistent itching and visible skin changes.",
    causes: [
      "Genetic factors affecting skin barrier function",
      "Immune system dysfunction",
      "Environmental allergens and irritants",
      "Stress and emotional factors",
      "Climate and weather changes",
      "Certain foods in sensitive individuals"
    ],
    earlySymptoms: [
      "Dry, sensitive skin",
      "Mild itching, especially at night",
      "Slightly rough or scaly patches",
      "Redness in affected areas",
      "Skin feeling tight"
    ],
    advancedSymptoms: [
      "Intense, persistent itching",
      "Thickened, leathery skin (lichenification)",
      "Cracked and bleeding skin",
      "Oozing or crusting lesions",
      "Widespread skin involvement"
    ],
    homeopathicPerspective: "Homeopathy treats eczema as a manifestation of internal imbalance rather than just a skin problem. Treatment considers the person's overall constitution, emotional state, and specific characteristics of the skin eruptions. The goal is to strengthen the body's healing ability and address the root cause rather than simply suppressing symptoms.",
    medicines: [
      {
        name: "Graphites",
        indications: "Oozing, honey-like discharge, cracks behind ears and in folds, worse from warmth",
        guidance: "Suited for eczema with sticky, honey-colored discharge, particularly in skin folds and behind ears."
      },
      {
        name: "Sulphur",
        indications: "Intense itching worse from warmth and bathing, burning sensation, dry scaly skin",
        guidance: "Helpful for eczema with intense itching that worsens with heat, especially at night in bed."
      },
      {
        name: "Petroleum",
        indications: "Deep cracks, bleeding fissures, worse in winter, rough thick skin",
        guidance: "Indicated for eczema with deep, painful cracks, particularly affecting hands and worsening in cold weather."
      },
      {
        name: "Arsenicum Album",
        indications: "Burning, restlessness, dry scaly eruptions, worse at night, anxiety about health",
        guidance: "Suited for eczema with burning pain relieved by warmth, often in anxious, fastidious individuals."
      }
    ],
    lifestyleTips: [
      "Use gentle, fragrance-free moisturizers regularly",
      "Avoid harsh soaps and hot water",
      "Wear soft, breathable cotton clothing",
      "Keep fingernails short to minimize scratching damage",
      "Identify and avoid personal triggers",
      "Manage stress through relaxation techniques"
    ],
    whenToConsult: [
      "Signs of skin infection (increased redness, warmth, pus)",
      "Eczema not responding to self-care measures",
      "Symptoms affecting sleep or daily activities",
      "Spreading or worsening despite treatment",
      "Fever accompanying skin symptoms"
    ]
  },
  {
    id: "insomnia",
    name: "Insomnia",
    summary: "A sleep disorder characterized by difficulty falling asleep, staying asleep, or getting restful sleep.",
    symptoms: ["Difficulty falling asleep", "Waking during night", "Early morning awakening", "Daytime fatigue"],
    category: "Sleep Disorders",
    overview: "Insomnia is a common sleep disorder affecting the ability to fall asleep, stay asleep, or get quality restorative sleep. It can be short-term (acute) or long-lasting (chronic), and significantly impacts energy levels, mood, health, work performance, and quality of life. Understanding the underlying causes is essential for effective treatment.",
    causes: [
      "Stress and worry about life events",
      "Poor sleep habits and irregular schedule",
      "Caffeine, alcohol, and nicotine use",
      "Medical conditions and chronic pain",
      "Mental health disorders like anxiety and depression",
      "Medications that interfere with sleep"
    ],
    earlySymptoms: [
      "Taking more than 30 minutes to fall asleep",
      "Waking up occasionally during night",
      "Feeling unrested despite adequate time in bed",
      "Mild daytime drowsiness",
      "Increased irritability"
    ],
    advancedSymptoms: [
      "Chronic inability to fall or stay asleep",
      "Severe daytime fatigue affecting function",
      "Difficulty concentrating and memory problems",
      "Depression and mood disturbances",
      "Increased errors and accidents"
    ],
    homeopathicPerspective: "Homeopathy addresses insomnia by treating the whole person, including the mental-emotional state, physical symptoms, and lifestyle factors contributing to sleep difficulties. Treatment aims to restore the natural sleep-wake cycle by addressing underlying anxiety, worry, or physical discomfort that may be interfering with sleep.",
    medicines: [
      {
        name: "Coffea Cruda",
        indications: "Mind racing with thoughts, oversensitivity, sleeplessness from excitement or good news",
        guidance: "Ideal for individuals whose minds are overactive with ideas and thoughts, preventing sleep."
      },
      {
        name: "Nux Vomica",
        indications: "Insomnia from overwork, wakes at 3-4 AM, irritable, digestive upset",
        guidance: "Suited for people who work too hard, consume too much coffee or alcohol, and wake in the early morning hours."
      },
      {
        name: "Passiflora",
        indications: "Restless sleep, wakes frequently, mental exhaustion, general sleeplessness",
        guidance: "A gentle remedy for general sleeplessness without specific mental or physical symptoms."
      },
      {
        name: "Ignatia",
        indications: "Insomnia from grief or emotional upset, sighing, mood swings",
        guidance: "Helpful for sleeplessness following emotional shock, grief, or disappointment."
      }
    ],
    lifestyleTips: [
      "Maintain consistent sleep and wake times",
      "Create a dark, cool, quiet sleep environment",
      "Avoid screens for 1-2 hours before bed",
      "Limit caffeine after noon",
      "Practice relaxation techniques before bed",
      "Avoid large meals close to bedtime"
    ],
    whenToConsult: [
      "Insomnia persists for more than a few weeks",
      "Sleep problems significantly affect daily life",
      "Experiencing breathing difficulties during sleep",
      "Using sleeping aids regularly",
      "Daytime symptoms like severe fatigue or confusion"
    ]
  },
  {
    id: "acid-reflux",
    name: "Acid Reflux (GERD)",
    summary: "A digestive condition where stomach acid flows back into the esophagus, causing heartburn and discomfort.",
    symptoms: ["Heartburn", "Regurgitation", "Difficulty swallowing", "Chest pain"],
    category: "Digestive",
    overview: "Gastroesophageal reflux disease (GERD) occurs when stomach acid frequently flows back into the esophagus, the tube connecting your mouth and stomach. This backwash (acid reflux) can irritate the lining of the esophagus, causing symptoms like heartburn. Occasional acid reflux is common, but when it occurs frequently, it may indicate GERD.",
    causes: [
      "Weakened lower esophageal sphincter",
      "Hiatal hernia",
      "Obesity and excess weight",
      "Pregnancy",
      "Delayed stomach emptying",
      "Certain foods and eating habits"
    ],
    earlySymptoms: [
      "Occasional heartburn after meals",
      "Sour taste in mouth",
      "Mild regurgitation",
      "Feeling of lump in throat",
      "Discomfort when lying down after eating"
    ],
    advancedSymptoms: [
      "Frequent severe heartburn",
      "Chronic cough and hoarseness",
      "Difficulty swallowing (dysphagia)",
      "Worsening asthma symptoms",
      "Disrupted sleep from nighttime symptoms"
    ],
    homeopathicPerspective: "Homeopathy treats acid reflux by addressing the underlying digestive imbalance and constitutional factors that contribute to the condition. Treatment considers the specific nature of symptoms, food triggers, emotional state, and overall health pattern to select an individualized remedy.",
    medicines: [
      {
        name: "Nux Vomica",
        indications: "Acid reflux from overeating or rich food, irritability, constipation, worse in morning",
        guidance: "Suited for overindulgence in food, alcohol, or coffee, with heartburn and a feeling of weight in the stomach."
      },
      {
        name: "Robinia",
        indications: "Intense acidity, sour eructations, heartburn worse at night when lying down",
        guidance: "Helpful for severe acidity with sour belching and heartburn, particularly worse at night."
      },
      {
        name: "Carbo Veg",
        indications: "Bloating and gas, slow digestion, relief from belching, heaviness after eating",
        guidance: "Indicated for acid reflux with significant bloating, gas, and a desire for fresh air."
      },
      {
        name: "Natrum Phos",
        indications: "Sour risings, yellow creamy coating on tongue, acid dyspepsia",
        guidance: "A tissue salt remedy helpful for general acidity with sour taste and yellow-coated tongue."
      }
    ],
    lifestyleTips: [
      "Eat smaller, more frequent meals",
      "Avoid lying down for 3 hours after eating",
      "Elevate the head of your bed",
      "Maintain a healthy weight",
      "Avoid trigger foods like spicy, fatty, and acidic foods",
      "Wear loose-fitting clothing"
    ],
    whenToConsult: [
      "Difficulty swallowing or pain when swallowing",
      "Unexplained weight loss",
      "Vomiting blood or dark material",
      "Symptoms persist despite lifestyle changes",
      "Chest pain (rule out cardiac causes first)"
    ]
  },
  {
    id: "allergies",
    name: "Allergies (Hay Fever)",
    summary: "An immune system response to substances like pollen, dust, or pet dander causing sneezing and itching.",
    symptoms: ["Sneezing", "Runny nose", "Itchy eyes", "Nasal congestion"],
    category: "Immune System",
    overview: "Allergies occur when your immune system reacts to a foreign substance (allergen) that doesn't cause a reaction in most people. Common allergens include pollen, pet dander, dust mites, and certain foods. Hay fever (allergic rhinitis) specifically refers to allergies affecting the nose and sinuses, typically triggered by airborne allergens.",
    causes: [
      "Pollen from trees, grasses, and weeds",
      "Dust mites and their waste",
      "Pet dander and saliva",
      "Mold spores",
      "Genetic predisposition",
      "Environmental factors and pollution"
    ],
    earlySymptoms: [
      "Occasional sneezing",
      "Mild nasal congestion",
      "Slight itching of nose and eyes",
      "Clear, watery nasal discharge",
      "Post-nasal drip"
    ],
    advancedSymptoms: [
      "Persistent sneezing fits",
      "Severe nasal blockage",
      "Red, swollen, watery eyes",
      "Facial pain and pressure",
      "Fatigue and reduced quality of life"
    ],
    homeopathicPerspective: "Homeopathy views allergies as a sign of immune system hypersensitivity and treats by addressing the constitutional tendencies that make a person susceptible to allergic reactions. Rather than suppressing symptoms, homeopathic treatment aims to gradually reduce the sensitivity to allergens and strengthen overall immunity.",
    medicines: [
      {
        name: "Allium Cepa",
        indications: "Watery discharge that irritates upper lip, sneezing, worse indoors, better in open air",
        guidance: "Suited for hay fever with profuse watery discharge from the nose that causes burning, much like when cutting onions."
      },
      {
        name: "Sabadilla",
        indications: "Spasmodic sneezing, itchy nose, watery eyes, worse from flower odors",
        guidance: "Helpful for violent sneezing attacks with itching in the nose, particularly from pollen exposure."
      },
      {
        name: "Euphrasia",
        indications: "Eye symptoms predominant, burning watery eyes, bland nasal discharge",
        guidance: "Indicated when eye symptoms are worse than nasal symptoms, with burning tears and red eyes."
      },
      {
        name: "Arsenicum Album",
        indications: "Burning but bland discharge, sneezing, restlessness, worse at night",
        guidance: "Suited for allergies with thin, burning nasal discharge, often with anxiety and restlessness."
      }
    ],
    lifestyleTips: [
      "Monitor pollen counts and limit outdoor exposure during high periods",
      "Keep windows closed during allergy season",
      "Shower and change clothes after outdoor activities",
      "Use air purifiers with HEPA filters",
      "Keep pets out of bedrooms",
      "Wash bedding regularly in hot water"
    ],
    whenToConsult: [
      "Over-the-counter remedies are not providing relief",
      "Symptoms interfering with sleep or daily activities",
      "Developing sinus infections frequently",
      "Experiencing asthma symptoms",
      "Allergies affecting quality of life significantly"
    ]
  },
  {
    id: "depression",
    name: "Depression",
    summary: "A mood disorder causing persistent feelings of sadness, hopelessness, and loss of interest in activities.",
    symptoms: ["Persistent sadness", "Loss of interest", "Fatigue", "Sleep changes"],
    category: "Mental Health",
    overview: "Depression (major depressive disorder) is a common and serious mood disorder that negatively affects how you feel, think, and handle daily activities. It causes persistent feelings of sadness and loss of interest that go beyond normal fluctuations in mood. Depression is not a weakness and requires understanding, support, and often professional treatment.",
    causes: [
      "Brain chemistry imbalances",
      "Genetic predisposition",
      "Traumatic or stressful life events",
      "Medical conditions and medications",
      "Substance abuse",
      "Social isolation and loneliness"
    ],
    earlySymptoms: [
      "Feeling sad or having a depressed mood",
      "Loss of interest in previously enjoyed activities",
      "Changes in appetite",
      "Trouble sleeping or sleeping too much",
      "Feeling tired or low energy"
    ],
    advancedSymptoms: [
      "Feelings of worthlessness or excessive guilt",
      "Difficulty thinking, concentrating, or making decisions",
      "Significant weight loss or gain",
      "Psychomotor agitation or slowing",
      "Thoughts of death or suicide"
    ],
    homeopathicPerspective: "Homeopathy approaches depression by understanding the individual's unique experience, including the nature of sadness, triggers, accompanying physical symptoms, and overall constitutional makeup. Treatment aims to gently restore emotional balance while addressing the whole person, including sleep, appetite, and energy levels.",
    medicines: [
      {
        name: "Ignatia Amara",
        indications: "Depression from grief or loss, mood swings, sighing, contradictory symptoms",
        guidance: "Particularly suited for depression following loss, disappointment, or emotional shock, with frequent sighing."
      },
      {
        name: "Natrum Muriaticum",
        indications: "Silent grief, dwells on past hurts, aversion to consolation, worse from sun",
        guidance: "Helpful for those who hold onto grief, prefer to be alone, and feel worse from sympathy or consolation."
      },
      {
        name: "Aurum Metallicum",
        indications: "Deep despair, worthlessness, perfectionism, suicidal thoughts, worse at night",
        guidance: "For severe depression with feelings of failure, self-condemnation, and desire for isolation. Seek professional help for suicidal thoughts."
      },
      {
        name: "Sepia",
        indications: "Indifference to loved ones, exhaustion, irritability, hormonal depression",
        guidance: "Suited for depression with emotional flatness, particularly in women with hormonal changes."
      }
    ],
    lifestyleTips: [
      "Maintain regular sleep schedule",
      "Engage in physical exercise, even brief walks",
      "Stay connected with supportive people",
      "Break large tasks into smaller, manageable steps",
      "Avoid alcohol and recreational drugs",
      "Practice mindfulness and relaxation techniques"
    ],
    whenToConsult: [
      "Symptoms persist for more than two weeks",
      "Having thoughts of self-harm or suicide",
      "Unable to perform daily activities",
      "Using substances to cope with feelings",
      "Symptoms significantly affect relationships and work"
    ]
  },
  {
    id: "arthritis",
    name: "Arthritis",
    summary: "Inflammation of the joints causing pain, stiffness, and reduced range of motion.",
    symptoms: ["Joint pain", "Stiffness", "Swelling", "Reduced mobility"],
    category: "Musculoskeletal",
    overview: "Arthritis refers to joint inflammation causing pain, stiffness, and swelling. There are many types, with osteoarthritis (wear-and-tear) and rheumatoid arthritis (autoimmune) being most common. Arthritis can affect any joint and may worsen with age, significantly impacting mobility and quality of life.",
    causes: [
      "Normal wear and tear on cartilage (osteoarthritis)",
      "Autoimmune attack on joint lining (rheumatoid)",
      "Injury or infection",
      "Age and genetic factors",
      "Obesity increasing joint stress",
      "Metabolic conditions like gout"
    ],
    earlySymptoms: [
      "Mild joint stiffness, especially in morning",
      "Occasional joint pain after activity",
      "Slight swelling around joints",
      "Joint sounds (cracking or popping)",
      "Reduced flexibility"
    ],
    advancedSymptoms: [
      "Constant joint pain affecting daily activities",
      "Significant joint swelling and warmth",
      "Visible joint deformity",
      "Severe limitation of movement",
      "Fatigue and systemic symptoms"
    ],
    homeopathicPerspective: "Homeopathic treatment of arthritis focuses on the individual's specific symptoms, including the type and location of pain, what makes it better or worse, accompanying symptoms, and overall health pattern. Treatment aims to reduce inflammation, relieve pain, and slow disease progression by addressing the underlying constitutional imbalance.",
    medicines: [
      {
        name: "Rhus Toxicodendron",
        indications: "Stiffness better from motion, worse on first movement, restlessness, worse in damp cold",
        guidance: "Suited for arthritis with initial stiffness that improves with continued movement and warmth."
      },
      {
        name: "Bryonia Alba",
        indications: "Pain worse from any motion, better from rest and pressure, joint hot and swollen",
        guidance: "Indicated when pain is worse from the slightest movement and the person wants to stay completely still."
      },
      {
        name: "Calcarea Carb",
        indications: "Arthritis in overweight individuals, chilly, sweaty, worse in cold damp weather",
        guidance: "Helpful for arthritis in people who are overweight, feel cold, and have weak joints."
      },
      {
        name: "Causticum",
        indications: "Joint stiffness with contractures, better in warm wet weather, worse in dry cold",
        guidance: "Suited for progressive joint stiffness and tightness, particularly when joints feel contracted."
      }
    ],
    lifestyleTips: [
      "Maintain a healthy weight to reduce joint stress",
      "Exercise regularly with low-impact activities",
      "Apply heat or cold therapy as helpful",
      "Use assistive devices to protect joints",
      "Practice gentle stretching and range of motion exercises",
      "Consider anti-inflammatory foods in diet"
    ],
    whenToConsult: [
      "Joint pain persists for more than two weeks",
      "Experiencing fever with joint swelling",
      "Sudden, severe joint pain",
      "Visible joint deformity",
      "Symptoms significantly limiting daily activities"
    ]
  }
];

export function getDiseaseById(id: string): Disease | undefined {
  return diseases.find(disease => disease.id === id);
}

export function searchDiseases(query: string): Disease[] {
  const lowercaseQuery = query.toLowerCase();
  return diseases.filter(
    disease =>
      disease.name.toLowerCase().includes(lowercaseQuery) ||
      disease.summary.toLowerCase().includes(lowercaseQuery) ||
      disease.symptoms.some(s => s.toLowerCase().includes(lowercaseQuery)) ||
      disease.category.toLowerCase().includes(lowercaseQuery)
  );
}

export function getDiseasesByLetter(letter: string): Disease[] {
  return diseases.filter(disease => 
    disease.name.toLowerCase().startsWith(letter.toLowerCase())
  );
}

export function getAllCategories(): string[] {
  return [...new Set(diseases.map(d => d.category))];
}
