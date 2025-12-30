import { Product } from "./product";

export interface OrderItem {
  product: Product | string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  county: string;
  subCounty: string;
  town: string;
  phoneNumber: string;
  shippingFee: number;
}

export type PaymentStatus = 'Pending' | 'Paid';
export type DeliveryStatus = 'Not Shipped' | 'Shipped' | 'Delivered';

export interface User {
  _id: string;
  name: string;

  email: string;
}

// For admin, `user` is populated. For normal user orders, it's probably just an ID.
export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  deliveryStatus?: DeliveryStatus;
  totalAmount: number;
  createdAt: string;
}

// ✅ Add back these two
export interface PlaceOrderPayload {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
}

export interface OrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalAmount: number;
}
