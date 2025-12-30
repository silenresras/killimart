"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
