// types/order.ts

export interface OrderItem {
    product: string;
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
  
  export type PaymentStatus = 'pending' | 'paid' | 'shipped';
  
  export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    createdAt: string;
  }
  
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
  