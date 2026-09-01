import React from 'react';
import { Truck, Sprout, ShoppingCart, TrendingUp, Navigation, PackageCheck, LogOut, User } from 'lucide-react';
import { AuthUser } from '../services/authService';

export type ActiveTab = 'home' | 'farmer' | 'buyer' | 'forecast' | 'logistics' | 'orders';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  ordersCount: number;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  ordersCount,
  currentUser,
  onLogout
}) => {
  return (
    <header className="bg-[#1B4332] text-white border-b border-[#2d5f49] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform identifier */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#D4A24E] text-[#1B4332] flex items-center justify-center font-black text-xl shadow-xs">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white">KisanDirect</span>
                <span className="text-[10px] font-mono font-semibold bg-[#24543f] text-[#D4A24E] px-2 py-0.5 rounded border border-[#D4A24E]/30">
                  Direct Exchange
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Direct Farm-to-Buyer Marketplace & Logistics
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
            <button
              id="nav-home-btn"
              onClick={() => onSelectTab('home')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#285e46] text-white font-bold'
                  : 'text-emerald-100 hover:bg-[#23523d] hover:text-white'
              }`}
            >
              Overview
            </button>

            <button
              id="nav-farmer-btn"
              onClick={() => onSelectTab('farmer')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'farmer'
                  ? 'bg-[#D4A24E] text-[#1B4332] font-bold shadow-xs'
                  : 'text-emerald-100 hover:bg-[#23523d] hover:text-white'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Farmer / FPO</span>
            </button>

            <button
              id="nav-buyer-btn"
              onClick={() => onSelectTab('buyer')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'buyer'
                  ? 'bg-[#D4A24E] text-[#1B4332] font-bold shadow-xs'
                  : 'text-emerald-100 hover:bg-[#23523d] hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Buyer Marketplace</span>
            </button>

            <button
              id="nav-forecast-btn"
              onClick={() => onSelectTab('forecast')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'forecast'
                  ? 'bg-[#285e46] text-white font-bold'
                  : 'text-emerald-100 hover:bg-[#23523d] hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#D4A24E]" />
              <span>AI Demand Forecast</span>
            </button>

            <button
              id="nav-logistics-btn"
              onClick={() => onSelectTab('logistics')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'logistics'
                  ? 'bg-[#285e46] text-white font-bold'
                  : 'text-emerald-100 hover:bg-[#23523d] hover:text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-[#D4A24E]" />
              <span>AI Route Optimizer</span>
            </button>

            <button
              id="nav-orders-btn"
              onClick={() => onSelectTab('orders')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer relative ${
                activeTab === 'orders'
                  ? 'bg-[#285e46] text-white font-bold'
                  : 'text-emerald-100 hover:bg-[#23523d] hover:text-white'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Orders & Logistics</span>
              {ordersCount > 0 && (
                <span className="bg-[#D4A24E] text-[#1B4332] font-black text-[10px] px-1.5 py-0.2 rounded-full">
                  {ordersCount}
                </span>
              )}
            </button>

            {/* Supabase Realtime Live Indicator */}
            <div 
              title="Connected to Supabase PostgreSQL & Realtime Engine"
              className="ml-2 pl-2 border-l border-[#2d5f49] flex items-center gap-1.5 text-[10px] text-emerald-200 font-mono bg-[#143326]/60 px-2 py-1 rounded-md border border-emerald-500/20"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400"></span>
              <span className="hidden xl:inline text-emerald-300 font-bold">Supabase</span>
              <span className="text-[9px] text-emerald-300/80">Live</span>
            </div>

            {/* User Profile Info & Logout */}
            {currentUser && onLogout && (
              <div className="ml-2 pl-2 border-l border-[#2d5f49] flex items-center gap-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-[11px] font-bold text-white leading-tight truncate max-w-[120px]" title={currentUser.name}>
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-[#D4A24E] leading-tight font-medium truncate max-w-[120px]">
                    {currentUser.isFPO ? 'FPO Verified' : currentUser.district ? `${currentUser.district}` : 'Farmer'}
                  </span>
                </div>
                <button
                  id="header-logout-btn"
                  onClick={onLogout}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 text-rose-200 hover:text-white border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold shadow-xs"
                  title="Sign Out of KisanDirect"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#2d5f49] text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-2.5 py-1.5 rounded-md ${activeTab === 'home' ? 'bg-[#285e46] text-white font-bold' : 'text-emerald-200'}`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('farmer')}
            className={`px-2.5 py-1.5 rounded-md ${activeTab === 'farmer' ? 'bg-[#D4A24E] text-[#1B4332] font-bold' : 'text-emerald-200'}`}
          >
            Farmer
          </button>
          <button
            onClick={() => onSelectTab('buyer')}
            className={`px-2.5 py-1.5 rounded-md ${activeTab === 'buyer' ? 'bg-[#D4A24E] text-[#1B4332] font-bold' : 'text-emerald-200'}`}
          >
            Buyer
          </button>
          <button
            onClick={() => onSelectTab('forecast')}
            className={`px-2.5 py-1.5 rounded-md ${activeTab === 'forecast' ? 'bg-[#285e46] text-white font-bold' : 'text-emerald-200'}`}
          >
            Forecast
          </button>
          <button
            onClick={() => onSelectTab('logistics')}
            className={`px-2.5 py-1.5 rounded-md ${activeTab === 'logistics' ? 'bg-[#285e46] text-white font-bold' : 'text-emerald-200'}`}
          >
            Routes
          </button>
          <button
            onClick={() => onSelectTab('orders')}
            className={`px-2.5 py-1.5 rounded-md ${activeTab === 'orders' ? 'bg-[#285e46] text-white font-bold' : 'text-emerald-200'}`}
          >
            Orders ({ordersCount})
          </button>
          {currentUser && onLogout && (
            <button
              id="mobile-header-logout-btn"
              onClick={onLogout}
              className="px-2.5 py-1.5 rounded-md text-rose-300 hover:bg-rose-950/40 flex items-center gap-1 font-semibold"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
