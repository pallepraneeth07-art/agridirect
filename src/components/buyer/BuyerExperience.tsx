'use client';

import React, { useState, useMemo } from 'react';
import { useMarket } from '@/context/MarketContext';
import { Product, ProductCategory, FulfillmentType, Farmer } from '@/types/market';
import { formatCurrency, formatDate } from '@/lib/utils';
import FarmerModal from '@/components/common/FarmerModal';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Star,
  Package,
  Layers,
  Calendar,
  XCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface BuyerExperienceProps {
  onOpenCart: () => void;
  activeTab: 'catalog' | 'orders';
  setActiveTab: (tab: 'catalog' | 'orders') => void;
}

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Grains',
  'Vegetables',
  'Fruits',
  'Dairy/Poultry',
  'Spices',
];

const FULFILLMENT_OPTIONS: ('All' | FulfillmentType)[] = [
  'All',
  'Farm Pickup',
  'Local Delivery',
  'Both',
];

export default function BuyerExperience({
  onOpenCart,
  activeTab,
  setActiveTab,
}: BuyerExperienceProps) {
  const {
    products,
    farmers,
    orders,
    cart,
    addToCart,
    cancelOrderByBuyer,
  } = useMarket();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [selectedFulfillment, setSelectedFulfillment] = useState<'All' | FulfillmentType>('All');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'freshness'>('featured');
  const [organicOnly, setOrganicOnly] = useState(false);

  // Farmer modal state
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  // Quantity input state per product
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});

  const handleQuantityChange = (productId: string, val: number, max: number) => {
    const safeVal = Math.max(1, Math.min(val, max));
    setQuantities((prev) => ({ ...prev, [productId]: safeVal }));
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Only active or out of stock items shown to buyers (never suspended or unapproved)
        if (p.status === 'Suspended' || p.status === 'Pending Moderation') return false;

        // Search match
        const query = searchQuery.toLowerCase().trim();
        const farmer = farmers.find((f) => f.id === p.farmerId);
        const matchesQuery =
          !query ||
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (farmer && farmer.name.toLowerCase().includes(query)) ||
          (farmer && farmer.farmName.toLowerCase().includes(query));

        // Category match
        const matchesCategory =
          selectedCategory === 'All' || p.category === selectedCategory;

        // Fulfillment match
        const matchesFulfillment =
          selectedFulfillment === 'All' ||
          p.fulfillmentType === selectedFulfillment ||
          p.fulfillmentType === 'Both';

        // Price match
        const matchesPrice = p.pricePerUnit <= maxPrice;

        // Organic filter
        const matchesOrganic = !organicOnly || !!p.organicCertified;

        return matchesQuery && matchesCategory && matchesFulfillment && matchesPrice && matchesOrganic;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.pricePerUnit - b.pricePerUnit;
        if (sortBy === 'price-high') return b.pricePerUnit - a.pricePerUnit;
        if (sortBy === 'freshness') {
          return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
        }
        return 0; // featured/default
      });
  }, [products, farmers, searchQuery, selectedCategory, selectedFulfillment, maxPrice, sortBy, organicOnly]);

  const openFarmerDetails = (farmerId: string) => {
    const f = farmers.find((item) => item.id === farmerId);
    if (f) setSelectedFarmer(f);
  };

  const farmerSpecificProducts = useMemo(() => {
    if (!selectedFarmer) return [];
    return products.filter((p) => p.farmerId === selectedFarmer.id && p.status === 'Active');
  }, [selectedFarmer, products]);

  // Buyer's orders
  const buyerOrders = orders; // Current prototype represents active buyer perspective

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Marketplace Catalog</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {filteredProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders</span>
            {buyerOrders.length > 0 && (
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded-full">
                {buyerOrders.length}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={onOpenCart}
          className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          <span>View Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CATALOG VIEW */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Hero Banner for Buyer */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>100% Farm-Gate Transparency &amp; Real-Time Inventory</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                Fresh Harvests Directly From Local Cultivators
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Connect directly with 5 verified regional growers. Zero middleman markup, real-time inventory validation, and flexible farm pickup or delivery.
              </p>
            </div>

            {/* Background organic design element */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
              <Package className="w-96 h-96 text-white" />
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            {/* Search Input & Sort Selector */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search organic wheat, mangoes, farm eggs, or farmer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="featured">Featured &amp; Recommended</option>
                  <option value="freshness">Harvest Freshness (Newest)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-slate-500 font-semibold mr-1 shrink-0">Category:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Secondary Controls: Price Slider, Fulfillment, Organic Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              {/* Price Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium text-slate-600 dark:text-slate-300">
                  <span>Price Ceiling:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    Up to {formatCurrency(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Fulfillment Type */}
              <div className="space-y-1.5">
                <span className="block font-medium text-slate-600 dark:text-slate-300">
                  Fulfillment Type:
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  {FULFILLMENT_OPTIONS.map((fOpt) => (
                    <button
                      key={fOpt}
                      onClick={() => setSelectedFulfillment(fOpt)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        selectedFulfillment === fOpt
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-900 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {fOpt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Organic Checkbox */}
              <div className="flex items-center md:justify-end">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={organicOnly}
                    onChange={(e) => setOrganicOnly(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Organic Certified Only
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Produce Matches Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try widening your price range, clearing the search query, or selecting another category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedFulfillment('All');
                  setMaxPrice(5000);
                  setOrganicOnly(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const farmer = farmers.find((f) => f.id === product.farmerId);
                const isSoldOut = product.availableQuantity <= 0 || product.status === 'Out of Stock';
                const isLowStock = product.availableQuantity > 0 && product.availableQuantity <= 10;
                const requestedQty = quantities[product.id] || 1;

                // Check how many of this item is currently in cart
                const existingCartItem = cart.find((i) => i.product.id === product.id);
                const inCartQty = existingCartItem ? existingCartItem.quantity : 0;
                const remainingOrderable = Math.max(0, product.availableQuantity - inCartQty);

                return (
                  <div
                    key={product.id}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Frame with Badges */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 shadow-sm backdrop-blur-xs">
                            {product.category}
                          </span>

                          {product.organicCertified && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> Organic
                            </span>
                          )}
                        </div>

                        {/* Bottom Image Overlay: Harvest Date & Fulfillment */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                            <Calendar className="w-3 h-3 text-emerald-400" />
                            Harvest: {formatDate(product.harvestDate)}
                          </span>

                          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                            <Truck className="w-3 h-3 text-amber-300" />
                            {product.fulfillmentType}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 space-y-3">
                        {/* Farmer & Location row (Clickable to open Farmer profile) */}
                        <button
                          onClick={() => openFarmerDetails(product.farmerId)}
                          className="text-left w-full group/farmer flex items-center justify-between text-xs text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover/farmer:text-emerald-600 transition-colors truncate">
                              {farmer ? farmer.farmName : 'Local Farm'}
                            </span>
                            {farmer?.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          {farmer && (
                            <div className="flex items-center gap-1 text-[11px] text-amber-600 shrink-0 font-bold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{farmer.rating}</span>
                            </div>
                          )}
                        </button>

                        {/* Title & Description */}
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                            {product.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Pricing & Stock Status */}
                        <div className="flex items-baseline justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-lg font-black text-slate-900 dark:text-white">
                              {formatCurrency(product.pricePerUnit)}
                            </span>
                            <span className="text-xs text-slate-500 ml-1">
                              / {product.unit}
                            </span>
                          </div>

                          <div>
                            {isSoldOut ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                Sold Out
                              </span>
                            ) : isLowStock ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                Only {product.availableQuantity} {product.unit} left
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                In Stock ({product.availableQuantity} {product.unit})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions: Quantity Selector & Add to Cart */}
                    <div className="p-4 pt-0">
                      {isSoldOut ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Currently Out of Stock</span>
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    requestedQty - 1,
                                    product.availableQuantity
                                  )
                                }
                                className="px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-slate-900 dark:text-white min-w-[28px] text-center">
                                {requestedQty}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    requestedQty + 1,
                                    product.availableQuantity
                                  )
                                }
                                disabled={requestedQty >= product.availableQuantity}
                                className="px-2.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              onClick={() => {
                                const ok = addToCart(product.id, requestedQty);
                                if (ok) {
                                  // reset selector back to 1
                                  setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
                                }
                              }}
                              className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Basket</span>
                            </button>
                          </div>

                          {inCartQty > 0 && (
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium text-center">
                              ✓ {inCartQty} {product.unit} already in your cart
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ORDERS VIEW */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                My Produce Order History
              </h2>
              <p className="text-xs text-slate-500">
                Track your live harvest requests, pickup confirmations, and delivery status.
              </p>
            </div>
          </div>

          {buyerOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <Package className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Orders Placed Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Discover seasonal fresh crops in our marketplace and place your first direct-from-farm order!
              </p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {buyerOrders.map((order) => {
                const isRequested = order.status === 'Requested';
                const isCompleted = order.status === 'Completed';
                const isCancelled = order.status === 'Cancelled';
                const isReady = order.status === 'Ready for Pickup/Delivery';
                const isAccepted = order.status === 'Accepted';

                const statusColor =
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                    : isReady
                    ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                    : isAccepted
                    ? 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300'
                    : isRequested
                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300';

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-all hover:border-emerald-500/30"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {order.id}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Farmer: <span className="font-semibold text-slate-700 dark:text-slate-300">{order.farmerName}</span> • Ordered on {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Order Amount</p>
                          <p className="text-base font-black text-emerald-700 dark:text-emerald-400">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>

                        {/* Buyer Cancel Button (Only if status is still Requested) */}
                        {isRequested && (
                          <button
                            onClick={() => cancelOrderByBuyer(order.id)}
                            className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold transition-all cursor-pointer"
                            title="Cancel order and immediately restock produce to farmer inventory"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Pipeline Visualization */}
                    {!isCancelled ? (
                      <div className="py-2">
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                          <div
                            className={`p-2 rounded-lg ${
                              isRequested || isAccepted || isReady || isCompleted
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-50 text-slate-400'
                            }`}
                          >
                            1. Requested
                          </div>
                          <div
                            className={`p-2 rounded-lg ${
                              isAccepted || isReady || isCompleted
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-50 text-slate-400'
                            }`}
                          >
                            2. Farmer Accepted
                          </div>
                          <div
                            className={`p-2 rounded-lg ${
                              isReady || isCompleted
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-50 text-slate-400'
                            }`}
                          >
                            3. Ready for Handover
                          </div>
                          <div
                            className={`p-2 rounded-lg ${
                              isCompleted
                                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                                : 'bg-slate-50 text-slate-400'
                            }`}
                          >
                            4. Completed
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Order was cancelled. All crop quantities were returned to available farm stock.</span>
                      </div>
                    )}

                    {/* Items List */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Purchased Produce Items
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.productTitle}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
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

                    {/* Fulfillment & Payment Meta Footer */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="font-semibold block text-slate-800 dark:text-slate-200">
                          Fulfillment: {order.fulfillmentType}
                        </span>
                        <span className="text-[11px]">
                          {order.deliveryAddress || order.pickupTimeWindow || 'Direct coordination'}
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold block text-slate-800 dark:text-slate-200">
                          Payment Method:
                        </span>
                        <span className="text-[11px]">
                          {order.paymentMethod} ({order.paymentStatus})
                        </span>
                      </div>

                      {order.customerNote && (
                        <div>
                          <span className="font-semibold block text-slate-800 dark:text-slate-200">
                            Customer Note:
                          </span>
                          <span className="text-[11px] italic">
                            &quot;{order.customerNote}&quot;
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Farmer Profile Modal */}
      <FarmerModal
        farmer={selectedFarmer}
        farmerProducts={farmerSpecificProducts}
        isOpen={!!selectedFarmer}
        onClose={() => setSelectedFarmer(null)}
        onAddToCart={(pId) => {
          addToCart(pId, 1);
        }}
      />
    </div>
  );
}
