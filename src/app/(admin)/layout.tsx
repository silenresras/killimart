"use client";

import { useEffect, useRef, useState } from "react";
import AdminSidebar from "@/components/admin/sidebar/AdminSidebar";
import AdminTopbar from "@/components/admin/topbar/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed z-50 md:relative ${
          sidebarOpen ? "block" : "hidden"
        } md:block md:mt-6 md:ml-4`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-4 md:mr-4 md:mt-6">
        <AdminTopbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 bg-gray-100 flex-1 rounded-xl">{children}</main>
      </div>
    </div>
  );
}
