import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { auth_api } from "@/api/api";

// Types for User and Store State
interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  isVerified?: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;

  setToken: (token: string) => void;
  setUser: (user: User) => void;

  error: string | null;
  message: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
}


axios.defaults.withCredentials = true;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null, // ✅ initial load
  error: null,
  message: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,

  setToken: (token) => {
    localStorage.setItem('authToken', token);
    set({ token });
  },

  setUser: (user) => set({ user }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  signup: async (name, email, password) => {
    set({ error: null, isLoading: true });
    try {
      const response = await auth_api.post("/signup", { name, email, password });
      localStorage.setItem("authToken", response.data.token);
      set({ user: response.data.user, token: response.data.token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const error = err as AxiosError<any>;
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || "Error signing up",
      });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ error: null, isLoading: true });
    try {
      const response = await auth_api.post("/login", { email, password });
      localStorage.setItem("authToken", response.data.token);
      set({ user: response.data.user, token: response.data.token, isAuthenticated: true, isLoading: false });
    } catch (err) {
      const error = err as AxiosError<any>;
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error signing in",
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await auth_api.post("/logout");
      localStorage.removeItem("authToken");
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    } catch {
      set({ error: "Error logging out", isLoading: false });
    }
  },

  verifyEmail: async (code) => {
    set({ error: null, isLoading: true });
    try {
      const response = await auth_api.post("/verify-email", { code });
      set((state) => ({
        user: { ...state.user, isVerified: true } as User,
        message: response.data.message,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (err) {
      const error = err as AxiosError<any>;
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error verifying email",
      });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found");
      set({ isCheckingAuth: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await auth_api.get("/check-auth", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.isAuthenticated) {
        set({
          isAuthenticated: true,
          user: response.data.user,
          isCheckingAuth: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
      }
    } catch {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ error: null, isLoading: true });
    try {
      const response = await auth_api.post("/forgot-password", { email });
      set({ message: response.data.message, isLoading: false });
    } catch (err) {
      const error = err as AxiosError<any>;
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          "Error sending reset password email",
      });
      throw err;
    }
  },
  

  resetPassword: async (token, password) => {
    set({ error: null, isLoading: true });
    try {
      const response = await auth_api.post(`/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (err) {
      const error = err as AxiosError<any>;
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
