"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Start loader when pathname changes
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Simulate transition delay

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-[9999]">
      <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
