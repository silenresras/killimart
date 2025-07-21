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
  error: string | null;
  message: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isLoading: boolean;

  setToken: (token: string) => void;
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

axios.defaults.withCredentials = true;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
  error: null,
  message: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,

  setToken: (token) => {
    localStorage.setItem("authToken", token);
    set({ token });
  },

  setUser: (user) => set({ user }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  signup: async (name, email, password) => {
    set({ error: null, isLoading: true });
    try {
      const response = await auth_api.post("/signup", { name, email, password });
      localStorage.setItem("authToken", response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
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
      localStorage.setItem("authToken", response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const error = err as AxiosError<unknown>;
      const data = error.response?.data;
      const message = hasMessage(data) ? data.message : "Error signing in";

      set({ isLoading: false, error: message });
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
      const error = err as AxiosError<unknown>;
      const data = error.response?.data;
      const message = hasMessage(data) ? data.message : "Error verifying email";

      set({ isLoading: false, error: message });
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
