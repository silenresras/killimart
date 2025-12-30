import { create } from 'zustand';
import { auth_api } from '@/api/api';

export interface Address {
  _id?: string;
  county: string;
  subCounty: string;
  town: string;
  phoneNumber: string;
  shippingFee?: number;
  isDefault: boolean;
}

interface ShippingState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  addOrUpdateAddress: (address: Address) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

// Type guard for error object without any
function isErrorWithMessage(error: unknown): error is { response: { data: { message: string } } } {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as { response: unknown }).response;
    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response
    ) {
      const data = (response as { data: unknown }).data;
      if (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as { message: unknown }).message === 'string'
      ) {
        return true;
      }
    }
  }
  return false;
}

function extractErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.response.data.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}

export const useShippingStore = create<ShippingState>((set) => ({
  addresses: [],
  loading: false,
  error: null,

  fetchAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const res = await auth_api.get("/shipping-address");
      const allAddresses: Address[] = res.data.shippingAddress || [];

      // Sort so default address comes first
      const sortedAddresses = allAddresses.sort(
        (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
      );

      set({ addresses: sortedAddresses, loading: false });
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err), loading: false });
    }
  },

  addOrUpdateAddress: async (address) => {
    set({ loading: true, error: null });
    try {
      if (address._id) {
        await auth_api.put(`/shipping-address/${address._id}`, address);
      } else {
        await auth_api.post("/shipping-address", address);
      }
      await useShippingStore.getState().fetchAddresses();
      set({ loading: false });
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err), loading: false });
    }
  },

  deleteAddress: async (id) => {
    set({ loading: true, error: null });
    try {
      await auth_api.delete(`/shipping-address/${id}`);
      await useShippingStore.getState().fetchAddresses();
      set({ loading: false });
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err), loading: false });
    }
  },

  setDefaultAddress: async (id) => {
    set({ loading: true, error: null });
    try {
      await auth_api.put(`/shipping-address/${id}`, { isDefault: true });
      await useShippingStore.getState().fetchAddresses();
      set({ loading: false });
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err), loading: false });
    }
  },
}));
