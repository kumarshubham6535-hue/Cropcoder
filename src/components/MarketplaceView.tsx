import React, { useState, useMemo } from 'react';
import { ProduceListing, MarketplaceOrder } from '../types';
import { INDIAN_STATES_AND_UT } from '../data/indianStates';
import { REGIONAL_HISTORICAL_DATASETS } from '../data/forecastingData';
import { Search, Filter, ShoppingBag, MapPin, Calendar, CheckCircle2, TrendingDown, ArrowRight, ShieldCheck, Sprout, Building2, Sparkles, RefreshCw } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

interface MarketplaceViewProps {
  listings: ProduceListing[];
  onPlaceOrder: (order: MarketplaceOrder) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  onPlaceOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [buyerMode, setBuyerMode] = useState<'all' | 'bulk' | 'individual'>('all');
  const [hideSoldOut, setHideSoldOut] = useState<boolean>(true);

  // Checkout modal state
  const [selectedListingForCheckout, setSelectedListingForCheckout] = useState<ProduceListing | null>(null);

  // Filter listings
  const filteredListings = useMemo(() => {
    return (listings || []).filter((listing) => {
      if (!listing) return false;

      const isSoldOut = listing.status === 'sold_out' || (listing.quantityAvailableQuintals || 0) <= 0;
      if (hideSoldOut && isSoldOut) {
        return false;
      }

      // Search text match
      const query = (searchQuery || '').toLowerCase().trim();
      const cropName = (listing.cropName || '').toLowerCase();
      const district = (listing.location?.district || '').toLowerCase();
      const state = (listing.location?.state || '').toLowerCase();
      const farmerName = (listing.farmerName || '').toLowerCase();
      const variety = (listing.variety || '').toLowerCase();

      const matchesSearch =
        !query ||
        cropName.includes(query) ||
        district.includes(query) ||
        state.includes(query) ||
        farmerName.includes(query) ||
        variety.includes(query);

      if (!matchesSearch) return false;

      // Crop filter
      if (selectedCropFilter !== 'all') {
        const cropMatch = 
          listing.cropId === selectedCropFilter ||
          (listing.cropName && listing.cropName.toLowerCase().includes(selectedCropFilter.toLowerCase()));
        if (!cropMatch) return false;
      }

      // State filter
      if (selectedStateFilter !== 'all') {
        const stateMatch = 
          (listing.location?.state || '').toLowerCase() === selectedStateFilter.toLowerCase();
        if (!stateMatch) return false;
      }

      // Buyer mode filter (Bulk: available quantity >= 10 Quintals, Standard: min order <= 5 Quintals)
      if (buyerMode === 'bulk' && (listing.quantityAvailableQuintals || 0) < 10) {
        return false;
      }
      if (buyerMode === 'individual' && (listing.minOrderQuintals || 1) > 5) {
        return false;
      }

      return true;
    });
  }, [listings, searchQuery, selectedCropFilter, selectedStateFilter, buyerMode, hideSoldOut]);

  // Master catalog of all crops across India
  const availableCrops = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    
    // First register all datasets
    REGIONAL_HISTORICAL_DATASETS.forEach((d) => {
      map.set(d.cropId, {
        id: d.cropId,
        name: d.cropNameEn,
        count: 0
      });
    });

    // Compute live counts from listings
    (listings || []).forEach((l) => {
      if (!l?.cropId) return;
      const key = l.cropId;
      const cleanName = l.cropName ? l.cropName.split('(')[0].trim() : l.cropId;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, {
          id: key,
          name: cleanName,
          count: 1,
        });
      }
    });

    return Array.from(map.values());
  }, [listings]);

  // Active crops vs All catalog crops
  const activeCrops = useMemo(() => availableCrops.filter(c => c.count > 0), [availableCrops]);
  const otherCrops = useMemo(() => availableCrops.filter(c => c.count === 0), [availableCrops]);

  // Live active state counts
  const stateCountsMap = useMemo(() => {
    const map = new Map<string, number>();
    (listings || []).forEach((l) => {
      const stateName = l.location?.state?.trim();
      if (!stateName) return;
      map.set(stateName, (map.get(stateName) || 0) + 1);
    });
    return map;
  }, [listings]);

  // States with active listings
  const activeStatesList = useMemo(() => {
    return Array.from(stateCountsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [stateCountsMap]);

  // Selected State Details if any
  const selectedStateObj = useMemo(() => {
    if (selectedStateFilter === 'all') return null;
    return INDIAN_STATES_AND_UT.find(s => s.nameEn.toLowerCase() === selectedStateFilter.toLowerCase()) || null;
  }, [selectedStateFilter]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCropFilter !== 'all' || selectedStateFilter !== 'all' || buyerMode !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCropFilter('all');
    setSelectedStateFilter('all');
    setBuyerMode('all');
  };

  return (
    <div id="marketplace-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-stone-800">
      {/* Top Banner with Real Impact Numbers */}
      <div className="bg-stone-50 p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1B4332] text-xs font-bold font-mono mb-1">
            <span>Direct Farmgate Sourcing • All 28 States & 8 UTs Supported</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            Buyer Marketplace — Consumer & Institutional Bulk Supply
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            All prices shown are direct farmgate quotes with integrated consolidated logistics support across India.
          </p>
        </div>

        {/* Buyer View Selector (Single Unified View) */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-300 self-start md:self-auto">
          <button
            onClick={() => setBuyerMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              buyerMode === 'all'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Listings ({listings.length})
          </button>
          <button
            onClick={() => setBuyerMode('individual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              buyerMode === 'individual'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Standard (1–5 Qtl)
          </button>
          <button
            onClick={() => setBuyerMode('bulk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              buyerMode === 'bulk'
                ? 'bg-[#D4A24E] text-[#1B4332] font-black shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Bulk (≥10 Qtl)
          </button>
        </div>
      </div>

      {/* Search & Filter Controls with Clean Structure & High Legibility */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="sm:col-span-5 flex flex-col justify-center">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-stone-400" />
            <span>Search Produce / Location</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="marketplace-search-input"
              placeholder="Search by crop, variety, district (e.g. Nashik, Agra), or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#1B4332] focus:bg-white focus:outline-hidden transition-all"
            />
          </div>
        </div>

        <div className="sm:col-span-3.5 flex flex-col justify-center">
          <label htmlFor="marketplace-crop-filter" className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>Crop / Commodity</span>
          </label>
          <select
            id="marketplace-crop-filter"
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
            className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 cursor-pointer focus:ring-2 focus:ring-[#1B4332] focus:bg-white focus:outline-hidden transition-all"
          >
            <option value="all">All Crops & Commodities ({listings.length} Lots Available)</option>
            {activeCrops.length > 0 && (
              <optgroup label="── Active Harvest Lots in Stock ──">
                {activeCrops.map((c) => (
                  <option key={`active-${c.id}`} value={c.id}>
                    {c.name} ({c.count} active {c.count === 1 ? 'lot' : 'lots'})
                  </option>
                ))}
              </optgroup>
            )}
            {otherCrops.length > 0 && (
              <optgroup label="── All Regional State Commodities ──">
                {otherCrops.map((c) => (
                  <option key={`other-${c.id}`} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div className="sm:col-span-3.5 flex flex-col justify-center">
          <label htmlFor="marketplace-state-filter" className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Indian State / UT</span>
          </label>
          <select
            id="marketplace-state-filter"
            value={selectedStateFilter}
            onChange={(e) => setSelectedStateFilter(e.target.value)}
            className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 cursor-pointer focus:ring-2 focus:ring-[#1B4332] focus:bg-white focus:outline-hidden transition-all"
          >
            <option value="all">All Indian States & UTs (All 36 Regions)</option>
            {activeStatesList.length > 0 && (
              <optgroup label="── States with Live Farmgate Stock ──">
                {activeStatesList.map((s) => (
                  <option key={`live-${s.name}`} value={s.name}>
                    {s.name} ({s.count} {s.count === 1 ? 'lot' : 'lots'})
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="── All 28 States & 8 Union Territories ──">
              {INDIAN_STATES_AND_UT.map((s) => {
                const count = stateCountsMap.get(s.nameEn) || 0;
                return (
                  <option key={`all-${s.code}`} value={s.nameEn}>
                    {s.nameEn} ({s.nameHi}) {count > 0 ? `• ${count} lots` : ''}
                  </option>
                );
              })}
            </optgroup>
          </select>
        </div>

        {/* Hide Sold Out / In-Stock toggle */}
        <div className="sm:col-span-12 flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700 select-none">
            <input
              type="checkbox"
              id="hide-sold-out-checkbox"
              checked={hideSoldOut}
              onChange={(e) => setHideSoldOut(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded border-stone-300 focus:ring-emerald-600 cursor-pointer"
            />
            <span>Hide Sold-Out Lots (Show In-Stock Farmgate Produce Only)</span>
          </label>
          <span className="text-stone-400 text-[11px]">
            {listings.filter(l => l.status === 'sold_out' || l.quantityAvailableQuintals <= 0).length} lot(s) currently reserved / sold out
          </span>
        </div>
      </div>

      {/* Filter Badges & Quick Reset bar if active */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">Active filters:</span>
          {selectedCropFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-bold">
              Crop: {availableCrops.find(c => c.id === selectedCropFilter)?.name || selectedCropFilter}
              <button onClick={() => setSelectedCropFilter('all')} className="hover:text-emerald-950 cursor-pointer ml-1">✕</button>
            </span>
          )}
          {selectedStateFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md font-bold">
              State: {selectedStateFilter} {selectedStateObj ? `(${selectedStateObj.nameHi})` : ''}
              <button onClick={() => setSelectedStateFilter('all')} className="hover:text-blue-950 cursor-pointer ml-1">✕</button>
            </span>
          )}
          {buyerMode !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md font-bold">
              Mode: {buyerMode === 'bulk' ? 'Bulk (≥10 Qtl)' : 'Standard Orders'}
              <button onClick={() => setBuyerMode('all')} className="hover:text-amber-950 cursor-pointer ml-1">✕</button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 border border-stone-300 px-2.5 py-1 rounded-md font-medium">
              "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-stone-900 cursor-pointer ml-1">✕</button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-red-600 hover:text-red-700 underline cursor-pointer ml-1.5 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Produce Listings Grid with Embedded Price Comparison (Requirement 3 & 7) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>
            Showing <strong>{filteredListings.length}</strong> active farmgate produce listings
            {selectedStateFilter !== 'all' ? ` in ${selectedStateFilter}` : ''}
          </span>
          <span className="hidden sm:inline">Transparent Direct-from-Farmer Pricing • Real-time APMC Mandi Comparison</span>
        </div>

        {filteredListings.length === 0 ? (
          <div className="bg-stone-50 p-8 rounded-2xl border border-dashed border-stone-300 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#1B4332] mx-auto flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-black text-stone-800">
                {selectedStateFilter !== 'all'
                  ? `No active harvest lots listed for ${selectedStateFilter} (${selectedStateObj?.nameHi || selectedStateFilter}) yet.`
                  : 'No produce matching your criteria found.'}
              </p>
              <p className="text-xs text-stone-500 max-w-lg mx-auto">
                {selectedStateObj
                  ? `Direct farmer aggregation is operational across all ${selectedStateObj.districts.length} districts in ${selectedStateObj.nameEn}. Farmers can register their harvest immediately with 0% middleman commission.`
                  : 'Try selecting a different crop or resetting your search filters.'}
              </p>
            </div>

            {selectedStateObj && (
              <div className="p-3 bg-white rounded-xl border border-stone-200 max-w-xl mx-auto text-left text-xs space-y-1">
                <span className="font-bold text-stone-700">Supported Districts in {selectedStateObj.nameEn}:</span>
                <p className="text-stone-500 line-clamp-2">
                  {selectedStateObj.districts.slice(0, 12).join(', ')}
                  {selectedStateObj.districts.length > 12 ? `, and ${selectedStateObj.districts.length - 12} more` : ''}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B4332] text-[#D4A24E] text-xs font-bold rounded-xl shadow-xs hover:bg-[#143427] cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Show All Available Indian Produce ({listings.length} Lots)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((listing) => {
              const isSoldOut = listing.status === 'sold_out' || (listing.quantityAvailableQuintals || 0) <= 0;
              const platformPriceKg = listing.askingPricePerQuintal / 100;
              const mandiMiddlemanKg = listing.mandiMiddlemanPricePerQuintal / 100;
              const retailTraditionalKg = listing.retailConsumerPricePerQuintal / 100;
              const consumerSavingsPercent = Math.round(
                ((retailTraditionalKg - platformPriceKg) / retailTraditionalKg) * 100
              );

              return (
                <div
                  key={listing.id}
                  id={`produce-card-${listing.id}`}
                  className={`rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 group ${
                    isSoldOut
                      ? 'bg-stone-50/80 border-stone-300 opacity-75'
                      : 'bg-white border-stone-200 shadow-xs hover:border-[#1B4332]'
                  }`}
                >
                  {/* Top metadata */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        {listing.grade}
                      </span>
                      {isSoldOut ? (
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span>Sold Out / Reserved</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{listing.isFPO ? 'FPO Direct' : 'Verified Farmer'}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-stone-900 group-hover:text-[#1B4332] transition-colors">
                        {listing.cropName}
                      </h3>
                      <p className="text-xs text-stone-500">{listing.variety}</p>
                    </div>

                    {/* Location & Farmer info */}
                    <div className="text-xs text-stone-600 space-y-1 pt-1 border-t border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-medium truncate">
                          {listing.location.village}, {listing.location.district} ({listing.location.state})
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span>Farmer: <strong>{listing.farmerName}</strong></span>
                        <span>Harvest: <strong>{listing.harvestDate}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Availability */}
                  <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Available Stock</span>
                      <span className={`font-extrabold ${isSoldOut ? 'text-rose-700' : 'text-stone-800'}`}>
                        {isSoldOut ? '0 Quintals' : `${listing.quantityAvailableQuintals} Quintals`}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        {isSoldOut ? '(Stock Exhausted)' : `(${listing.quantityAvailableQuintals * 100} kg)`}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Min Order</span>
                      <span className="font-bold text-stone-700">
                        {listing.minOrderQuintals} Qtl ({listing.minOrderQuintals * 100} kg)
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">Scheduled Delivery</span>
                    </div>
                  </div>

                  {/* PRICE COMPARISON ELEMENT (Requirement 7) */}
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-mono font-bold text-[10px] uppercase text-amber-900 border-b border-amber-200 pb-1">
                      <span>Price Comparison (Direct vs Middleman)</span>
                      <span className="text-emerald-800 font-bold">-{consumerSavingsPercent}% Less</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-stone-500 block text-[11px]">Traditional Retail Price</span>
                        <span className="font-extrabold text-rose-800 text-sm line-through">
                          ₹{retailTraditionalKg.toFixed(1)}/kg
                        </span>
                        <span className="text-[10px] text-stone-400 block">(₹{listing.retailConsumerPricePerQuintal}/Qtl)</span>
                      </div>

                      <div className="text-right">
                        <span className="text-emerald-800 font-bold block text-[11px]">CropCoder Price</span>
                        <span className="font-black text-[#1B4332] text-base">
                          ₹{platformPriceKg.toFixed(1)}/kg
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold block">(₹{listing.askingPricePerQuintal}/Qtl)</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Order Button */}
                  <button
                    id={`order-btn-${listing.id}`}
                    disabled={isSoldOut}
                    onClick={() => !isSoldOut && setSelectedListingForCheckout(listing)}
                    className={`w-full py-2.5 px-4 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors ${
                      isSoldOut
                        ? 'bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300'
                        : 'bg-[#1B4332] hover:bg-[#143326] text-[#D4A24E] cursor-pointer shadow-xs'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isSoldOut ? 'Sold Out (0 Qtl Available)' : 'Place Order (Standard / Bulk)'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Direct Checkout Modal */}
      {selectedListingForCheckout && (
        <CheckoutModal
          listing={selectedListingForCheckout}
          onClose={() => setSelectedListingForCheckout(null)}
          onConfirmOrder={(order) => {
            onPlaceOrder(order);
            setSelectedListingForCheckout(null);
          }}
        />
      )}
    </div>
  );
};
