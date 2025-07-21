"use client";

import { useAuthStore } from "@/store/AuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isCheckingAuth, isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  // 🔑 Trigger checkAuth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user?.role !== "admin") {
        router.push("/unauthorized");
      }
    }
  }, [isCheckingAuth, isAuthenticated, user, router]);

  // 🔄 Show loader while checking
  if (isCheckingAuth || !user) {
    return <div className="text-center mt-10">Checking admin access...</div>;
  }

  return <>{user.role === "admin" ? children : null}</>;
}
