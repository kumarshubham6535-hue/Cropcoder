import React, { useState } from 'react';
import { CropCategory, DiseaseInfo, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CROP_DISEASES } from '../data/cropDiseases';
import {
  Sparkles,
  Camera,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  PhoneCall,
  Activity,
  Layers,
  Thermometer,
  CloudRain
} from 'lucide-react';

interface LandingPageProps {
  currentLang: Language;
  onNavigateToScan: (crop?: CropCategory) => void;
  onSelectSampleLeaf: (disease: DiseaseInfo) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentLang,
  onNavigateToScan,
  onSelectSampleLeaf,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [headlineLang, setHeadlineLang] = useState<'hi' | 'en'>(currentLang === 'hi' ? 'hi' : 'en');

  const CROPS_GRID: { id: CropCategory; nameEn: string; nameHi: string; icon: string; typicalDiseases: string }[] = [
    { id: 'potato', nameEn: 'Potato', nameHi: 'आलू', icon: '🥔', typicalDiseases: 'Late Blight, Early Blight, Black Scurf' },
    { id: 'tomato', nameEn: 'Tomato', nameHi: 'टमाटर', icon: '🍅', typicalDiseases: 'Early Blight, Leaf Curl, Bacterial Wilt' },
    { id: 'rice', nameEn: 'Paddy / Rice', nameHi: 'धान', icon: '🌾', typicalDiseases: 'Blast, Bacterial Blight, Sheath Rot' },
    { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं', icon: '🌾', typicalDiseases: 'Yellow Rust, Brown Rust, Karnal Bunt' },
    { id: 'mustard', nameEn: 'Mustard / Rapeseed', nameHi: 'सरसों', icon: '🌼', typicalDiseases: 'White Rust, Alternaria Blight' },
    { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास', icon: '🌱', typicalDiseases: 'Bacterial Blight, Bollworm, Leaf Curl' },
    { id: 'sugarcane', nameEn: 'Sugarcane', nameHi: 'गन्ना', icon: '🎋', typicalDiseases: 'Red Rot, Smut, Grassy Shoot' },
    { id: 'chilli', nameEn: 'Chilli', nameHi: 'मिर्च', icon: '🌶️', typicalDiseases: 'Murda Rog (Leaf Curl), Anthracnose' },
    { id: 'soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन', icon: '🌱', typicalDiseases: 'Yellow Mosaic Virus, Charcoal Rot' },
    { id: 'groundnut', nameEn: 'Groundnut / Peanut', nameHi: 'मूंगफली', icon: '🥜', typicalDiseases: 'Tikka Leaf Spot, Rust' },
    { id: 'maize', nameEn: 'Maize / Corn', nameHi: 'मक्का', icon: '🌽', typicalDiseases: 'Fall Armyworm, Maydis Leaf Blight' },
    { id: 'onion', nameEn: 'Onion / Garlic', nameHi: 'प्याज', icon: '🧅', typicalDiseases: 'Purple Blotch, Stemphylium Blight' },
    { id: 'gram', nameEn: 'Gram / Chickpea', nameHi: 'चना', icon: '🧆', typicalDiseases: 'Fusarium Wilt, Ascochyta Blight' },
    { id: 'mango', nameEn: 'Mango', nameHi: 'आम', icon: '🥭', typicalDiseases: 'Powdery Mildew, Anthracnose, Dieback' },
    { id: 'banana', nameEn: 'Banana', nameHi: 'केला', icon: '🍌', typicalDiseases: 'Panama Wilt TR4, Sigatoka Leaf Spot' },
    { id: 'tea', nameEn: 'Tea', nameHi: 'चाय', icon: '🍵', typicalDiseases: 'Blister Blight, Red Rust, Black Rot' },
  ];

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-200">
      {/* 1. Agro-Climatic Live Alert Strip */}
      <div className="bg-[#FAF7F0] border-b border-[#E5DFD3] py-2.5 px-4 text-xs text-[#1B4332]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
              <CloudRain className="w-3 h-3" />
              <span>{currentLang === 'hi' ? 'मौसम चेतावनी' : 'AGRO-CLIMATE ALERT'}</span>
            </span>
            <span className="font-semibold text-neutral-800">
              {t.advisoryWeatherAlert}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-neutral-600">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-[#D4A24E]" />
              <span>RH: 88% | Temp: 24°C</span>
            </span>
            <span className="hidden md:inline text-neutral-400">|</span>
            <span className="hidden md:inline font-medium text-emerald-800">
              {t.advisoryKvkSeal}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section (Smart Precision Agriculture Field Background) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative text-[#FAF7F0] rounded-xl p-6 sm:p-10 lg:p-12 border border-[#D4A24E]/40 shadow-xl overflow-hidden bg-[#081C15]">
          {/* Smart Agriculture Background Image with Drone & Precision Farming Landscape */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80')`,
            }}
          />
          {/* Gradient & Dark Contrast Overlays to Ensure Maximum WCAG AA Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#081C15]/95 via-[#1B4332]/88 to-[#081C15]/75 pointer-events-none" />
          <div className="absolute -right-12 -bottom-12 w-96 h-96 rounded-full bg-[#2D6A4F]/30 pointer-events-none blur-2xl" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4A24E]/15 pointer-events-none rounded-full blur-2xl" />

          <div className="relative z-10 max-w-3xl">
            {/* Bilingual Toggle Pill */}
            <div className="inline-flex items-center gap-1 p-1 rounded-md bg-[#081C15]/60 border border-[#2D6A4F] mb-4 text-xs font-semibold">
              <button
                onClick={() => setHeadlineLang('hi')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  headlineLang === 'hi'
                    ? 'bg-[#D4A24E] text-[#081C15] font-bold'
                    : 'text-[#FAF7F0]/80 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setHeadlineLang('en')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  headlineLang === 'en'
                    ? 'bg-[#D4A24E] text-[#081C15] font-bold'
                    : 'text-[#FAF7F0]/80 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#FAF7F0] leading-tight mb-4">
              {headlineLang === 'hi' ? (
                <>
                  फसल की बीमारी पहचानें और <br />
                  <span className="text-[#D4A24E] underline decoration-[#D4A24E]/40 underline-offset-8">
                    तुरंत सटीक इलाज व पर्ची
                  </span> पाएं
                </>
              ) : (
                <>
                  Instant Crop Disease Diagnosis & <br />
                  <span className="text-[#D4A24E] underline decoration-[#D4A24E]/40 underline-offset-8">
                    Field Agronomic Advisory
                  </span>
                </>
              )}
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-[#FAF7F0]/85 leading-relaxed mb-8 max-w-2xl">
              {headlineLang === 'hi' ? (
                <span>
                  रोगग्रस्त पत्ती की फोटो अपलोड करें — ICAR व KVK प्रमाणित जैविक व रासायनिक दवाओं की सही खुराक (Dosage), स्प्रेयर टंकी गणना और किसान परामर्श पर्ची तुरंत प्राप्त करें।
                </span>
              ) : (
                <span>
                  Capture or upload a leaf photo to receive ICAR-certified bio-organic and chemical remedies, knapsack sprayer tank calculators, and official prescription slips.
                </span>
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => onNavigateToScan()}
                className="bg-[#D4A24E] hover:bg-[#C2903C] text-[#081C15] px-6 py-3 rounded-md text-sm sm:text-base font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 tracking-wide"
              >
                <Camera className="w-5 h-5 text-[#081C15]" />
                <span>{t.heroBtnScan}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onSelectSampleLeaf(CROP_DISEASES[0])}
                className="bg-[#081C15]/70 hover:bg-[#081C15] text-[#FAF7F0] border border-[#2D6A4F] px-5 py-3 rounded-md text-sm sm:text-base font-bold flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#D4A24E]" />
                <span>{t.heroBtnDemo}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Credible Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E5DFD3] rounded-lg p-5 sm:p-6 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#E5DFD3]">
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-mono">
                40%
              </div>
              <div className="text-xs text-neutral-600 font-medium mt-1">
                {t.statLossPrevented}
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-mono">
                24+
              </div>
              <div className="text-xs text-neutral-600 font-medium mt-1">
                {t.statCropsSupported}
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-mono">
                10,000+
              </div>
              <div className="text-xs text-neutral-600 font-medium mt-1">
                {t.statRemediesCount}
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#D4A24E] font-mono">
                &lt; 3s
              </div>
              <div className="text-xs text-neutral-600 font-medium mt-1">
                {t.statResponseTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 3-Step "How It Works" Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] tracking-tight">
            {currentLang === 'hi' ? 'कार्यप्रणाली — केवल ३ आसान चरण' : 'How It Works — 3 Simple Steps'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Simple, fast, and engineered specifically for real field conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white border border-[#E5DFD3] rounded-lg p-6 hover:border-[#1B4332] transition-colors shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-md bg-[#1B4332] text-[#D4A24E] flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                {t.step1Title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 text-[11px] text-[#1B4332] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Camera or Gallery upload</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#E5DFD3] rounded-lg p-6 hover:border-[#1B4332] transition-colors shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-md bg-[#1B4332] text-[#D4A24E] flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                {t.step2Title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 text-[11px] text-[#1B4332] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>96%+ Pattern accuracy</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#E5DFD3] rounded-lg p-6 hover:border-[#1B4332] transition-colors shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-md bg-[#1B4332] text-[#D4A24E] flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                {t.step3Title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 text-[11px] text-[#1B4332] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chemical + Organic + Prescription</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 1-Click Live Test Samples Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F0] border border-[#2D6A4F]/40 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#1B4332] text-[#D4A24E] text-[11px] font-bold mb-1">
                <span>DEMO PRESETS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1B4332]">
                {currentLang === 'hi' ? 'तुरंत जांचें (1-Click Sample Leaf Tests)' : 'Instant 1-Click Sample Leaf Tests'}
              </h2>
            </div>
            <p className="text-xs text-neutral-600 max-w-md">
              Click any sample leaf below to immediately test diagnosis, dosage calculations, and the agronomic prescription slip.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CROP_DISEASES.slice(0, 5).map((d) => (
              <div
                key={d.id}
                onClick={() => onSelectSampleLeaf(d)}
                className="bg-white border border-[#E5DFD3] rounded-lg overflow-hidden cursor-pointer hover:border-[#1B4332] transition-all hover:shadow-md group flex flex-col"
              >
                <div className="aspect-4/3 overflow-hidden bg-neutral-900 relative">
                  <img
                    src={d.sampleImage}
                    alt={d.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 left-2 bg-[#081C15]/80 text-[#FAF7F0] text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {d.cropIcon} {currentLang === 'hi' ? d.cropNameHi : d.cropNameEn}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-[#1B4332] text-[#D4A24E] text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                    Test Demo
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#1B4332] line-clamp-1">
                      {currentLang === 'hi' ? d.nameHi : d.nameEn}
                    </h4>
                    <p className="text-[11px] text-neutral-500 line-clamp-1">
                      {currentLang === 'hi' ? d.nameEn : d.nameHi}
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-amber-800 uppercase">{d.severity}</span>
                    <span className="text-[#1B4332] font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                      Scan →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Supported Major Crops Coverage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] tracking-tight">
            {currentLang === 'hi' ? 'समर्थित प्रमुख फसलें (Supported Indian Crops)' : 'Supported Agricultural Crops'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Standardized pathology and formulation data calibrated for Indian agro-climatic zones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CROPS_GRID.map((crop) => (
            <div
              key={crop.id}
              onClick={() => onNavigateToScan(crop.id)}
              className="bg-white border border-[#E5DFD3] rounded-lg p-4 hover:border-[#1B4332] transition-all cursor-pointer shadow-2xs hover:shadow-xs group flex items-start gap-3.5"
            >
              <div className="text-3xl p-2.5 rounded-md bg-[#FAF7F0] border border-[#E5DFD3] group-hover:scale-105 transition-transform">
                {crop.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1B4332]">
                    {currentLang === 'hi' ? `${crop.nameHi} (${crop.nameEn})` : `${crop.nameEn} (${crop.nameHi})`}
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#1B4332] group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  <strong>Common threats:</strong> {crop.typicalDiseases}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
