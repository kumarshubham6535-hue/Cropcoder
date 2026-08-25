import React, { useState, useEffect } from 'react';
import { ScanResult, Language, DosageInput } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  Volume2,
  VolumeX,
  Share2,
  FileText,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Droplets,
  Calculator,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Sprout,
  PhoneCall,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { PrescriptionModal } from './PrescriptionModal';

interface ResultsPageProps {
  scan: ScanResult;
  currentLang: Language;
  onReScan: () => void;
  onSaveNotes?: (scanId: string, notes: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  scan,
  currentLang,
  onReScan,
  onSaveNotes,
}) => {
  const t = TRANSLATIONS[currentLang];
  const disease = scan.disease;

  const [activeTab, setActiveTab] = useState<'chemical' | 'organic' | 'dosage' | 'prevention'>('chemical');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [expandedPreventionIdx, setExpandedPreventionIdx] = useState<number | null>(0);

  // Dosage Calculator state
  const [areaValue, setAreaValue] = useState<number>(1.0);
  const [areaUnit, setAreaUnit] = useState<'acre' | 'bigha' | 'hectare' | 'guntha'>('acre');
  const [tankCapacity, setTankCapacity] = useState<number>(15); // standard Indian 15L knapsack sprayer
  const [selectedChemicalIdx, setSelectedChemicalIdx] = useState<number>(0);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Audio Speech Synthesis
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const langCode = currentLang === 'en' ? 'en-IN' : 'hi-IN';
    const speechText = currentLang === 'en'
      ? `Crop diagnosis for ${disease.cropNameEn}: ${disease.nameEn}. Severity is ${disease.severity}. Confidence score is ${scan.confidence} percent. Recommended treatment: ${
          disease.treatments.chemical[0]?.tradeName || disease.treatments.organic[0]?.name || 'Routine field monitoring'
        }. Recommended dosage: ${disease.treatments.chemical[0]?.dosagePerLiter || '5 grams per liter'}.`
      : `फसल जांच रिपोर्ट: ${disease.cropNameHi} में ${disease.nameHi} पाया गया है। गंभीरता स्तर ${disease.severity === 'severe' ? 'गंभीर' : disease.severity === 'moderate' ? 'मध्यम' : 'हल्का'} है। सटीकता ${scan.confidence} प्रतिशत है। मुख्य अनुशंसित दवा: ${
          disease.treatments.chemical[0]?.tradeName || disease.treatments.organic[0]?.nameHindi || 'नियमित देखभाल'
        }, खुराक ${disease.treatments.chemical[0]?.dosagePerLiter || '5 ग्राम प्रति लीटर'}।`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = langCode;
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // WhatsApp Share Link
  const handleShareWhatsApp = () => {
    const shareText = `*KrishiScan Crop Diagnostic Report*\n🌿 Crop: ${disease.cropNameEn} (${disease.cropNameHi})\n🚨 Disease: ${disease.nameEn} (${disease.nameHi})\n📊 Confidence: ${scan.confidence}%\n⚠️ Severity: ${disease.severity.toUpperCase()}\n💊 Prescribed Remedy: ${disease.treatments.chemical[0]?.tradeName || disease.treatments.organic[0]?.name}\n💧 Dosage: ${disease.treatments.chemical[0]?.dosagePerLiter || 'As recommended'}\n\nGenerated via KrishiScan Advisory System.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  // Calculation Math for Knapsack Sprayer
  // 1 Acre = 200 Liters spray volume typically. 1 Hectare = 2.47 Acres. 1 Bigha = 0.4 Acres approx. 1 Guntha = 0.025 Acres.
  const normalizedAcres = 
    areaUnit === 'acre' ? areaValue :
    areaUnit === 'hectare' ? areaValue * 2.47 :
    areaUnit === 'bigha' ? areaValue * 0.4 :
    areaValue * 0.025; // guntha

  const totalWaterLiters = Math.round(normalizedAcres * 200);
  const totalTanks = Math.ceil(totalWaterLiters / tankCapacity);

  // parse dosage per liter (approx float)
  const currentChem = disease.treatments.chemical[selectedChemicalIdx];
  let chemRatePerL = 2.0;
  if (currentChem) {
    const match = currentChem.dosagePerLiter.match(/([\d.]+)/);
    if (match) chemRatePerL = parseFloat(match[1]);
  }
  const totalChemicalGrams = Math.round(totalWaterLiters * chemRatePerL);
  const perTankChemicalGrams = (chemRatePerL * tankCapacity).toFixed(1);

  // Severity Visuals
  const severityBadgeConfig = {
    mild: {
      bg: 'bg-amber-100/90 text-amber-900 border-amber-300',
      dot: 'bg-amber-500',
      label: t.severityMild,
      impact: 'Yield impact: < 10% if treated within 7 days',
    },
    moderate: {
      bg: 'bg-orange-100/90 text-orange-900 border-orange-300',
      dot: 'bg-orange-600',
      label: t.severityModerate,
      impact: 'Yield impact: 15% - 35% if untreated',
    },
    severe: {
      bg: 'bg-red-100/90 text-red-900 border-red-300',
      dot: 'bg-red-600',
      label: t.severitySevere,
      impact: 'Yield impact: 40% - 80% (Rapid leaf defoliation)',
    },
    healthy: {
      bg: 'bg-emerald-100/90 text-emerald-900 border-emerald-300',
      dot: 'bg-emerald-600',
      label: t.severityHealthy,
      impact: 'Optimal canopy health. No immediate yield loss.',
    },
  }[disease.severity];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Banner Alert Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#1B4332] text-white rounded-xl border border-[#D4A24E]/30 mb-5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4A24E] animate-ping" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
            {t.resultsTitle} • {currentLang === 'hi' ? `${scan.cropNameHi} (${scan.cropNameEn})` : `${scan.cropNameEn} (${scan.cropNameHi})`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-[#D4A24E] font-mono font-bold">KS-{scan.id.slice(-6).toUpperCase()}</span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="hidden sm:inline text-white/70 font-mono">{scan.timestamp}</span>
        </div>
      </div>

      {/* Main Diagnostic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Left Column: Leaf Image & Diagnostic Overview */}
        <div className="lg:col-span-1 space-y-4">
          {/* Leaf Image Card */}
          <div className="bg-white border border-[#D4A24E]/30 rounded-xl overflow-hidden shadow-xs">
            <div className="relative aspect-4/3 bg-neutral-900 overflow-hidden">
              <img
                src={scan.imageUrl || disease.sampleImage}
                alt={disease.nameEn}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = disease.sampleImage;
                }}
              />
              <div className="absolute top-2 left-2 bg-[#081C15]/80 text-[#FAF7F0] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                <span>{disease.cropIcon}</span>
                <span>{currentLang === 'hi' ? disease.cropNameHi : disease.cropNameEn}</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-[#1B4332] text-[#D4A24E] text-xs font-mono font-bold px-2 py-0.5 rounded border border-[#D4A24E]/40 shadow-xs">
                {scan.confidence}% Match
              </div>
            </div>

            <div className="p-3.5 space-y-3">
              {/* Severity Pill */}
              <div>
                <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-widest block mb-1">
                  {t.severityLabel}
                </span>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold ${severityBadgeConfig.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${severityBadgeConfig.dot}`} />
                  <span>{severityBadgeConfig.label}</span>
                </div>
                <p className="text-[10px] text-neutral-600 mt-1 font-medium leading-tight">
                  {severityBadgeConfig.impact}
                </p>
              </div>

              {/* Pathogen & Weather details */}
              <div className="pt-2.5 border-t border-[#D4A24E]/20 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500 text-[11px]">Pathogen Type:</span>
                  <span className="font-semibold text-neutral-800 text-[11px]">{disease.pathogenType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 text-[11px]">Peak Weather:</span>
                  <span className="font-semibold text-neutral-800 text-[11px]">{disease.favorableWeather.temp}, {disease.favorableWeather.humidity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 text-[11px]">Season:</span>
                  <span className="font-semibold text-neutral-800 text-[11px]">{disease.favorableWeather.season}</span>
                </div>
              </div>

              {/* Action Buttons: Audio + Prescription */}
              <div className="pt-2.5 border-t border-[#D4A24E]/20 space-y-2">
                <button
                  onClick={handleToggleAudio}
                  className={`w-full py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-[#1B4332] text-white hover:bg-[#2D6A4F]'
                  }`}
                >
                  {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4A24E]" />}
                  <span>{isPlayingAudio ? t.audioPlaying : t.audioListenBtn}</span>
                </button>

                <button
                  onClick={() => setShowPrescriptionModal(true)}
                  className="w-full py-1.5 px-3 rounded text-xs font-bold bg-[#D4A24E] hover:bg-[#C2903C] text-[#081C15] flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t.downloadPrescription}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Helpline Connect */}
          <div className="p-3 bg-[#FAF7F0] border border-[#D4A24E]/30 rounded-xl text-xs space-y-1.5">
            <div className="font-bold text-[#1B4332] flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#D4A24E]" />
              <span>{currentLang === 'hi' ? 'किसान कॉल सेंटर' : 'Kisan Call Center Helpline'}</span>
            </div>
            <p className="text-[10px] text-neutral-600">
              Need free agronomic consultation with ICAR scientists in your regional language?
            </p>
            <a
              href="tel:18001801551"
              className="inline-flex items-center justify-center gap-1.5 w-full py-1 bg-[#1B4332] text-white font-bold rounded text-xs hover:bg-[#2D6A4F] transition-colors"
            >
              <span>Dial 1800-180-1551 (Toll-Free)</span>
            </a>
          </div>
        </div>

        {/* Right Column: Disease Details & Tabbed Prescriptions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header Card with Vernacular & Scientific Name */}
          <div className="bg-white border border-[#D4A24E]/30 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B4332] tracking-tight">
                  {currentLang === 'hi' ? disease.nameHi : disease.nameEn}
                </h1>
                <div className="text-sm sm:text-base font-semibold text-neutral-700">
                  {currentLang === 'hi' ? disease.nameEn : disease.nameHi}
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-[#FAF7F0] border border-[#D4A24E]/30 rounded text-neutral-600 font-bold">
                ICAR: {disease.id.toUpperCase()}
              </span>
            </div>

            <p className="text-xs italic text-neutral-500 font-serif mb-3">
              Scientific Name: <span className="font-semibold text-neutral-700">{disease.scientificName}</span>
            </p>

            {/* Diagnostic Symptoms List */}
            <div className="bg-[#FAF7F0] rounded-lg p-3 border border-[#D4A24E]/20">
              <h3 className="text-[10px] font-bold text-[#1B4332] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentLang === 'hi' ? 'पहचाने गए मुख्य लक्षण (Key Lesion Indicators):' : 'Key Diagnostic Symptoms & Lesion Indicators:'}</span>
              </h3>
              <ul className="space-y-1 text-xs text-neutral-700">
                {disease.symptoms[currentLang === 'en' ? 'en' : 'hi'].map((sym, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                    <span className="text-[#D4A24E] font-bold mt-0.5">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tab Navigation (High Density Style) */}
          <div className="bg-[#FAF7F0] border border-[#D4A24E]/30 rounded-lg p-1 flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('chemical')}
              className={`flex-1 py-1.5 px-2.5 rounded text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'chemical'
                  ? 'bg-[#1B4332] text-white shadow-2xs'
                  : 'text-neutral-700 hover:bg-[#D4A24E]/15'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#D4A24E]" />
              <span>{t.tabChemical}</span>
            </button>

            <button
              onClick={() => setActiveTab('organic')}
              className={`flex-1 py-1.5 px-2.5 rounded text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'organic'
                  ? 'bg-[#1B4332] text-white shadow-2xs'
                  : 'text-neutral-700 hover:bg-[#D4A24E]/15'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.tabOrganic}</span>
            </button>

            <button
              onClick={() => setActiveTab('dosage')}
              className={`flex-1 py-1.5 px-2.5 rounded text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'dosage'
                  ? 'bg-[#1B4332] text-white shadow-2xs'
                  : 'text-neutral-700 hover:bg-[#D4A24E]/15'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-[#D4A24E]" />
              <span>{t.tabDosageCalc}</span>
            </button>

            <button
              onClick={() => setActiveTab('prevention')}
              className={`flex-1 py-1.5 px-2.5 rounded text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'prevention'
                  ? 'bg-[#1B4332] text-white shadow-2xs'
                  : 'text-neutral-700 hover:bg-[#D4A24E]/15'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.tabPrevention}</span>
            </button>
          </div>

          {/* TAB 1: CHEMICAL TREATMENTS */}
          {activeTab === 'chemical' && (
            <div className="space-y-3">
              {disease.treatments.chemical.length === 0 ? (
                <div className="p-5 bg-white border border-[#D4A24E]/30 rounded-xl text-center text-xs text-neutral-600">
                  No chemical application required for this condition. Maintain routine organic spray.
                </div>
              ) : (
                disease.treatments.chemical.map((chem, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#D4A24E]/30 rounded-xl p-4 space-y-2.5 hover:border-[#1B4332] transition-all shadow-xs"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-neutral-100 pb-2.5">
                      <div>
                        <div className="text-sm sm:text-base font-bold text-[#1B4332] flex items-center gap-2">
                          <span>{chem.tradeName}</span>
                          {chem.cibrcApproved && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-300">
                              CIBRC Approved
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          Generic: {chem.genericName}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-500 block">
                          {currentLang === 'hi' ? 'प्रतीक्षा अवधि (PHI):' : 'Pre-Harvest Waiting (PHI):'}
                        </span>
                        <span className="text-xs font-bold text-amber-800 font-mono">{chem.waitingPeriodDays} Days</span>
                      </div>
                    </div>

                    {/* Dosage Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 bg-[#FAF7F0] rounded-lg text-xs">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">
                          {currentLang === 'hi' ? 'प्रति लीटर खुराक:' : 'Dosage per Liter:'}
                        </span>
                        <span className="font-bold text-[#1B4332] font-mono text-xs">{chem.dosagePerLiter}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px]">
                          {currentLang === 'hi' ? 'प्रति एकड़ मात्रा:' : 'Dosage per Acre:'}
                        </span>
                        <span className="font-bold text-neutral-800 font-mono text-xs">{chem.dosagePerAcre}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px]">
                          {currentLang === 'hi' ? 'स्प्रे अंतराल:' : 'Spray Interval:'}
                        </span>
                        <span className="font-semibold text-neutral-800 text-xs">{chem.sprayIntervalDays}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-neutral-700 block mb-0.5">
                        {currentLang === 'hi' ? 'छिड़काव विधि (Application Method):' : 'Application Method & Timing:'}
                      </span>
                      <p className="text-[11px] text-neutral-600 leading-snug">
                        {chem.applicationMethod}
                      </p>
                    </div>

                    {chem.precautions.length > 0 && (
                      <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-900 space-y-0.5">
                        <div className="font-bold flex items-center gap-1 text-[10px]">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          <span>{currentLang === 'hi' ? 'सावधानी एवं निर्देश (Safety Precaution):' : 'Safety Precaution & Handling Instructions:'}</span>
                        </div>
                        <ul className="list-disc pl-4 text-[10px] space-y-0.5">
                          {chem.precautions.map((p, pIdx) => (
                            <li key={pIdx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: ORGANIC & BIO-REMEDIES */}
          {activeTab === 'organic' && (
            <div className="space-y-3">
              {disease.treatments.organic.map((org, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#D4A24E]/30 rounded-xl p-4 space-y-2.5 shadow-xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-emerald-100 pb-2.5">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-emerald-900">
                        {currentLang === 'hi' ? org.nameHindi : org.name}
                      </h4>
                      <div className="text-xs text-neutral-600">
                        {currentLang === 'hi' ? org.name : org.nameHindi}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      {org.costEfficiency}
                    </span>
                  </div>

                  <div className="p-2.5 bg-emerald-50/50 rounded text-xs space-y-1 border border-emerald-100">
                    <div>
                      <span className="font-semibold text-emerald-950 text-[11px]">
                        {currentLang === 'hi' ? 'घटक व अनुपातिक मात्रा: ' : 'Active Bio-Components & Ratio: '}
                      </span>
                      <span className="text-emerald-900 font-mono font-medium text-[11px]">{org.dosagePerLiter}</span>
                    </div>
                    <div className="text-neutral-700 text-[10px]">
                      {org.ingredients}
                    </div>
                  </div>

                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-neutral-800 block text-[11px]">
                      {currentLang === 'hi' ? 'बनाने एवं प्रयोग की विधि (Preparation Protocol):' : 'Preparation & Application Protocol:'}
                    </span>
                    <p className="text-neutral-700 leading-snug text-[10px]">
                      {org.preparationMethod}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1.5 border-t border-neutral-100">
                    <div>
                      <span className="text-neutral-500 text-[10px] block">
                        {currentLang === 'hi' ? 'छिड़काव का सही समय:' : 'Optimal Spray Window:'}
                      </span>
                      <span className="font-semibold text-neutral-800 text-[11px]">{org.bestTime}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">
                        {currentLang === 'hi' ? 'समय सारणी (Schedule):' : 'Application Schedule:'}
                      </span>
                      <span className="font-semibold text-neutral-800 text-[11px]">{org.applicationSchedule}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SPRAYER TANK DOSAGE CALCULATOR */}
          {activeTab === 'dosage' && (
            <div className="bg-white border border-[#D4A24E]/30 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1B4332] mb-0.5">
                  {t.dosageCalculatorTitle}
                </h3>
                <p className="text-[11px] text-neutral-600">
                  Calculate exact formulation weight, water volume, and 15L/16L knapsack sprayer tanks for your land.
                </p>
              </div>

              {/* Calculator Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#FAF7F0] rounded-lg border border-[#D4A24E]/20">
                {/* Area Input */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    {t.farmArea}
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={areaValue}
                    onChange={(e) => setAreaValue(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full bg-white border border-[#D4A24E]/40 rounded px-2.5 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                  />
                </div>

                {/* Area Unit */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    {t.selectUnit}
                  </label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="w-full bg-white border border-[#D4A24E]/40 rounded px-2.5 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                  >
                    <option value="acre">Acre (एकड़)</option>
                    <option value="bigha">Bigha (बीघा - 0.4 Acre)</option>
                    <option value="hectare">Hectare (हेक्टेयर)</option>
                    <option value="guntha">Guntha (गुंठा)</option>
                  </select>
                </div>

                {/* Sprayer Pump Tank Size */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    {t.sprayerCapacity}
                  </label>
                  <select
                    value={tankCapacity}
                    onChange={(e) => setTankCapacity(parseInt(e.target.value))}
                    className="w-full bg-white border border-[#D4A24E]/40 rounded px-2.5 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                  >
                    <option value={15}>15 Liters (Knapsack Pump)</option>
                    <option value={16}>16 Liters (Battery Sprayer)</option>
                    <option value={20}>20 Liters (Heavy Duty)</option>
                    <option value={200}>200 Liters (Tractor Tank)</option>
                  </select>
                </div>
              </div>

              {/* Chemical Selector */}
              {disease.treatments.chemical.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Select Formulation for Calculation:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {disease.treatments.chemical.map((c, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => setSelectedChemicalIdx(cIdx)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                          selectedChemicalIdx === cIdx
                            ? 'bg-[#1B4332] text-white border-[#1B4332] font-bold'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        {c.tradeName.split('(')[0]} ({c.dosagePerLiter})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Calculated Outputs Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                  <div className="text-[10px] text-emerald-800 font-bold uppercase mb-0.5">
                    {t.dosageResultWater}
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-mono">
                    {totalWaterLiters} <span className="text-xs font-normal">Liters</span>
                  </div>
                  <div className="text-[9px] text-emerald-700 mt-0.5">
                    For {areaValue} {areaUnit}
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                  <div className="text-[10px] text-amber-800 font-bold uppercase mb-0.5">
                    {t.dosageResultChemical}
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-amber-950 font-mono">
                    {totalChemicalGrams} <span className="text-xs font-normal">g / ml</span>
                  </div>
                  <div className="text-[9px] text-amber-700 mt-0.5">
                    ({perTankChemicalGrams} g/ml per {tankCapacity}L tank)
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                  <div className="text-[10px] text-blue-800 font-bold uppercase mb-0.5">
                    {t.dosageResultTanks}
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-blue-950 font-mono">
                    {totalTanks} <span className="text-xs font-normal">Pumps</span>
                  </div>
                  <div className="text-[9px] text-blue-700 mt-0.5">
                    of {tankCapacity}L capacity
                  </div>
                </div>
              </div>

              {/* Knapsack Sprayer Mixing Instructions */}
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-[11px] text-neutral-700 space-y-1">
                <span className="font-bold text-neutral-900 block">
                  {currentLang === 'hi' ? 'टंकी में घोल बनाने का सही तरीका (Mixing Guide):' : 'Knapsack Sprayer Tank Mixing Guide:'}
                </span>
                <p className="text-[10px] leading-relaxed">
                  {currentLang === 'hi' ? (
                    <>
                      1. पहले आधी बाल्टी पानी में <strong>{perTankChemicalGrams} ग्राम/मिली</strong> दवा को अच्छी तरह घोल लें (Mother Solution)।<br />
                      2. स्प्रेयर टंकी में आधा साफ पानी भरें, फिर तैयार घोल डालें और ऊपर तक पानी भरकर ढक्कन कसें।<br />
                      3. नोजल को फसल की पत्तियों से 30 सेमी ऊपर रखकर एक समान गति से आगे बढ़ें।
                    </>
                  ) : (
                    <>
                      1. Pre-dissolve <strong>{perTankChemicalGrams} g/ml</strong> of chemical in half a bucket of clean water to make a concentrated mother solution.<br />
                      2. Fill the knapsack tank halfway with water, pour the solution through the top mesh strainer, top up with water, and seal tightly.<br />
                      3. Maintain spray nozzle 30 cm above leaf canopy with uniform walking pace.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PREVENTION ACCORDION */}
          {activeTab === 'prevention' && (
            <div className="bg-white border border-[#D4A24E]/30 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1B4332] mb-0.5">
                  {currentLang === 'hi' ? 'दीर्घकालिक रोकथाम एवं फसल सुरक्षा नियम' : 'Long-term Prevention & Crop Protection Guidelines'}
                </h3>
                <p className="text-[11px] text-neutral-600">
                  Cultural practices to prevent recurring fungal and bacterial pathogen spore buildup in field soil.
                </p>
              </div>

              <div className="space-y-2">
                {disease.preventionTips[currentLang === 'en' ? 'en' : 'hi'].map((tip, idx) => (
                  <div
                    key={idx}
                    className="border border-[#D4A24E]/20 rounded-lg overflow-hidden bg-[#FAF7F0]"
                  >
                    <button
                      onClick={() => setExpandedPreventionIdx(expandedPreventionIdx === idx ? null : idx)}
                      className="w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs font-bold text-neutral-800 hover:bg-[#FAF7F0]/80 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-[#1B4332] text-white text-[10px] flex items-center justify-center font-mono font-bold">
                          {idx + 1}
                        </span>
                        <span>{tip}</span>
                      </span>
                      {expandedPreventionIdx === idx ? (
                        <ChevronUp className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      )}
                    </button>

                    {expandedPreventionIdx === idx && (
                      <div className="px-3.5 py-2.5 bg-white border-t border-[#D4A24E]/20 text-[11px] text-neutral-700 leading-relaxed">
                        <p>
                          <strong>Agronomic Field Protocol:</strong> Consistently implementing this practice reduces pathogen inoculum threshold by up to 65% across subsequent cropping cycles. Recommended by ICAR All India Coordinated Research Projects (AICRP).
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D4A24E]/20">
            <button
              onClick={onReScan}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-[#1B4332] text-[#1B4332] text-xs font-bold hover:bg-[#1B4332] hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.reScanBtn}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#25D366] text-white text-xs font-bold hover:bg-[#20bd5a] transition-colors shadow-2xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.shareWhatsApp}</span>
              </button>

              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#D4A24E] hover:bg-[#C2903C] text-[#081C15] text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{currentLang === 'hi' ? 'किसान पर्ची (Prescription Slip)' : 'Prescription Slip (PDF)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Slip Modal */}
      {showPrescriptionModal && (
        <PrescriptionModal
          scan={scan}
          currentLang={currentLang}
          onClose={() => setShowPrescriptionModal(false)}
        />
      )}
    </div>
  );
};
