export type ProductCategory = 
  | 'Grains' 
  | 'Vegetables' 
  | 'Fruits' 
  | 'Dairy/Poultry' 
  | 'Spices';

export type ProductUnit = 'kg' | 'quintal' | 'crate' | 'dozen' | 'litre';

export type FulfillmentType = 'Farm Pickup' | 'Local Delivery' | 'Both';

export type ProductStatus = 'Active' | 'Pending Moderation' | 'Out of Stock' | 'Suspended';

export type OrderStatus = 
  | 'Requested' 
  | 'Accepted' 
  | 'Ready for Pickup/Delivery' 
  | 'Completed' 
  | 'Cancelled';

export type PaymentMethod = 'Cash on Delivery / Pickup' | 'Mock Online Payment';

export type UserRole = 'buyer' | 'farmer' | 'admin';

export interface Farmer {
  id: string;
  name: string;
  farmName: string;
  location: string;
  district: string;
  contact: string;
  shortBio: string;
  rating: number;
  reviewsCount: number;
  avatarUrl: string;
  joinedYear: number;
  verified: boolean;
}

export interface Product {
  id: string;
  farmerId: string;
  title: string;
  category: ProductCategory;
  pricePerUnit: number;
  unit: ProductUnit;
  availableQuantity: number;
  initialQuantity: number;
  harvestDate: string;
  fulfillmentType: FulfillmentType;
  imageUrl: string;
  status: ProductStatus;
  description: string;
  organicCertified?: boolean;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  farmerId: string;
  unit: ProductUnit;
  pricePerUnit: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  farmerId: string;
  farmerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  pickupTimeWindow?: string;
  customerNote?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorRole: 'Farmer' | 'Buyer' | 'Admin' | 'System';
  actorName: string;
  action: string;
  details: string;
  type: 'order' | 'inventory' | 'moderation' | 'system';
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
