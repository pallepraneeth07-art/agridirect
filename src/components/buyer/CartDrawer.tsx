'use client';

import React, { useState } from 'react';
import { useMarket } from '@/context/MarketContext';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOrders: () => void;
}

export default function CartDrawer({ isOpen, onClose, onViewOrders }: CartDrawerProps) {
  const {
    cart,
    cartTotal,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
  } = useMarket();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [buyerName, setBuyerName] = useState('Priya Sharma');
  const [buyerPhone, setBuyerPhone] = useState('+91 98334 11209');
  const [fulfillmentType, setFulfillmentType] = useState<'Farm Pickup' | 'Local Delivery' | 'Both'>('Local Delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Green Meadows Tower, Pune West, 411038');
  const [pickupTimeWindow, setPickupTimeWindow] = useState('Tomorrow morning (9:00 AM - 12:00 PM)');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery / Pickup' | 'Mock Online Payment'>('Mock Online Payment');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // ignore
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await placeOrder({
        buyerName,
        buyerPhone,
        fulfillmentType,
        deliveryAddress: fulfillmentType !== 'Farm Pickup' ? deliveryAddress : undefined,
        pickupTimeWindow: fulfillmentType !== 'Local Delivery' ? pickupTimeWindow : undefined,
        customerNote,
        paymentMethod,
      });

      if (success) {
        setStep('success');
        triggerConfetti();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {step === 'cart' && `Your Cart (${cartCount})`}
                {step === 'checkout' && 'Checkout & Fulfillment'}
                {step === 'success' && 'Order Placed!'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                      <ShoppingBag className="w-8 h-8 opacity-60" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Your farm basket is empty
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                        Support local verified farmers by adding fresh seasonal harvests directly to your cart.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Browse Fresh Produce
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                      <span>Items directly from growers</span>
                      <button
                        onClick={clearCart}
                        className="text-rose-600 hover:text-rose-700 text-xs font-medium hover:underline"
                      >
                        Clear All
                      </button>
                    </div>

                    {cart.map((item) => {
                      const maxStock = item.product.availableQuantity;
                      const isAtCeiling = item.quantity >= maxStock;

                      return (
                        <div
                          key={item.product.id}
                          className="flex gap-3.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-500/30 transition-all shadow-xs"
                        >
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            className="w-18 h-18 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                          />

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                {item.product.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {formatCurrency(item.product.pricePerUnit)} / {item.product.unit}
                              </p>
                            </div>

                            {/* Quantity Controls & Warning */}
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                                <button
                                  onClick={() =>
                                    updateCartQuantity(item.product.id, item.quantity - 1)
                                  }
                                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                  title="Decrease"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2.5 text-xs font-bold text-slate-900 dark:text-white">
                                  {item.quantity} {item.product.unit}
                                </span>
                                <button
                                  disabled={isAtCeiling}
                                  onClick={() =>
                                    updateCartQuantity(item.product.id, item.quantity + 1)
                                  }
                                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                                  title={isAtCeiling ? 'Reached farm stock limit' : 'Increase'}
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                  {formatCurrency(item.quantity * item.product.pricePerUnit)}
                                </span>
                                <button
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {isAtCeiling && (
                              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-1">
                                Maximum stock reached ({maxStock} {item.product.unit} available)
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {step === 'checkout' && (
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                {/* Contact Information */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Buyer Contact Info
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Fulfillment Preference */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Fulfillment Preference
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('Local Delivery')}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all ${
                        fulfillmentType === 'Local Delivery'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-xs ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Truck className="w-5 h-5 mb-1 text-emerald-600" />
                      <span>Local Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('Farm Pickup')}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold transition-all ${
                        fulfillmentType === 'Farm Pickup'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-xs ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <MapPin className="w-5 h-5 mb-1 text-emerald-600" />
                      <span>Farm Pickup</span>
                    </button>
                  </div>

                  {fulfillmentType === 'Local Delivery' ? (
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Delivery Address
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Complete street address, building, city, pin code..."
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Estimated Pickup Window
                      </label>
                      <input
                        type="text"
                        required
                        value={pickupTimeWindow}
                        onChange={(e) => setPickupTimeWindow(e.target.value)}
                        placeholder="e.g., Saturday 10:00 AM - 1:00 PM"
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Exact farm address &amp; directions provided upon farmer acceptance.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Note to Farmer (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      placeholder="e.g. Please pack in reusable jute bags if available"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Simulated Payment */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Simulated Payment Mode
                    </h4>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-medium">
                      Zero Risk Demo
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label
                      onClick={() => setPaymentMethod('Mock Online Payment')}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === 'Mock Online Payment'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Mock Instant UPI / NetBanking
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Auto-simulates instant payment confirmation.
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'Mock Online Payment'}
                        onChange={() => setPaymentMethod('Mock Online Payment')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('Cash on Delivery / Pickup')}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === 'Cash on Delivery / Pickup'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Cash on Delivery / Pickup
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Pay directly to the farmer upon receiving produce.
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'Cash on Delivery / Pickup'}
                        onChange={() => setPaymentMethod('Cash on Delivery / Pickup')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </label>
                  </div>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="py-8 px-2 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Order Request Received!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
                    Your order has been routed directly to the verified farmer(s). Crop inventory has been reserved.
                  </p>
                </div>

                <div className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Simulated Payment</span>
                    <span className="font-semibold text-emerald-600">Verified (Demo)</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Fulfillment Type</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {fulfillmentType}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Initial Status</span>
                    <span className="font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                      Requested
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col w-full gap-2">
                  <button
                    onClick={() => {
                      handleClose();
                      onViewOrders();
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Track in Buyer Orders</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          {step !== 'success' && cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal ({cartCount} units)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Direct-to-Farmer Platform Fee</span>
                  <span className="font-semibold text-emerald-600">₹0 (Hackathon Promo)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-800">
                  <span>Estimated Total</span>
                  <span className="text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Fulfillment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm &amp; Place Order</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
