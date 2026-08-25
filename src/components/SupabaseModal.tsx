import React, { useState, useEffect } from 'react';
import { Database, Check, Copy, AlertCircle, RefreshCw, X, Shield, ExternalLink, Key, Table, Eye, Layers, UploadCloud, User, FileText, CheckCircle2 } from 'lucide-react';
import {
  DEFAULT_SUPABASE_PROJECT_ID,
  DEFAULT_SUPABASE_URL,
  getSupabaseConfig,
  setSupabaseConfig,
  SUPABASE_SQL_SCHEMA,
} from '../lib/supabase';
import {
  checkSupabaseStatus,
  SupabaseStatus,
  fetchTableRecords,
  syncAllLocalDataToSupabase,
} from '../services/supabaseService';
import { ScanResult } from '../types';
import { UserProfile, getRegisteredUsers, getCurrentUser } from '../services/authService';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
  scans?: ScanResult[];
  currentUser?: UserProfile | null;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
  scans = [],
  currentUser,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'explorer' | 'sql' | 'settings'>('explorer');
  const [status, setStatus] = useState<SupabaseStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [selectedTable, setSelectedTable] = useState<'farmer_profiles' | 'scan_history' | 'crops'>('farmer_profiles');
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ message: string; count: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url || DEFAULT_SUPABASE_URL);
      setAnonKey(config.anonKey || '');
      runStatusCheck();
      loadTableData(selectedTable);
    }
  }, [isOpen]);

  const runStatusCheck = async () => {
    setIsChecking(true);
    const result = await checkSupabaseStatus();
    setStatus(result);
    setIsChecking(false);
  };

  const loadTableData = async (tbl: 'farmer_profiles' | 'scan_history' | 'crops') => {
    setIsLoadingTable(true);
    setSelectedTable(tbl);
    const records = await fetchTableRecords(tbl);
    setTableData(records);
    setIsLoadingTable(false);
  };

  const handleSyncAllToSupabase = async () => {
    setIsSyncingAll(true);
    const registeredUsers = getRegisteredUsers();
    const activeUser = currentUser || getCurrentUser();
    
    const res = await syncAllLocalDataToSupabase(scans, registeredUsers, activeUser);
    setIsSyncingAll(false);

    if (res.success) {
      setSyncFeedback({
        message: `Successfully synchronized ${res.syncedFarmers} Farmer Profiles and ${res.syncedScans} Diagnostic Scans into Supabase!`,
        count: res.syncedFarmers + res.syncedScans,
      });
      runStatusCheck();
      loadTableData(selectedTable);
    } else {
      setSyncFeedback({
        message: res.errorMsg || 'Could not sync with Supabase. Check if SQL schema is executed and Anon Key is saved in the API Credentials tab.',
        count: 0,
      });
    }

    setTimeout(() => setSyncFeedback(null), 5000);
  };

  const handleSaveConfig = () => {
    setSupabaseConfig(url.trim(), anonKey.trim());
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
    onConfigUpdated();
    runStatusCheck();
    loadTableData(selectedTable);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF7F0] w-full max-w-4xl rounded-xl shadow-2xl border border-[#D4A24E]/40 overflow-hidden text-[#2B2B2B] my-4 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="bg-[#1B4332] text-white px-4 py-3 flex items-center justify-between border-b border-[#D4A24E]/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4A24E] text-[#1B4332] flex items-center justify-center font-black">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm uppercase tracking-wider block">
                  Supabase Live Cloud Database
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-mono font-bold">
                  PostgreSQL 15
                </span>
              </div>
              <span className="text-[10px] text-white/70 font-mono">
                Project ID: {DEFAULT_SUPABASE_PROJECT_ID} &bull; Endpoint: {url}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://supabase.com/dashboard/project/${DEFAULT_SUPABASE_PROJECT_ID}/editor`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-[#D4A24E] hover:bg-[#C2903C] text-[#081C15] rounded text-[11px] font-bold cursor-pointer transition-colors"
            >
              <span>Supabase Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={runStatusCheck}
              disabled={isChecking}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Test Connection"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Test Connection</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#2D6A4F] rounded text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Status & Navigation Tabs */}
        <div className="bg-white px-4 py-2.5 border-b border-[#D4A24E]/20 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-wider">Status:</span>
            {isChecking ? (
              <span className="inline-flex items-center gap-1 text-neutral-600 font-mono text-[11px]">
                <RefreshCw className="w-3 h-3 animate-spin text-[#D4A24E]" /> Checking...
              </span>
            ) : status?.connected ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded font-black text-[11px] border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Live PostgreSQL Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded font-bold text-[11px] border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                {status?.hasAnonKey ? 'Needs SQL Migration in Supabase' : 'Anon Key Required'}
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#FAF7F0] p-1 rounded-lg border border-[#D4A24E]/30 text-xs">
            <button
              onClick={() => {
                setActiveTab('explorer');
                loadTableData(selectedTable);
              }}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'explorer'
                  ? 'bg-[#1B4332] text-white shadow-2xs'
                  : 'text-neutral-700 hover:bg-[#D4A24E]/20'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Live Cloud Records ({tableData.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-[#1B4332] text-white shadow-2xs'
                  : 'text-neutral-700 hover:bg-[#D4A24E]/20'
              }`}
            >
              PostgreSQL Schema (SQL)
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#1B4332] text-white shadow-2xs'
                  : 'text-neutral-700 hover:bg-[#D4A24E]/20'
              }`}
            >
              API Credentials
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: LIVE DATA EXPLORER */}
          {activeTab === 'explorer' && (
            <div className="space-y-3">
              {/* Sync Actions Bar */}
              <div className="bg-white p-3.5 rounded-xl border border-[#D4A24E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#1B4332] uppercase tracking-wider flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-[#D4A24E]" />
                    <span>Sync All Details to Supabase Database</span>
                  </h3>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    Upload your farmer profile details, all field scans, and treatment records to Supabase PostgreSQL in one click.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncAllToSupabase}
                    disabled={isSyncingAll}
                    className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#D4A24E] ${isSyncingAll ? 'animate-spin' : ''}`} />
                    <span>{isSyncingAll ? 'Syncing to Supabase...' : 'Sync All Details Now'}</span>
                  </button>
                </div>
              </div>

              {/* Sync Feedback Toast */}
              {syncFeedback && (
                <div className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2 animate-in fade-in ${
                  syncFeedback.count > 0
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{syncFeedback.message}</span>
                </div>
              )}

              {/* Table Switcher Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <div>
                  <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Viewing Supabase Table: <span className="text-[#1B4332] font-mono font-black">public.{selectedTable}</span>
                  </h4>
                </div>

                {/* Table Picker Buttons */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#D4A24E]/30 text-xs">
                  <button
                    onClick={() => loadTableData('farmer_profiles')}
                    className={`px-3 py-1 rounded font-bold transition-all cursor-pointer text-xs flex items-center gap-1 ${
                      selectedTable === 'farmer_profiles'
                        ? 'bg-[#1B4332] text-white shadow-2xs'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span>Farmer Profiles</span>
                  </button>
                  <button
                    onClick={() => loadTableData('scan_history')}
                    className={`px-3 py-1 rounded font-bold transition-all cursor-pointer text-xs flex items-center gap-1 ${
                      selectedTable === 'scan_history'
                        ? 'bg-[#1B4332] text-white shadow-2xs'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Scan History</span>
                  </button>
                  <button
                    onClick={() => loadTableData('crops')}
                    className={`px-3 py-1 rounded font-bold transition-all cursor-pointer text-xs flex items-center gap-1 ${
                      selectedTable === 'crops'
                        ? 'bg-[#1B4332] text-white shadow-2xs'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>Crops (16)</span>
                  </button>
                </div>
              </div>

              {/* Data Table Viewer */}
              <div className="border border-[#E5DFD3] rounded-lg overflow-hidden bg-white shadow-2xs">
                <div className="bg-[#FAF7F0] px-3.5 py-2 border-b border-[#E5DFD3] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#1B4332]">
                      public.{selectedTable}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      ({tableData.length} records retrieved from Supabase)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => loadTableData(selectedTable)}
                      disabled={isLoadingTable}
                      className="text-[11px] font-bold text-[#1B4332] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingTable ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                    <a
                      href={`https://supabase.com/dashboard/project/${DEFAULT_SUPABASE_PROJECT_ID}/editor/${selectedTable}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1"
                    >
                      <span>Open in Supabase</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-80">
                  {isLoadingTable ? (
                    <div className="p-8 text-center text-neutral-500 font-mono text-xs">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#D4A24E]" />
                      Querying Supabase PostgreSQL ({selectedTable})...
                    </div>
                  ) : tableData.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500 text-xs">
                      <p className="font-bold text-[#1B4332] mb-1">No rows in {selectedTable} table yet.</p>
                      <p className="text-[11px] text-neutral-500 mb-3 max-w-md mx-auto">
                        Click <strong>"Sync All Details Now"</strong> above to push your farmer details and scan history to Supabase instantly.
                      </p>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleSyncAllToSupabase}
                          className="px-3 py-1.5 bg-[#1B4332] text-white rounded text-xs font-bold cursor-pointer hover:bg-[#2D6A4F]"
                        >
                          Sync Local Data to Supabase Now
                        </button>
                        <button
                          onClick={() => setActiveTab('sql')}
                          className="px-3 py-1.5 bg-[#FAF7F0] border border-[#D4A24E]/40 text-[#1B4332] rounded text-xs font-bold cursor-pointer hover:bg-[#D4A24E]/20"
                        >
                          Check SQL Schema →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead className="bg-[#FAF7F0] sticky top-0 text-neutral-800 border-b border-[#E5DFD3] text-[11px]">
                        <tr>
                          {selectedTable === 'farmer_profiles' ? (
                            <>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Farmer Code</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Farmer Name</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Phone</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Location (State / District)</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Land Size</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Primary Crop</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Synced Date</th>
                            </>
                          ) : selectedTable === 'scan_history' ? (
                            <>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Crop & Disease</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Severity</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Confidence</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Plot / Location</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Status</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Farmer Name</th>
                              <th className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">Timestamp</th>
                            </>
                          ) : (
                            Object.keys(tableData[0] || {})
                              .filter((k) => k !== 'full_disease_payload')
                              .slice(0, 7)
                              .map((key) => (
                                <th key={key} className="p-2.5 font-extrabold uppercase font-mono text-[10px] tracking-wider text-[#1B4332]">
                                  {key}
                                </th>
                              ))
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-xs">
                        {tableData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-amber-50/40 text-[11px]">
                            {selectedTable === 'farmer_profiles' ? (
                              <>
                                <td className="p-2.5 font-mono font-bold text-[#1B4332]">{row.farmer_code || `KRISHI-${row.id?.slice(0, 4)}`}</td>
                                <td className="p-2.5 font-bold text-neutral-900">{row.full_name}</td>
                                <td className="p-2.5 font-mono text-neutral-700">{row.phone_number}</td>
                                <td className="p-2.5 text-neutral-700">{row.district}, {row.state} {row.village ? `(${row.village})` : ''}</td>
                                <td className="p-2.5 font-mono font-bold text-emerald-800">{row.total_land_acres} Acres</td>
                                <td className="p-2.5 capitalize font-semibold text-neutral-800">{row.primary_crop}</td>
                                <td className="p-2.5 text-[10px] text-neutral-500 font-mono">{new Date(row.updated_at || row.created_at).toLocaleDateString()}</td>
                              </>
                            ) : selectedTable === 'scan_history' ? (
                              <>
                                <td className="p-2.5 font-bold text-[#1B4332]">
                                  <div>{row.disease_name_en}</div>
                                  <div className="text-[10px] text-neutral-500">{row.crop_name_en} ({row.crop})</div>
                                </td>
                                <td className="p-2.5">
                                  <span className={`inline-block px-1.5 py-0.5 rounded font-black text-[10px] uppercase font-mono ${
                                    row.severity === 'severe'
                                      ? 'bg-rose-100 text-rose-800'
                                      : row.severity === 'moderate'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {row.severity}
                                  </span>
                                </td>
                                <td className="p-2.5 font-mono font-bold text-emerald-800">{row.confidence}%</td>
                                <td className="p-2.5 text-neutral-700">{row.field_location} ({row.farm_area_acres} Ac)</td>
                                <td className="p-2.5">
                                  <span className="font-semibold text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded text-[10px]">
                                    {row.status}
                                  </span>
                                </td>
                                <td className="p-2.5 font-medium text-neutral-800">{row.user_name || row.user_phone || 'Rajendra Patil'}</td>
                                <td className="p-2.5 text-[10px] text-neutral-500 font-mono">{row.timestamp_text || new Date(row.created_at).toLocaleDateString()}</td>
                              </>
                            ) : (
                              Object.keys(row)
                                .filter((k) => k !== 'full_disease_payload')
                                .slice(0, 7)
                                .map((key) => (
                                  <td key={key} className="p-2.5 max-w-[180px] truncate text-neutral-800 font-mono">
                                    {typeof row[key] === 'object'
                                      ? JSON.stringify(row[key])
                                      : String(row[key] ?? '-')}
                                  </td>
                                ))
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Direct Supabase Deep-Link Banner */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-bold text-emerald-950">
                    Live Cloud PostgreSQL Sync Active:
                  </span>
                  <span className="text-emerald-800 text-[11px]">
                    All details are saved to Supabase and queryable in your Supabase SQL & Table Editors.
                  </span>
                </div>
                <a
                  href={`https://supabase.com/dashboard/project/${DEFAULT_SUPABASE_PROJECT_ID}/editor`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Open Supabase Table Editor</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1B4332] uppercase tracking-wider">
                    Complete SQL Code for Supabase Editor
                  </h3>
                  <p className="text-[11px] text-neutral-600">
                    Copy and run this in your Supabase Project Dashboard &gt; <strong>SQL Editor</strong> &gt; <strong>New query</strong> &gt; <strong>Run</strong>.
                  </p>
                </div>
                <button
                  onClick={handleCopySQL}
                  className="inline-flex items-center gap-1.5 bg-[#D4A24E] hover:bg-[#C2903C] text-[#081C15] px-3.5 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Entire SQL Code'}</span>
                </button>
              </div>

              {/* Instructions Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded border border-[#D4A24E]/20 flex items-start gap-2">
                  <span className="w-4 h-4 rounded bg-[#1B4332] text-[#D4A24E] text-[10px] flex items-center justify-center font-bold font-mono shrink-0">1</span>
                  <span>Open <a href={`https://supabase.com/dashboard/project/${DEFAULT_SUPABASE_PROJECT_ID}/sql`} target="_blank" rel="noreferrer" className="text-[#1B4332] underline font-bold">SQL Editor</a> in Supabase</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#D4A24E]/20 flex items-start gap-2">
                  <span className="w-4 h-4 rounded bg-[#1B4332] text-[#D4A24E] text-[10px] flex items-center justify-center font-bold font-mono shrink-0">2</span>
                  <span>Paste this SQL & Click <strong>Run</strong> to generate all 16 crop models & tables</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#D4A24E]/20 flex items-start gap-2">
                  <span className="w-4 h-4 rounded bg-[#1B4332] text-[#D4A24E] text-[10px] flex items-center justify-center font-bold font-mono shrink-0">3</span>
                  <span>Paste your <strong>anon public key</strong> in the API Credentials tab</span>
                </div>
              </div>

              {/* Code Display Area */}
              <div className="relative rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 text-neutral-200">
                <div className="bg-neutral-800 px-3 py-1.5 text-[11px] font-mono text-neutral-400 flex items-center justify-between border-b border-neutral-700">
                  <span>schema.sql • 10 sections (16 Crops, Farmer Profiles, Scans, RLS, Indexes)</span>
                  <span className="text-[#D4A24E]">PostgreSQL 15+</span>
                </div>
                <pre className="p-3.5 text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed text-emerald-400">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: API CREDENTIALS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 bg-white p-4 rounded-xl border border-[#D4A24E]/30">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1B4332] uppercase tracking-wider mb-1">
                  Supabase Project REST API Credentials
                </h3>
                <p className="text-[11px] text-neutral-600">
                  Obtain your <strong>anon public key</strong> from Supabase Dashboard &gt; Project Settings &gt; API.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://gzwketwuirwtwrbkhbiz.supabase.co"
                    className="w-full bg-[#FAF7F0] border border-[#D4A24E]/40 rounded px-3 py-2 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider block mb-1 flex items-center justify-between">
                    <span>Supabase Anon Public API Key (JWT)</span>
                    <a
                      href={`https://supabase.com/dashboard/project/${DEFAULT_SUPABASE_PROJECT_ID}/settings/api`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1B4332] underline text-[10px] font-bold flex items-center gap-1"
                    >
                      <span>Find Key in Supabase Dashboard</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </label>
                  <textarea
                    rows={3}
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-[#FAF7F0] border border-[#D4A24E]/40 rounded px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-[#1B4332]"
                  />
                  <span className="text-[10px] text-neutral-500 block mt-1">
                    This is your client-side anon public key (safe for browser SPA applications).
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={handleSaveConfig}
                    className="inline-flex items-center gap-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-4 py-2 rounded text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-[#D4A24E]" />
                    <span>Save & Reconnect Backend</span>
                  </button>

                  {savedFeedback && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved successfully!
                    </span>
                  )}
                </div>
              </div>

              {/* Status explanation */}
              <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#D4A24E]/20 text-[11px] text-neutral-700 space-y-1">
                <div className="font-bold text-[#1B4332] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#D4A24E]" />
                  <span>Dual Storage Engine & Offline Resilience:</span>
                </div>
                <p>
                  All scans are instantly saved both in Supabase PostgreSQL (when connected) and in local application memory. If Supabase is awaiting SQL migration or if the farmer is in an offline field zone, the app works seamlessly and syncs back when online.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#FAF7F0] px-4 py-2.5 border-t border-[#D4A24E]/30 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[10px] text-neutral-500 font-mono">
            REST Endpoint: {url}/rest/v1/
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200 rounded transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
