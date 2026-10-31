'use client';

import React from 'react';
import { useMarket } from '@/context/MarketContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useMarket();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const iconColor =
          toast.type === 'success'
            ? 'text-emerald-500'
            : toast.type === 'error'
            ? 'text-rose-500'
            : toast.type === 'warning'
            ? 'text-amber-500'
            : 'text-emerald-600';

        const borderColor =
          toast.type === 'success'
            ? 'border-emerald-500/20'
            : toast.type === 'error'
            ? 'border-rose-500/20'
            : toast.type === 'warning'
            ? 'border-amber-500/20'
            : 'border-slate-200 dark:border-slate-800';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-xl border ${borderColor} transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
          >
            <div className={`mt-0.5 shrink-0 ${iconColor}`}>
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 -mr-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
