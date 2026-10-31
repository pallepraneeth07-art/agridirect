'use client';

import React from 'react';
import { Farmer, Product } from '@/types/market';
import { formatCurrency } from '@/lib/utils';
import { X, Star, MapPin, Phone, ShieldCheck, Calendar, PackageCheck, Leaf } from 'lucide-react';

interface FarmerModalProps {
  farmer: Farmer | null;
  farmerProducts: Product[];
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
}

export default function FarmerModal({
  farmer,
  farmerProducts,
  isOpen,
  onClose,
  onAddToCart,
}: FarmerModalProps) {
  if (!isOpen || !farmer) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-slate-200 dark:border-slate-800">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 relative p-6 flex items-end">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-emerald-100 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Verified AgriDirect Partner
            </span>
          </div>

          <div className="p-6 pt-0 relative">
            {/* Avatar & Key Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
              <div className="flex items-end gap-3.5">
                <img
                  src={farmer.avatarUrl}
                  alt={farmer.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-md ring-2 ring-emerald-500/20"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {farmer.name}
                  </h3>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {farmer.farmName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  {farmer.rating}
                </span>
                <span className="text-xs text-amber-700 dark:text-amber-400">
                  ({farmer.reviewsCount} reviews)
                </span>
              </div>
            </div>

            {/* Metadata Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{farmer.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{farmer.contact}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Member since {farmer.joinedYear}</span>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                About the Farm
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {farmer.shortBio}
              </p>
            </div>

            {/* Current Active Listings */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-emerald-600" />
                  Active Produce Listings ({farmerProducts.length})
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {farmerProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-2.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-emerald-500/40 transition-all"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {p.title}
                        </p>
                        <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(p.pricePerUnit)} / {p.unit}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-slate-500">
                          {p.availableQuantity > 0 ? `${p.availableQuantity} ${p.unit} left` : 'Sold out'}
                        </span>
                        {p.availableQuantity > 0 && (
                          <button
                            onClick={() => onAddToCart(p.id)}
                            className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold transition-colors"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
