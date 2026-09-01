import React, { useState, useId, useMemo } from 'react';
import { ProduceListing, MarketplaceOrder } from '../types';
import { X, MapPin, Truck, ShieldCheck, CheckCircle2, Calendar, TrendingDown, DollarSign } from 'lucide-react';
import { INDIAN_STATES_AND_UT } from '../data/indianStates';

interface CheckoutModalProps {
  listing: ProduceListing;
  onClose: () => void;
  onConfirmOrder: (order: MarketplaceOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  listing,
  onClose,
  onConfirmOrder,
}) => {
  const modalTitleId = useId();

  const availableStock = Math.max(0, listing.quantityAvailableQuintals || 0);
  const isSoldOut = listing.status === 'sold_out' || availableStock <= 0;
  const initialQty = isSoldOut ? 0 : Math.max(1, Math.min(listing.minOrderQuintals || 1, availableStock));

  // Order configuration
  const [quantity, setQuantity] = useState<number>(initialQty);
  const [buyerName, setBuyerName] = useState<string>('Aarav Sharma (FreshMart)');
  const [buyerPhone, setBuyerPhone] = useState<string>('+91 98110 44556');
  const [district, setDistrict] = useState<string>('Pune');
  const [state, setState] = useState<string>('Maharashtra');
  const [addressLine, setAddressLine] = useState<string>('Shop 12, Commercial Market Hub');
  const [pincode, setPincode] = useState<string>('411038');
  const [isScheduledPickup, setIsScheduledPickup] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Financial Calculations
  const produceTotal = quantity * listing.askingPricePerQuintal;
  // Consolidated logistics fee (~₹120 base + ₹50 per quintal)
  const logisticsFee = Math.round(120 + quantity * 45);
  const totalAmount = produceTotal + logisticsFee;

  // Middleman comparison
  const traditionalChainCost = quantity * listing.retailConsumerPricePerQuintal;
  const consumerSavings = Math.max(0, traditionalChainCost - totalAmount);

  // Farmer payout gain
  const farmerEarnings = produceTotal;
  const mandiEquivalentEarnings = quantity * listing.mandiMiddlemanPricePerQuintal;
  const farmerGainVsMandi = farmerEarnings - mandiEquivalentEarnings;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSoldOut) {
      setErrorMessage('This harvest lot is sold out.');
      return;
    }

    if (quantity <= 0 || quantity > availableStock) {
      setErrorMessage(`Please select a valid quantity between 1 and ${availableStock} Quintals.`);
      return;
    }

    const newOrder: MarketplaceOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `KD-2026-${Math.floor(Math.random() * 90000) + 10000}`,
      listingId: listing.id,
      cropName: listing.cropName,
      farmerName: listing.farmerName,
      farmerPhone: listing.farmerPhone,
      farmerPickupLocation: listing.pickupPointName,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      buyerType: quantity >= 10 ? 'bulk' : 'individual',
      deliveryAddress: {
        addressLine: addressLine.trim(),
        district: district.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      },
      quantityQuintals: Number(quantity),
      pricePerQuintal: listing.askingPricePerQuintal,
      produceTotal,
      logisticsFee,
      totalAmount,
      traditionalChainCost,
      consumerSavings,
      farmerEarnings,
      farmerGainVsMandi,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDeliveryDays: 2,
      logisticsStep: `Assigned collection at ${listing.pickupPointName} • Scheduled dispatch to ${district}`,
      isScheduledPickup,
      scheduledDate: isScheduledPickup ? scheduledDate : undefined,
    };

    onConfirmOrder(newOrder);
  };

  return (
    <div 
      id="checkout-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
    >
      <div 
        id="checkout-modal-card"
        className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-300 text-stone-800"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1B4332] text-white p-4 sm:p-5 flex items-center justify-between z-10 border-b border-[#D4A24E]/30">
          <div>
            <h2 id={modalTitleId} className="text-base sm:text-lg font-black text-white">
              Direct Purchase & Logistics Confirmation
            </h2>
            <p className="text-xs text-emerald-200">
              Direct Farmer Contract • 0% Middleman Deduction • Guaranteed Collection
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="p-5 space-y-5 text-xs">
          {/* Produce Summary */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-stone-900">{listing.cropName}</span>
              <span className="font-black text-[#1B4332] text-sm">₹{listing.askingPricePerQuintal} / Quintal</span>
            </div>
            <p className="text-stone-500 text-[11px]">
              Farmer: {listing.farmerName} • Location: {listing.location.district} ({listing.location.state})
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-700">Order Quantity (Quintals) *</label>
              <span className="text-stone-500 text-[11px]">
                Available: {listing.quantityAvailableQuintals} Qtl ({listing.quantityAvailableQuintals * 100} kg)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={listing.minOrderQuintals}
                max={listing.quantityAvailableQuintals}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-32 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-black text-stone-900 text-sm focus:ring-2 focus:ring-[#1B4332] focus:outline-hidden"
                required
              />
              <span className="text-stone-600 font-medium">
                = <strong>{quantity * 100} Kilograms</strong> (
                {quantity >= 10 ? 'Bulk Logistics Tier' : 'Standard Consumer Tier'})
              </span>
            </div>
          </div>

          {/* Scheduled Logistics Option (For Bulk Buyers) */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
              <input
                type="checkbox"
                checked={isScheduledPickup}
                onChange={(e) => setIsScheduledPickup(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span>Enable Scheduled Pickup / Staggered Delivery Dispatch</span>
            </label>
            {isScheduledPickup && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-stone-500">Target Dispatch Date:</span>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="p-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                  required
                />
              </div>
            )}
          </div>

          {/* Buyer Details */}
          <div className="space-y-3">
            <h3 className="font-extrabold uppercase tracking-wider text-stone-700 text-[11px]">
              Buyer Contact & Delivery Point
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Buyer Name / Enterprise *</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Contact Phone *</label>
                <input
                  type="text"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-stone-600 mb-1 font-semibold">Street / Market Address *</label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Pincode *</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-stone-600 mb-1 font-semibold">State / UT *</label>
                <select
                  value={state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setState(newState);
                    const stateObj = INDIAN_STATES_AND_UT.find(
                      (s) => s.nameEn === newState || s.nameHi === newState || s.code === newState
                    );
                    if (stateObj && stateObj.districts.length > 0 && !stateObj.districts.includes(district)) {
                      setDistrict(stateObj.districts[0]);
                    }
                  }}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  required
                >
                  <optgroup label="States (28)">
                    {INDIAN_STATES_AND_UT.filter((s) => !s.nameEn.includes('(UT)') && !s.nameEn.includes('(NCT)')).map((st) => (
                      <option key={st.code} value={st.nameEn}>
                        {st.nameEn}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Union Territories (8)">
                    {INDIAN_STATES_AND_UT.filter((s) => s.nameEn.includes('(UT)') || s.nameEn.includes('(NCT)')).map((st) => (
                      <option key={st.code} value={st.nameEn}>
                        {st.nameEn}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Destination District *</label>
                <input
                  type="text"
                  list="checkout-district-options"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg"
                  required
                />
                <datalist id="checkout-district-options">
                  {(INDIAN_STATES_AND_UT.find(s => s.nameEn === state || s.code === state)?.districts || []).map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Logistics Step Preview (Requirement #2) */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <h4 className="font-extrabold text-[#1B4332] text-xs flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>Assigned Logistics Support & Route Points</span>
            </h4>
            <div className="space-y-1 text-[11px] text-stone-700">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Pickup Point (Farmer):</strong> {listing.pickupPointName}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4A24E] shrink-0 mt-0.5" />
                <span>
                  <strong>Delivery Point (Buyer):</strong> {addressLine}, {district} ({state})
                </span>
              </div>
              <p className="text-[10px] text-emerald-800 font-semibold pt-1">
                ✓ Automated collection scheduled • Aggregated with neighboring farms for 55% freight savings
              </p>
            </div>
          </div>

          {/* Real-time Transparent Price Comparison (Requirement #7) */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-2">
            <div className="flex items-center justify-between font-bold text-amber-900 border-b border-amber-200 pb-1">
              <span>Financial Comparison (You vs Traditional Chain)</span>
              <span className="text-emerald-800 font-black">
                Save ₹{consumerSavings.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-1 text-stone-700">
              <div className="flex justify-between">
                <span>Traditional Middleman Retail Total ({quantity * 100} kg):</span>
                <span className="line-through text-stone-500 font-semibold">₹{traditionalChainCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Direct Produce Cost ({quantity} Qtl @ ₹{listing.askingPricePerQuintal}):</span>
                <span>₹{produceTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Consolidated Logistics & Handover Fee:</span>
                <span>₹{logisticsFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-black text-stone-900 pt-1 border-t border-amber-200 text-sm">
                <span>Total Payable on KisanDirect:</span>
                <span className="text-[#1B4332]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-2 bg-white rounded-lg border border-amber-200 text-[10px] text-emerald-800 font-bold flex items-center justify-between">
              <span>Farmer Extra Earning vs Local Mandi:</span>
              <span>+₹{farmerGainVsMandi.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-order-btn"
              disabled={isSoldOut}
              className={`px-6 py-2.5 font-black rounded-xl shadow-md transition-colors flex items-center gap-1.5 ${
                isSoldOut
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300'
                  : 'bg-[#1B4332] hover:bg-[#143326] text-[#D4A24E] cursor-pointer'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSoldOut ? 'Sold Out' : 'Confirm & Place Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
