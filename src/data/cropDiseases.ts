import { DiseaseInfo } from '../types';

export const CROP_DISEASES: DiseaseInfo[] = [
  {
    id: 'potato-late-blight',
    crop: 'potato',
    cropNameEn: 'Potato',
    cropNameHi: 'आलू',
    cropIcon: '🥔',
    nameEn: 'Late Blight of Potato',
    nameHi: 'आलू का पछेती झुलसा रोग',
    pathogenType: 'Fungal',
    scientificName: 'Phytophthora infestans',
    severity: 'severe',
    confidenceRange: [93, 97],
    symptoms: {
      en: [
        'Water-soaked dark brown/black lesions on leaf margins and tips',
        'Delicate white fungal downy growth visible on undersides of leaves in humid mornings',
        'Rapid collapse and purplish-brown rotting of foliage within 3-5 days',
        'Dry brownish-purple skin rot extending into tuber flesh'
      ],
      hi: [
        'पत्तियों के किनारों और सिरों पर पानी से भीगे भूरे-काले धब्बे',
        'सुबह के समय पत्तियों की निचली सतह पर सफेद फफूंद की परत',
        '3 से 5 दिनों में पूरी फसल के पत्तों का झुलसना और सूखना',
        'आलू के कंदों पर भूरा-बैंगनी सूखा सड़न रोग'
      ]
    },
    causes: {
      en: 'Prolonged cloudy weather, high relative humidity (>85%), and cool night temperatures (10-18°C) followed by warm days.',
      hi: 'लगातार बादलों का मौसम, 85% से अधिक आर्द्रता और 10-18°C का रात का तापमान इस फफूंद को तेजी से फैलाता है।'
    },
    favorableWeather: {
      temp: '12°C - 22°C',
      humidity: '> 85%',
      season: 'Rabi (December - February)'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Mancozeb 75% WP (Indofil M-45)',
          genericName: 'Mancozeb 75% WP',
          dosagePerLiter: '2.5 g / Liter',
          dosagePerAcre: '500 - 600 g / Acre',
          waterPerAcre: '200 - 250 Liters',
          applicationMethod: 'Foliar spray covering both upper and lower leaf surfaces thoroughly.',
          waitingPeriodDays: 7,
          sprayIntervalDays: '7 to 10 days',
          cibrcApproved: true,
          precautions: [
            'Avoid spraying during strong winds or right before heavy rainfall.',
            'Maintain at least 7 days waiting period before harvesting tubers.',
            'Wear protective face mask and wash equipment thoroughly after use.'
          ]
        },
        {
          tradeName: 'Curzate M-8 (Cymoxanil 8% + Mancozeb 64% WP)',
          genericName: 'Cymoxanil 8% + Mancozeb 64% WP',
          dosagePerLiter: '1.5 g / Liter',
          dosagePerAcre: '300 g / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Curative spray within 48 hours of initial symptom observation.',
          waitingPeriodDays: 10,
          sprayIntervalDays: '10 to 12 days',
          cibrcApproved: true,
          precautions: [
            'Rotate with Copper Oxychloride to prevent fungicide resistance.',
            'Do not mix directly with alkaline sprays or micro-nutrients without jar test.'
          ]
        },
        {
          tradeName: 'Copper Oxychloride 50% WP (Blitox / Blue Copper)',
          genericName: 'Copper Oxychloride 50% WP',
          dosagePerLiter: '3.0 g / Liter',
          dosagePerAcre: '600 g / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Preventive protective spray during high humidity forecasts.',
          waitingPeriodDays: 5,
          sprayIntervalDays: '10 to 14 days',
          cibrcApproved: true,
          precautions: [
            'Ensure continuous agitation in the spray tank to prevent chemical settling.'
          ]
        }
      ],
      organic: [
        {
          name: 'Trichoderma viride 1% WP Bio-Fungicide',
          nameHindi: 'ट्राइकोडर्मा विरिडी 1% डब्ल्यूपी जैविक फफूंदनाशी',
          ingredients: 'Trichoderma viride spore suspension (2x10^6 cfu/g) + Jaggery activator solution',
          dosagePerLiter: '5.0 g / Liter',
          preparationMethod: 'Mix 1 kg Trichoderma with 50 kg well-decomposed FYM (Farmyard Manure) moistened with 5% jaggery water. Keep covered for 7 days in shade before field application, or mix directly in spray water.',
          applicationSchedule: 'Spray every 10-12 days at dawn or dusk.',
          bestTime: 'Late afternoon (4 PM - 6 PM) to protect beneficial spores from UV sunlight',
          costEfficiency: '₹120 - ₹160 per Acre (High ROI)'
        },
        {
          name: 'Fermented Sour Buttermilk + Copper Pot Extract (Khatta Chaach + Tamba)',
          nameHindi: 'खट्टी छाछ और तांबे का जैविक घोल',
          ingredients: '5 Liters sour deshi cow buttermilk fermented with pure copper plate for 7 days + 150 Liters water',
          dosagePerLiter: '30 ml / Liter (3% solution)',
          preparationMethod: 'Store 5L churned desi buttermilk in a mud pot with a cleaned copper plate/pipe for 7-10 days until it turns greenish-blue. Filter through muslin cloth and dilute in 150L water.',
          applicationSchedule: 'Spray once a week as protective anti-fungal barrier.',
          bestTime: 'Early morning after dew dries',
          costEfficiency: 'Zero-cost farm-made formulation'
        }
      ]
    },
    preventionTips: {
      en: [
        'Use certified disease-free seed tubers from CPRI (Central Potato Research Institute) or state seed corp.',
        'Avoid excessive furrow flooding or overhead sprinkler irrigation during cool foggy weeks.',
        'Destroy volunteer potato plants and nightshade weeds near field borders.',
        'Practice earthing-up (मिट्टी चढ़ाना) to form 15-20 cm high ridges to protect growing tubers from spore wash-off.',
        'Practice 3-year crop rotation with non-solanaceous crops like wheat, mustard, or pulses.'
      ],
      hi: [
        'हमेशा प्रमाणित रोग-मुक्त बीज कंदों (CPRI प्रमाणित) का ही प्रयोग करें।',
        'कोहरे और ठंड के दिनों में स्प्रिंकलर या रात के समय भारी सिंचाई से बचें।',
        'खेत की मेड़ों से खरपतवार और पिछले मौसम के अवशेष तुरंत नष्ट करें।',
        'पौधों पर अच्छी तरह मिट्टी चढ़ाएं ताकि बारिश का पानी फफूंद बीजाणुओं को आलू के कंदों तक न पहुंचा सके।',
        'दलहनी फसलों, सरसों या गेहूं के साथ 3 वर्षीय फसल चक्र अपनाएं।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#78350F'
  },
  {
    id: 'tomato-early-blight',
    crop: 'tomato',
    cropNameEn: 'Tomato',
    cropNameHi: 'टमाटर',
    cropIcon: '🍅',
    nameEn: 'Early Blight of Tomato',
    nameHi: 'टमाटर का अगेती झुलसा रोग',
    pathogenType: 'Fungal',
    scientificName: 'Alternaria solani',
    severity: 'moderate',
    confidenceRange: [91, 96],
    symptoms: {
      en: [
        'Distinct dark brown to black circular spots with concentric target-like rings on older lower leaves',
        'Yellow chlorotic halos surrounding necrotic leaf spots',
        'Stem cankers and dark sunken leathery lesions at stem base and fruit calyx',
        'Premature defoliation exposing green tomatoes to sunscald'
      ],
      hi: [
        'निचली पुरानी पत्तियों पर गहरे भूरे गोल छल्लेदार (Target-board) धब्बे',
        'धब्बों के चारों ओर पीला घेरा और पत्तियों का पीला पड़ना',
        'तने के निचले भाग और फल के डंठल पर काले धंसे हुए घाव',
        'पत्तियां जल्दी झड़ना जिससे फलों पर धूप से झुलसन (सनस्कैल्ड) का खतरा'
      ]
    },
    causes: {
      en: 'Fungus overwinters in crop debris and infects lower leaves in warm (24-29°C), humid weather with intermittent rain/dew.',
      hi: 'गर्म और नम मौसम (24-29°C), रात की ओस और बारिश के बाद मिट्टी से फफूंद पुरानी पत्तियों पर फैलती है।'
    },
    favorableWeather: {
      temp: '24°C - 30°C',
      humidity: '75% - 90%',
      season: 'Kharif & Post-Monsoon'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)',
          genericName: 'Azoxystrobin + Difenoconazole SC',
          dosagePerLiter: '1.0 ml / Liter',
          dosagePerAcre: '200 ml / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Systemic foliar spray targeting lower canopy and undersides of leaves.',
          waitingPeriodDays: 5,
          sprayIntervalDays: '12 to 14 days',
          cibrcApproved: true,
          precautions: [
            'Do not apply more than 2 sequential sprays; alternate with contact fungicides.',
            'Ensure spray tank water pH is between 6.0 and 7.0.'
          ]
        },
        {
          tradeName: 'Chlorothalonil 75% WP (Kavach / Bravo)',
          genericName: 'Chlorothalonil 75% WP',
          dosagePerLiter: '2.0 g / Liter',
          dosagePerAcre: '400 g / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Broad spectrum protectant foliar spray.',
          waitingPeriodDays: 3,
          sprayIntervalDays: '7 to 10 days',
          cibrcApproved: true,
          precautions: [
            'Do not spray during peak midday heat to avoid foliar phytotoxicity.'
          ]
        }
      ],
      organic: [
        {
          name: 'Neem Oil 1500 PPM + Cow Urine Bio-Shield',
          nameHindi: 'नीम तेल 1500 पीपीएम + गोमूत्र सुरक्षा घोल',
          ingredients: 'Neem Oil 1500 PPM @ 3ml/L + Cow urine @ 50ml/L + Eco-friendly soap surfactant @ 1ml/L',
          dosagePerLiter: '3 ml Neem Oil + 50 ml aged Cow Urine',
          preparationMethod: 'Emulsify 600ml Neem oil with 200ml natural liquid soap in 5L warm water until milky. Add to 200L spray water mixed with 10L filtered aged cow urine.',
          applicationSchedule: 'Preventive spray every 8 days from 20 days after transplanting.',
          bestTime: 'Evening after 4:30 PM',
          costEfficiency: '₹90 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Prune lower leaves (bottom 30 cm of plant) to eliminate splash-contact with contaminated soil.',
        'Use plastic mulch or straw mulch around tomato roots to prevent rain splash.',
        'Adopt drip irrigation instead of furrow/flood watering.',
        'Stake plants upright with bamboo and jute twine to promote air circulation.'
      ],
      hi: [
        'पौधे के निचले 30 सेमी तक के पत्तों की छंटाई (प्रूनिंग) करें ताकि मिट्टी के संपर्क से बचा जा सके।',
        'टमाटर की क्यारियों में प्लास्टिक या पुआल की मल्चिंग अवश्य करें।',
        'ड्रिप (टपक) सिंचाई विधि का उपयोग करें, ऊपर से पानी छिड़कने से बचें।',
        'पौधों को बांस के सहारे ऊपर बांधें ताकि हवा का संचार बना रहे।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#B45309'
  },
  {
    id: 'rice-blast',
    crop: 'rice',
    cropNameEn: 'Paddy / Rice',
    cropNameHi: 'धान (चावल)',
    cropIcon: '🌾',
    nameEn: 'Rice Blast (Leaf & Neck Blast)',
    nameHi: 'धान का ब्लास्ट / झोंका रोग',
    pathogenType: 'Fungal',
    scientificName: 'Magnaporthe oryzae',
    severity: 'severe',
    confidenceRange: [92, 98],
    symptoms: {
      en: [
        'Spindle-shaped / diamond-shaped lesions on leaves with greyish-white centers and brownish-red borders',
        'Lesions coalesce rapidly causing complete drying of leaf blades',
        'Blackening and rot of panicle neck (Neck Blast), causing chaffy, empty white ears that break off easily'
      ],
      hi: [
        'पत्तियों पर आंख या नाव के आकार के धब्बे जिनका केंद्र धूसर-सफेद और किनारे कत्थई-लाल होते हैं',
        'धब्बों के आपस में मिलने से पूरी पत्ती सूखकर झुलस जाती है',
        'बाली की गर्दन पर कालापन और सड़न (गर्दन तोड़ रोग), जिससे बालियां खाली और सफेद रह जाती हैं'
      ]
    },
    causes: {
      en: 'Excessive nitrogen (urea) application, high plant density, prolonged leaf wetness (>10 hours), and day temperatures of 25-28°C.',
      hi: 'यूरिया (नाइट्रोजन) का अत्यधिक प्रयोग, घनी बुवाई, 10 घंटे से अधिक पत्ती पर नमी और 25-28°C तापमान।'
    },
    favorableWeather: {
      temp: '20°C - 28°C',
      humidity: '> 90%',
      season: 'Kharif (August - October)'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Tricyclazole 75% WP (Beam / Baan / Blastoff)',
          genericName: 'Tricyclazole 75% WP',
          dosagePerLiter: '0.6 g / Liter',
          dosagePerAcre: '120 - 150 g / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Foliar spray at maximum tillering stage and repeat at panicle emergence (booting stage).',
          waitingPeriodDays: 30,
          sprayIntervalDays: '10 to 14 days',
          cibrcApproved: true,
          precautions: [
            'Crucial: Apply at heading/panicle initiation stage even if few leaf symptoms exist in endemic zones.'
          ]
        },
        {
          tradeName: 'Isoprothiolane 40% EC (Fuji-One)',
          genericName: 'Isoprothiolane 40% EC',
          dosagePerLiter: '1.5 ml / Liter',
          dosagePerAcre: '300 ml / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Systemic curative spray targeting neck blast.',
          waitingPeriodDays: 21,
          sprayIntervalDays: '12 days',
          cibrcApproved: true,
          precautions: [
            'Maintain 2-3 cm standing water in paddy field during chemical application.'
          ]
        }
      ],
      organic: [
        {
          name: 'Pseudomonas fluorescens 1.0% WP + Jeevamrutha',
          nameHindi: 'स्यूडोमोनास फ्लोरोसेंस 1% + जीवामृत जैविक घोल',
          ingredients: 'Pseudomonas fluorescens @ 5g/L + Fresh Jeevamrutha filtered spray @ 50ml/L',
          dosagePerLiter: '5 g / Liter',
          preparationMethod: 'Mix 1 kg Pseudomonas fluorescens in 200L water with 10L filtered aged Jeevamrutha. Spray uniformly across the paddy canopy.',
          applicationSchedule: 'Spray at 30, 45, and 60 days after transplanting.',
          bestTime: 'Morning before 10 AM or cloudy days',
          costEfficiency: '₹140 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Treat seeds with Carbendazim 2g/kg or Trichoderma viride 10g/kg before sowing nursery.',
        'Split nitrogen fertilizer into 3-4 doses; avoid excess basal or late top-dressing of Urea.',
        'Maintain balanced Potassium (MOP) application which strengthens leaf epidermal silica cell walls.',
        'Burn or deeply incorporate infected stubble immediately after harvest.'
      ],
      hi: [
        'नर्सरी बुवाई से पहले बीजों का ट्राइकोडर्मा (10 ग्राम/किग्रा) से बीजोपचार अवश्य करें।',
        'यूरिया (नाइट्रोजन) को एक साथ न डालें, इसे 3-4 भागों में बांटकर दें।',
        'पोटाश (MOP) का संतुलित उपयोग करें, जिससे पौधे की पत्तियां मजबूत होती हैं।',
        'कटाई के बाद संक्रमित ठूंठों को खेत में गहरा जुताई करके मिट्टी में दबाएं।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1536939459926-301728717817?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#065F46'
  },
  {
    id: 'wheat-yellow-rust',
    crop: 'wheat',
    cropNameEn: 'Wheat',
    cropNameHi: 'गेहूं',
    cropIcon: '🌾',
    nameEn: 'Yellow / Stripe Rust of Wheat',
    nameHi: 'गेहूं का पीला रतुआ (हल्दी रोग)',
    pathogenType: 'Fungal',
    scientificName: 'Puccinia striiformis f. sp. tritici',
    severity: 'severe',
    confidenceRange: [94, 98],
    symptoms: {
      en: [
        'Narrow bright yellow/lemon-yellow pustules arranged in parallel linear stripes on leaf blades',
        'Yellow powder (urediniospores) rubs off easily on clothes or fingers when touched',
        'Severely infected fields appear yellow from a distance and leaves dry prematurely like burnt straw'
      ],
      hi: [
        'पत्तियों पर समानांतर कतारों में चमकदार पीले रंग के उभरे हुए दाने/धारियां',
        'उंगली या कपड़े से छूने पर हल्दी जैसा पीला पाउडर चिपकना',
        'दूर से देखने पर पूरा खेत पीला दिखाई देना और बालियां बनने से पहले फसल सूखना'
      ]
    },
    causes: {
      en: 'Cool moist weather (8-15°C), persistent winter fog in North-Western plains (Punjab, Haryana, Tarai), and westerly disturbances.',
      hi: 'शीत ऋतु में 8-15°C तापमान, लगातार कोहरा और पश्चिमी विक्षोभ की बारिश इस बीमारी को फैलाती है।'
    },
    favorableWeather: {
      temp: '8°C - 16°C',
      humidity: '> 80%',
      season: 'Rabi (January - February)'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Propiconazole 25% EC (Tilt / Bumper / Radar)',
          genericName: 'Propiconazole 25% EC',
          dosagePerLiter: '1.0 ml / Liter',
          dosagePerAcre: '200 ml in 200 Liters water / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Foliar spray with hollow cone nozzle immediately on sighting first yellow foci.',
          waitingPeriodDays: 30,
          sprayIntervalDays: '15 days',
          cibrcApproved: true,
          precautions: [
            'Do not delay spray; yellow rust can spread across 10 acres in 48 hours with wind currents.'
          ]
        },
        {
          tradeName: 'Tebuconazole 25.9% m/m EC (Folicur)',
          genericName: 'Tebuconazole 25.9% EC',
          dosagePerLiter: '1.0 ml / Liter',
          dosagePerAcre: '200 ml / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Curative spray on flag leaf emergence.',
          waitingPeriodDays: 28,
          sprayIntervalDays: '14 days',
          cibrcApproved: true,
          precautions: [
            'Do not spray during morning hours when heavy dew is present on wheat canopy.'
          ]
        }
      ],
      organic: [
        {
          name: 'Fermented Garlic-Chilli Extract + Neem Barrier',
          nameHindi: 'लहसुन-मिर्च अर्क + नीम तेल जैव कीटनाशक',
          ingredients: 'Garlic paste 500g + Hot green chilli paste 500g + Neem oil 1500 PPM 500ml in 150L water',
          dosagePerLiter: '10 ml / Liter',
          preparationMethod: 'Crush garlic and spicy chillies, soak in 5L water overnight. Boil for 15 mins, cool, filter, and blend with emulsified neem oil.',
          applicationSchedule: 'Preventive spray at tillering and jointing stages.',
          bestTime: 'Midday sunny hours',
          costEfficiency: '₹110 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Sow rust-resistant wheat varieties approved for NWPZ (e.g. DBW-187, DBW-303, PBW-725, HD-3226).',
        'Avoid growing susceptible obsolete varieties like HD-2967 or PBW-343 in sub-mountainous zones.',
        'Monitor field borders in late December and early January weekly.',
        'Coordinate community spraying across neighboring farms to stop airborne spore spread.'
      ],
      hi: [
        'रोग प्रतिरोधी किस्में (जैसे DBW-187 करण वंदना, DBW-303, HD-3226) ही बोएं।',
        'संवेदनशील पुरानी किस्में (HD-2967, PBW-343) लगाने से बचें।',
        'दिसंबर के अंतिम सप्ताह और जनवरी में खेत की लगातार निगरानी करें।',
        'हवा से उड़ने वाले बीजाणुओं को रोकने के लिए पड़ोसी किसानों के साथ मिलकर छिड़काव करें।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#CA8A04'
  },
  {
    id: 'cotton-bacterial-blight',
    crop: 'cotton',
    cropNameEn: 'Cotton',
    cropNameHi: 'कपास',
    cropIcon: '🌱',
    nameEn: 'Bacterial Blight / Black Arm of Cotton',
    nameHi: 'कपास का जीवाणु झुलसा / काला धब्बा रोग',
    pathogenType: 'Bacterial',
    scientificName: 'Xanthomonas citri pv. malvacearum',
    severity: 'moderate',
    confidenceRange: [90, 95],
    symptoms: {
      en: [
        'Angular, water-soaked oily spots bound by leaf veins (Angular Leaf Spot phase)',
        'Spots turn reddish-brown to black and spread along petiole and main stem causing "Black Arm"',
        'Deep circular water-soaked spots on developing green bolls causing premature boll opening and fiber staining'
      ],
      hi: [
        'पत्तियों की नसों के बीच कोणीय, पानी जैसे भीगे धब्बे (Angular Leaf Spot)',
        'धब्बे लाल-भूरे से काले होकर तने और शाखाओं पर फैलते हैं (ब्लैक आर्म लक्षण)',
        'कपास के गूलरों (टिंडों) पर काले धब्बे जिससे बिनौले और रेशे खराब हो जाते हैं'
      ]
    },
    causes: {
      en: 'Seed-borne bacterium activated by warm rains, overhead drizzle, temperature between 30-35°C, and insect injury.',
      hi: 'बीज जनित जीवाणु, जो 30-35°C तापमान, बारिश के पानी के छींटों और कीटों के काटने से फैलता है।'
    },
    favorableWeather: {
      temp: '28°C - 35°C',
      humidity: '> 80%',
      season: 'Kharif (July - September)'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Streptocycline + Copper Oxychloride 50% WP',
          genericName: 'Streptomycin Sulphate 90% + Tetracycline Hydrochloride 10% SP + Copper Oxychloride',
          dosagePerLiter: '0.1 g Streptocycline (6g pouch per 60L) + 2.5 g Copper Oxychloride',
          dosagePerAcre: '24 g Streptocycline + 500 g COC in 200 Liters water / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Thorough foliar spray ensuring lower branches and stems are wet.',
          waitingPeriodDays: 14,
          sprayIntervalDays: '12 to 15 days',
          cibrcApproved: true,
          precautions: [
            'Dissolve Streptocycline pouch separately in a bucket of warm water before mixing with COC tank.'
          ]
        }
      ],
      organic: [
        {
          name: 'Dashparni Ark + Hing (Asafoetida) Spray',
          nameHindi: 'दशपर्णी अर्क + हींग युक्त जैविक जीवाणुरोधी स्प्रे',
          ingredients: '10 Liters Dashparni Ark + 50g organic Hing dissolved in 200L water',
          dosagePerLiter: '50 ml Dashparni Ark / Liter',
          preparationMethod: 'Extract made from 10 native bitter leaves (Neem, Karanj, Calotropis, Custard apple, Castor, Datura, Papaya, Guava, Lantana, Ginger) fermented with cow urine.',
          applicationSchedule: 'Spray every 10 days during cloudy monsoon breaks.',
          bestTime: 'Late afternoon',
          costEfficiency: '₹80 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Acid delinting of cotton seed with commercial Sulfuric Acid (100ml/kg seed) followed by Streptocycline seed soaking.',
        'Destroy infected crop residues and do not leave cotton stalks standing in field over winter.',
        'Maintain optimum plant population (don\'t overcrowd rows).',
        'Control sucking pests (jassids, whiteflies) which create entry wounds for bacterial invasion.'
      ],
      hi: [
        'बुवाई से पहले सल्फ्यूरिक एसिड से बीजों का रोआं छुड़ाएं और स्ट्रेप्टोसाइक्लिन से उपचारित करें।',
        'फसल कटाई के बाद कपास की पुरानी पराली/डंठल को खेत से बाहर निकालकर जलाएं।',
        'पौधों के बीच उचित दूरी रखें ताकि पत्तियों में हवा और धूप लग सके।',
        'रस चूसक कीटों (माहू, सफेद मक्खी) का समय पर नियंत्रण करें।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#15803D'
  },
  {
    id: 'chilli-leaf-curl',
    crop: 'chilli',
    cropNameEn: 'Chilli',
    cropNameHi: 'मिर्च',
    cropIcon: '🌶️',
    nameEn: 'Chilli Leaf Curl Virus (Murda Rog)',
    nameHi: 'मिर्च का मरोड़िया रोग (पर्ण कुंचन वायरस)',
    pathogenType: 'Viral',
    scientificName: 'Chilli leaf curl virus (ChiLCV) transmitted by Whitefly (Bemisia tabaci)',
    severity: 'severe',
    confidenceRange: [92, 97],
    symptoms: {
      en: [
        'Upward curling, puckering, and crinkling of leaves (Boat-shaped / Cup-shaped curling)',
        'Severe reduction in leaf size, thickening of leaf veins, and stunted bushy plant growth',
        'Drastic dropping of flowers, deformed tiny fruits, and 70-90% yield reduction'
      ],
      hi: [
        'पत्तियों का ऊपर की ओर मुड़ना (नाव जैसी कटोरी का आकार बनना) और सिकुड़ना',
        'पत्तियों का आकार छोटा होना, नसों का मोटा होना और पौधे का बौना रह जाना',
        'फूलों का गिरना, छोटे टेढ़े-मेढ़े फल लगना और उपज में भारी गिरावट'
      ]
    },
    causes: {
      en: 'Geminivirus transmitted by vector Whitefly (Bemisia tabaci) and Thrips during hot dry weather.',
      hi: 'सफेद मक्खी (Whitefly) और थ्रिप्स कीटों द्वारा फैलाया जाने वाला वायरस रोग।'
    },
    favorableWeather: {
      temp: '30°C - 38°C',
      humidity: '< 60%',
      season: 'Summer & Kharif'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Diafenthiuron 50% WP (Pegasus / Polo)',
          genericName: 'Diafenthiuron 50% WP',
          dosagePerLiter: '1.25 g / Liter',
          dosagePerAcre: '250 g / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Foliar spray to eradicate vector whitefly and mites beneath leaves.',
          waitingPeriodDays: 7,
          sprayIntervalDays: '10 to 12 days',
          cibrcApproved: true,
          precautions: [
            'Note: Viral diseases cannot be cured once inside the plant cell; destroying the insect vector is mandatory.'
          ]
        },
        {
          tradeName: 'Acetamiprid 20% SP (Pride / Manik)',
          genericName: 'Acetamiprid 20% SP',
          dosagePerLiter: '0.4 g / Liter',
          dosagePerAcre: '80 g / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Systemic insecticide spray against adult whitefly colonies.',
          waitingPeriodDays: 3,
          sprayIntervalDays: '10 days',
          cibrcApproved: true,
          precautions: [
            'Alternate with botanical sprays to prevent vector resistance.'
          ]
        }
      ],
      organic: [
        {
          name: 'Yellow Sticky Traps + Agniastra Bio-Spray',
          nameHindi: 'पीले चिपचिपे कार्ड + अग्न्यास्त्र कीटनाशक',
          ingredients: 'Install 25 Yellow Sticky Traps/Acre + Spray 5L Agniastra (Desi cow urine + Neem + Tobacco + Garlic + Green chilli)',
          dosagePerLiter: '25 ml Agniastra / Liter',
          preparationMethod: 'Boil 5L cow urine with 500g crushed tobacco, 500g garlic, 500g hot chillies, and 2kg neem leaves in earthen pot for 30 mins. Filter after 48 hours.',
          applicationSchedule: 'Spray every 7 days; replace sticky traps every 20 days.',
          bestTime: 'Early morning',
          costEfficiency: '₹180 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Install 25-30 Yellow Sticky Traps per acre at canopy height to capture adult whiteflies before they lay eggs.',
        'Plant 2-3 border rows of tall Maize, Sorghum, or Bajra as a live physical wind barrier to block whitefly migration.',
        'Rogue out (uproot) severely stunted viral-infected plants immediately and bury them away from field.',
        'Use 40-mesh insect-proof net in nursery seedbeds during seedling raising.'
      ],
      hi: [
        'खेत में प्रति एकड़ 25-30 पीले चिपचिपे कार्ड (Yellow Sticky Traps) लगाएं ताकि सफेद मक्खी पकड़ी जा सके।',
        'खेत के चारों ओर मक्का, ज्वार या बाजरे की 2-3 कतारें सुरक्षा दीवार (बॉर्डर क्रॉप) के रूप में लगाएं।',
        'गंभीर रूप से मुड़े हुए बीमार पौधों को उखाड़कर खेत से दूर जमीन में गाड़ दें।',
        'नर्सरी में पौध तैयार करते समय 40-मेश कीट-रोधी जाली से क्यारियों को ढकें।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#DC2626'
  },
  {
    id: 'mustard-white-rust',
    crop: 'mustard',
    cropNameEn: 'Mustard / Rapeseed',
    cropNameHi: 'सरसों / राई',
    cropIcon: '🌼',
    nameEn: 'White Rust of Mustard (Albugo Blister)',
    nameHi: 'सरसों का सफेद रतुआ (सफेद फफोले रोग)',
    pathogenType: 'Fungal',
    scientificName: 'Albugo candida (White blister rust)',
    severity: 'severe',
    confidenceRange: [93, 98],
    symptoms: {
      en: [
        'White or creamy-yellow shiny blisters (pustules) on leaf under-surfaces',
        'Staghead deformity: hypertrophied, swollen, zigzag flower stems devoid of normal siliquae',
        'Chlorotic yellow blotches on upper leaf surfaces matching lower blisters'
      ],
      hi: [
        'पत्तियों की निचली सतह पर सफेद या हल्के पीले चमकदार उभरे हुए फफोले',
        'फूलों और तनों का विकृत होकर मोटा होना (हिरण-सींग / स्टैगहेड विकृति) और फलियों का न बनना',
        'पत्ती की ऊपरी सतह पर पीले धब्बे'
      ]
    },
    causes: {
      en: 'High soil moisture, winter dew, 12-18°C temperatures, and dense sowing in North India.',
      hi: 'सर्दियों की भारी ओस, 12-18°C तापमान और अत्यधिक घनी बुवाई से फफूंद का प्रसार।'
    },
    favorableWeather: {
      temp: '10°C - 18°C',
      humidity: '> 85%',
      season: 'Rabi (December - January)'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ 72)',
          genericName: 'Metalaxyl 8% + Mancozeb 64% WP',
          dosagePerLiter: '2.0 g / Liter',
          dosagePerAcre: '400 - 500 g / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Foliar spray covering flower heads and foliage before flowering starts.',
          waitingPeriodDays: 21,
          sprayIntervalDays: '12 to 14 days',
          cibrcApproved: true,
          precautions: [
            'Do not spray during peak bee pollination hours (10 AM to 2 PM).'
          ]
        },
        {
          tradeName: 'Mancozeb 75% WP (Indofil M-45)',
          genericName: 'Mancozeb 75% WP',
          dosagePerLiter: '2.5 g / Liter',
          dosagePerAcre: '500 g / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Protective spray at 45 and 60 days after sowing.',
          waitingPeriodDays: 14,
          sprayIntervalDays: '10 days',
          cibrcApproved: true,
          precautions: ['Use hollow cone nozzle for fine mist.']
        }
      ],
      organic: [
        {
          name: 'Fermented Butter Milk + Garlic Decoction',
          nameHindi: 'खट्टी छाछ व लहसुन का जैविक घोल',
          ingredients: '5L desi cow buttermilk fermented 6 days + 500g garlic paste in 150L water',
          dosagePerLiter: '30 ml / Liter',
          preparationMethod: 'Blend crushed garlic in sour buttermilk, strain through fine mesh cloth, and dilute in spray barrel.',
          applicationSchedule: 'Spray every 10 days during cloudy winter weeks.',
          bestTime: 'Morning 8 AM - 10 AM',
          costEfficiency: '₹75 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Sow tolerant varieties like RH-749, NRCHB-101, or Giriraj (DRMRI).',
        'Avoid late sowing after October 25 in Northern plains.',
        'Prune and destroy hypertrophied staghead twigs as soon as noticed.'
      ],
      hi: [
        'सहनशील किस्में जैसे RH-749, NRCHB-101 या गिरिराज की ही बुवाई करें।',
        'अक्टूबर के तीसरे सप्ताह के बाद देर से बुवाई करने से बचें।',
        'स्टैगहेड वाले विकृत फूलों और डंठलों को तुरंत तोड़कर जमीन में दबाएं।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#CA8A04'
  },
  {
    id: 'sugarcane-red-rot',
    crop: 'sugarcane',
    cropNameEn: 'Sugarcane',
    cropNameHi: 'गन्ना',
    cropIcon: '🎋',
    nameEn: 'Red Rot of Sugarcane (Cancer of Cane)',
    nameHi: 'गन्ने का लाल सड़न रोग (लाल सड़न)',
    pathogenType: 'Fungal',
    scientificName: 'Colletotrichum falcatum',
    severity: 'severe',
    confidenceRange: [94, 99],
    symptoms: {
      en: [
        'Third or fourth leaf from crown turns yellow, withers, and droops along margin',
        'Longitudinal splitting of stalk reveals blood-red internal tissues with characteristic white horizontal cross-bands',
        'Sour alcohol-like fermenting odor emitted from split infected canes'
      ],
      hi: [
        'गन्ने के ऊपरी भाग की तीसरी-चौथी पत्ती पीली पड़कर सूखने लगती है',
        'गन्ने को बीच से चीरने पर अंदर का गूदा लाल दिखाई देता है जिस पर सफेद आड़ी धारियां (White patches) होती हैं',
        'गन्ने से शराब जैसी खट्टी किण्वन की गंध आती है'
      ]
    },
    causes: {
      en: 'Infected seed setts, waterlogging in clay soils, and persistent 28-32°C monsoon temperatures.',
      hi: 'संक्रमित बीज गन्ने (सेट्स), खेत में जलभराव और 28-32°C का मानसूनी तापमान।'
    },
    favorableWeather: {
      temp: '27°C - 33°C',
      humidity: '> 90%',
      season: 'Monsoon (July - September)'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Carbendazim 50% WP (Bavistin) - Sett Treatment',
          genericName: 'Carbendazim 50% WP',
          dosagePerLiter: '1.0 g / Liter sett soak',
          dosagePerAcre: '200 g for seed setts per Acre',
          waterPerAcre: '200 Liters dipping solution',
          applicationMethod: 'Dip two/three-bud cane setts in solution for 15 minutes before furrow planting.',
          waitingPeriodDays: 60,
          sprayIntervalDays: 'One-time seed treatment',
          cibrcApproved: true,
          precautions: [
            'Wear rubber gloves while handling fungicide dip basin.'
          ]
        },
        {
          tradeName: 'Thiophanate Methyl 70% WP (Roko / Topsin-M)',
          genericName: 'Thiophanate Methyl 70% WP',
          dosagePerLiter: '1.5 g / Liter',
          dosagePerAcre: '300 g / Acre',
          waterPerAcre: '250 Liters',
          applicationMethod: 'Soil drenching along cane rows at first symptom onset.',
          waitingPeriodDays: 45,
          sprayIntervalDays: '15 days',
          cibrcApproved: true,
          precautions: ['Target root zone drenching rather than tall foliage.']
        }
      ],
      organic: [
        {
          name: 'Trichoderma harzianum Sett Dip + FYM Incorporation',
          nameHindi: 'ट्राइकोडर्मा हरजिएनम बीजोपचार + गोबर खाद',
          ingredients: 'Trichoderma harzianum 2% WP @ 10g/L sett dip + 2.5 kg/acre soil application with 500kg FYM',
          dosagePerLiter: '10 g / Liter for sett dipping',
          preparationMethod: 'Mix 2.5 kg bio-fungicide in moist FYM, incubate 10 days under shade, broadcast in furrows during planting.',
          applicationSchedule: 'At planting and earthing-up stage.',
          bestTime: 'Cool evening planting',
          costEfficiency: '₹220 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Plant red rot-resistant varieties like Co-0238 (select clean nurseries), Co-0118, Co-15023.',
        'Never take ratoon crop from a field diagnosed with red rot; burn dried trash.',
        'Treat setts with hot water (52°C for 30 minutes) or moist hot air.'
      ],
      hi: [
        'रोग प्रतिरोधी किस्मों (जैसे Co-0118, Co-15023) का ही स्वस्थ बीज बोएं।',
        'लाल सड़न वाले खेत में पेड़ी (Ratoon) फसल बिल्कुल न लें; पुरानी पत्तियां जलाएं।',
        'बुवाई से पहले 52°C गर्म पानी से 30 मिनट तक बीजोपचार करें।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#991B1B'
  },
  {
    id: 'soybean-yellow-mosaic',
    crop: 'soybean',
    cropNameEn: 'Soybean',
    cropNameHi: 'सोयाबीन',
    cropIcon: '🌱',
    nameEn: 'Soybean Yellow Mosaic Virus (YMV)',
    nameHi: 'सोयाबीन का पीला मोज़ेक वायरस',
    pathogenType: 'Viral',
    scientificName: 'Mungbean yellow mosaic India virus (MYMIV)',
    severity: 'severe',
    confidenceRange: [92, 97],
    symptoms: {
      en: [
        'Alternating bright yellow and green mosaic patches on young trifoliate leaves',
        'Severely infected plants produce small, flat, seedless or discolored pods',
        'Stunting of plants with leathery and curled foliage'
      ],
      hi: [
        'नई पत्तियों पर चमकीले पीले और गहरे हरे रंग के चितकबरे धब्बे (मोज़ेक)',
        'पौधों का कद छोटा होना और फलियों में दाने न पड़ना या छोटे रह जाना',
        'पत्तियां मोटी और खुरदरी हो जाना'
      ]
    },
    causes: {
      en: 'Vector Whitefly (Bemisia tabaci) spreading virus across Madhya Pradesh, Maharashtra, and Rajasthan fields.',
      hi: 'सफेद मक्खी (Whitefly) कीट द्वारा वायरस का तेजी से एक पौधे से दूसरे पौधे में फैलाव।'
    },
    favorableWeather: {
      temp: '26°C - 34°C',
      humidity: '65% - 85%',
      season: 'Kharif (July - August)'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC (Alika)',
          genericName: 'Thiamethoxam + Lambda-cyhalothrin ZC',
          dosagePerLiter: '0.4 ml / Liter',
          dosagePerAcre: '80 ml / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Foliar spray as soon as first yellowing spots appear in field.',
          waitingPeriodDays: 21,
          sprayIntervalDays: '10 to 14 days',
          cibrcApproved: true,
          precautions: ['Spray during calm air to ensure vector knockdown.']
        }
      ],
      organic: [
        {
          name: 'Yellow Sticky Traps + 5% Neem Seed Kernel Extract (NSKE)',
          nameHindi: 'पीले चिपचिपे ट्रैप + 5% निंबोली अर्क (NSKE)',
          ingredients: '5 kg powdered Neem seed kernels soaked overnight in 100L water with 100g soap + 20 Yellow Traps/Acre',
          dosagePerLiter: '50 ml / Liter',
          preparationMethod: 'Crush dried neem seeds, soak in water for 12 hours, filter thoroughly and spray.',
          applicationSchedule: 'Spray every 8 days from 15 DAS.',
          bestTime: 'Early morning',
          costEfficiency: '₹95 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Sow YMV-resistant cultivars like JS-20-29, JS-20-34, NRC-86, or JS-97-52.',
        'Treat seed with Imidacloprid 48% FS @ 1.25 ml/kg before sowing.',
        'Uproot and bury stray yellow mosaic plants before flowering.'
      ],
      hi: [
        'रोग प्रतिरोधी किस्में (जैसे JS-20-29, JS-20-34, NRC-86) की ही बुवाई करें।',
        'बुवाई से पहले इमिडाक्लोप्रिड 48% FS (1.25 मिली/किग्रा) से बीजोपचार करें।',
        'शुरुआती संक्रमित पीले पौधों को तुरंत उखाड़कर खेत से बाहर नष्ट करें।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#EAB308'
  },
  {
    id: 'groundnut-tikka-disease',
    crop: 'groundnut',
    cropNameEn: 'Groundnut / Peanut',
    cropNameHi: 'मूंगफली',
    cropIcon: '🥜',
    nameEn: 'Tikka Disease (Early & Late Leaf Spot)',
    nameHi: 'मूंगफली का टिक्का रोग (पत्ती धब्बा)',
    pathogenType: 'Fungal',
    scientificName: 'Cercospora arachidicola & Phaeoisariopsis personata',
    severity: 'moderate',
    confidenceRange: [91, 96],
    symptoms: {
      en: [
        'Circular brown-black spots with bright yellow halos on upper leaf surface (Early Leaf Spot)',
        'Dark black carbonaceous spots lacking distinct yellow halos on lower surface (Late Leaf Spot)',
        'Severe premature defoliation leaving only bare stem tips, cutting pod yields by 50%'
      ],
      hi: [
        'पत्तियों पर गोल भूरे-काले धब्बे जिनके चारों ओर पीला घेरा (हेलो) होता है',
        'पत्तियों की निचली सतह पर काले खुरदरे धब्बे',
        'पत्तियों का तेजी से झड़ना जिससे पौधे ठूंठ बन जाते हैं और फलियां छोटी रह जाती हैं'
      ]
    },
    causes: {
      en: 'High soil humidity, intermittent rainy spells, and temperatures around 25-30°C.',
      hi: 'अधिक नमी, रुक-रुक कर होने वाली मानसूनी बारिश और 25-30°C का तापमान।'
    },
    favorableWeather: {
      temp: '24°C - 30°C',
      humidity: '> 85%',
      season: 'Kharif (August - September)'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Hexaconazole 5% SC (Contaf Plus / Sitara)',
          genericName: 'Hexaconazole 5% SC',
          dosagePerLiter: '2.0 ml / Liter',
          dosagePerAcre: '400 ml in 200 Liters water / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Foliar spray starting 35-40 days after sowing.',
          waitingPeriodDays: 20,
          sprayIntervalDays: '12 to 14 days',
          cibrcApproved: true,
          precautions: ['Spray evenly on both leaf surfaces.']
        },
        {
          tradeName: 'Carbendazim 12% + Mancozeb 63% WP (Saaf / Companion)',
          genericName: 'Carbendazim 12% + Mancozeb 63% WP',
          dosagePerLiter: '2.0 g / Liter',
          dosagePerAcre: '400 g / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Curative spray on first spot observation.',
          waitingPeriodDays: 15,
          sprayIntervalDays: '10 to 12 days',
          cibrcApproved: true,
          precautions: ['Maintain safe interval before fodder harvest.']
        }
      ],
      organic: [
        {
          name: 'Pseudomonas fluorescens 1% WP Foliar Spray',
          nameHindi: 'स्यूडोमोनास फ्लोरोसेंस जैविक स्प्रे',
          ingredients: 'Pseudomonas fluorescens @ 5g/L water + 2g jaggery',
          dosagePerLiter: '5 g / Liter',
          preparationMethod: 'Mix bio-agent with water and jaggery, spray under overcast sky.',
          applicationSchedule: 'Spray at 40 and 55 DAS.',
          bestTime: 'Evening 4 PM onwards',
          costEfficiency: '₹130 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Treat seed kernels with Trichoderma @ 10g/kg or Thiram @ 3g/kg seed before sowing.',
        'Adopt intercropping with Redgram / Pigeonpea (6:1 ratio) to break pathogen air currents.',
        'Deep plow fields in summer to bury infected groundnut haulms.'
      ],
      hi: [
        'बुवाई से पहले बीजों (दानों) का ट्राइकोडर्मा (10 ग्राम/किग्रा) से बीजोपचार करें।',
        'अरहर के साथ 6:1 अनुपात में अंतर-फसल (Intercropping) लगाएं।',
        'गर्मी में खेत की गहरी जुताई करके पुरानी पत्तियों और अवशेषों को नष्ट करें।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#78350F'
  },
  {
    id: 'maize-fall-armyworm',
    crop: 'maize',
    cropNameEn: 'Maize / Corn',
    cropNameHi: 'मक्का',
    cropIcon: '🌽',
    nameEn: 'Fall Armyworm Infestation (FAW)',
    nameHi: 'मक्के का फॉल आर्मीवर्म (सैनिक कीट प्रकोप)',
    pathogenType: 'Pest',
    scientificName: 'Spodoptera frugiperda (Fall Armyworm)',
    severity: 'severe',
    confidenceRange: [94, 98],
    symptoms: {
      en: [
        'Pin-hole feeding marks and elongated papery window panes on young whorl leaves',
        'Copious fresh sawdust-like granular larval excreta (frass) accumulated inside central whorl funnel',
        'Ragged, severely shredded leaves and boring into developing corn cobs'
      ],
      hi: [
        'मक्के की गोभ (Whorl) की पत्तियों पर छेद और जालीदार सफेद पारदर्शी खिड़कियां',
        'गोभ के अंदर लकड़ी के बुरादे जैसा कीट का मल (Frass) भरा होना',
        'पत्तियों का बुरी तरह फटा और कटा-फटा दिखाई देना और भुट्टों में सुराख'
      ]
    },
    causes: {
      en: 'Nocturnal moth laying egg masses covered in buff hair scales on leaf under-surfaces.',
      hi: 'रात में उड़ने वाले पतंगे द्वारा पत्तियों पर बालों से ढके अंडों का गुच्छा देना।'
    },
    favorableWeather: {
      temp: '22°C - 35°C',
      humidity: '50% - 85%',
      season: 'Kharif & Rabi'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Chlorantraniliprole 18.5% SC (Coragen)',
          genericName: 'Chlorantraniliprole 18.5% SC',
          dosagePerLiter: '0.4 ml / Liter',
          dosagePerAcre: '80 ml in 200 Liters water / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Direct knapsack nozzle straight down into central leaf whorl funnel.',
          waitingPeriodDays: 14,
          sprayIntervalDays: '15 to 20 days',
          cibrcApproved: true,
          precautions: [
            'Direct spray inside plant whorl (funnel); broadcasting on top canopy is ineffective.'
          ]
        },
        {
          tradeName: 'Emamectin Benzoate 5% SG (Proclaim / King Doxa)',
          genericName: 'Emamectin Benzoate 5% SG',
          dosagePerLiter: '0.5 g / Liter',
          dosagePerAcre: '100 g / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Targeted whorl spray at early instar stage.',
          waitingPeriodDays: 7,
          sprayIntervalDays: '10 to 12 days',
          cibrcApproved: true,
          precautions: ['Use protective eyewear during mixing.']
        }
      ],
      organic: [
        {
          name: 'Sand-Lime Whorl Application + Metarhizium rileyi',
          nameHindi: 'गोभ में रेत-चूना मिश्रण + मेटाराइजियम जैविक फफूंद',
          ingredients: 'Dry river sand 10 kg + 100g slaked lime (Chuna) applied in whorls + 5g/L Metarhizium rileyi bio-spray',
          dosagePerLiter: '5 g / Liter bio-spray or pinch of dry sand-lime mix per plant whorl',
          preparationMethod: 'Drop a pinch of dry sand-lime mix directly into each maize whorl. Larvae ingest abrasive grains and dehydrate.',
          applicationSchedule: 'Apply at 15 and 30 DAS.',
          bestTime: 'Morning',
          costEfficiency: '₹80 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Install 5 Pheromone Traps per acre with FAW lures to monitor adult moth arrival.',
        'Intercrop maize with Desmodium, Cowpea, or Groundnut to repel egg-laying moths (Push-Pull strategy).',
        'Hand-pick and crush egg masses and early-stage caterpillar clusters during morning field walks.'
      ],
      hi: [
        'कीट की निगरानी के लिए प्रति एकड़ 5 फेरोमोन ट्रैप (FAW ल्यूर) लगाएं।',
        'मक्के के साथ लोबिया (काउपी) या मूंगफली की अंतर-फसल लगाएं।',
        'सुबह के समय पत्तियों पर दिखने वाले अंडों के गुच्छों और सूंडियों को हाथ से चुनकर नष्ट करें।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#854D0E'
  },
  {
    id: 'onion-purple-blotch',
    crop: 'onion',
    cropNameEn: 'Onion / Garlic',
    cropNameHi: 'प्याज / लहसुन',
    cropIcon: '🧅',
    nameEn: 'Purple Blotch of Onion',
    nameHi: 'प्याज का बैंगनी धब्बा रोग (पर्पल ब्लॉच)',
    pathogenType: 'Fungal',
    scientificName: 'Alternaria porri',
    severity: 'moderate',
    confidenceRange: [92, 97],
    symptoms: {
      en: [
        'Small, water-soaked lesions on leaves rapidly developing purple to dark brownish-purple centers',
        'Yellow chlorotic halos surrounding lesions, causing leaf tops to break over and collapse',
        'Bulb rot developing at neck stage during harvest and transit storage'
      ],
      hi: [
        'पत्तियों पर छोटे, पानी जैसे धब्बे जो जल्दी ही गहरे बैंगनी-भूरे रंग में बदल जाते हैं',
        'धब्बों के किनारों पर पीलापन जिससे पत्तियां बीच से मुड़कर टूट जाती हैं',
        'कंद (गांठ) के ऊपरी हिस्से की सड़न जिससे भंडारण में प्याज खराब होता है'
      ]
    },
    causes: {
      en: 'High humidity (>80%), temperatures between 22-28°C, and frequent overhead sprinkler wetting.',
      hi: '80% से अधिक नमी, 22-28°C तापमान और पत्तियों पर लगातार पानी रुकना।'
    },
    favorableWeather: {
      temp: '20°C - 28°C',
      humidity: '> 80%',
      season: 'Rabi & Kharif'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Difenoconazole 25% EC (Score) + Sticker',
          genericName: 'Difenoconazole 25% EC',
          dosagePerLiter: '1.0 ml / Liter + 0.5 ml sticker (APS-80)',
          dosagePerAcre: '200 ml / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Foliar spray with agricultural wetting agent/sticker because onion leaves have waxy cuticle.',
          waitingPeriodDays: 7,
          sprayIntervalDays: '10 to 12 days',
          cibrcApproved: true,
          precautions: [
            'Mandatory: Always mix non-ionic sticker/spreader; spray droplets roll off waxy onion leaves otherwise.'
          ]
        },
        {
          tradeName: 'Mancozeb 75% WP (Indofil M-45)',
          genericName: 'Mancozeb 75% WP',
          dosagePerLiter: '2.5 g / Liter',
          dosagePerAcre: '500 g / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Preventive protective spray.',
          waitingPeriodDays: 7,
          sprayIntervalDays: '10 days',
          cibrcApproved: true,
          precautions: ['Add sticker surfactant.']
        }
      ],
      organic: [
        {
          name: 'Trichoderma viride + Cow Urine Bio-Wash',
          nameHindi: 'ट्राइकोडर्मा विरिडी + गोमूत्र सुरक्षा स्प्रे',
          ingredients: 'Trichoderma viride @ 5g/L + Aged cow urine @ 50ml/L + 1ml natural soap',
          dosagePerLiter: '5 g Trichoderma + 50 ml cow urine / Liter',
          preparationMethod: 'Blend bio-fungicide in diluted cow urine with soap surfactant.',
          applicationSchedule: 'Spray every 10 days starting 30 days after transplanting.',
          bestTime: 'Afternoon 4 PM',
          costEfficiency: '₹110 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Dip onion seedling roots in Carbendazim (1g/L) or Trichoderma (10g/L) for 15 mins before transplanting.',
        'Avoid excessive nitrogen top-dressing which makes onion leaf tissues soft and vulnerable.',
        'Cure onion bulbs in shade with tops attached for 10-15 days before removing foliage for storage.'
      ],
      hi: [
        'पौध रोपाई से पहले जड़ों को ट्राइकोडर्मा (10 ग्राम/ली) के घोल में 15 मिनट डुबोएं।',
        'यूरिया का अधिक प्रयोग न करें जिससे पत्तियां कोमल होकर जल्दी बीमार होती हैं।',
        'भंडारण से पहले प्याज को 10-15 दिन छाया में सुखाएं (Curing)।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#7E22CE'
  },
  {
    id: 'gram-wilt',
    crop: 'gram',
    cropNameEn: 'Gram / Chickpea',
    cropNameHi: 'चना / छोले',
    cropIcon: '🧆',
    nameEn: 'Fusarium Wilt of Chickpea (Ukhta Rog)',
    nameHi: 'चने का उकठा रोग (विल्ट)',
    pathogenType: 'Fungal',
    scientificName: 'Fusarium oxysporum f. sp. ciceris',
    severity: 'severe',
    confidenceRange: [93, 98],
    symptoms: {
      en: [
        'Sudden drooping, dull greenish-grey discoloration, and drying of leaves without preliminary yellowing',
        'Internal xylem vascular vessels show dark brown to black longitudinal discoloration when taproot is split vertically',
        'Rapid wilting in patches across the field during seedling and flowering stages'
      ],
      hi: [
        'पौधों की पत्तियों का अचानक मुरझाना और सूखकर लटक जाना',
        'चने की मुख्य जड़ को बीच से चीरने पर अंदर की नलियों में काली-कत्थई धारियां (Vascular browning) दिखना',
        'खेत में गोल पैचों में पौधों का अचानक सूखना'
      ]
    },
    causes: {
      en: 'Soil-borne fungus surviving as chlamydospores in soil for up to 6 years, triggered by warm soil (>25°C) and moisture stress.',
      hi: 'मिट्टी में रहने वाली फफूंद, जो 25°C से अधिक तापमान और मिट्टी में नमी की कमी से सक्रिय होती है।'
    },
    favorableWeather: {
      temp: '22°C - 28°C',
      humidity: '50% - 70%',
      season: 'Rabi (November & February)'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Carbendazim 50% WP (Bavistin) Seed Treatment',
          genericName: 'Carbendazim 50% WP',
          dosagePerLiter: '2.0 g / kg seed',
          dosagePerAcre: '60 g for 30kg seed rate / Acre',
          waterPerAcre: 'Minimal slurry water for seed coating',
          applicationMethod: 'Dry seed dressing or slurry coating 24 hours before sowing.',
          waitingPeriodDays: 60,
          sprayIntervalDays: 'Single pre-sowing seed treatment',
          cibrcApproved: true,
          precautions: [
            'Once plants wilt in field, foliar spray is ineffective because pathogen is in root xylem.'
          ]
        }
      ],
      organic: [
        {
          name: 'Trichoderma harzianum 2% WP Soil Enrichment',
          nameHindi: 'ट्राइकोडर्मा हरजिएनम 2% गोबर खाद संवर्धन',
          ingredients: '2.5 kg Trichoderma harzianum + 100 kg farmyard manure (FYM) incubated 10 days under wet gunny bags',
          dosagePerLiter: '2.5 kg / Acre soil application',
          preparationMethod: 'Broadcast bio-enriched manure in furrows before last plowing.',
          applicationSchedule: 'Pre-sowing basal application.',
          bestTime: 'Evening furrow broadcast',
          costEfficiency: '₹180 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Sow wilt-resistant chickpea varieties like JG-11, JG-14, JAKI-9218, RVG-202, or Pusa-372.',
        'Adopt deep sowing (8-10 cm) to place roots in cooler, moist soil layers.',
        'Rotate with non-host crops like wheat, mustard, or barley; avoid chickpea after chickpea.'
      ],
      hi: [
        'उकठा प्रतिरोधी किस्में जैसे JG-11, JG-14, JAKI-9218, RVG-202 ही बोएं।',
        'बीज की बुवाई थोड़ी गहरी (8-10 सेमी) करें ताकि जड़ें ठंडी मिट्टी में रहें।',
        'गेहूं या सरसों के साथ फसल चक्र अपनाएं, लगातार उसी खेत में चना न बोएं।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#92400E'
  },
  {
    id: 'mango-powdery-mildew',
    crop: 'mango',
    cropNameEn: 'Mango',
    cropNameHi: 'आम',
    cropIcon: '🥭',
    nameEn: 'Powdery Mildew of Mango',
    nameHi: 'आम का चूर्णिल आसिता (भभूतिया रोग)',
    pathogenType: 'Fungal',
    scientificName: 'Oidium mangiferae',
    severity: 'severe',
    confidenceRange: [93, 98],
    symptoms: {
      en: [
        'White superficial powdery flour-like fungal growth on inflorescences (panicles), floral axis, and young fruitlets',
        'Blossom blight: flowers turn brown, fail to open, dry up, and drop completely',
        'Pea-stage green fruit drop, resulting in up to 70-80% crop yield loss'
      ],
      hi: [
        'बौर (फूलों के गुच्छों), डंठल और छोटे फलों पर सफेद भभूति/पाउडर जैसी परत',
        'फूलों का भूरा होकर सूखना और बिना फल बने झड़ जाना',
        'मटर के दाने जैसे छोटे फलों का भारी संख्या में गिरना'
      ]
    },
    causes: {
      en: 'Cool nights (10-15°C) with warm sunny days (28-32°C) and morning fog during flowering season (February-March).',
      hi: 'बौर आने के समय (फरवरी-मार्च) रात की ठंड, सुबह का कोहरा और दिन की धूप।'
    },
    favorableWeather: {
      temp: '15°C - 30°C',
      humidity: '65% - 85%',
      season: 'Spring (February - March)'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Wettable Sulphur 80% WDG (Sulfex / Insulf)',
          genericName: 'Sulphur 80% WDG',
          dosagePerLiter: '2.5 g / Liter',
          dosagePerAcre: '500 - 750 g / 250L water per Acre orchard',
          waterPerAcre: '250 - 500 Liters (orchard spray)',
          applicationMethod: 'First spray at panicle emergence before flower opening.',
          waitingPeriodDays: 5,
          sprayIntervalDays: '10 to 14 days',
          cibrcApproved: true,
          precautions: [
            'Do not spray Sulphur when day temperature exceeds 35°C to avoid scorching blossom.'
          ]
        },
        {
          tradeName: 'Hexaconazole 5% EC (Contaf)',
          genericName: 'Hexaconazole 5% EC',
          dosagePerLiter: '1.0 ml / Liter',
          dosagePerAcre: '250 ml in 250 Liters water',
          waterPerAcre: '250 Liters',
          applicationMethod: 'Second spray at 50% fruit set (pea size).',
          waitingPeriodDays: 14,
          sprayIntervalDays: '12 days',
          cibrcApproved: true,
          precautions: ['Cover the entire tree canopy thoroughly with high-pressure power sprayer.']
        }
      ],
      organic: [
        {
          name: 'Fermented Milk-Whey (Khatta Dudh) 10% Spray',
          nameHindi: 'खट्टा दूध/छाछ 10% जैव छिड़काव',
          ingredients: '10 Liters desi cow fermented whey + 90 Liters water',
          dosagePerLiter: '100 ml / Liter (10% solution)',
          preparationMethod: 'Ferment cow whey in shade for 4 days, dilute and spray on panicles.',
          applicationSchedule: 'Spray weekly during flowering.',
          bestTime: 'Morning 8 AM - 10 AM',
          costEfficiency: '₹150 per Orchard Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Prune dense interior branches after harvest to allow sunlight penetration into inner tree canopy.',
        'Prune and destroy malformed vegetative shoots and dried inflorescences in December.',
        'Maintain balanced orchard irrigation; do not flood during peak bloom.'
      ],
      hi: [
        'कटाई के बाद पेड़ के बीच की घनी डालियों की छंटाई करें ताकि धूप अंदर तक पहुंचे।',
        'दिसंबर में सूखे बौर और बीमार टहनियों को काटकर नष्ट करें।',
        'फूल खिलते समय अधिक भारी सिंचाई करने से बचें।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#F59E0B'
  },
  {
    id: 'banana-panama-wilt',
    crop: 'banana',
    cropNameEn: 'Banana',
    cropNameHi: 'केला',
    cropIcon: '🍌',
    nameEn: 'Panama Wilt (Fusarium Wilt TR4)',
    nameHi: 'केले का पनामा विल्ट / उकठा रोग',
    pathogenType: 'Fungal',
    scientificName: 'Fusarium oxysporum f. sp. cubense (Tropical Race 4)',
    severity: 'severe',
    confidenceRange: [94, 99],
    symptoms: {
      en: [
        'Yellowing of lower leaf margins progressing inward; leaves buckle at petiole base and hang like a skirt around pseudostem',
        'Longitudinal splitting of pseudostem base with distinctive reddish-brown vascular discoloration inside corm',
        'Complete wilting and collapse of banana mat before bunch maturation'
      ],
      hi: [
        'निचली पत्तियों के किनारों का पीला पड़ना, डंठल का टूटना और पत्तियों का तने के चारों ओर लटक जाना',
        'तने के निचले हिस्से का फटना और कंद को काटने पर अंदर लाल-कत्थई धारियां दिखना',
        'घौद (Bunch) पकने से पहले ही पूरे पौधे का सूखकर गिर जाना'
      ]
    },
    causes: {
      en: 'Soil fungus penetrating root vascular bundles, spread via contaminated suckers, farm tools, and irrigation channels.',
      hi: 'मिट्टी की फफूंद जो जड़ों से तने में घुसती है; संक्रमित सकर्स और सिंचाई जल से फैलती है।'
    },
    favorableWeather: {
      temp: '25°C - 34°C',
      humidity: '> 80%',
      season: 'All Seasons'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Carbendazim 50% WP (Bavistin) - Sucker Dip & Drench',
          genericName: 'Carbendazim 50% WP',
          dosagePerLiter: '2.0 g / Liter',
          dosagePerAcre: '500 g for sucker treatment / Acre',
          waterPerAcre: '250 Liters dipping solution',
          applicationMethod: 'Paring and pralinage of suckers followed by 2g/L dip for 30 minutes before field planting.',
          waitingPeriodDays: 60,
          sprayIntervalDays: 'Planting time treatment',
          cibrcApproved: true,
          precautions: [
            'Quarantine infected mats; disinfect farm machetes in 5% bleach between plants.'
          ]
        }
      ],
      organic: [
        {
          name: 'Pseudomonas fluorescens + Trichoderma viride Corm Treatment',
          nameHindi: 'स्यूडोमोनास + ट्राइकोडर्मा कंद उपचार व जड़ छिड़काव',
          ingredients: '50g Trichoderma + 50g Pseudomonas mixed in 5 kg cow dung slurry per planting pit',
          dosagePerLiter: '20 g bio-mix per sucker pit',
          preparationMethod: 'Apply enriched compost directly in planting pits and drench every 2 months.',
          applicationSchedule: 'At planting, 2nd month, and 4th month.',
          bestTime: 'Cool planting hours',
          costEfficiency: '₹280 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Plant certified tissue-culture banana plantlets (Grand Naine / G9) from accredited labs.',
        'Never source traditional suckers from regions known to harbor Fusarium TR4.',
        'Practice green manuring with Sunnhemp or Crotalaria to suppress soil nematode and fungus populations.'
      ],
      hi: [
        'हमेशा प्रमाणित लैब से टिशू कल्चर पौधे (Grand Naine G9) ही लगाएं।',
        'बीमार क्षेत्रों से देसी सकर्स (कंद) कभी न लाएं।',
        'खेत में सनई या ढैंचा की हरी खाद देकर मिट्टी का जीवांश सुधारें।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#EAB308'
  },
  {
    id: 'tea-blister-blight',
    crop: 'tea',
    cropNameEn: 'Tea',
    cropNameHi: 'चाय',
    cropIcon: '🍵',
    nameEn: 'Blister Blight of Tea',
    nameHi: 'चाय का फफोला रोग (ब्लिस्टर ब्लाइट)',
    pathogenType: 'Fungal',
    scientificName: 'Exobasidium vexans',
    severity: 'severe',
    confidenceRange: [93, 98],
    symptoms: {
      en: [
        'Pale yellow translucent pinhead spots on tender young tea shoots (two leaves and a bud)',
        'Circular concave depression on upper leaf surface with corresponding white velvety blister on under surface',
        'Stem curl and death of harvested flush, destroying marketable green tea leaves'
      ],
      hi: [
        'कोमल चाय की नई पत्तियों (Two leaves and a bud) पर हल्के पीले पारदर्शी धब्बे',
        'पत्ती की ऊपरी सतह पर गड्ढा और निचली सतह पर सफेद मखमली फफोला (Blister)',
        'नई पत्तियों का मुड़ना और सूखना जिससे चाय की गुणवत्ता और उपज नष्ट होती है'
      ]
    },
    causes: {
      en: 'High hill altitude humidity (>90%), continuous monsoon drizzle, and temperatures between 15-22°C in Assam, Nilgiris, and Darjeeling.',
      hi: 'पहाड़ी क्षेत्रों में लगातार रिमझिम बारिश, 90% से अधिक नमी और 15-22°C तापमान।'
    },
    favorableWeather: {
      temp: '15°C - 23°C',
      humidity: '> 90%',
      season: 'Monsoon (June - September)'
    },
    treatments: {
      chemical: [
        {
          tradeName: 'Copper Oxychloride 50% WP + Hexaconazole 5% EC (TRA Protocol)',
          genericName: 'Copper Oxychloride + Hexaconazole',
          dosagePerLiter: '1.5 g COC + 0.5 ml Hexaconazole / Liter',
          dosagePerAcre: '300 g COC + 100 ml Hexaconazole in 200 Liters water / Acre',
          waterPerAcre: '200 Liters',
          applicationMethod: 'Fine mist spraying immediately after 7-day plucking round.',
          waitingPeriodDays: 7,
          sprayIntervalDays: '7 to 10 days during continuous rain',
          cibrcApproved: true,
          precautions: [
            'Strictly observe Tea Board of India Plant Protection Code (PPC) maximum residue limits (MRL).'
          ]
        }
      ],
      organic: [
        {
          name: 'Bacillus subtilis (Bio-Protector) Tea Board Certified',
          nameHindi: 'बैसिलस सबटिलिस जैविक जैव-फफूंदनाशी',
          ingredients: 'Bacillus subtilis 1% WP @ 5g/L water',
          dosagePerLiter: '5 g / Liter',
          preparationMethod: 'Mix bio-agent in clean mountain stream water and spray on tea bushes.',
          applicationSchedule: 'Spray every 7 days during plucking season.',
          bestTime: 'Morning before mist lifts',
          costEfficiency: '₹220 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Regulate shade tree canopy (lopping of shade tree branches before monsoon) to enhance sunlight penetration.',
        'Strictly follow 7-day regular plucking rounds without letting tender shoots overgrow.',
        'Avoid excessive late application of nitrogenous fertilizers during peak monsoon months.'
      ],
      hi: [
        'मानसून से पहले छायादार पेड़ों की डालियों की छंटाई करें ताकि धूप चाय की झाड़ियों तक पहुंचे।',
        '7 दिनों के नियमित अंतराल पर नई पत्तियों की चुनाई (Plucking) करें।',
        'मानसून के महीनों में यूरिया का अधिक प्रयोग न करें।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#047857'
  },
  {
    id: 'crop-healthy',
    crop: 'tomato',
    cropNameEn: 'Tomato / General Crop',
    cropNameHi: 'टमाटर / सामान्य फसल',
    cropIcon: '🌿',
    nameEn: 'Healthy Crop (No Pathogen Detected)',
    nameHi: 'स्वस्थ फसल (कोई रोग नहीं मिला)',
    pathogenType: 'None',
    scientificName: 'Optimal Chlorophyll & Leaf Vigour',
    severity: 'healthy',
    confidenceRange: [96, 99],
    symptoms: {
      en: [
        'Vibrant, deep green uniform leaf coloration with intact cuticle',
        'No necrotic spots, powdery mildew, rust pustules, or leaf curling detected',
        'Turgid vascular veins and vigorous vegetative growth'
      ],
      hi: [
        'चमकदार, गहरा हरा रंग और स्वस्थ पत्तियों की बनावट',
        'कोई फफूंद, धब्बे, रतुआ या मरोड़िया लक्षण नहीं पाए गए',
        'पौधे का सामान्य विकास और स्वस्थ तना'
      ]
    },
    causes: {
      en: 'Balanced soil nutrition, timely irrigation, and effective proactive pest management.',
      hi: 'संतुलित खाद, समय पर सिंचाई और उत्तम कृषि प्रबंधन।'
    },
    favorableWeather: {
      temp: '22°C - 30°C',
      humidity: '50% - 70%',
      season: 'All Seasons'
    },
    treatments: {
      chemical: [],
      organic: [
        {
          name: 'Preventive Seaweed Extract / Panchagavya Growth Tonic',
          nameHindi: 'पंचगव्य / समुद्री शैवाल टॉनिक (प्रतिरोधक क्षमता वृद्धि)',
          ingredients: 'Panchagavya 3% solution (30ml/L) or Ascophyllum nodosum seaweed liquid @ 2ml/L',
          dosagePerLiter: '30 ml / Liter',
          preparationMethod: 'Mix 300ml authentic Panchagavya in 10L clean water, stir clockwise for 5 mins, and filter before filling sprayer tank.',
          applicationSchedule: 'Spray once every 15-20 days during flowering and fruit setting stages to boost plant immunity.',
          bestTime: 'Morning 7 AM - 9 AM',
          costEfficiency: '₹150 per Acre'
        }
      ]
    },
    preventionTips: {
      en: [
        'Continue regular weekly field scouting for early pest signs.',
        'Maintain soil organic carbon by incorporating compost or vermicompost.',
        'Conduct routine soil testing once a year to balance N-P-K and micronutrients (Zinc, Boron, Iron).',
        'Ensure proper field drainage before monsoon rains.'
      ],
      hi: [
        'कीटों और रोगों की समय पर पहचान के लिए हफ्ते में एक बार खेत का निरीक्षण करते रहें।',
        'मिट्टी में जीवांश कार्बन बढ़ाने के लिए गोबर की खाद या वर्मीकम्पोस्ट का प्रयोग जारी रखें।',
        'वर्ष में एक बार मिट्टी परीक्षण कराकर ही रासायनिक खादों का प्रयोग करें।',
        'बारिश के मौसम में खेत से अतिरिक्त पानी की उचित जल निकासी की व्यवस्था रखें।'
      ]
    },
    sampleImage: 'https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=800&auto=format&fit=crop&q=80',
    fallbackColor: '#166534'
  }
];
