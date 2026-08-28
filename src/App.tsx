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

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Listings state (stored in localStorage with automatic hydration of all state agricultural listings)
  const [listings, setListings] = useState<ProduceListing[]>(() => {
    try {
      const saved = localStorage.getItem('kd_listings_v5') || localStorage.getItem('kd_listings_v2') || localStorage.getItem('kd_listings');
      if (saved) {
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

  // Orders state
  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => {
    try {
      const saved = localStorage.getItem('kd_orders_v5') || localStorage.getItem('kd_orders_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const initialIds = new Set(INITIAL_MARKETPLACE_ORDERS.map(o => o.id));
          const userOrders = parsed.filter((o: any) => !initialIds.has(o.id));
          return [...INITIAL_MARKETPLACE_ORDERS, ...userOrders];
        }
      }
    } catch {
      // ignore parse error
    }
    return INITIAL_MARKETPLACE_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kd_listings_v5', JSON.stringify(listings));
    } catch (e) {
      console.warn('Failed to save listings to localStorage', e);
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem('kd_orders_v5', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Handler to add new produce from farmer hub
  const handleAddListing = (newListing: ProduceListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  // Handler when a buyer places an order
  const handlePlaceOrder = (newOrder: MarketplaceOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Update remaining quantity in listing
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === newOrder.listingId) {
          const remaining = Math.max(0, item.quantityAvailableQuintals - newOrder.quantityQuintals);
          return {
            ...item,
            quantityAvailableQuintals: remaining,
            status: remaining <= 0 ? 'sold_out' : item.status,
          };
        }
        return item;
      })
    );

    // Switch to Orders view so buyer sees real-time logistics steps & price certificate
    setActiveTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        ordersCount={orders.length}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
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
          <LogisticsOptimizerView />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            orders={orders}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
