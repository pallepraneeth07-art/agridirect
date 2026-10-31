'use client';

import React, { useState, useMemo } from 'react';
import { useMarket } from '@/context/MarketContext';
import {
  Product,
  ProductCategory,
  ProductUnit,
  FulfillmentType,
  OrderStatus,
  ProductStatus,
} from '@/types/market';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Plus,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  Edit3,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  Phone,
  ArrowRight,
  Search,
} from 'lucide-react';

const PRESET_IMAGES: { label: string; url: string }[] = [
  {
    label: 'Wheat / Grains',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
  },
  {
    label: 'Cherry Tomatoes',
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
  },
  {
    label: 'Fresh Mangoes',
    url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
  },
  {
    label: 'Fresh Milk / Dairy',
    url: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&q=80&w=800',
  },
  {
    label: 'Red Chillies',
    url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=800',
  },
  {
    label: 'Bell Peppers',
    url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=800',
  },
  {
    label: 'Fresh Strawberries',
    url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800',
  },
];

export default function FarmerExperience() {
  const {
    activeFarmer,
    farmers,
    activeFarmerId,
    setActiveFarmerId,
    products,
    orders,
    addProduct,
    updateProductStock,
    toggleProductStatus,
    updateOrderStatus,
  } = useMarket();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockInputVal, setStockInputVal] = useState<number>(0);

  // New Produce Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Vegetables');
  const [pricePerUnit, setPricePerUnit] = useState<number>(50);
  const [unit, setUnit] = useState<ProductUnit>('kg');
  const [availableQuantity, setAvailableQuantity] = useState<number>(100);
  const [harvestDate, setHarvestDate] = useState('2026-10-31');
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('Both');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[1].url);
  const [description, setDescription] = useState('');
  const [organicCertified, setOrganicCertified] = useState(true);

  // Filter listings & orders for current active farmer
  const farmerProducts = useMemo(() => {
    return products.filter((p) => p.farmerId === activeFarmerId);
  }, [products, activeFarmerId]);

  const farmerOrders = useMemo(() => {
    return orders.filter((o) => o.farmerId === activeFarmerId);
  }, [orders, activeFarmerId]);

  // Metric cards calculations
  const metrics = useMemo(() => {
    const totalRev = farmerOrders
      .filter((o) => o.status === 'Completed' || o.status === 'Accepted' || o.status === 'Ready for Pickup/Delivery')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const activeListings = farmerProducts.filter((p) => p.status === 'Active').length;
    const pendingOrders = farmerOrders.filter((o) => o.status === 'Requested').length;
    const completedOrders = farmerOrders.filter((o) => o.status === 'Completed').length;

    return { totalRev, activeListings, pendingOrders, completedOrders };
  }, [farmerProducts, farmerOrders]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      farmerId: activeFarmerId,
      title,
      category,
      pricePerUnit: Number(pricePerUnit),
      unit,
      availableQuantity: Number(availableQuantity),
      initialQuantity: Number(availableQuantity),
      harvestDate,
      fulfillmentType,
      imageUrl,
      status: 'Active',
      description: description || `Fresh harvested ${title} grown sustainably at ${activeFarmer?.farmName}.`,
      organicCertified,
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const startStockEdit = (product: Product) => {
    setEditingStockId(product.id);
    setStockInputVal(product.availableQuantity);
  };

  const saveStockEdit = (productId: string) => {
    updateProductStock(productId, stockInputVal);
    setEditingStockId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Farmer Profile Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 rounded-2xl p-6 sm:p-7 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeFarmer?.avatarUrl}
            alt={activeFarmer?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {activeFarmer?.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" /> Verified Producer
              </span>
            </div>
            <p className="text-xs text-amber-200 font-medium mt-0.5">
              {activeFarmer?.farmName} • {activeFarmer?.location}
            </p>
            <p className="text-[11px] text-amber-300/80 mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3" /> {activeFarmer?.contact}
            </p>
          </div>
        </div>

        {/* Change Farmer Selector & Add Produce Trigger */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-amber-300 block">Switch Farm Account</span>
            <select
              value={activeFarmerId}
              onChange={(e) => setActiveFarmerId(e.target.value)}
              className="text-xs font-bold bg-amber-950/80 border border-amber-600/50 text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              {farmers.map((f) => (
                <option key={f.id} value={f.id} className="text-slate-900">
                  {f.name} ({f.farmName})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Produce</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Crop Revenue</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {formatCurrency(metrics.totalRev)}
            </h3>
            <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
              Direct settlement (no fees)
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Listings</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {metrics.activeListings}
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Across {farmerProducts.length} total crops
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Pending Requests</p>
            <h3 className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-2">
              {metrics.pendingOrders}
              {metrics.pendingOrders > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </h3>
            <p className="text-[10px] text-amber-600 font-medium mt-0.5">
              Awaiting farmer action
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Fulfilled Orders</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {metrics.completedOrders}
            </h3>
            <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
              Successfully completed
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Farm Inventory ({farmerProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Incoming Order Pipeline</span>
          {farmerOrders.length > 0 && (
            <span className="text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.2 rounded-full">
              {farmerOrders.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Farm Produce Inventory
              </h2>
              <p className="text-xs text-slate-500">
                Update available stock quantities instantly. Changes reflect in real time on the buyer marketplace.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List New Crop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmerProducts.map((p) => {
              const isEditing = editingStockId === p.id;
              const isOutOfStock = p.availableQuantity === 0;

              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 bg-slate-100 dark:bg-slate-800">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800">
                          {p.category}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'Active'
                              ? 'bg-emerald-600 text-white'
                              : p.status === 'Out of Stock'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {p.title}
                        </h3>
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                          {formatCurrency(p.pricePerUnit)} / {p.unit}
                        </p>
                      </div>

                      {/* Stock Quick Editor */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600 dark:text-slate-300">
                            Available Stock:
                          </span>
                          {!isEditing ? (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">
                                {p.availableQuantity} {p.unit}
                              </span>
                              <button
                                onClick={() => startStockEdit(p)}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                                title="Edit Stock"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                value={stockInputVal}
                                onChange={(e) => setStockInputVal(Number(e.target.value))}
                                className="w-16 px-1.5 py-0.5 text-xs font-bold border rounded bg-white dark:bg-slate-900 text-center"
                              />
                              <button
                                onClick={() => saveStockEdit(p.id)}
                                className="px-2 py-0.5 bg-emerald-600 text-white text-[11px] rounded font-bold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingStockId(null)}
                                className="px-1 text-[11px] text-slate-400 hover:text-slate-600"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Quick +/- buttons */}
                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px]">
                          <span className="text-slate-400 text-[10px]">Quick:</span>
                          <button
                            onClick={() => updateProductStock(p.id, p.availableQuantity + 10)}
                            className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100"
                          >
                            +10 {p.unit}
                          </button>
                          <button
                            onClick={() => updateProductStock(p.id, p.availableQuantity + 25)}
                            className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100"
                          >
                            +25
                          </button>
                          <button
                            disabled={p.availableQuantity < 10}
                            onClick={() =>
                              updateProductStock(p.id, Math.max(0, p.availableQuantity - 10))
                            }
                            className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-100 disabled:opacity-30"
                          >
                            -10
                          </button>
                        </div>
                      </div>

                      {/* Status Toggle */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-500">Marketplace Visibility:</span>
                        <button
                          onClick={() =>
                            toggleProductStatus(
                              p.id,
                              p.status === 'Active' ? 'Out of Stock' : 'Active'
                            )
                          }
                          className="flex items-center gap-1.5 font-semibold text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900"
                        >
                          {p.status === 'Active' ? (
                            <>
                              <span className="text-emerald-600 font-bold">Active</span>
                              <ToggleRight className="w-5 h-5 text-emerald-600" />
                            </>
                          ) : (
                            <>
                              <span className="text-slate-400">Inactive</span>
                              <ToggleLeft className="w-5 h-5 text-slate-400" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INCOMING ORDERS PIPELINE */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Order Fulfillment Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Advance orders through fulfillment stages: Accept ➔ Pack / Ready ➔ Handover Complete.
            </p>
          </div>

          {farmerOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <Package className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Orders for {activeFarmer?.farmName}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When buyers place orders for your produce, they will show up here immediately with live pipeline controls.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {farmerOrders.map((order) => {
                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {order.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Buyer: <span className="font-semibold text-slate-800 dark:text-slate-200">{order.buyerName}</span> ({order.buyerPhone}) • {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Total Value</span>
                        <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Ordered produce items */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Items Ordered
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.productTitle}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {item.productTitle}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {item.quantity} {item.unit} × {formatCurrency(item.pricePerUnit)}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                              {formatCurrency(item.quantity * item.pricePerUnit)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fulfillment notes */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fulfillment Preference:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {order.fulfillmentType}
                        </span>
                      </div>
                      {order.deliveryAddress && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Delivery Address:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {order.deliveryAddress}
                          </span>
                        </div>
                      )}
                      {order.pickupTimeWindow && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Pickup Window:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {order.pickupTimeWindow}
                          </span>
                        </div>
                      )}
                      {order.customerNote && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Customer Note:</span>
                          <span className="italic text-slate-700 dark:text-slate-300">
                            &quot;{order.customerNote}&quot;
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span className="text-slate-500">Simulated Payment:</span>
                        <span className="font-semibold text-emerald-600">
                          {order.paymentMethod} ({order.paymentStatus})
                        </span>
                      </div>
                    </div>

                    {/* Interactive Pipeline Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                      {order.status === 'Requested' && (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(
                                order.id,
                                'Cancelled',
                                'Farmer unavailable to fulfill'
                              )
                            }
                            className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                          >
                            Decline &amp; Restock
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Accepted')}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept Order</span>
                          </button>
                        </>
                      )}

                      {order.status === 'Accepted' && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, 'Ready for Pickup/Delivery')
                          }
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Mark Packed &amp; Ready</span>
                        </button>
                      )}

                      {order.status === 'Ready for Pickup/Delivery' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Completed')}
                          className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Handover Completed</span>
                        </button>
                      )}

                      {order.status === 'Completed' && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Fulfilled &amp; Settled
                        </span>
                      )}

                      {order.status === 'Cancelled' && (
                        <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Order Cancelled (Items Restocked)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ADD NEW PRODUCE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div
            onClick={() => setShowAddModal(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    List New Harvested Produce
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publish directly to the AgriDirect marketplace from {activeFarmer?.farmName}.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Produce Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Baby Spinach, Fresh Farm Honey"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                    >
                      <option value="Grains">Grains</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Dairy/Poultry">Dairy/Poultry</option>
                      <option value="Spices">Spices</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as ProductUnit)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="quintal">Quintal</option>
                      <option value="crate">Crate</option>
                      <option value="dozen">Dozen</option>
                      <option value="litre">Litre</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Price per {unit} (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Available Stock Quantity ({unit})
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={availableQuantity}
                      onChange={(e) => setAvailableQuantity(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Harvest Date
                    </label>
                    <input
                      type="date"
                      required
                      value={harvestDate}
                      onChange={(e) => setHarvestDate(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Fulfillment Offered
                    </label>
                    <select
                      value={fulfillmentType}
                      onChange={(e) => setFulfillmentType(e.target.value as FulfillmentType)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                    >
                      <option value="Both">Both (Pickup &amp; Delivery)</option>
                      <option value="Local Delivery">Local Delivery Only</option>
                      <option value="Farm Pickup">Farm Pickup Only</option>
                    </select>
                  </div>
                </div>

                {/* Preset Image Chooser */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Produce Image Preset or Enter Custom URL
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {PRESET_IMAGES.map((img, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setImageUrl(img.url)}
                        className={`shrink-0 p-1 rounded-xl border text-[10px] font-medium transition-all ${
                          imageUrl === img.url
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.label}
                          className="w-12 h-10 object-cover rounded-lg mb-1"
                        />
                        <span>{img.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Description &amp; Soil / Farming Notes
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe harvest method, pesticide-free practices, shelf-life..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={organicCertified}
                      onChange={(e) => setOrganicCertified(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>Organic / Chemical-free Certified</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Publish Produce
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
