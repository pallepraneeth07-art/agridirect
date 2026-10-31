'use client';

import React, { useState, useMemo } from 'react';
import { useMarket } from '@/context/MarketContext';
import { ProductStatus } from '@/types/market';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Search,
  Filter,
  Activity,
  Package,
  Users,
  Coins,
  RefreshCw,
  ExternalLink,
  Clock,
  RotateCcw,
} from 'lucide-react';

export default function AdminExperience() {
  const {
    products,
    farmers,
    orders,
    auditLogs,
    moderateProduct,
    resetAllData,
  } = useMarket();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProductStatus>('All');
  const [activeTab, setActiveTab] = useState<'listings' | 'audit'>('listings');

  // Filter listings
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const farmer = farmers.find((f) => f.id === p.farmerId);
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (farmer && farmer.name.toLowerCase().includes(q)) ||
        (farmer && farmer.farmName.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [products, farmers, searchQuery, statusFilter]);

  // Overall GMV & stats
  const stats = useMemo(() => {
    const totalGmv = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const suspendedCount = products.filter((p) => p.status === 'Suspended').length;
    const pendingCount = products.filter((p) => p.status === 'Pending Moderation').length;

    return {
      totalGmv,
      totalListings: products.length,
      farmersCount: farmers.length,
      totalOrders: orders.length,
      suspendedCount,
      pendingCount,
    };
  }, [orders, products, farmers]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-6 sm:p-7 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Marketplace Trust &amp; Moderation Center
            </h1>
          </div>
          <p className="text-xs text-indigo-200 mt-1 max-w-xl">
            Audit produce quality standards, moderate community farmer listings, resolve disputes, and monitor end-to-end platform transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Operational 100%
          </span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Platform GMV</span>
            <Coins className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(stats.totalGmv)}
          </h3>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
            Across {stats.totalOrders} total buyer orders
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Produce Catalog</span>
            <Package className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.totalListings}
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {stats.suspendedCount} suspended, {stats.pendingCount} pending
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Verified Farmers</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.farmersCount}
          </h3>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
            100% KYC &amp; farm-site verified
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Audit Log Events</span>
            <Activity className="w-4 h-4 text-teal-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {auditLogs.length}
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Immutable platform action ledger
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'listings'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Produce Listings Moderation ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Platform Audit Log Feed ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: LISTINGS MODERATION TABLE */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search listing title, category or grower..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                Status:
              </span>
              {(['All', 'Active', 'Out of Stock', 'Suspended', 'Pending Moderation'] as const).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      statusFilter === st
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Produce Details</th>
                    <th className="py-3 px-4">Farmer / Farmstead</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price &amp; Unit</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderator Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProducts.map((p) => {
                    const farmer = farmers.find((f) => f.id === p.farmerId);
                    const isSuspended = p.status === 'Suspended';
                    const isPending = p.status === 'Pending Moderation';

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {p.title}
                              </p>
                              <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {farmer ? farmer.name : 'Unknown'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {farmer?.farmName}
                          </p>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {p.category}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {formatCurrency(p.pricePerUnit)} / {p.unit}
                        </td>

                        <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                          {p.availableQuantity} {p.unit}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : p.status === 'Out of Stock'
                                ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                : p.status === 'Suspended'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <button
                                onClick={() => moderateProduct(p.id, 'Approve')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                                title="Approve produce for public catalog"
                              >
                                Approve
                              </button>
                            )}

                            {isSuspended ? (
                              <button
                                onClick={() => moderateProduct(p.id, 'Restore')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                                title="Restore produce to active marketplace"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => moderateProduct(p.id, 'Flag/Suspend')}
                                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-lg text-[11px] font-semibold cursor-pointer"
                                title="Temporarily hide or suspend listing"
                              >
                                Flag / Suspend
                              </button>
                            )}

                            <button
                              onClick={() => moderateProduct(p.id, 'Delete Duplicate')}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                              title="Delete Duplicate Listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOG FEED */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Platform Action Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Chronological log capturing every order submission, status transition, inventory tweak, and moderator decision.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {auditLogs.length} Events Logged
            </span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => {
              const typeColor =
                log.type === 'order'
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : log.type === 'inventory'
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  : log.type === 'moderation'
                  ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                  : 'bg-slate-500/10 text-slate-600 border-slate-500/20';

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 text-xs"
                >
                  <div className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase shrink-0 mt-0.5 ${typeColor}`}>
                    {log.type}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {log.action}
                        <span className="font-normal text-slate-500 ml-1.5">
                          by <span className="font-semibold text-slate-700 dark:text-slate-300">{log.actorName}</span> ({log.actorRole})
                        </span>
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(log.timestamp)}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {log.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
