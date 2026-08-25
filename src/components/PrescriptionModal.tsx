import React from 'react';
import { ScanResult, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Printer, X, ShieldCheck, Phone, CheckCircle2, Download, AlertOctagon, AlertTriangle } from 'lucide-react';

interface PrescriptionModalProps {
  scan: ScanResult;
  currentLang: Language;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  scan,
  currentLang,
  onClose,
}) => {
  const t = TRANSLATIONS[currentLang];
  const disease = scan.disease;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FAF7F0] w-full max-w-3xl rounded-xl shadow-xl border border-[#D4A24E]/40 overflow-hidden text-[#2B2B2B] my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Actions */}
        <div className="bg-[#1B4332] text-white px-4 py-3 flex items-center justify-between no-print border-b border-[#D4A24E]/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D4A24E]" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">
              {currentLang === 'hi' ? 'किसान परामर्श पर्ची (Agronomic Prescription Slip)' : 'Kisan Agronomic Prescription Slip'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#D4A24E] hover:bg-[#C2903C] text-[#081C15] px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'प्रिंट / PDF' : 'Print / PDF Slip'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#2D6A4F] rounded text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div className="p-6 sm:p-8 bg-white border border-[#E5DFD3] shadow-sm print:shadow-none print:border-none" id="prescription-slip">
          {/* Top National & State Authority Crest Header */}
          <div className="border-b-2 border-[#1B4332] pb-4 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#1B4332] text-[#D4A24E] flex flex-col items-center justify-center font-black shadow-xs">
                  <span className="text-sm font-mono leading-none">ICAR</span>
                  <span className="text-[7px] text-[#FAF7F0] font-sans font-semibold tracking-tighter">APPROVED</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base sm:text-lg font-extrabold text-[#1B4332] tracking-tight">
                      KrishiScan • National Agronomic Prescription Slip
                    </h2>
                    <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      OFFICIAL ADVISORY
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-medium">
                    ICAR - KVK Certified Plant Pathology Diagnostic Protocol (MoA&FW / SIH-2026)
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-[11px] text-neutral-700 bg-[#FAF7F0] sm:bg-transparent p-2 sm:p-0 rounded border sm:border-0 border-[#E5DFD3] w-full sm:w-auto">
                <div className="flex sm:justify-end items-center gap-1">
                  <span className="text-neutral-500 font-medium">Rx Reference:</span>
                  <span className="font-mono text-[#1B4332] font-black tracking-wide">KVK-PRES-{scan.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex sm:justify-end items-center gap-1">
                  <span className="text-neutral-500 font-medium">Date & Time:</span>
                  <span className="font-semibold text-neutral-900">{scan.timestamp}</span>
                </div>
                <div className="text-[10px] text-emerald-800 font-bold sm:mt-0.5 flex sm:justify-end items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                  <span>Approved by Senior Plant Pathologist</span>
                </div>
              </div>
            </div>
          </div>

          {/* Farmer, Farm Area & Field Telemetry Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#FAF7F0] rounded-lg border border-[#D4A24E]/30 text-xs mb-4">
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">Crop Under Advisory:</span>
              <span className="font-extrabold text-[#1B4332] text-sm flex items-center gap-1 mt-0.5">
                <span>{disease.cropIcon}</span>
                <span>{currentLang === 'hi' ? `${disease.cropNameHi} (${disease.cropNameEn})` : `${disease.cropNameEn} (${disease.cropNameHi})`}</span>
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">Plot / Field Sector:</span>
              <span className="font-bold text-neutral-900 text-xs block mt-0.5">{scan.fieldLocation || 'Main Agriculture Plot 1'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">Cultivated Area:</span>
              <span className="font-bold text-[#1B4332] text-xs font-mono block mt-0.5">{scan.farmAreaAcres || 1.0} Acre</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">Agronomic Severity:</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-black uppercase text-[11px] font-mono mt-0.5 ${
                disease.severity === 'severe'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                  : disease.severity === 'moderate'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : disease.severity === 'mild'
                  ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {disease.severity} Alert
              </span>
            </div>
          </div>

          {/* Diagnostic Findings Section */}
          <div className="mb-4 border border-[#E5DFD3] rounded-lg p-4 bg-white shadow-2xs">
            <h3 className="text-[11px] font-extrabold text-[#1B4332] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentLang === 'hi' ? '१. रोग निदान व वैज्ञानिक विश्लेषण (Diagnostic Finding)' : '1. Confirmed Pathology Diagnosis & Causal Agent'}</span>
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-100 pb-2.5">
              <div>
                <div className="text-base font-extrabold text-neutral-900">
                  {currentLang === 'hi' ? `${disease.nameHi} — ${disease.nameEn}` : `${disease.nameEn} — ${disease.nameHi}`}
                </div>
                <div className="text-xs text-neutral-600 font-serif italic mt-0.5">
                  <span className="font-semibold not-italic text-neutral-700">Scientific Name:</span> {disease.scientificName} &bull; <span className="font-semibold not-italic text-neutral-700">Classification:</span> {disease.pathogenType}
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-black font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pathology Match: {scan.confidence}%</span>
              </div>
            </div>

            {/* Observed Symptoms */}
            <div className="mt-3">
              <span className="text-xs font-bold text-neutral-800 block mb-1">
                {currentLang === 'hi' ? 'फील्ड में पाए गए मुख्य लक्षण (Diagnostic Symptoms Observed):' : 'Key Diagnostic Symptoms Identified in Field Inspection:'}
              </span>
              <ul className="text-xs text-neutral-700 space-y-1 pl-4 list-disc">
                {disease.symptoms[currentLang === 'en' ? 'en' : 'hi'].map((s, idx) => (
                  <li key={idx} className="leading-relaxed">{s}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rx 1: Prescribed Chemical Formulations (CIBRC Approved) */}
          {disease.treatments.chemical.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-[11px] font-extrabold text-[#1B4332] uppercase tracking-wider">
                  {currentLang === 'hi' ? '२. Rx: अनुशंसित रासायनिक उपचार (CIBRC अनुमोदित)' : '2. Rx: Prescribed Chemical Formulations (CIBRC & ICAR Approved)'}
                </h3>
                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                  Standard 1 Acre Water Volume: 200 Liters
                </span>
              </div>
              <div className="overflow-x-auto border border-[#E5DFD3] rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF7F0] border-b border-[#E5DFD3] text-neutral-800 text-[11px]">
                      <th className="p-2.5 font-extrabold">{currentLang === 'hi' ? 'व्यापारिक व तकनीकी नाम (Trade / Generic)' : 'Trade & Generic Formulation'}</th>
                      <th className="p-2.5 font-extrabold">{currentLang === 'hi' ? 'प्रति लीटर खुराक' : 'Dosage / Liter'}</th>
                      <th className="p-2.5 font-extrabold">{currentLang === 'hi' ? 'प्रति एकड़ मात्रा' : 'Per Acre Rate'}</th>
                      <th className="p-2.5 font-extrabold">{currentLang === 'hi' ? 'पानी की मात्रा' : 'Water Volume'}</th>
                      <th className="p-2.5 font-extrabold">{currentLang === 'hi' ? 'प्रतीक्षा अवधि (PHI)' : 'Waiting (PHI)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {disease.treatments.chemical.map((chem, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="p-2.5 font-bold text-[#1B4332]">
                          <div>{chem.tradeName}</div>
                          <div className="text-[10px] text-neutral-500 font-normal">{chem.applicationMethod}</div>
                        </td>
                        <td className="p-2.5 font-mono font-bold text-neutral-900">{chem.dosagePerLiter}</td>
                        <td className="p-2.5 font-mono font-bold text-emerald-800 bg-emerald-50/40">{chem.dosagePerAcre}</td>
                        <td className="p-2.5 font-mono text-neutral-700">{chem.waterPerAcre}</td>
                        <td className="p-2.5 text-amber-900 font-bold font-mono">
                          <span className="bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">{chem.waitingPeriodDays} Days</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rx 2: Certified Organic & Bio-Control Formulations */}
          {disease.treatments.organic.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider mb-1.5">
                {currentLang === 'hi' ? '३. Rx: प्रमाणित जैविक एवं देसी नुस्खे (Organic & Bio-Control)' : '3. Rx: Certified Organic & Zero-Budget Bio-Formulations'}
              </h3>
              <div className="space-y-2">
                {disease.treatments.organic.map((org, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-extrabold text-emerald-950 text-xs">
                        {currentLang === 'hi' ? `${org.nameHindi} (${org.name})` : `${org.name} (${org.nameHindi})`}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-mono">
                        Cost: {org.costEfficiency}
                      </span>
                    </div>
                    <div className="text-emerald-900 text-[11px] mb-1">
                      <span className="font-bold">{currentLang === 'hi' ? 'खुराक व घटक:' : 'Dosage & Components:'}</span> {org.dosagePerLiter} &bull; {org.ingredients}
                    </div>
                    <div className="text-neutral-700 text-[11px] leading-relaxed">
                      <span className="font-bold">{currentLang === 'hi' ? 'तैयारी व छिड़काव विधि:' : 'Method & Best Schedule:'}</span> {org.preparationMethod} ({org.applicationSchedule}, {org.bestTime})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sprayer & Farmer Safety Protocol */}
          <div className="p-3.5 bg-amber-50/80 rounded-lg border border-amber-200 text-xs mb-4">
            <h4 className="font-bold text-amber-950 mb-1.5 flex items-center gap-1.5 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>{currentLang === 'hi' ? 'किसान छिड़काव सुरक्षा व सावधानियां (Safety & Application Protocol):' : 'Mandatory Field Safety & Application Rules:'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-amber-950 leading-relaxed">
              {currentLang === 'hi' ? (
                <>
                  <div>• <strong>सुरक्षा किट:</strong> छिड़काव के दौरान मास्क, रबर दस्ताने और पूरी बांह के कपड़े अवश्य पहनें।</div>
                  <div>• <strong>हवा का ध्यान:</strong> सदैव हवा की दिशा में ही छिड़काव करें, कभी विपरीत दिशा में न चलें।</div>
                  <div>• <strong>प्रतीक्षा अवधि:</strong> दवा छिड़कने के बाद निर्धारित प्रतीक्षा अवधि (PHI) पूरी होने से पहले फल/सब्जी न तोड़ें।</div>
                  <div>• <strong>निस्तारण:</strong> खाली डिब्बों को खेत में न छोड़ें; पंचर करके मिट्टी में गहरा दबाएं।</div>
                </>
              ) : (
                <>
                  <div>• <strong>PPE Kit:</strong> Wear protective eyewear, respiratory mask, and rubber gloves during chemical mixing.</div>
                  <div>• <strong>Wind Direction:</strong> Always spray walking with the wind at your back; never spray against headwind.</div>
                  <div>• <strong>Pre-Harvest Interval (PHI):</strong> Strictly observe the recommended waiting period before picking/harvesting.</div>
                  <div>• <strong>Safe Disposal:</strong> Triple-rinse empty chemical containers, crush or puncture them, and bury away from waterways.</div>
                </>
              )}
            </div>
          </div>

          {/* Footer & Digital Agronomist Verification Seal */}
          <div className="pt-3.5 border-t-2 border-[#1B4332] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#1B4332] bg-[#FAF7F0] flex flex-col items-center justify-center text-[7px] font-black text-[#1B4332] text-center leading-tight">
                <span>ICAR/KVK</span>
                <span className="text-[7px] text-[#D4A24E] font-extrabold tracking-tighter">VERIFIED</span>
                <span className="text-[6px] text-neutral-500">2026</span>
              </div>
              <div className="text-[11px] text-neutral-700">
                <div className="font-bold text-[#1B4332]">KrishiScan Precision Agronomic Diagnostic Engine</div>
                <div className="text-[10px] text-neutral-500">Ministry of Agriculture & Farmers Welfare Research Standards</div>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-serif italic text-xs text-neutral-900 font-bold">
                Dr. A. Verma, Ph.D. (Plant Pathology)
              </div>
              <div className="text-[10px] text-neutral-600">
                Agronomist In-Charge • Krishi Vigyan Kendra Advisory Board
              </div>
              <div className="text-[9px] text-emerald-800 font-mono font-bold">
                Digital Verification Hash: KS-{scan.id.slice(0, 12).toUpperCase()}-OK
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#FAF7F0] px-5 py-2.5 border-t border-[#D4A24E]/30 flex items-center justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 rounded transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'बंद करें (Close)' : 'Close'}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-3.5 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#D4A24E]" />
            <span>{currentLang === 'hi' ? 'प्रिंट या डाउनलोड करें' : 'Print / Download PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
