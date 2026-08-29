import React, { useState, useEffect } from 'react';
import { ProduceListing, MarketplaceOrder } from './types';
import { INITIAL_PRODUCE_LISTINGS, INITIAL_MARKETPLACE_ORDERS } from './data/marketplaceData';
import { Header, ActiveTab } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { FarmerHub } from './components/FarmerHub';
import { MarketplaceView } from './components/MarketplaceView';
import { DemandForecastView } from './components/DemandForecastView';
import { LogisticsOptimizerView } from './components/LogisticsOptimizerView';
import { OrdersView } from './components/OrdersView';
import { Footer } from './components/Footer';

const ORDERS_STORAGE_KEY = 'kd_orders_v7';
const LISTINGS_STORAGE_KEY = 'kd_listings_v7';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Listings state (stored in localStorage with automatic hydration of all state agricultural listings)
  const [listings, setListings] = useState<ProduceListing[]>(() => {
    try {
      const saved = localStorage.getItem(LISTINGS_STORAGE_KEY) || localStorage.getItem('kd_listings_v5') || localStorage.getItem('kd_listings_v2') || localStorage.getItem('kd_listings');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Identify any custom listings created by user
          const initialIds = new Set(INITIAL_PRODUCE_LISTINGS.map(l => l.id));
          const customListings = parsed
            .filter((p: any) => !initialIds.has(p.id))
            .map((item: any, idx: number) => ({
              id: item.id || `list-custom-${Date.now()}-${idx}`,
              farmerId: item.farmerId || 'farmer-01',
              farmerName: item.farmerName || 'Verified Farmer',
              farmerPhone: item.farmerPhone || '+91 98000 00000',
              isFPO: Boolean(item.isFPO),
              fpoName: item.fpoName,
              cropId: item.cropId || 'onion',
              cropName: item.cropName || 'Fresh Farm Produce',
              variety: item.variety || 'Standard Grade',
              grade: item.grade || 'Grade A (Premium)',
              quantityAvailableQuintals: Number(item.quantityAvailableQuintals) || 10,
              minOrderQuintals: Number(item.minOrderQuintals) || 1,
              askingPricePerQuintal: Number(item.askingPricePerQuintal) || 2000,
              mandiMiddlemanPricePerQuintal: Number(item.mandiMiddlemanPricePerQuintal) || 1300,
              retailConsumerPricePerQuintal: Number(item.retailConsumerPricePerQuintal) || 3200,
              harvestDate: item.harvestDate || new Date().toISOString().split('T')[0],
              location: {
                village: item.location?.village || 'Lasalgaon',
                district: item.location?.district || 'Nashik',
                state: item.location?.state || 'Maharashtra',
                lat: item.location?.lat || 20.1448,
                lng: item.location?.lng || 74.2255,
              },
              pickupPointName: item.pickupPointName || 'Designated Collection Center',
              createdAt: item.createdAt || new Date().toISOString(),
              status: item.status || 'active',
            }));

          return [...INITIAL_PRODUCE_LISTINGS, ...customListings];
        }
      }
    } catch {
      // ignore parse error
    }
    return INITIAL_PRODUCE_LISTINGS;
  });

  // Orders state - accurately persisted and restored without resurrected deleted/cancelled orders
  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }

      // Check legacy storage once if v7 does not exist yet
      const legacy = localStorage.getItem('kd_orders_v6') || localStorage.getItem('kd_orders_v5');
      if (legacy !== null) {
        const parsedLegacy = JSON.parse(legacy);
        if (Array.isArray(parsedLegacy)) {
          return parsedLegacy;
        }
      }
    } catch {
      // ignore parse error
    }
    return INITIAL_MARKETPLACE_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
    } catch (e) {
      console.warn('Failed to save listings to localStorage', e);
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Handler to add new produce from farmer hub
  const handleAddListing = (newListing: ProduceListing) => {
    setListings((prev) => {
      const updated = [newListing, ...prev];
      try {
        localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  // Handler when a buyer places an order
  const handlePlaceOrder = (newOrder: MarketplaceOrder) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    // Update remaining quantity in listing
    setListings((prev) => {
      const updated = prev.map((item) => {
        if (item.id === newOrder.listingId) {
          const remaining = Math.max(0, item.quantityAvailableQuintals - newOrder.quantityQuintals);
          return {
            ...item,
            quantityAvailableQuintals: remaining,
            status: remaining <= 0 ? 'sold_out' : item.status,
          };
        }
        return item;
      });
      try {
        localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    // Switch to Orders view so buyer sees real-time logistics steps & price certificate
    setActiveTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler when buyer/farmer cancels a delivery
  const handleCancelOrder = (orderId: string, reason: string, note?: string) => {
    let targetListingId: string | undefined;
    let targetQty: number = 0;

    setOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.id === orderId) {
          targetListingId = order.listingId;
          targetQty = order.quantityQuintals;
          return {
            ...order,
            status: 'cancelled' as const,
            cancelledAt: new Date().toISOString(),
            cancellationReason: reason || 'Customer requested delivery cancellation',
            cancellationNote: note,
            refundAmount: order.totalAmount,
            refundStatus: 'initiated' as const,
            logisticsStep: `Delivery Cancelled • 100% Refund (₹${order.totalAmount.toLocaleString('en-IN')}) initiated • Produce returned to farmer inventory`,
          };
        }
        return order;
      });

      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to sync cancelled order to localStorage', e);
      }
      return updated;
    });

    // Return stock back to the active produce listing
    if (targetListingId) {
      setListings((prev) => {
        const updated = prev.map((item) => {
          if (item.id === targetListingId) {
            const restoredQty = item.quantityAvailableQuintals + targetQty;
            return {
              ...item,
              quantityAvailableQuintals: restoredQty,
              status: 'active',
            };
          }
          return item;
        });
        try {
          localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn(e);
        }
        return updated;
      });
    }
  };

  // Handler to advance order status lifecycle (confirmed -> aggregated -> in_transit -> delivered)
  const handleUpdateStatus = (orderId: string, newStatus: MarketplaceOrder['status']) => {
    setOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.id === orderId) {
          let stepDescription = order.logisticsStep;
          if (newStatus === 'aggregated') {
            stepDescription = `Produce aggregated & inspected at ${order.farmerPickupLocation || 'Collection Center'} • Barcode batch assigned`;
          } else if (newStatus === 'in_transit') {
            stepDescription = `Dispatched via multi-farm TSP cold-chain vehicle • En route to ${order.deliveryAddress?.district || 'Buyer Destination'}`;
          } else if (newStatus === 'delivered') {
            stepDescription = `Successfully delivered to ${order.buyerName} • Direct farmer payout (₹${order.produceTotal.toLocaleString('en-IN')}) settled`;
          }
          return {
            ...order,
            status: newStatus,
            logisticsStep: stepDescription,
          };
        }
        return order;
      });
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  // Handler to permanently delete/dismiss an order record
  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => {
      const updated = prev.filter((order) => order.id !== orderId);
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to sync deleted order to localStorage', e);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col font-sans selection:bg-[#D4A24E] selection:text-[#1B4332]">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        ordersCount={orders.filter(o => o.status !== 'cancelled').length}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            listings={listings}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'farmer' && (
          <FarmerHub
            listings={listings}
            onAddListing={handleAddListing}
          />
        )}

        {activeTab === 'buyer' && (
          <MarketplaceView
            listings={listings}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {activeTab === 'forecast' && (
          <DemandForecastView />
        )}

        {activeTab === 'logistics' && (
          <LogisticsOptimizerView
            listings={listings}
            orders={orders}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            orders={orders}
            onCancelOrder={handleCancelOrder}
            onDeleteOrder={handleDeleteOrder}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
