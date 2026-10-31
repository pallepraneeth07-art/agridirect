'use client';

import React, { useState } from 'react';
import { MarketProvider, useMarket } from '@/context/MarketContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/buyer/CartDrawer';
import BuyerExperience from '@/components/buyer/BuyerExperience';
import FarmerExperience from '@/components/farmer/FarmerExperience';
import AdminExperience from '@/components/admin/AdminExperience';
import ToastContainer from '@/components/common/ToastContainer';
import {
  Sprout,
  ShoppingBag,
  UserCheck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

function MarketplaceApp() {
  const { role, setRole, resetAllData } = useMarket();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [buyerActiveTab, setBuyerActiveTab] = useState<'catalog' | 'orders'>('catalog');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 dark:bg-slate-950">
      {/* Global Navigation with fixed top announcement & role toolbar */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === 'buyer' && (
          <BuyerExperience
            onOpenCart={() => setIsCartOpen(true)}
            activeTab={buyerActiveTab}
            setActiveTab={setBuyerActiveTab}
          />
        )}

        {role === 'farmer' && <FarmerExperience />}

        {role === 'admin' && <AdminExperience />}
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onViewOrders={() => {
          setRole('buyer');
          setBuyerActiveTab('orders');
        }}
      />

      {/* Floating Toast Notification Stack */}
      <ToastContainer />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                AgriDirect — Direct Farmer-to-Buyer Marketplace
              </p>
              <p className="text-[11px] text-slate-400">
                Student Hackathon Prototype • Zero Middlemen • Real-Time Crop Inventory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Switch View:</span>
            <button
              onClick={() => {
                setRole('buyer');
                setBuyerActiveTab('catalog');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-emerald-600 font-semibold text-[11px] transition-colors"
            >
              Buyer Catalog
            </button>
            <button
              onClick={() => setRole('farmer')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-amber-600 font-semibold text-[11px] transition-colors"
            >
              Farmer Dashboard
            </button>
            <button
              onClick={() => setRole('admin')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-indigo-600 font-semibold text-[11px] transition-colors"
            >
              Admin Moderation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <MarketProvider>
      <MarketplaceApp />
    </MarketProvider>
  );
}
