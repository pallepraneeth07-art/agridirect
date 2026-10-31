'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Farmer,
  Product,
  Order,
  AuditLog,
  CartItem,
  UserRole,
  OrderStatus,
  ProductStatus,
  ToastMessage,
  PaymentMethod,
  FulfillmentType,
} from '@/types/market';
import {
  SEED_FARMERS,
  SEED_PRODUCTS,
  SEED_ORDERS,
  SEED_AUDIT_LOGS,
} from '@/data/seedData';

interface PlaceOrderParams {
  buyerName: string;
  buyerPhone: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  pickupTimeWindow?: string;
  customerNote?: string;
  paymentMethod: PaymentMethod;
}

interface MarketContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeFarmerId: string;
  setActiveFarmerId: (id: string) => void;
  activeFarmer: Farmer | undefined;
  farmers: Farmer[];
  products: Product[];
  orders: Order[];
  auditLogs: AuditLog[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  addToCart: (productId: string, quantity?: number) => boolean;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (params: PlaceOrderParams) => Promise<boolean>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, reason?: string) => void;
  cancelOrderByBuyer: (orderId: string, reason?: string) => void;
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProductStock: (productId: string, newQuantity: number) => void;
  toggleProductStatus: (productId: string, newStatus: ProductStatus) => void;
  moderateProduct: (productId: string, action: 'Approve' | 'Flag/Suspend' | 'Restore' | 'Delete Duplicate') => void;
  resetAllData: () => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const STORAGE_KEY = 'agridirect_marketplace_v1';

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [role, setRoleState] = useState<UserRole>('buyer');
  const [activeFarmerId, setActiveFarmerId] = useState<string>('farmer-1');
  const [farmers, setFarmers] = useState<Farmer[]>(SEED_FARMERS);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.farmers) setFarmers(parsed.farmers);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.cart) setCart(parsed.cart);
        if (parsed.role) setRoleState(parsed.role);
        if (parsed.activeFarmerId) setActiveFarmerId(parsed.activeFarmerId);
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          farmers,
          products,
          orders,
          auditLogs,
          cart,
          role,
          activeFarmerId,
        })
      );
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  }, [isLoaded, farmers, products, orders, auditLogs, cart, role, activeFarmerId]);

  const addToast = useCallback(
    (title: string, description?: string, type: ToastMessage['type'] = 'info') => {
      const id = 'toast_' + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addAuditLog = useCallback(
    (
      actorRole: AuditLog['actorRole'],
      actorName: string,
      action: string,
      details: string,
      type: AuditLog['type']
    ) => {
      const newLog: AuditLog = {
        id: 'log-' + Date.now().toString(),
        timestamp: new Date().toISOString(),
        actorRole,
        actorName,
        action,
        details,
        type,
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    },
    []
  );

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    addToast(
      `Switched to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} Mode`,
      `You are now viewing the marketplace as a ${newRole}.`,
      'info'
    );
  };

  const activeFarmer = useMemo(() => {
    return farmers.find((f) => f.id === activeFarmerId) || farmers[0];
  }, [farmers, activeFarmerId]);

  // Cart calculations
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity * item.product.pricePerUnit, 0);
  }, [cart]);

  // Cart management with real-time stock validation
  const addToCart = (productId: string, quantity = 1): boolean => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      addToast('Product Not Found', 'Could not locate this item in the catalog.', 'error');
      return false;
    }

    if (product.status !== 'Active') {
      addToast('Item Unavailable', 'This produce is currently not active for sale.', 'warning');
      return false;
    }

    if (product.availableQuantity <= 0) {
      addToast('Sold Out', `Sorry, ${product.title} is currently out of stock.`, 'error');
      return false;
    }

    const existingCartItem = cart.find((i) => i.product.id === productId);
    const currentInCart = existingCartItem ? existingCartItem.quantity : 0;
    const targetQuantity = currentInCart + quantity;

    if (targetQuantity > product.availableQuantity) {
      addToast(
        'Inventory Limit Reached',
        `Only ${product.availableQuantity} ${product.unit} available in farm inventory.`,
        'warning'
      );
      return false;
    }

    setCart((prev) => {
      if (existingCartItem) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: targetQuantity, product }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });

    addToast(
      'Added to Cart',
      `${quantity} ${product.unit} of ${product.title} added.`,
      'success'
    );
    return true;
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (quantity > product.availableQuantity) {
      addToast(
        'Stock Ceiling Exceeded',
        `Maximum available quantity is ${product.availableQuantity} ${product.unit}.`,
        'warning'
      );
      quantity = product.availableQuantity;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity, product } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      addToast('Item Removed', `${item.product.title} removed from cart.`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Checkout & Order Placement with strict stock reduction
  const placeOrder = async (params: PlaceOrderParams): Promise<boolean> => {
    if (cart.length === 0) {
      addToast('Cart is Empty', 'Please add fresh produce before checking out.', 'warning');
      return false;
    }

    // Verify all items have sufficient available inventory
    for (const item of cart) {
      const liveProduct = products.find((p) => p.id === item.product.id);
      if (!liveProduct) {
        addToast('Checkout Failed', `${item.product.title} no longer exists.`, 'error');
        return false;
      }
      if (liveProduct.availableQuantity < item.quantity) {
        addToast(
          'Insufficient Stock',
          `${liveProduct.title} only has ${liveProduct.availableQuantity} ${liveProduct.unit} remaining. Please adjust your cart.`,
          'error'
        );
        return false;
      }
    }

    // Decrement stock for all items
    setProducts((prev) =>
      prev.map((p) => {
        const cartMatch = cart.find((c) => c.product.id === p.id);
        if (!cartMatch) return p;
        const newQty = Math.max(0, p.availableQuantity - cartMatch.quantity);
        return {
          ...p,
          availableQuantity: newQty,
          status: newQty === 0 ? 'Out of Stock' : p.status,
        };
      })
    );

    // Group items by farmer so each farmer receives their respective order
    const itemsByFarmer: { [farmerId: string]: typeof cart } = {};
    cart.forEach((item) => {
      const fId = item.product.farmerId;
      if (!itemsByFarmer[fId]) itemsByFarmer[fId] = [];
      itemsByFarmer[fId].push(item);
    });

    const newOrders: Order[] = [];
    const timestamp = new Date().toISOString();

    Object.entries(itemsByFarmer).forEach(([fId, farmerItems], index) => {
      const farmerObj = farmers.find((f) => f.id === fId);
      const farmerName = farmerObj ? `${farmerObj.name} (${farmerObj.farmName})` : 'Local Farmstead';
      const orderTotal = farmerItems.reduce(
        (sum, item) => sum + item.quantity * item.product.pricePerUnit,
        0
      );

      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder: Order = {
        id: orderId,
        buyerId: 'buyer-current',
        buyerName: params.buyerName || 'Verified Buyer',
        buyerPhone: params.buyerPhone || '+91 98000 00000',
        farmerId: fId,
        farmerName,
        items: farmerItems.map((ci) => ({
          productId: ci.product.id,
          productTitle: ci.product.title,
          farmerId: ci.product.farmerId,
          unit: ci.product.unit,
          pricePerUnit: ci.product.pricePerUnit,
          quantity: ci.quantity,
          imageUrl: ci.product.imageUrl,
        })),
        totalAmount: orderTotal,
        status: 'Requested',
        fulfillmentType: params.fulfillmentType,
        deliveryAddress: params.deliveryAddress,
        pickupTimeWindow: params.pickupTimeWindow,
        customerNote: params.customerNote,
        paymentMethod: params.paymentMethod,
        paymentStatus: params.paymentMethod === 'Mock Online Payment' ? 'Paid' : 'Pending',
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      newOrders.push(newOrder);

      addAuditLog(
        'Buyer',
        params.buyerName || 'Buyer',
        'Order Placed',
        `Placed order ${orderId} with ${farmerName} for ₹${orderTotal.toLocaleString('en-IN')}`,
        'order'
      );
    });

    setOrders((prev) => [...newOrders, ...prev]);
    clearCart();

    addToast(
      'Order Confirmed!',
      `Created ${newOrders.length} order request(s). Farmers have been notified.`,
      'success'
    );
    return true;
  };

  // Cancel order by buyer (Restores inventory!)
  const cancelOrderByBuyer = (orderId: string, reason = 'Buyer cancellation') => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (targetOrder.status !== 'Requested') {
      addToast(
        'Cannot Cancel Order',
        'This order has already been accepted or processed by the farmer.',
        'warning'
      );
      return;
    }

    // Restore inventory
    setProducts((prev) =>
      prev.map((p) => {
        const itemMatch = targetOrder.items.find((i) => i.productId === p.id);
        if (!itemMatch) return p;
        const restoredQty = p.availableQuantity + itemMatch.quantity;
        return {
          ...p,
          availableQuantity: restoredQty,
          status: p.status === 'Out of Stock' ? 'Active' : p.status,
        };
      })
    );

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Cancelled',
              paymentStatus: o.paymentStatus === 'Paid' ? 'Refunded' : o.paymentStatus,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    addAuditLog(
      'Buyer',
      targetOrder.buyerName,
      'Order Cancelled',
      `Cancelled ${orderId}. Restored all item quantities to farm inventory.`,
      'order'
    );

    addToast(
      'Order Cancelled',
      `Order ${orderId} has been cancelled and inventory returned to stock.`,
      'info'
    );
  };

  // Update order status by Farmer
  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    reason?: string
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // If farmer rejects / cancels, restore stock
    if (newStatus === 'Cancelled') {
      setProducts((prev) =>
        prev.map((p) => {
          const itemMatch = targetOrder.items.find((i) => i.productId === p.id);
          if (!itemMatch) return p;
          const restoredQty = p.availableQuantity + itemMatch.quantity;
          return {
            ...p,
            availableQuantity: restoredQty,
            status: p.status === 'Out of Stock' ? 'Active' : p.status,
          };
        })
      );
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              paymentStatus:
                newStatus === 'Completed' && o.paymentStatus === 'Pending'
                  ? 'Paid'
                  : newStatus === 'Cancelled' && o.paymentStatus === 'Paid'
                  ? 'Refunded'
                  : o.paymentStatus,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    const farmerName = activeFarmer ? activeFarmer.name : 'Farmer';
    addAuditLog(
      'Farmer',
      farmerName,
      `Status Update: ${newStatus}`,
      `Order ${orderId} moved to '${newStatus}'. ${reason || ''}`,
      'order'
    );

    addToast(
      `Order ${newStatus}`,
      `Order ${orderId} is now marked as ${newStatus}.`,
      'success'
    );
  };

  // Farmer listing management
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now().toString().slice(-5)}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };

    setProducts((prev) => [newProduct, ...prev]);

    const farmer = farmers.find((f) => f.id === productData.farmerId) || activeFarmer;
    addAuditLog(
      'Farmer',
      farmer ? farmer.name : 'Farmer',
      'Produce Listed',
      `Listed ${productData.title} (${productData.availableQuantity} ${productData.unit}) at ₹${productData.pricePerUnit}/${productData.unit}`,
      'inventory'
    );

    addToast(
      'Produce Listed Successfully',
      `${productData.title} is now published in the marketplace.`,
      'success'
    );
  };

  const updateProductStock = (productId: string, newQuantity: number) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const safeQty = Math.max(0, newQuantity);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              availableQuantity: safeQty,
              status: safeQty === 0 ? 'Out of Stock' : p.status === 'Out of Stock' ? 'Active' : p.status,
            }
          : p
      )
    );

    addAuditLog(
      'Farmer',
      activeFarmer ? activeFarmer.name : 'Farmer',
      'Stock Adjusted',
      `Updated ${targetProduct.title} stock from ${targetProduct.availableQuantity} to ${safeQty} ${targetProduct.unit}.`,
      'inventory'
    );

    addToast(
      'Stock Updated',
      `${targetProduct.title} inventory updated to ${safeQty} ${targetProduct.unit}.`,
      'info'
    );
  };

  const toggleProductStatus = (productId: string, newStatus: ProductStatus) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
    );

    addAuditLog(
      'Farmer',
      activeFarmer ? activeFarmer.name : 'Farmer',
      'Listing Status Changed',
      `Set status of ${targetProduct.title} to '${newStatus}'.`,
      'inventory'
    );

    addToast('Status Updated', `${targetProduct.title} is now ${newStatus}.`, 'info');
  };

  // Admin moderation
  const moderateProduct = (
    productId: string,
    action: 'Approve' | 'Flag/Suspend' | 'Restore' | 'Delete Duplicate'
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (action === 'Delete Duplicate') {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setCart((prev) => prev.filter((c) => c.product.id !== productId));
      addAuditLog(
        'Admin',
        'Marketplace Moderator',
        'Listing Deleted',
        `Removed duplicate listing ${product.title} (ID: ${productId}).`,
        'moderation'
      );
      addToast('Listing Removed', `Deleted listing ${product.title}.`, 'warning');
      return;
    }

    let nextStatus: ProductStatus = product.status;
    if (action === 'Approve') nextStatus = 'Active';
    if (action === 'Flag/Suspend') nextStatus = 'Suspended';
    if (action === 'Restore') nextStatus = 'Active';

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: nextStatus } : p))
    );

    addAuditLog(
      'Admin',
      'Marketplace Moderator',
      `Listing Moderated: ${action}`,
      `Changed ${product.title} status to '${nextStatus}'.`,
      'moderation'
    );

    addToast(
      `Listing ${action}`,
      `Moderation action applied to ${product.title}.`,
      action === 'Flag/Suspend' ? 'warning' : 'success'
    );
  };

  // Reset to initial seed data
  const resetAllData = () => {
    setFarmers(SEED_FARMERS);
    setProducts(SEED_PRODUCTS);
    setOrders(SEED_ORDERS);
    setAuditLogs(SEED_AUDIT_LOGS);
    setCart([]);
    setRoleState('buyer');
    setActiveFarmerId('farmer-1');

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }

    addToast(
      'Demo Data Reset',
      'Restored initial 5 farmers, 15 produce listings, and 3 sample orders.',
      'info'
    );
  };

  return (
    <MarketContext.Provider
      value={{
        role,
        setRole,
        activeFarmerId,
        setActiveFarmerId,
        activeFarmer,
        farmers,
        products,
        orders,
        auditLogs,
        cart,
        cartCount,
        cartTotal,
        toasts,
        addToast,
        removeToast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        updateOrderStatus,
        cancelOrderByBuyer,
        addProduct,
        updateProductStock,
        toggleProductStatus,
        moderateProduct,
        resetAllData,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}
