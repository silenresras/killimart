import { create } from 'zustand';
import { order_api } from '@/api/api';

import {
  Order,
  PlaceOrderPayload,
  PaymentStatus,
} from '@/types/order';

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
  updateOrderStatus: (id: string, status: PaymentStatus) => Promise<void>;
  resetOrderState: () => void;

  setIsSuccess: (success: boolean) => void;
  setError: (error: string | null) => void;
}

function isAxiosErrorWithMessage(
  error: unknown
): error is { response: { data: { message: string } } } {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response: unknown }).response;

    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = (response as { data: unknown }).data;

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as { message: unknown }).message === "string"
      ) {
        return true;
      }
    }
  }
  return false;
}



function extractErrorMessage(error: unknown): string {
  if (isAxiosErrorWithMessage(error)) {
    return error.response.data.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}

export const useOrderStore = create<OrderState>((set) => ({
  order: null,
  orders: [],
  isSuccess: false,
  isLoading: false,
  error: null,

  setIsSuccess: (success) => set({ isSuccess: success }),
  setError: (error) => set({ error }),

  resetOrderState: () =>
    set({
      order: null,
      orders: [],
      isSuccess: false,
      isLoading: false,
      error: null,
    }),

  placeOrder: async (orderData) => {
    set({ isLoading: true, error: null, isSuccess: false });
    try {
      const response = await order_api.post('/', {
        items: orderData.orderItems,
        shippingAddress: orderData.shippingAddress,
        totalAmount: orderData.totalPrice,
      });

      set({
        order: response.data,
        isSuccess: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        isSuccess: false,
        error: extractErrorMessage(error),
      });
    }
  },

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await order_api.get('/my-orders');
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: extractErrorMessage(error),
      });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await order_api.get(`/${id}`);
      set({ order: response.data, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: extractErrorMessage(error),
      });
    }
  },

  fetchAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await order_api.get('/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ orders: response.data, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: extractErrorMessage(error),
      });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await order_api.put(
        `/admin/orders/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set((state) => ({
        ...state,
        orders: state.orders.map((order) =>
          order._id === id ? { ...order, paymentStatus: status } : order
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: extractErrorMessage(error),
      });
    }
  },
}));
