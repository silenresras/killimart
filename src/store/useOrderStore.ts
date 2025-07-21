import { create } from 'zustand';
import axios from 'axios';

// ========== Types ==========
// types/order.ts or wherever your types are defined

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

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
}


export interface PlaceOrderPayload {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
}

// ========== Store Interface ==========
interface OrderState {
  order: Order | null;
  orders: Order[];
  isSuccess: boolean;
  isLoading: boolean;
  error: string | null;

  placeOrder: (orderData: PlaceOrderPayload) => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>; // ✅ Add this
  resetOrderState: () => void;

  setIsSuccess: (success: boolean) => void;
  setError: (error: string | null) => void;
}


// ========== Zustand Store ==========
export const useOrderStore = create<OrderState>((set) => ({
  order: null,
  orders: [], // 🆕 store all orders
  isSuccess: false,
  isLoading: false,
  error: null,

  // Setters
  setIsSuccess: (success: boolean) => set({ isSuccess: success }),
  setError: (error: string | null) => set({ error }),

  // 🆕 Reset state
  resetOrderState: () =>
    set({
      order: null,
      orders: [],
      isSuccess: false,
      isLoading: false,
      error: null,
    }),

  // Place Order
  placeOrder: async (orderData) => {
    set({ isLoading: true, error: null, isSuccess: false });
    try {
      const response = await axios.post('http://localhost:7000/api/orders/', {
        items: orderData.orderItems, // ← renamed orderItems → items
        shippingAddress: orderData.shippingAddress,
        totalAmount: orderData.totalPrice, // ← renamed totalPrice → totalAmount
      });

      set({
        order: response.data,
        isSuccess: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        isSuccess: false,
        error: error.response?.data?.message || 'Failed to place order',
      });
    }
  },

  // 🆕 Fetch all orders
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('http://localhost:7000/api/orders/my-orders');
      set({ orders: response.data, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch orders',
      });
    }
  },

  // 🆕 Fetch single order
  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:7000/api/orders/${id}`);
      set({ order: response.data, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch order',
      });
    }
  },

  fetchAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:7000/api/orders/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ orders: response.data, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch admin orders',
      });
    }
  },

  // ✅ Admin: Update Order Status
  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.put(
        `http://localhost:7000/api/orders/admin/orders/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Optional: Refresh orders
      set((state) => ({
        ...state,
        orders: state.orders.map((order) =>
          order._id === id ? { ...order, paymentStatus: status } : order
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to update order status',
      });
    }
  },


}));
