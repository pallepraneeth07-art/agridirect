'use client';

import React, { useState } from 'react';
import { useMarket } from '@/context/MarketContext';
import {
  Sprout,
  ShoppingBag,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  ShoppingCart,
  ChevronDown,
  Sparkles,
  Info,
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
}

export default function Navbar({ onOpenCart }: NavbarProps) {
  const {
    role,
    setRole,
    farmers,
    activeFarmerId,
    setActiveFarmerId,
    activeFarmer,
    cartCount,
    resetAllData,
  } = useMarket();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-emerald-900/10 dark:border-emerald-500/10 shadow-sm transition-all">
      {/* Hackathon Prototype Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white text-xs font-medium py-1.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-semibold tracking-wide uppercase text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
              Hackathon Prototype
            </span>
            <span className="text-emerald-100 hidden sm:inline">
              Simulated payments &amp; demo fulfillment active. Switch roles anytime to test all workflows.
            </span>
          </div>

          <div className="flex items-center gap-3">
            {showResetConfirm ? (
              <div className="flex items-center gap-1.5 bg-rose-950/70 border border-rose-300/40 px-2 py-0.5 rounded text-[11px] text-white animate-in fade-in">
                <span>Reset all seed data?</span>
                <button
                  onClick={() => {
                    resetAllData();
                    setShowResetConfirm(false);
                  }}
                  className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 rounded font-semibold text-[10px]"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-1 py-0.5 hover:underline text-[10px] text-rose-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                title="Reset marketplace back to original 5 farmers & 15 products"
                className="flex items-center gap-1 text-[11px] font-medium text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 transition-colors px-2.5 py-0.5 rounded-md"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Agri<span className="text-emerald-600 dark:text-emerald-400">Direct</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <Sparkles className="w-2.5 h-2.5" /> Direct Soil to Table
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-0.5">
                Zero Middlemen Agricultural Marketplace
              </p>
            </div>
          </div>

          {/* Central Role Simulation Switcher Toolbar */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-inner">
            <button
              onClick={() => setRole('buyer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'buyer'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buyer Mode</span>
              {role === 'buyer' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1"></span>
              )}
            </button>

            <button
              onClick={() => setRole('farmer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'farmer'
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Farmer Mode</span>
              {role === 'farmer' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-1"></span>
              )}
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'admin'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Mode</span>
              {role === 'admin' && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ml-1"></span>
              )}
            </button>
          </div>

          {/* Right Section: Persona Context & Cart Trigger */}
          <div className="flex items-center gap-3">
            {/* If in Farmer role, allow quick switching between farmers */}
            {role === 'farmer' && (
              <div className="relative flex items-center">
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden xl:inline mr-2">
                  Acting As:
                </label>
                <div className="relative">
                  <select
                    value={activeFarmerId}
                    onChange={(e) => setActiveFarmerId(e.target.value)}
                    className="text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 py-1.5 pl-2.5 pr-7 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {farmers.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.farmName})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 text-amber-700 dark:text-amber-300 pointer-events-none" />
                </div>
              </div>
            )}

            {/* If in Buyer role, show active persona indicator */}
            {role === 'buyer' && (
              <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                  Priya Sharma <span className="font-normal text-emerald-700 dark:text-emerald-400">(Buyer)</span>
                </span>
              </div>
            )}

            {/* If in Admin role */}
            {role === 'admin' && (
              <div className="hidden sm:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                  Moderator <span className="font-normal text-indigo-700 dark:text-indigo-400">(All Access)</span>
                </span>
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer group"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white text-emerald-700 font-bold text-[11px] shadow-sm animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Role Switcher Toolbar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 -mx-4 px-4">
          <button
            onClick={() => setRole('buyer')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              role === 'buyer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            Buyer
          </button>
          <button
            onClick={() => setRole('farmer')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              role === 'farmer'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            Farmer
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              role === 'admin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}
