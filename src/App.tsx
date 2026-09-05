import React, { useState, useEffect, useCallback } from 'react';
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
import { FarmerAuthModal } from './components/FarmerAuthModal';
import { AuthUser, getActiveAuthSession, saveActiveAuthSession } from './services/authService';
import { 
  fetchSupabaseProduceListings, 
  createSupabaseProduceListing, 
  fetchSupabaseMarketplaceOrders, 
  createSupabaseMarketplaceOrder, 
  cancelSupabaseOrder, 
  updateSupabaseOrderStatus, 
  deleteSupabaseOrder 
} from './services/supabaseService';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

const ORDERS_STORAGE_KEY = 'kd_orders_v7';
const LISTINGS_STORAGE_KEY = 'kd_listings_v7';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return getActiveAuthSession();
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isSyncingWithDB, setIsSyncingWithDB] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot_password'>('login');

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

  // Fetch initial data from Supabase backend on startup
  useEffect(() => {
    let isMounted = true;
    async function loadBackendData() {
      if (!isSupabaseConfigured()) {
        setIsSyncingWithDB(false);
        return;
      }
      setIsSyncingWithDB(true);
      try {
        const [listingsRes, ordersRes] = await Promise.all([
          fetchSupabaseProduceListings(),
          fetchSupabaseMarketplaceOrders()
        ]);

        if (isMounted) {
          if (listingsRes.data && listingsRes.data.length > 0) {
            // Merge Supabase listings with default catalog to ensure complete state coverage
            const dbIds = new Set(listingsRes.data.map(l => l.id));
            const missingDefaults = INITIAL_PRODUCE_LISTINGS.filter(d => !dbIds.has(d.id));
            setListings([...listingsRes.data, ...missingDefaults]);
          }

          if (ordersRes.data && ordersRes.data.length > 0) {
            setOrders(ordersRes.data);
          }
        }
      } catch (err) {
        console.warn('Initial Supabase hydration notice:', err);
      } finally {
        if (isMounted) {
          setIsSyncingWithDB(false);
        }
      }
    }

    loadBackendData();

    // Setup Supabase Realtime Subscription only when a project is configured.
    if (!isSupabaseConfigured()) {
      return () => {
        isMounted = false;
      };
    }

    const channel = supabase
      .channel('cropcoder-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'produce_listings' },
        async () => {
          const res = await fetchSupabaseProduceListings();
          if (res.data && res.data.length > 0 && isMounted) {
            const dbIds = new Set(res.data.map(l => l.id));
            const missingDefaults = INITIAL_PRODUCE_LISTINGS.filter(d => !dbIds.has(d.id));
            setListings([...res.data, ...missingDefaults]);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'marketplace_orders' },
        async () => {
          const res = await fetchSupabaseMarketplaceOrders();
          if (res.data && isMounted) {
            setOrders(res.data);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

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

  // Handler to add new produce from farmer hub (with Supabase sync)
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

    // Write to Supabase produce_listings table
    createSupabaseProduceListing(newListing).catch((err) => {
      console.warn('Supabase create produce notice:', err);
    });
  };

  // Handler when a buyer places an order (with Supabase sync)
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

    // Save to Supabase marketplace_orders table
    createSupabaseMarketplaceOrder(newOrder).catch((err) => {
      console.warn('Supabase create order notice:', err);
    });

    // Switch to Orders view so buyer sees real-time logistics steps & price certificate
    setActiveTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler when buyer/farmer cancels a delivery (with Supabase sync)
  const handleCancelOrder = (orderId: string, reason: string, note?: string) => {
    let targetListingId: string | undefined;
    let targetQty: number = 0;
    let refundAmount: number = 0;

    setOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.id === orderId) {
          targetListingId = order.listingId;
          targetQty = order.quantityQuintals;
          refundAmount = order.totalAmount;
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
              status: 'active' as const,
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

    // Sync cancellation to Supabase
    cancelSupabaseOrder(orderId, reason, note, refundAmount, targetListingId, targetQty).catch((err) => {
      console.warn('Supabase cancel order notice:', err);
    });
  };

  // Handler to advance order status lifecycle (confirmed -> aggregated -> in_transit -> delivered)
  const handleUpdateStatus = (orderId: string, newStatus: MarketplaceOrder['status']) => {
    let stepDescription: string | undefined;

    setOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.id === orderId) {
          stepDescription = order.logisticsStep;
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

    // Sync status update to Supabase
    updateSupabaseOrderStatus(orderId, newStatus, stepDescription).catch((err) => {
      console.warn('Supabase update status notice:', err);
    });
  };

  // Handler to permanently delete/dismiss an order record (with Supabase sync)
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

    // Delete in Supabase
    deleteSupabaseOrder(orderId).catch((err) => {
      console.warn('Supabase delete order notice:', err);
    });
  };

  // Auth Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    saveActiveAuthSession(user);
    setCurrentUser(user);
    setAuthModalOpen(false);
  };

  const openAuth = (mode: 'login' | 'signup' | 'forgot_password' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    saveActiveAuthSession(null);
    setCurrentUser(null);
    setActiveTab('home');
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
        currentUser={currentUser}
        onLogout={handleLogout}
        onAuth={openAuth}
        isSyncingWithDB={isSyncingWithDB}
        isSupabaseConfigured={isSupabaseConfigured()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            listings={listings}
            currentUser={currentUser}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAuth={openAuth}
          />
        )}

        {activeTab === 'farmer' && (
          <FarmerHub
            listings={listings}
            onAddListing={handleAddListing}
            currentUser={currentUser}
            onLogout={handleLogout}
            onUserUpdate={(updatedUser) => {
              setCurrentUser(updatedUser);
              saveActiveAuthSession(updatedUser);
            }}
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

      {authModalOpen && (
        <FarmerAuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleLoginSuccess}
          initialMode={authModalMode}
        />
      )}
    </div>
  );
}
