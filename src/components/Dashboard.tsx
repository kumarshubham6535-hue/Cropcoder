import React, { useState } from 'react';
import { ScanResult, Language, CropCategory } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { MONTHLY_TREND_DATA, SEVERITY_DISTRIBUTION } from '../data/sampleScans';
import { UserProfile, getRegisteredUsers } from '../services/authService';
import { syncAllLocalDataToSupabase } from '../services/supabaseService';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  BarChart2,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  Camera,
  Layers,
  Thermometer,
  CloudRain,
  MapPin,
  TrendingUp,
  Award,
  Sparkles,
  User,
  LogIn,
  Search,
  UploadCloud,
  Database,
  RefreshCw
} from 'lucide-react';
import { PrescriptionModal } from './PrescriptionModal';

interface DashboardProps {
  scans: ScanResult[];
  currentLang: Language;
  onViewScanResult: (scan: ScanResult) => void;
  onUpdateScanStatus: (scanId: string, status: 'Treated' | 'Follow-up' | 'Critical' | 'Healthy') => void;
  onNavigateToScan?: (crop?: CropCategory) => void;
  onOpenSupabaseModal?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  scans,
  currentLang,
  onViewScanResult,
  onUpdateScanStatus,
  onNavigateToScan,
  onOpenSupabaseModal,
  currentUser,
  onOpenAuthModal,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'scans' | 'weather' | 'market' | 'schemes'>('scans');
  const [selectedScanForParchi, setSelectedScanForParchi] = useState<ScanResult | null>(null);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleQuickSyncSupabase = async () => {
    setIsSyncingSupabase(true);
    const users = getRegisteredUsers();
    const res = await syncAllLocalDataToSupabase(scans, users, currentUser);
    setIsSyncingSupabase(false);
    if (res.success) {
      setSyncToast(`Synced ${res.syncedFarmers} Farmers & ${res.syncedScans} Scans to Supabase!`);
    } else {
      setSyncToast(res.errorMsg || 'Please configure Anon Key in Supabase Settings.');
    }
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Filter scans based on crop and search query
  const filteredScans = scans.filter((s) => {
    const matchesCrop = cropFilter === 'all' || s.crop === cropFilter;
    const matchesSearch =
      !searchQuery ||
      s.cropNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cropNameHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.disease.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.disease.nameHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.fieldLocation && s.fieldLocation.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCrop && matchesSearch;
  });

  // Calculate KPIs
  const totalScansCount = scans.length;
  const healthyCount = scans.filter((s) => s.severity === 'healthy').length;
  const treatedCount = scans.filter((s) => s.status === 'Treated').length;
  const criticalCount = scans.filter((s) => s.severity === 'severe' && s.status !== 'Treated').length;

  // Active threat item (the most critical recent scan or first scan)
  const activeThreatScan = scans.find(s => s.severity === 'severe') || scans[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 animate-in fade-in duration-150">
      {/* High Density Main Split: Sidebar + Dashboard Section */}
      <div className="flex flex-col lg:flex-row gap-5">
        
        {/* Left Aside: Farmer Identity & Quick Agro Navigation */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
          {/* Farmer Profile Card (High Density Design Theme) */}
          <div className="bg-white border border-[#D4A24E]/30 rounded-xl p-4 shadow-xs relative">
            {currentUser ? (
              <>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold text-[#1B4332]/70 uppercase tracking-widest font-mono">
                    ID: {currentUser.farmerIdCode}
                  </p>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Account" />
                </div>
                <h2 className="text-lg font-extrabold text-[#1B4332] tracking-tight">
                  {currentUser.name}
                </h2>
                <p className="text-xs text-[#2B2B2B]/70 flex items-center gap-1 mt-0.5 font-medium">
                  <MapPin className="w-3 h-3 text-[#D4A24E]" />
                  <span>{currentUser.district}, {currentUser.state}</span>
                </p>
                <div className="mt-3 pt-2.5 border-t border-[#D4A24E]/20 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-[#FAF7F0] p-1.5 rounded border border-[#D4A24E]/20">
                    <span className="text-[10px] text-neutral-500 block">Holding</span>
                    <span className="font-bold text-[#1B4332] font-mono">{currentUser.farmSizeAcres} Acres</span>
                  </div>
                  <div className="bg-[#FAF7F0] p-1.5 rounded border border-[#D4A24E]/20">
                    <span className="text-[10px] text-neutral-500 block">Primary Crop</span>
                    <span className="font-bold text-[#1B4332] capitalize">{currentUser.primaryCrop}</span>
                  </div>
                </div>
                <button
                  onClick={onOpenAuthModal}
                  className="mt-3 w-full py-1 text-center text-[10px] font-bold text-[#1B4332] hover:bg-[#FAF7F0] rounded border border-[#D4A24E]/30 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Manage Account / Switch
                </button>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="w-10 h-10 bg-[#FAF7F0] border border-[#D4A24E]/40 rounded-full flex items-center justify-center mx-auto mb-2 text-[#1B4332]">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#1B4332]">Guest Mode</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5 mb-3">
                  Sign in to link and persist your personal farm scan records.
                </p>
                <button
                  onClick={onOpenAuthModal}
                  className="w-full py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Farmer Login / Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Sub-Navigation Strip */}
          <div className="space-y-1 bg-white/70 border border-[#D4A24E]/20 rounded-xl p-2 shadow-2xs">
            <button
              onClick={() => setActiveSidebarTab('scans')}
              className={`w-full flex items-center justify-between p-2 rounded text-xs transition-all ${
                activeSidebarTab === 'scans'
                  ? 'bg-[#1B4332]/10 text-[#1B4332] font-bold border-l-4 border-[#1B4332]'
                  : 'hover:bg-black/5 opacity-75'
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>My Field Scans</span>
              </span>
              <span className="text-[10px] bg-[#D4A24E] text-[#081C15] font-bold px-1.5 py-0.2 rounded-full">
                {scans.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('weather')}
              className={`w-full flex items-center justify-between p-2 rounded text-xs transition-all ${
                activeSidebarTab === 'weather'
                  ? 'bg-[#1B4332]/10 text-[#1B4332] font-bold border-l-4 border-[#1B4332]'
                  : 'hover:bg-black/5 opacity-75'
              }`}
            >
              <span className="flex items-center gap-2">
                <CloudRain className="w-3.5 h-3.5" />
                <span>Weather Alerts</span>
              </span>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            <button
              onClick={() => setActiveSidebarTab('market')}
              className={`w-full flex items-center justify-between p-2 rounded text-xs transition-all ${
                activeSidebarTab === 'market'
                  ? 'bg-[#1B4332]/10 text-[#1B4332] font-bold border-l-4 border-[#1B4332]'
                  : 'hover:bg-black/5 opacity-75'
              }`}
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Mandi Mandate</span>
              </span>
              <span className="text-[10px] font-mono font-semibold text-emerald-800">₹1,840/q</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('schemes')}
              className={`w-full flex items-center justify-between p-2 rounded text-xs transition-all ${
                activeSidebarTab === 'schemes'
                  ? 'bg-[#1B4332]/10 text-[#1B4332] font-bold border-l-4 border-[#1B4332]'
                  : 'hover:bg-black/5 opacity-75'
              }`}
            >
              <span className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5" />
                <span>PM-Kisan Subsidies</span>
              </span>
              <span className="text-[10px] text-[#D4A24E] font-bold">Active</span>
            </button>

            {onOpenSupabaseModal && (
              <div className="pt-1 mt-1 border-t border-[#D4A24E]/20 space-y-1.5">
                <button
                  onClick={onOpenSupabaseModal}
                  className="w-full flex items-center justify-between p-2 rounded text-xs bg-[#1B4332]/5 hover:bg-[#1B4332]/15 text-[#1B4332] font-bold transition-all border border-[#D4A24E]/30 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Supabase PostgreSQL</span>
                  </span>
                  <span className="text-[9px] bg-[#1B4332] text-white px-1.5 py-0.5 rounded font-mono">
                    Cloud DB
                  </span>
                </button>

                <button
                  onClick={handleQuickSyncSupabase}
                  disabled={isSyncingSupabase}
                  className="w-full py-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Upload all details & scans to Supabase"
                >
                  <UploadCloud className={`w-3 h-3 text-[#D4A24E] ${isSyncingSupabase ? 'animate-bounce' : ''}`} />
                  <span>{isSyncingSupabase ? 'Syncing to Cloud...' : '⚡ Sync All to Supabase'}</span>
                </button>

                {syncToast && (
                  <div className="p-2 bg-emerald-50 border border-emerald-300 text-emerald-900 text-[10px] rounded font-medium animate-in fade-in leading-tight">
                    {syncToast}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Impact Stats Banner (High Density Theme Component) */}
          <div className="bg-[#1B4332] text-white rounded-xl p-4 border border-[#D4A24E]/30 shadow-md flex flex-col gap-1.5">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#D4A24E]">
              Farmer Impact Metrics
            </p>
            <p className="text-2xl font-extrabold text-white">
              40% <span className="text-xs font-normal opacity-80">Loss Avoided</span>
            </p>
            <p className="text-[11px] leading-tight text-white/80">
              Your proactive diagnostic scans saved approx. <strong>₹24,000</strong> in potential tuber loss this season.
            </p>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
              <span>KVK Advisory Verified</span>
              <span className="text-emerald-400 font-bold">96.4% Acc.</span>
            </div>
          </div>
        </aside>

        {/* Right Area: High-Density Diagnostic Overview & Threat Monitor */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          
          {/* Top Row: Scanner Quick Action + Active Threat Highlight Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Crop Health Scanner Box */}
            <div className="md:col-span-2 bg-white border border-[#D4A24E]/30 rounded-xl p-4 sm:p-5 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-xs sm:text-sm flex items-center gap-2 text-[#1B4332] uppercase tracking-wider">
                    <span className="w-2 h-4 bg-[#D4A24E] rounded-full" />
                    <span>CROP HEALTH SCANNER</span>
                  </h3>
                  <button
                    onClick={() => onNavigateToScan?.()}
                    className="text-[10px] font-bold text-[#1B4332] hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    SCAN NEW LEAF →
                  </button>
                </div>

                {/* Upload or Capture Drag Area */}
                <div
                  onClick={() => onNavigateToScan?.()}
                  className="border-2 border-dashed border-[#D4A24E]/40 rounded-lg h-36 flex flex-col items-center justify-center bg-[#FAF7F0] cursor-pointer hover:bg-[#FAF7F0]/90 transition-all group"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#D4A24E]/40 mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5 text-[#1B4332]" />
                  </div>
                  <p className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
                    UPLOAD OR CAPTURE CROP LEAF
                  </p>
                  <p className="text-[10px] text-[#2B2B2B]/60 mt-0.5">
                    Supports JPG, PNG (Max 10MB) • Automated ICAR Pathology Matching
                  </p>
                </div>
              </div>

              {/* Progress & Live Sensor Bar */}
              <div className="mt-3 pt-2 border-t border-[#D4A24E]/15">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#1B4332] font-bold mb-1">
                  <span>AI PATHOLOGY RADAR (LIVE)</span>
                  <span className="text-emerald-700">100% READY</span>
                </div>
                <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#1B4332] h-full w-full" />
                </div>
                <p className="text-[10px] italic text-[#2B2B2B]/60 mt-1">
                  6 active crop models loaded: Potato, Tomato, Paddy, Wheat, Cotton, Chilli.
                </p>
              </div>
            </div>

            {/* Active Threat Card (High Density Theme) */}
            {activeThreatScan && (
              <div className="bg-[#1B4332] text-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#D4A24E]/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 bg-[#D4A24E] rounded">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#081C15]" />
                      </div>
                      <span className="text-[11px] font-bold tracking-wider uppercase text-[#D4A24E]">
                        ACTIVE THREAT
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-red-600 text-[10px] font-extrabold rounded uppercase tracking-wider">
                      {activeThreatScan.severity}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold leading-tight text-white mt-1">
                    {activeThreatScan.disease.nameHi} <br />
                    <span className="text-[#D4A24E] text-xs font-normal">
                      ({activeThreatScan.disease.nameEn})
                    </span>
                  </h4>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs opacity-80 font-mono">
                      {activeThreatScan.confidence}% Confidence
                    </span>
                    <span className="opacity-40">•</span>
                    <span className="text-xs opacity-80">
                      {activeThreatScan.cropNameEn}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 mt-3">
                  <p className="text-[10px] uppercase font-bold opacity-60 mb-1">
                    Immediate Action
                  </p>
                  <p className="text-xs leading-snug text-white/90">
                    {activeThreatScan.disease.treatments.chemical[0]?.tradeName || 'Apply Mancozeb 75% WP @ 2.5g/L immediately.'}
                  </p>
                  <button
                    onClick={() => onViewScanResult(activeThreatScan)}
                    className="mt-2.5 w-full py-1.5 bg-[#D4A24E] hover:bg-[#C2903C] text-[#081C15] rounded text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Prescription Slip</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Grid: Recent Scan History Table + Advisory & Trend Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Table Area (2 Cols) */}
            <div className="lg:col-span-2 flex flex-col bg-white border border-[#D4A24E]/30 rounded-xl overflow-hidden shadow-xs">
              <div className="p-3.5 bg-[#FAF7F0] border-b border-[#D4A24E]/20 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1B4332]">
                    Search & Field Scan History
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-[#1B4332] text-[#FAF7F0] text-[10px] font-mono font-bold">
                    {filteredScans.length}
                  </span>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search disease/plot..."
                      className="w-32 sm:w-40 pl-6 pr-2 py-0.5 bg-white border border-[#D4A24E]/40 rounded text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                    />
                    <Search className="w-3 h-3 text-neutral-400 absolute left-2 top-1.5 pointer-events-none" />
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <Filter className="w-3 h-3 text-neutral-500" />
                    <select
                      value={cropFilter}
                      onChange={(e) => setCropFilter(e.target.value)}
                      className="bg-white border border-[#D4A24E]/40 rounded px-2 py-0.5 text-xs font-semibold text-neutral-800 focus:outline-none"
                    >
                      <option value="all">All Crops</option>
                      <option value="potato">Potato (आलू)</option>
                      <option value="tomato">Tomato (टमाटर)</option>
                      <option value="rice">Rice (धान)</option>
                      <option value="wheat">Wheat (गेहूं)</option>
                      <option value="cotton">Cotton (कपास)</option>
                      <option value="chilli">Chilli (मिर्च)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table Rows (Compact High Density) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#FAF7F0] sticky top-0 text-[#1B4332] border-b border-[#D4A24E]/20">
                    <tr>
                      <th className="p-2.5 font-bold">Date</th>
                      <th className="p-2.5 font-bold">Crop Type</th>
                      <th className="p-2.5 font-bold">Diagnosis / Search Result</th>
                      <th className="p-2.5 font-bold">Status</th>
                      <th className="p-2.5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4A24E]/10">
                    {filteredScans.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-neutral-500 text-xs">
                          <p className="font-semibold mb-1">No scan records found.</p>
                          <p className="text-[11px] text-neutral-400">
                            Scan a plant leaf or adjust your search filter to view diagnosis history.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredScans.map((scan) => (
                        <tr key={scan.id} className="hover:bg-neutral-50/80 transition-colors">
                          <td className="p-2.5 opacity-80 text-[11px] font-mono whitespace-nowrap">
                            {scan.timestamp.split(' ')[0]}
                          </td>
                          <td className="p-2.5 font-bold text-[#1B4332] whitespace-nowrap">
                            {scan.cropNameHi} ({scan.cropNameEn})
                          </td>
                          <td className="p-2.5">
                            <div className="font-semibold text-neutral-900 line-clamp-1">
                              {scan.disease.nameHi}
                            </div>
                            <div className="text-[10px] text-neutral-500 font-mono">
                              {scan.disease.nameEn} • {scan.confidence}% match
                            </div>
                          </td>
                          <td className="p-2.5">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                scan.severity === 'severe'
                                  ? 'text-red-700 bg-red-100'
                                  : scan.severity === 'moderate'
                                  ? 'text-amber-800 bg-amber-100'
                                  : scan.severity === 'healthy'
                                  ? 'text-emerald-800 bg-emerald-100'
                                  : 'text-blue-800 bg-blue-100'
                              }`}
                            >
                              {scan.severity}
                            </span>
                          </td>
                          <td className="p-2.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => onViewScanResult(scan)}
                                className="px-2 py-1 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-[10px] font-bold rounded uppercase transition-colors cursor-pointer"
                              >
                                REPORT
                              </button>
                              <button
                                onClick={() => setSelectedScanForParchi(scan)}
                                className="p-1 bg-[#D4A24E] hover:bg-[#C2903C] text-[#081C15] rounded transition-colors cursor-pointer"
                                title="Prescription"
                              >
                                <FileText className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Advisory Insights & Disease Trend (1 Col) */}
            <div className="flex flex-col gap-4">
              {/* Advisory Insights Card */}
              <div className="bg-[#D4A24E]/10 border border-[#D4A24E]/30 rounded-xl p-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1B4332] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4A24E]" />
                  <span>Advisory Insights</span>
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2.5">
                    <div className="w-1 bg-[#1B4332] rounded-full shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#1B4332]">Organic Control</p>
                      <p className="text-[10px] leading-tight opacity-80 text-neutral-700 mt-0.5">
                        Neem oil spray (5ml/L) or Dashparni Ark effective against current aphid & thrips buildup.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <div className="w-1 bg-[#D4A24E] rounded-full shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#1B4332]">Soil & Nitrogen Tip</p>
                      <p className="text-[10px] leading-tight opacity-80 text-neutral-700 mt-0.5">
                        Avoid excess urea top-dressing during high humidity (88% RH) to curtail blast spore growth.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disease Trend (30 Days / Seasonal Bar Chart) */}
              <div className="bg-white border border-[#D4A24E]/30 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1B4332]">
                    Disease Trend (Seasonal)
                  </h3>
                  <span className="text-[9px] font-mono text-neutral-500">2026 Kharif</span>
                </div>

                <div className="h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_TREND_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#FAF7F0" />
                      <XAxis dataKey="month" stroke="#888" fontSize={9} />
                      <YAxis stroke="#888" fontSize={9} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1B4332',
                          color: '#FAF7F0',
                          borderRadius: '4px',
                          fontSize: '10px',
                          border: 'none',
                        }}
                      />
                      <Bar dataKey="potatoBlight" fill="#B45309" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="riceBlast" fill="#065F46" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="wheatRust" fill="#D4A24E" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-between text-[9px] font-bold uppercase text-neutral-500 pt-2 border-t border-neutral-100">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
                    <span>Potato</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#065F46]" />
                    <span>Rice</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A24E]" />
                    <span>Wheat</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Slip Modal */}
      {selectedScanForParchi && (
        <PrescriptionModal
          scan={selectedScanForParchi}
          currentLang={currentLang}
          onClose={() => setSelectedScanForParchi(null)}
        />
      )}
    </div>
  );
};


