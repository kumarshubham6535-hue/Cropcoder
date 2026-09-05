import { isSupabaseConfigured, supabase } from './supabaseClient';
import { ProduceListing, MarketplaceOrder, FarmerProfile, QualityGrade, OrderStatus } from '../types';
import { AuthUser, normalizePhone, getCleanDigits } from './authService';

// ============================================================================
// Database Row Types (Matching Supabase SQL Schema)
// ============================================================================

export interface DBProfileRow {
  id: string;
  name: string;
  phone: string;
  is_fpo: boolean;
  fpo_name: string | null;
  state: string;
  district: string;
  village: string;
  primary_crops: string[];
  is_phone_verified: boolean;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DBProduceListingRow {
  id: string;
  farmer_id: string | null;
  farmer_name: string;
  farmer_phone: string;
  is_fpo: boolean;
  fpo_name: string | null;
  crop_id: string;
  crop_name: string;
  variety: string;
  grade: string;
  quantity_available_quintals: number;
  min_order_quintals: number;
  asking_price_per_quintal: number;
  mandi_middleman_price_per_quintal: number;
  retail_consumer_price_per_quintal: number;
  harvest_date: string;
  village: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  pickup_point_name: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface DBMarketplaceOrderRow {
  id: string;
  order_number: string;
  listing_id: string | null;
  buyer_id: string | null;
  buyer_name: string;
  buyer_phone: string;
  delivery_address: string;
  crop_id: string;
  crop_name: string;
  variety: string;
  quantity_quintals: number;
  farmer_price_per_quintal: number;
  logistics_fee: number;
  total_amount: number;
  middleman_mandi_equivalent: number;
  buyer_saved_amount: number;
  payment_method: string;
  payment_status: string;
  payment_transaction_id?: string | null;
  status: string;
  logistics_step: string;
  estimated_delivery_hours?: number;
  cancellation_reason?: string | null;
  cancellation_note?: string | null;
  cancelled_at?: string | null;
  refund_amount?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface DBOTPChallengeRow {
  id?: string;
  phone: string;
  otp_code: string;
  purpose: string;
  payload?: any;
  expires_at: string;
  is_used: boolean;
  created_at?: string;
}

export interface DBAPMCBenchmarkRow {
  id?: string;
  crop_id: string;
  crop_name: string;
  state: string;
  district: string;
  mandi_name: string;
  modal_price_per_quintal: number;
  min_price_per_quintal: number;
  max_price_per_quintal: number;
  arrivals_tonnes: number;
  forecast_demand_quintals?: number;
  suggested_fair_price?: number;
  recorded_date?: string;
}

// ============================================================================
// Mappers: Transform between DB Snake_Case and App CamelCase
// ============================================================================

export function mapDBToListing(row: DBProduceListingRow): ProduceListing {
  return {
    id: row.id,
    farmerId: row.farmer_id || 'farmer-01',
    farmerName: row.farmer_name,
    farmerPhone: row.farmer_phone,
    isFPO: Boolean(row.is_fpo),
    fpoName: row.fpo_name || undefined,
    cropId: row.crop_id,
    cropName: row.crop_name,
    variety: row.variety,
    grade: (row.grade as QualityGrade) || 'Grade A (Premium)',
    quantityAvailableQuintals: Number(row.quantity_available_quintals) || 0,
    minOrderQuintals: Number(row.min_order_quintals) || 1,
    askingPricePerQuintal: Number(row.asking_price_per_quintal) || 0,
    mandiMiddlemanPricePerQuintal: Number(row.mandi_middleman_price_per_quintal) || 0,
    retailConsumerPricePerQuintal: Number(row.retail_consumer_price_per_quintal) || 0,
    harvestDate: row.harvest_date,
    location: {
      village: row.village,
      district: row.district,
      state: row.state,
      lat: Number(row.latitude) || 20.1448,
      lng: Number(row.longitude) || 74.2255,
    },
    pickupPointName: row.pickup_point_name,
    createdAt: row.created_at || new Date().toISOString(),
    status: (row.status as 'active' | 'sold_out') || 'active',
  };
}

export function mapListingToDB(listing: ProduceListing): Partial<DBProduceListingRow> {
  return {
    id: listing.id,
    farmer_id: listing.farmerId.startsWith('f-') || listing.farmerId.includes('-') ? listing.farmerId : null,
    farmer_name: listing.farmerName,
    farmer_phone: listing.farmerPhone,
    is_fpo: listing.isFPO,
    fpo_name: listing.fpoName || null,
    crop_id: listing.cropId,
    crop_name: listing.cropName,
    variety: listing.variety,
    grade: listing.grade,
    quantity_available_quintals: listing.quantityAvailableQuintals,
    min_order_quintals: listing.minOrderQuintals,
    asking_price_per_quintal: listing.askingPricePerQuintal,
    mandi_middleman_price_per_quintal: listing.mandiMiddlemanPricePerQuintal,
    retail_consumer_price_per_quintal: listing.retailConsumerPricePerQuintal,
    harvest_date: listing.harvestDate,
    village: listing.location.village,
    district: listing.location.district,
    state: listing.location.state,
    latitude: listing.location.lat,
    longitude: listing.location.lng,
    pickup_point_name: listing.pickupPointName,
    status: listing.status,
  };
}

export function mapDBToOrder(row: DBMarketplaceOrderRow): MarketplaceOrder {
  // Parse delivery address format "Shop 12, Pune, Maharashtra - 411038" or fallback
  const addrParts = (row.delivery_address || '').split(',');
  const pincodeMatch = (row.delivery_address || '').match(/\b\d{6}\b/);
  
  return {
    id: row.id,
    orderNumber: row.order_number,
    listingId: row.listing_id || '',
    cropName: row.crop_name,
    farmerName: 'Verified Direct Farmer',
    farmerPhone: '+91 98000 00000',
    farmerPickupLocation: 'Designated APMC / Village Collection Hub',
    buyerName: row.buyer_name,
    buyerPhone: row.buyer_phone,
    buyerType: Number(row.quantity_quintals) >= 10 ? 'bulk' : 'individual',
    deliveryAddress: {
      addressLine: addrParts[0]?.trim() || row.delivery_address,
      district: addrParts[1]?.trim() || 'Central District',
      state: addrParts[2]?.trim() || 'State Hub',
      pincode: pincodeMatch ? pincodeMatch[0] : '400001',
    },
    quantityQuintals: Number(row.quantity_quintals),
    pricePerQuintal: Number(row.farmer_price_per_quintal),
    produceTotal: Number(row.quantity_quintals) * Number(row.farmer_price_per_quintal),
    logisticsFee: Number(row.logistics_fee) || 0,
    totalAmount: Number(row.total_amount),
    traditionalChainCost: Number(row.middleman_mandi_equivalent) || (Number(row.total_amount) + Number(row.buyer_saved_amount)),
    consumerSavings: Number(row.buyer_saved_amount) || 0,
    farmerEarnings: Number(row.quantity_quintals) * Number(row.farmer_price_per_quintal),
    farmerGainVsMandi: Math.round(Number(row.quantity_quintals) * Number(row.farmer_price_per_quintal) * 0.35),
    status: (row.status as OrderStatus) || 'confirmed',
    createdAt: row.created_at || new Date().toISOString(),
    estimatedDeliveryDays: 2,
    logisticsStep: row.logistics_step,
    isScheduledPickup: false,
    cancelledAt: row.cancelled_at || undefined,
    cancellationReason: row.cancellation_reason || undefined,
    cancellationNote: row.cancellation_note || undefined,
    refundAmount: row.refund_amount || undefined,
    refundStatus: row.refund_amount ? 'refunded' : undefined,
  };
}

export function mapOrderToDB(order: MarketplaceOrder): Partial<DBMarketplaceOrderRow> {
  const fullAddress = `${order.deliveryAddress.addressLine}, ${order.deliveryAddress.district}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}`;

  return {
    id: order.id,
    order_number: order.orderNumber,
    listing_id: order.listingId || null,
    buyer_name: order.buyerName,
    buyer_phone: order.buyerPhone,
    delivery_address: fullAddress,
    crop_id: order.cropName.toLowerCase().includes('onion') ? 'onion' : order.cropName.toLowerCase().includes('potato') ? 'potato' : 'tomato',
    crop_name: order.cropName,
    variety: 'Standard Grade-A',
    quantity_quintals: order.quantityQuintals,
    farmer_price_per_quintal: order.pricePerQuintal,
    logistics_fee: order.logisticsFee,
    total_amount: order.totalAmount,
    middleman_mandi_equivalent: order.traditionalChainCost,
    buyer_saved_amount: order.consumerSavings,
    payment_method: 'upi',
    payment_status: 'completed',
    status: order.status,
    logistics_step: order.logisticsStep,
    estimated_delivery_hours: order.estimatedDeliveryDays * 24,
    cancellation_reason: order.cancellationReason || null,
    cancellation_note: order.cancellationNote || null,
    cancelled_at: order.cancelledAt || null,
    refund_amount: order.refundAmount || null,
  };
}

// ============================================================================
// PRODUCE LISTINGS CRUD OPERATIONS
// ============================================================================

export async function fetchSupabaseProduceListings(): Promise<{ data: ProduceListing[] | null; error: any }> {
  if (!isSupabaseConfigured()) return { data: null, error: null };
  try {
    const { data, error } = await supabase
      .from('produce_listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchProduceListings error:', error);
      return { data: null, error };
    }

    if (data && Array.isArray(data)) {
      const listings = data.map(mapDBToListing);
      return { data: listings, error: null };
    }
    return { data: [], error: null };
  } catch (err) {
    console.warn('Network exception while fetching Supabase listings:', err);
    return { data: null, error: err };
  }
}

export async function createSupabaseProduceListing(listing: ProduceListing): Promise<{ success: boolean; error: any }> {
  if (!isSupabaseConfigured()) return { success: true, error: null };
  try {
    const payload = mapListingToDB(listing);
    const { error } = await supabase
      .from('produce_listings')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase createProduceListing error:', error);
      return { success: false, error };
    }
    return { success: true, error: null };
  } catch (err) {
    console.warn('Exception creating Supabase listing:', err);
    return { success: false, error: err };
  }
}

export async function updateSupabaseProduceListing(id: string, updates: Partial<ProduceListing>): Promise<{ success: boolean; error: any }> {
  if (!isSupabaseConfigured()) return { success: true, error: null };
  try {
    const dbUpdates: any = {};
    if (updates.quantityAvailableQuintals !== undefined) {
      dbUpdates.quantity_available_quintals = updates.quantityAvailableQuintals;
    }
    if (updates.status !== undefined) {
      dbUpdates.status = updates.status;
    }
    if (updates.askingPricePerQuintal !== undefined) {
      dbUpdates.asking_price_per_quintal = updates.askingPricePerQuintal;
    }

    const { error } = await supabase
      .from('produce_listings')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.warn('Supabase updateProduceListing error:', error);
      return { success: false, error };
    }
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function decrementSupabaseProduceStock(listingId: string, quantityToDeduct: number): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { data } = await supabase
      .from('produce_listings')
      .select('quantity_available_quintals')
      .eq('id', listingId)
      .single();

    if (data) {
      const currentQty = Number(data.quantity_available_quintals) || 0;
      const newQty = Math.max(0, currentQty - quantityToDeduct);
      await supabase
        .from('produce_listings')
        .update({
          quantity_available_quintals: newQty,
          status: newQty <= 0 ? 'sold_out' : 'active',
        })
        .eq('id', listingId);
    }
  } catch (e) {
    console.warn('Failed to decrement stock in Supabase', e);
  }
}

export async function restoreSupabaseProduceStock(listingId: string, quantityToRestore: number): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { data } = await supabase
      .from('produce_listings')
      .select('quantity_available_quintals')
      .eq('id', listingId)
      .single();

    if (data) {
      const currentQty = Number(data.quantity_available_quintals) || 0;
      const newQty = currentQty + quantityToRestore;
      await supabase
        .from('produce_listings')
        .update({
          quantity_available_quintals: newQty,
          status: 'active',
        })
        .eq('id', listingId);
    }
  } catch (e) {
    console.warn('Failed to restore stock in Supabase', e);
  }
}

export async function deleteSupabaseProduceListing(id: string): Promise<{ success: boolean; error: any }> {
  if (!isSupabaseConfigured()) return { success: true, error: null };
  try {
    const { error } = await supabase
      .from('produce_listings')
      .delete()
      .eq('id', id);

    return { success: !error, error };
  } catch (err) {
    return { success: false, error: err };
  }
}

// ============================================================================
// MARKETPLACE ORDERS CRUD OPERATIONS
// ============================================================================

export async function fetchSupabaseMarketplaceOrders(): Promise<{ data: MarketplaceOrder[] | null; error: any }> {
  if (!isSupabaseConfigured()) return { data: null, error: null };
  try {
    const { data, error } = await supabase
      .from('marketplace_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchMarketplaceOrders error:', error);
      return { data: null, error };
    }

    if (data && Array.isArray(data)) {
      const orders = data.map(mapDBToOrder);
      return { data: orders, error: null };
    }
    return { data: [], error: null };
  } catch (err) {
    console.warn('Network exception while fetching Supabase orders:', err);
    return { data: null, error: err };
  }
}

export async function createSupabaseMarketplaceOrder(order: MarketplaceOrder): Promise<{ success: boolean; error: any }> {
  if (!isSupabaseConfigured()) return { success: true, error: null };
  try {
    const payload = mapOrderToDB(order);
    const { error } = await supabase
      .from('marketplace_orders')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase createMarketplaceOrder error:', error);
      return { success: false, error };
    }

    // Auto-decrement inventory from listing
    if (order.listingId) {
      await decrementSupabaseProduceStock(order.listingId, order.quantityQuintals);
    }

    return { success: true, error: null };
  } catch (err) {
    console.warn('Exception creating Supabase order:', err);
    return { success: false, error: err };
  }
}

export async function updateSupabaseOrderStatus(
  orderId: string, 
  status: OrderStatus, 
  logisticsStep?: string
): Promise<{ success: boolean; error: any }> {
  if (!isSupabaseConfigured()) return { success: true, error: null };
  try {
    const { error } = await supabase
      .from('marketplace_orders')
      .update({
        status,
        ...(logisticsStep ? { logistics_step: logisticsStep } : {}),
      })
      .eq('id', orderId);

    return { success: !error, error };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function cancelSupabaseOrder(
  orderId: string, 
  reason: string, 
  note?: string,
  refundAmount?: number,
  targetListingId?: string,
  restoreQty?: number
): Promise<{ success: boolean; error: any }> {
  if (!isSupabaseConfigured()) return { success: true, error: null };
  try {
    const { error } = await supabase
      .from('marketplace_orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason,
        cancellation_note: note || null,
        refund_amount: refundAmount || 0,
        logistics_step: `Order Cancelled • 100% Refund (₹${(refundAmount || 0).toLocaleString('en-IN')}) processed to buyer`,
      })
      .eq('id', orderId);

    // Restore produce stock in database
    if (targetListingId && restoreQty && restoreQty > 0) {
      await restoreSupabaseProduceStock(targetListingId, restoreQty);
    }

    return { success: !error, error };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function deleteSupabaseOrder(orderId: string): Promise<{ success: boolean; error: any }> {
  if (!isSupabaseConfigured()) return { success: true, error: null };
  try {
    const { error } = await supabase
      .from('marketplace_orders')
      .delete()
      .eq('id', orderId);

    return { success: !error, error };
  } catch (err) {
    return { success: false, error: err };
  }
}

// ============================================================================
// PROFILES & AUTH CRUD OPERATIONS
// ============================================================================

export async function fetchSupabaseProfileByPhone(phone: string): Promise<DBProfileRow | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const normalized = normalizePhone(phone);
    const cleanDigits = getCleanDigits(phone);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`phone.eq.${normalized},phone.ilike.%${cleanDigits}%`)
      .limit(1)
      .single();

    if (error || !data) return null;
    return data as DBProfileRow;
  } catch {
    return null;
  }
}

export async function syncSupabaseProfile(user: AuthUser): Promise<{ success: boolean; error: any }> {
  if (!isSupabaseConfigured()) return { success: true, error: null };
  try {
    const payload: Partial<DBProfileRow> = {
      id: user.id.startsWith('farmer-') || user.id.startsWith('f-') ? user.id : undefined,
      name: user.name,
      phone: normalizePhone(user.phone),
      is_fpo: user.isFPO,
      fpo_name: user.fpoName || null,
      state: user.state,
      district: user.district,
      village: user.village,
      primary_crops: user.primaryCrops,
      is_phone_verified: user.isPhoneVerified,
      role: 'farmer',
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'phone' });

    return { success: !error, error };
  } catch (err) {
    return { success: false, error: err };
  }
}

// ============================================================================
// OTP CHALLENGES (SMS Verification & Recovery)
// ============================================================================

export async function saveSupabaseOTPChallenge(
  phone: string,
  otpCode: string,
  purpose: string,
  payload?: any,
  expiresAtMs?: number
): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) return { success: false };
  try {
    const expiresAt = new Date(expiresAtMs || Date.now() + 5 * 60 * 1000).toISOString();
    await supabase.from('otp_challenges').insert({
      phone: normalizePhone(phone),
      otp_code: otpCode,
      purpose,
      payload: payload || null,
      expires_at: expiresAt,
      is_used: false,
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function verifySupabaseStoredOTP(
  phone: string,
  otpCode: string,
  purpose: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const normalized = normalizePhone(phone);
    const { data, error } = await supabase
      .from('otp_challenges')
      .select('*')
      .eq('phone', normalized)
      .eq('otp_code', otpCode)
      .eq('purpose', purpose)
      .eq('is_used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data && !error) {
      // Mark as used
      if (data.id) {
        await supabase
          .from('otp_challenges')
          .update({ is_used: true })
          .eq('id', data.id);
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ============================================================================
// APMC MANDI BENCHMARKS
// ============================================================================

export async function fetchSupabaseAPMCBenchmarks(cropId?: string): Promise<DBAPMCBenchmarkRow[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    let query = supabase.from('apmc_mandi_benchmarks').select('*');
    if (cropId) {
      query = query.eq('crop_id', cropId);
    }
    const { data } = await query;
    return (data as DBAPMCBenchmarkRow[]) || [];
  } catch {
    return [];
  }
}
