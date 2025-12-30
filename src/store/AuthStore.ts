import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { auth_api } from "@/api/api";

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  isVerified?: boolean;
}

interface AuthStore {
  user: User | null;
  error: string | null;
  message: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
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

function hasMessage(obj: unknown): obj is { message: string } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "message" in obj &&
    typeof (obj as Record<string, unknown>).message === "string"
  );
}

axios.defaults.withCredentials = true; // ✅ Ensure cookies are sent

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  error: null,
  message: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,

  setUser: (user) => set({ user }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  signup: async (name, email, password) => {
    set({ error: null, isLoading: true });
    try {
      const response = await auth_api.post("/signup", { name, email, password });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const error = err as AxiosError<unknown>;
      const data = error.response?.data;
      const message = hasMessage(data) ? data.message : error.message || "Error signing up";

      set({ isLoading: false, error: message });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ error: null, isLoading: true });
    try {
      const response = await auth_api.post("/login", { email, password });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const error = err as AxiosError<unknown>;
      const data = error.response?.data;
      const message = hasMessage(data) ? data.message : "Error logging in";

      set({ isLoading: false, error: message });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await auth_api.post("/logout");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
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
      const error = err as AxiosError<unknown>;
      const data = error.response?.data;
      const message = hasMessage(data) ? data.message : "Error verifying email";

      set({ isLoading: false, error: message });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await auth_api.get("/check-auth");

      if (response.data.isAuthenticated) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
      }
    } catch (err) {
      console.error("Auth check failed", err);
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        error: "Session expired or invalid",
      });
    }
  },

  forgotPassword: async (email) => {
    set({ error: null, isLoading: true });
    try {
      const response = await auth_api.post("/forgot-password", { email });
      set({ message: response.data.message, isLoading: false });
    } catch (err) {
      const error = err as AxiosError<unknown>;
      const data = error.response?.data;
      const message = hasMessage(data) ? data.message : "Error sending reset password email";

      set({ isLoading: false, error: message });
      throw err;
    }
  },

  resetPassword: async (token, password) => {
    set({ error: null, isLoading: true });
    try {
      const response = await auth_api.post(`/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (err) {
      const error = err as AxiosError<unknown>;
      const data = error.response?.data;
      const message = hasMessage(data) ? data.message : "Error resetting password";

      set({ isLoading: false, error: message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
