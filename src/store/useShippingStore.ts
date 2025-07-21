// store/useShippingStore.tsx
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

export const useShippingStore = create<ShippingState>((set) => ({
  addresses: [],
  loading: false,
  error: null,

  fetchAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const res = await auth_api.get("/shipping-address");



      const allAddresses = res.data.shippingAddress || [];

      // Sort: default address (isDefault: true) comes first
      const sortedAddresses = allAddresses.sort(
        (a: Address, b: Address) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
      );


      set({ addresses: sortedAddresses, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch addresses",
        loading: false,
      });
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
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to save address", loading: false });
    }
  },

  deleteAddress: async (id) => {
    set({ loading: true, error: null });
    try {
      await auth_api.delete(`/shipping-address/${id}`);
      await useShippingStore.getState().fetchAddresses();
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete address", loading: false });
    }
  },

  setDefaultAddress: async (id) => {
    set({ loading: true, error: null });
    try {
      await auth_api.put(`/shipping-address/${id}`, { isDefault: true });
      await useShippingStore.getState().fetchAddresses();
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to set default", loading: false });
    }
  },
}));
