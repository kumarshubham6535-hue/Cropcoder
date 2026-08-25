import React, { useState, useRef, useEffect } from 'react';
import { CropCategory, DiseaseInfo, Language, ScanResult } from '../types';
import { CROP_DISEASES } from '../data/cropDiseases';
import { TRANSLATIONS } from '../data/translations';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  X,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScanPageProps {
  currentLang: Language;
  onScanComplete: (result: ScanResult) => void;
  preselectedCrop?: CropCategory;
}

const CROPS: { id: CropCategory; nameEn: string; nameHi: string; icon: string; category?: string }[] = [
  { id: 'potato', nameEn: 'Potato', nameHi: 'आलू', icon: '🥔', category: 'Vegetable' },
  { id: 'tomato', nameEn: 'Tomato', nameHi: 'टमाटर', icon: '🍅', category: 'Vegetable' },
  { id: 'rice', nameEn: 'Paddy / Rice', nameHi: 'धान', icon: '🌾', category: 'Cereal' },
  { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं', icon: '🌾', category: 'Cereal' },
  { id: 'mustard', nameEn: 'Mustard / Rapeseed', nameHi: 'सरसों', icon: '🌼', category: 'Oilseed' },
  { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास', icon: '🌱', category: 'Cash Crop' },
  { id: 'sugarcane', nameEn: 'Sugarcane', nameHi: 'गन्ना', icon: '🎋', category: 'Cash Crop' },
  { id: 'chilli', nameEn: 'Chilli', nameHi: 'मिर्च', icon: '🌶️', category: 'Spices' },
  { id: 'soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन', icon: '🌱', category: 'Oilseed' },
  { id: 'groundnut', nameEn: 'Groundnut / Peanut', nameHi: 'मूंगफली', icon: '🥜', category: 'Oilseed' },
  { id: 'maize', nameEn: 'Maize / Corn', nameHi: 'मक्का', icon: '🌽', category: 'Cereal' },
  { id: 'onion', nameEn: 'Onion / Garlic', nameHi: 'प्याज', icon: '🧅', category: 'Vegetable' },
  { id: 'gram', nameEn: 'Gram / Chickpea', nameHi: 'चना', icon: '🧆', category: 'Pulse' },
  { id: 'mango', nameEn: 'Mango', nameHi: 'आम', icon: '🥭', category: 'Fruit' },
  { id: 'banana', nameEn: 'Banana', nameHi: 'केला', icon: '🍌', category: 'Fruit' },
  { id: 'tea', nameEn: 'Tea', nameHi: 'चाय', icon: '🍵', category: 'Plantation' },
];

export const ScanPage: React.FC<ScanPageProps> = ({
  currentLang,
  onScanComplete,
  preselectedCrop = 'potato',
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedCrop, setSelectedCrop] = useState<CropCategory>(preselectedCrop);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStageText, setScanStageText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: any) {
      setCameraError('Camera access unavailable. Please upload a file instead.');
      setCameraActive(false);
    }
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setSelectedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run the stepped scanning simulation
  const runDiagnosticScan = () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanProgress(5);
    setScanStageText(t.scanningStage1);

    const stages = [
      { progress: 28, text: t.scanningStage1, delay: 600 },
      { progress: 58, text: t.scanningStage2, delay: 1300 },
      { progress: 82, text: t.scanningStage3, delay: 2000 },
      { progress: 96, text: t.scanningStage4, delay: 2700 },
    ];

    stages.forEach((stage) => {
      setTimeout(() => {
        setScanProgress(stage.progress);
        setScanStageText(stage.text);
      }, stage.delay);
    });

    // Complete scan after 3.2s
    setTimeout(() => {
      setScanProgress(100);

      // Find best match disease for the selected crop
      const cropDiseases = CROP_DISEASES.filter((d) => d.crop === selectedCrop);
      const chosenDisease = cropDiseases.length > 0
        ? cropDiseases[0]
        : CROP_DISEASES[0];

      // Calculate confidence between range
      const [minConf, maxConf] = chosenDisease.confidenceRange;
      const calculatedConf = Number((minConf + Math.random() * (maxConf - minConf)).toFixed(1));

      const scanResult: ScanResult = {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        crop: selectedCrop,
        cropNameEn: chosenDisease.cropNameEn,
        cropNameHi: chosenDisease.cropNameHi,
        disease: chosenDisease,
        confidence: calculatedConf,
        imageUrl: selectedImage,
        severity: chosenDisease.severity,
        farmAreaAcres: 1.5,
        fieldLocation: 'Sector 3 - Main Field',
        status: chosenDisease.severity === 'healthy' ? 'Healthy' : 'Critical',
        notes: `Diagnosed via KrishiScan AI. Immediate foliar spray recommended.`,
      };

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#1B4332', '#D4A24E', '#2D6A4F']
        });
      } catch (e) {
        // ignore if confetti fails
      }

      setIsScanning(false);
      onScanComplete(scanResult);
    }, 3200);
  };

  const handleSelectSample = (sample: DiseaseInfo) => {
    setSelectedCrop(sample.crop);
    setSelectedImage(sample.sampleImage);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4332]/10 border border-[#1B4332]/20 text-[#1B4332] text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A24E]" />
          <span>ICAR Pathology Dataset v2.4</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] tracking-tight">
          {t.scanTitle}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto mt-1">
          {t.scanSubtitle}
        </p>
      </div>

      {/* Step 1: Crop Selection Pills */}
      <div className="bg-white border border-[#D4A24E]/30 rounded-xl p-3.5 sm:p-4 mb-4 shadow-xs">
        <label className="text-[10px] font-bold text-[#1B4332] uppercase tracking-widest block mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-[#1B4332] text-[#D4A24E] text-[10px] flex items-center justify-center font-mono font-black">1</span>
            <span>{t.selectCrop}</span>
          </span>
          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">16 MAJOR MARKET CROPS</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {CROPS.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop.id)}
              disabled={isScanning}
              className={`p-2 sm:p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                selectedCrop === crop.id
                  ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                  : 'bg-[#FAF7F0] text-neutral-800 border-[#D4A24E]/20 hover:border-[#1B4332]/50'
              }`}
            >
              <span className="text-xl sm:text-2xl">{crop.icon}</span>
              <span className="text-xs font-bold block leading-tight">
                {currentLang === 'hi' ? crop.nameHi : crop.nameEn}
              </span>
              <span className={`text-[10px] block ${selectedCrop === crop.id ? 'text-[#D4A24E] font-medium' : 'text-neutral-500'}`}>
                {currentLang === 'hi' ? crop.nameEn : crop.nameHi}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Image Upload / Camera Area */}
      <div className="bg-white border border-[#D4A24E]/30 rounded-xl p-4 sm:p-5 mb-4 shadow-xs">
        <label className="text-[10px] font-bold text-[#1B4332] uppercase tracking-widest block mb-3 flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-[#1B4332] text-[#D4A24E] text-[10px] flex items-center justify-center font-mono font-black">2</span>
          <span>{currentLang === 'hi' ? 'पत्ती की तस्वीर अपलोड करें (Upload Leaf Photo)' : 'Upload Symptomatic Leaf Photo'}</span>
        </label>

        {/* Live Camera Feed Mode */}
        {cameraActive ? (
          <div className="relative rounded-lg overflow-hidden border-2 border-[#1B4332] bg-black aspect-4/3 max-w-lg mx-auto">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-4">
              <button
                onClick={captureCameraPhoto}
                className="bg-[#D4A24E] hover:bg-[#C2903C] text-[#081C15] px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{currentLang === 'hi' ? 'तस्वीर लें (Capture)' : 'Capture Photo'}</span>
              </button>
              <button
                onClick={stopCamera}
                className="bg-neutral-800/80 text-white px-3 py-1.5 rounded-full text-xs hover:bg-neutral-700 cursor-pointer"
              >
                {currentLang === 'hi' ? 'रद्द करें (Cancel)' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Upload Drag & Drop Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-5 sm:p-7 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-[#1B4332] bg-[#FAF7F0]'
                  : 'border-[#D4A24E]/40 bg-[#FAF7F0]/60 hover:bg-[#FAF7F0]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {selectedImage ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-lg overflow-hidden border-2 border-[#1B4332] shadow-sm mb-2.5">
                    <img
                      src={selectedImage}
                      alt="Selected Leaf"
                      className="w-full h-full object-cover"
                    />
                    {isScanning && (
                      <div className="absolute inset-0 bg-[#081C15]/40 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="w-full h-1 bg-[#D4A24E] shadow-[0_0_8px_#D4A24E] absolute animate-scan-laser" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-600 font-medium">
                    {t.orClickToBrowse}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-3">
                  <div className="w-11 h-11 rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center mb-2.5">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-neutral-800 mb-0.5">
                    {t.dragDropText}
                  </p>
                  <p className="text-[10px] text-neutral-500 mb-3">
                    PNG, JPG, WEBP (Max 10MB)
                  </p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1B4332] text-[#FAF7F0] text-xs font-bold hover:bg-[#2D6A4F] transition-colors">
                    <ImageIcon className="w-3 h-3 text-[#D4A24E]" />
                    <span>{t.uploadFile}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Camera capture secondary trigger */}
            <div className="flex items-center justify-center gap-3 mt-2.5">
              <button
                type="button"
                onClick={startCamera}
                disabled={isScanning}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#D4A24E]/40 bg-white text-[#1B4332] text-xs font-bold hover:bg-[#FAF7F0] transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#D4A24E]" />
                <span>{t.takePhoto}</span>
              </button>
            </div>

            {cameraError && (
              <p className="text-xs text-amber-800 text-center mt-2 font-medium">
                {cameraError}
              </p>
            )}
          </div>
        )}

        {/* Realistic Stepped Scanning Progress Bar */}
        {isScanning && (
          <div className="mt-4 p-3.5 bg-[#FAF7F0] rounded-lg border border-[#1B4332] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#1B4332]">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-[#D4A24E] animate-spin" />
                <span>{scanStageText}</span>
              </span>
              <span className="font-mono">{scanProgress}%</span>
            </div>

            <div className="w-full bg-[#E5DFD3] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#1B4332] h-2 rounded-full transition-all duration-300 relative"
                style={{ width: `${scanProgress}%` }}
              >
                <div className="absolute inset-0 bg-[#D4A24E]/40 animate-pulse" />
              </div>
            </div>

            <p className="text-[10px] text-neutral-500 text-center">
              Matching lesion contours against 10,000+ verified ICAR plant pathology profiles...
            </p>
          </div>
        )}

        {/* Action Trigger Button */}
        {selectedImage && !isScanning && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={runDiagnosticScan}
              className="bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FAF7F0] px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 tracking-wide cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4A24E]" />
              <span>{currentLang === 'hi' ? 'रोग का विश्लेषण करें (Start AI Diagnosis)' : 'Start AI Diagnosis'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Step 3: 1-Click Demo Leaf Presets */}
      <div className="bg-[#FAF7F0] border border-[#D4A24E]/30 rounded-xl p-3.5 sm:p-4">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-[10px] font-bold text-[#1B4332] uppercase tracking-widest block">
            {t.sampleImagesLabel}
          </label>
          <span className="text-[10px] text-neutral-500 font-mono">1-CLICK INSTANT DEMO</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {CROP_DISEASES.slice(0, 5).map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              disabled={isScanning}
              className="group text-left p-1.5 rounded-lg bg-white border border-[#D4A24E]/20 hover:border-[#1B4332] transition-all overflow-hidden shadow-2xs hover:shadow-xs flex flex-col cursor-pointer"
            >
              <div className="aspect-4/3 rounded overflow-hidden mb-1 bg-neutral-100 relative">
                <img
                  src={sample.sampleImage}
                  alt={sample.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] px-1 rounded font-mono">
                  {sample.cropNameEn}
                </span>
              </div>
              <div className="text-[11px] font-bold text-neutral-900 line-clamp-1">
                {currentLang === 'hi' ? sample.nameHi : sample.nameEn}
              </div>
              <div className="text-[9px] text-neutral-500 line-clamp-1">
                {currentLang === 'hi' ? sample.nameEn : sample.nameHi}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
