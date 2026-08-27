import React from 'react';
import { MarketplaceOrder } from '../types';
import { Package, MapPin, Truck, CheckCircle2, Clock, Calendar, ArrowRight, DollarSign } from 'lucide-react';

interface OrdersViewProps {
  orders: MarketplaceOrder[];
  onUpdateStatus?: (orderId: string, status: MarketplaceOrder['status']) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders }) => {
  return (
    <div id="orders-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-stone-800">
      {/* Header */}
      <div className="bg-stone-50 p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1B4332] text-xs font-mono font-bold mb-1">
            <span>Requirement #2 • Integrated Logistics & Milestone Tracking</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            Orders & Direct Logistics Handover ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Real-time assigned collection points, delivery destinations, and verified price savings.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-stone-300 text-center space-y-3">
          <Package className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No Orders Placed Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Browse the Buyer Marketplace and place an order to see live logistics collection and transparent price comparisons.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              id={`order-card-${order.id}`}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1B4332] flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-stone-900">{order.orderNumber}</span>
                      <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-stone-400 block">Total Payable (Direct)</span>
                  <span className="text-lg font-black text-[#1B4332]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Order Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Left: Produce & Buyer Details */}
                <div className="space-y-2.5 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div className="flex justify-between border-b border-stone-200 pb-1.5 font-bold text-stone-900">
                    <span>{order.cropName}</span>
                    <span>{order.quantityQuintals} Quintals ({order.quantityQuintals * 100} kg)</span>
                  </div>

                  <div className="space-y-1 text-stone-600">
                    <div className="flex justify-between">
                      <span>Buyer:</span>
                      <span className="font-semibold text-stone-800">{order.buyerName} ({order.buyerPhone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Farmer / FPO:</span>
                      <span className="font-semibold text-stone-800">{order.farmerName} ({order.farmerPhone})</span>
                    </div>
                    {order.isScheduledPickup && order.scheduledDate && (
                      <div className="flex justify-between text-amber-800 font-bold">
                        <span>Scheduled Dispatch Date:</span>
                        <span>{order.scheduledDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Logistics Support Steps (Requirement #2) */}
                <div className="space-y-2.5 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                  <h4 className="font-extrabold text-[#1B4332] text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Assigned Collection & Delivery Points</span>
                  </h4>

                  <div className="space-y-2 text-[11px] text-stone-700">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">1. Pickup Point (Farmer)</span>
                      <span className="font-semibold text-stone-800">{order.farmerPickupLocation}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">2. Delivery Point (Buyer)</span>
                      <span className="font-semibold text-stone-800">
                        {order.deliveryAddress.addressLine}, {order.deliveryAddress.district} ({order.deliveryAddress.state}) - {order.deliveryAddress.pincode}
                      </span>
                    </div>

                    <div className="pt-1 text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{order.logisticsStep}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Comparison Callout for this Order (Requirement #7) */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
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
          ))}
        </div>
      )}
    </div>
  );
};
