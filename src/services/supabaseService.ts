import { getSupabase, getSupabaseConfig } from '../lib/supabase';
import { ScanResult, CropCategory } from '../types';
import { INITIAL_SAMPLE_SCANS } from '../data/sampleScans';
import { CROP_DISEASES } from '../data/cropDiseases';

export interface SupabaseStatus {
  connected: boolean;
  message: string;
  hasAnonKey: boolean;
  tableName: string;
}

/**
 * Test connectivity with Supabase backend
 */
export async function checkSupabaseStatus(): Promise<SupabaseStatus> {
  const { anonKey } = getSupabaseConfig();
  if (!anonKey) {
    return {
      connected: false,
      message: 'Supabase Anon Key is not set. Using local database with fallback.',
      hasAnonKey: false,
      tableName: 'scan_history',
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      connected: false,
      message: 'Failed to initialize Supabase client instance.',
      hasAnonKey: true,
      tableName: 'scan_history',
    };
  }

  try {
    const { data, error } = await client
      .from('scan_history')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        // Relation does not exist
        return {
          connected: false,
          message: 'Table "scan_history" does not exist yet. Please run the SQL schema in Supabase.',
          hasAnonKey: true,
          tableName: 'scan_history',
        };
      }
      return {
        connected: false,
        message: `Supabase Error: ${error.message}`,
        hasAnonKey: true,
        tableName: 'scan_history',
      };
    }

    return {
      connected: true,
      message: 'Connected to Supabase PostgreSQL database (scan_history table active).',
      hasAnonKey: true,
      tableName: 'scan_history',
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Network/Connection error: ${err?.message || 'Unable to reach Supabase'}`,
      hasAnonKey: true,
      tableName: 'scan_history',
    };
  }
}

/**
 * Fetch all diagnostic scans from Supabase with fallback to local state
 */
export async function fetchScansFromSupabase(userPhone?: string): Promise<ScanResult[] | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    let query = client
      .from('scan_history')
      .select('*')
      .order('created_at', { ascending: false });

    // If user phone provided, query either their specific scans or all available records
    const { data, error } = await query;

    if (error || !data) {
      console.warn('Could not fetch from Supabase, error:', error);
      return null;
    }

    // Map database records back to ScanResult model
    const scans: ScanResult[] = data.map((row: any) => {
      // Find disease info fallback or use stored payload
      const matchedDisease =
        CROP_DISEASES.find((d) => d.id === row.disease_id) ||
        row.full_disease_payload || {
          id: row.disease_id || 'unknown',
          crop: (row.crop as CropCategory) || 'potato',
          cropNameEn: row.crop_name_en || 'Crop',
          cropNameHi: row.crop_name_hi || 'फसल',
          cropIcon: '🌱',
          nameEn: row.disease_name_en || 'Crop Disease',
          nameHi: row.disease_name_hi || 'फसल रोग',
          pathogenType: row.pathogen_type || 'Fungal',
          scientificName: row.scientific_name || 'Plant Pathogen',
          severity: row.severity || 'moderate',
          confidenceRange: [90, 98],
          symptoms: { en: ['Observed lesion patterns'], hi: ['पत्तियों पर धब्बे'] },
          causes: { en: ['Fungal spores'], hi: ['फंगल बीजाणु'] },
          favorableWeather: { temp: '20-25°C', humidity: '>80%', season: 'Rabi' },
          treatments: { chemical: [], organic: [] },
          preventionTips: { en: ['Field sanitization'], hi: ['खेत की सफाई'] },
          sampleImage: row.image_url || '',
          fallbackColor: '#1B4332',
        };

      return {
        id: row.id,
        timestamp: row.timestamp_text || new Date(row.created_at).toLocaleString(),
        crop: row.crop as CropCategory,
        cropNameEn: row.crop_name_en,
        cropNameHi: row.crop_name_hi,
        disease: matchedDisease,
        confidence: Number(row.confidence) || 95.0,
        imageUrl: row.image_url,
        severity: row.severity,
        farmAreaAcres: Number(row.farm_area_acres) || 1.0,
        fieldLocation: row.field_location || 'Main Field',
        status: row.status || 'Follow-up',
        notes: row.notes || '',
        userId: row.user_id,
        userPhone: row.user_phone,
        userName: row.user_name,
      };
    });

    return scans.length > 0 ? scans : null;
  } catch (err) {
    console.warn('Supabase fetch exception:', err);
    return null;
  }
}

/**
 * Save new scan into Supabase PostgreSQL
 */
export async function saveScanToSupabase(scan: ScanResult): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload: any = {
      id: scan.id,
      timestamp_text: scan.timestamp,
      crop: scan.crop,
      crop_name_en: scan.cropNameEn,
      crop_name_hi: scan.cropNameHi,
      disease_id: scan.disease.id,
      disease_name_en: scan.disease.nameEn,
      disease_name_hi: scan.disease.nameHi,
      scientific_name: scan.disease.scientificName,
      pathogen_type: scan.disease.pathogenType,
      confidence: scan.confidence,
      severity: scan.severity,
      image_url: scan.imageUrl,
      farm_area_acres: scan.farmAreaAcres || 1.0,
      field_location: scan.fieldLocation || 'Plot 1',
      status: scan.status || 'Follow-up',
      notes: scan.notes || '',
      full_disease_payload: scan.disease,
      user_id: scan.userId || null,
      user_phone: scan.userPhone || null,
      user_name: scan.userName || null,
    };

    const { error } = await client
      .from('scan_history')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Failed to save scan to Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Exception saving scan to Supabase:', err);
    return false;
  }
}

/**
 * Save or update Farmer Profile directly in Supabase
 */
export async function saveFarmerProfileToSupabase(profile: any): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const payload = {
      farmer_code: profile.farmerIdCode || `KRISHI-${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: profile.name,
      phone_number: profile.phone,
      state: profile.state || 'Maharashtra',
      district: profile.district || 'Nashik',
      village: profile.village || '',
      total_land_acres: profile.farmSizeAcres || 1.0,
      primary_crop: profile.primaryCrop || 'potato',
      preferred_language: 'hi',
      updated_at: new Date().toISOString(),
    };

    const { error } = await client
      .from('farmer_profiles')
      .upsert(payload, { onConflict: 'phone_number' });

    if (error) {
      console.warn('Could not sync profile to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception syncing profile to Supabase:', err);
    return false;
  }
}

/**
 * Fetch raw table records from Supabase for live viewing in App UI
 */
export async function fetchTableRecords(tableName: string): Promise<any[]> {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) {
      console.warn(`Error fetching ${tableName}:`, error);
      return [];
    }
    return data;
  } catch (err) {
    console.warn(`Error fetching ${tableName}:`, err);
    return [];
  }
}

/**
 * Fetch all registered farmers directly from Supabase
 */
export async function fetchFarmersFromSupabase(): Promise<any[]> {
  return fetchTableRecords('farmer_profiles');
}

/**
 * Fetch all scans directly from Supabase
 */
export async function fetchAllScansDirect(): Promise<any[]> {
  return fetchTableRecords('scan_history');
}

/**
 * Sync all local farmer profiles and all scans to Supabase in one operation
 */
export async function syncAllLocalDataToSupabase(
  scans: ScanResult[],
  users: any[],
  currentUser?: any
): Promise<{ success: boolean; syncedFarmers: number; syncedScans: number; errorMsg?: string }> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      syncedFarmers: 0,
      syncedScans: 0,
      errorMsg: 'Supabase client is not connected or anon key missing.',
    };
  }

  let syncedFarmers = 0;
  let syncedScans = 0;

  // 1. Sync current user & all users
  const farmersToSync = [...users];
  if (currentUser && !farmersToSync.find((u) => u.phone === currentUser.phone)) {
    farmersToSync.unshift(currentUser);
  }

  for (const user of farmersToSync) {
    const ok = await saveFarmerProfileToSupabase(user);
    if (ok) syncedFarmers++;
  }

  // 2. Sync all scans
  for (const scan of scans) {
    // Enrich with user phone / name if available
    const enrichedScan = {
      ...scan,
      userId: scan.userId || currentUser?.id,
      userPhone: scan.userPhone || currentUser?.phone,
      userName: scan.userName || currentUser?.name,
    };
    const ok = await saveScanToSupabase(enrichedScan);
    if (ok) syncedScans++;
  }

  return {
    success: syncedFarmers > 0 || syncedScans > 0,
    syncedFarmers,
    syncedScans,
  };
}

/**
 * Update scan status in Supabase
 */
export async function updateScanStatusInSupabase(
  scanId: string,
  status: 'Treated' | 'Follow-up' | 'Critical' | 'Healthy'
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('scan_history')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', scanId);

    if (error) {
      console.warn('Failed to update status in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception updating scan in Supabase:', err);
    return false;
  }
}

/**
 * Delete a scan from Supabase
 */
export async function deleteScanFromSupabase(scanId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('scan_history')
      .delete()
      .eq('id', scanId);

    if (error) {
      console.warn('Failed to delete scan from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception deleting scan from Supabase:', err);
    return false;
  }
}
