import React, { useState } from 'react';
import { MarketplaceOrder } from '../types';
import { 
  Package, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Ban, 
  RotateCcw, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle,
  Sparkles,
  Trash2
} from 'lucide-react';

interface OrdersViewProps {
  orders: MarketplaceOrder[];
  onCancelOrder?: (orderId: string, reason: string, note?: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, status: MarketplaceOrder['status']) => void;
}

type OrderFilter = 'all' | 'active' | 'delivered' | 'cancelled';

const CANCELLATION_REASONS = [
  'Change in dispatch schedule / delivery requirements',
  'Found immediate alternative local harvest supply',
  'Incorrect crop quantity or variety selected',
  'Delivery location / destination contact error',
  'Logistics transit timeline not aligning with facility',
  'Other commercial / personal reason'
];

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onCancelOrder, onDeleteOrder }) => {
  const [filter, setFilter] = useState<OrderFilter>('all');
  const [cancellingOrder, setCancellingOrder] = useState<MarketplaceOrder | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>(CANCELLATION_REASONS[0]);
  const [customNote, setCustomNote] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');

  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') return order.status !== 'delivered' && order.status !== 'cancelled';
    if (filter === 'delivered') return order.status === 'delivered';
    if (filter === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  const handleOpenCancelModal = (order: MarketplaceOrder) => {
    setCancellingOrder(order);
    setSelectedReason(CANCELLATION_REASONS[0]);
    setCustomNote('');
  };

  const handleConfirmCancel = () => {
    if (!cancellingOrder) return;
    const orderId = cancellingOrder.id;
    const orderNum = cancellingOrder.orderNumber;
    const refundAmt = cancellingOrder.totalAmount.toLocaleString('en-IN');
    const reasonToSave = selectedReason;
    const noteToSave = customNote.trim() || undefined;

    if (onCancelOrder) {
      onCancelOrder(orderId, reasonToSave, noteToSave);
    }
    
    setCancellingOrder(null);
    setFilter('all'); // Ensure the user immediately sees the cancelled order with refund details
    setActionSuccessMsg(`Delivery for Order ${orderNum} has been cancelled. 100% Refund of ₹${refundAmt} initiated to buyer account.`);
    setTimeout(() => {
      setActionSuccessMsg(null);
    }, 8000);
  };

  return (
    <div id="orders-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-stone-800">
      {/* Header */}
      <div className="bg-stone-50 p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            Orders & Direct Dispatches ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Track confirmed dispatches, view direct farmer-to-buyer price savings, and manage cancellations.
          </p>
        </div>

        {/* Filter Navigation Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 text-xs font-semibold">
          <button
            id="filter-all-orders-btn"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            id="filter-active-orders-btn"
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'active'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            id="filter-delivered-orders-btn"
            onClick={() => setFilter('delivered')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'delivered'
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Delivered ({deliveredOrders.length})
          </button>
          <button
            id="filter-cancelled-orders-btn"
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'cancelled'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            Cancelled ({cancelledOrders.length})
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm text-[#1B4332] font-semibold flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setActionSuccessMsg(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-stone-300 text-center space-y-3">
          <Package className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">
            {filter === 'cancelled'
              ? 'No Cancelled Orders'
              : filter === 'active'
              ? 'No Active Dispatches Right Now'
              : filter === 'delivered'
              ? 'No Delivered Orders Yet'
              : 'No Orders Found'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {filter === 'cancelled'
              ? 'All current dispatches are actively routed to their delivery destinations.'
              : 'Browse the Buyer Marketplace to place direct farm-to-buyer dispatches with transparent price comparisons.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isCancelled = order.status === 'cancelled';
            const isDelivered = order.status === 'delivered';
            const canCancel = !isCancelled && !isDelivered;

            return (
              <div
                key={order.id}
                id={`order-card-${order.id}`}
                className={`bg-white p-5 sm:p-6 rounded-2xl border ${
                  isCancelled
                    ? 'border-rose-200 bg-rose-50/10'
                    : 'border-stone-200'
                } shadow-xs space-y-4 transition-all`}
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        isCancelled
                          ? 'bg-rose-100 text-rose-700'
                          : isDelivered
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-emerald-100 text-[#1B4332]'
                      }`}
                    >
                      {isCancelled ? <Ban className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-stone-900">{order.orderNumber}</span>
                        
                        {/* Status Badge */}
                        {order.status === 'in_transit' && (
                          <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            In Transit
                          </span>
                        )}
                        {order.status === 'confirmed' && (
                          <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full">
                            Confirmed
                          </span>
                        )}
                        {order.status === 'aggregated' && (
                          <span className="text-[10px] font-bold uppercase bg-indigo-100 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded-full">
                            Aggregated at Hub
                          </span>
                        )}
                        {order.status === 'delivered' && (
                          <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-900 border border-teal-200 px-2 py-0.5 rounded-full">
                            Delivered
                          </span>
                        )}
                        {order.status === 'cancelled' && (
                          <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Delivery Cancelled
                          </span>
                        )}

                        {order.buyerType === 'bulk' && (
                          <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                            Bulk / Commercial
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center sm:items-end justify-between sm:justify-end gap-2.5 sm:flex-col text-left sm:text-right">
                    <div>
                      <span className="text-xs text-stone-400 block">
                        {isCancelled ? 'Refund Amount (100%)' : 'Total Direct Payable'}
                      </span>
                      <span className={`text-lg font-black ${isCancelled ? 'text-rose-700' : 'text-[#1B4332]'}`}>
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Prominent Cancel Delivery Action for Active Orders */}
                      {canCancel && (
                        <button
                          id={`cancel-order-btn-${order.id}`}
                          onClick={() => handleOpenCancelModal(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Cancel Delivery</span>
                        </button>
                      )}

                      {/* Remove / Delete Order button */}
                      {onDeleteOrder && (
                        <button
                          id={`remove-order-btn-${order.id}`}
                          onClick={() => {
                            onDeleteOrder(order.id);
                            setActionSuccessMsg(`Order ${order.orderNumber} has been removed.`);
                            setTimeout(() => setActionSuccessMsg(null), 4000);
                          }}
                          title="Remove this order from list"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-700 border border-stone-200 hover:border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cancelled Notice Banner if Order is Cancelled */}
                {isCancelled && (
                  <div className="p-3.5 bg-rose-50/80 rounded-xl border border-rose-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap font-bold text-rose-900">
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        Delivery Cancelled on {order.cancelledAt ? new Date(order.cancelledAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </span>
                      <span className="bg-rose-200/70 text-rose-900 px-2 py-0.5 rounded text-[11px] font-mono">
                        100% Refund ₹{(order.refundAmount || order.totalAmount).toLocaleString('en-IN')} Processed
                      </span>
                    </div>
                    {order.cancellationReason && (
                      <p className="text-rose-800 text-[11px]">
                        <strong>Reason:</strong> {order.cancellationReason}
                      </p>
                    )}
                    {order.cancellationNote && (
                      <p className="text-rose-700 text-[11px] italic">
                        <strong>Note:</strong> "{order.cancellationNote}"
                      </p>
                    )}
                    <p className="text-[10px] text-rose-600 font-medium pt-0.5">
                      ✓ Produce stock of {order.quantityQuintals} Quintals has been released back into the farmer's listing inventory.
                    </p>
                  </div>
                )}

                {/* Order Content */}
                <div className="space-y-3 text-xs">
                  {/* Produce & Order Details */}
                  <div className="space-y-2.5 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-2 gap-1 font-bold text-stone-900">
                      <span className="text-sm">{order.cropName}</span>
                      <span className="text-stone-700">{order.quantityQuintals} Quintals ({order.quantityQuintals * 100} kg)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-stone-600">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Buyer</span>
                        <span className="font-semibold text-stone-800">{order.buyerName} ({order.buyerPhone})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Farmer / FPO</span>
                        <span className="font-semibold text-stone-800">{order.farmerName} ({order.farmerPhone})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Produce Price</span>
                        <span className="font-semibold text-stone-800">₹{order.pricePerQuintal.toLocaleString('en-IN')}/qtl (₹{order.produceTotal.toLocaleString('en-IN')})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Logistics Fee</span>
                        <span className="font-semibold text-stone-800">₹{order.logisticsFee.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {order.isScheduledPickup && order.scheduledDate && (
                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-amber-800 font-bold text-xs">
                        <span>Scheduled Dispatch Date:</span>
                        <span>{order.scheduledDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Comparison Callout for this Order */}
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-amber-900 block">
                      Verified Middleman Bypass Impact:
                    </span>
                    <span className="text-stone-700">
                      Traditional Middleman Cost: <strong className="line-through">₹{order.traditionalChainCost.toLocaleString('en-IN')}</strong> • Direct Price: <strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto font-bold">
                    <span className="text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                      Buyer Saved: ₹{order.consumerSavings.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[#1B4332] bg-[#D4A24E]/20 px-2.5 py-1 rounded-md">
                      Farmer Extra: +₹{order.farmerGainVsMandi.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Dialog / Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            id="cancel-delivery-modal"
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">Cancel Delivery & Order</h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Order #{cancellingOrder.orderNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCancellingOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Order Brief */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between font-bold text-stone-800">
                <span>{cancellingOrder.cropName}</span>
                <span>{cancellingOrder.quantityQuintals} Quintals</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Farmer / FPO:</span>
                <span className="font-semibold text-stone-800">{cancellingOrder.farmerName}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Total Amount Paid:</span>
                <span className="font-bold text-[#1B4332]">₹{cancellingOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Cancellation Policy & Refund Terms */}
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-1.5 text-stone-700">
              <div className="flex items-center gap-1.5 text-[#1B4332] font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Instant Refund Guarantee</span>
              </div>
              <p className="text-[11px] text-stone-600">
                Since this dispatch has not completed final handover, <strong>100% of the payable amount (₹{cancellingOrder.totalAmount.toLocaleString('en-IN')})</strong> will be reversed immediately to your payment source.
              </p>
              <p className="text-[11px] text-stone-600">
                The reserved harvest ({cancellingOrder.quantityQuintals} Quintals) will be restored to the farmer's listing.
              </p>
            </div>

            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                Please select reason for cancellation:
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {CANCELLATION_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      selectedReason === reason
                        ? 'border-[#1B4332] bg-emerald-50/40 text-stone-900 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="mt-0.5 text-[#1B4332] focus:ring-[#1B4332]"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional Note */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                Additional Comments / Feedback (Optional):
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Let the farmer or logistics partner know any specific feedback..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button
                id="cancel-modal-keep-btn"
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Keep Delivery Active
              </button>

              <button
                id="cancel-modal-confirm-btn"
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Confirm Delivery Cancellation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
