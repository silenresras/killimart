"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/AuthStore";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 h-screen md:h-[90vh] bg-white border border-gray-200 p-6 shadow-lg rounded-none md:rounded-2xl flex flex-col justify-between">
      {/* Close Button for mobile */}
      <div className="md:hidden flex justify-end">
        <button onClick={onClose}>
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="flex flex-col flex-grow justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-8 mt-2">Admin Panel</h2>
          <ul className="space-y-6 text-sm text-gray-700">
            <li>
              <Link href="/admin/dashboard" className="hover:text-emerald-400 font-medium" onClick={onClose}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="hover:text-emerald-400 font-medium" onClick={onClose}>
                Manage Products
              </Link>
            </li>
            <li>
              <Link href="/admin/categories" className="hover:text-emerald-400 font-medium" onClick={onClose}>
                Manage Categories
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="hover:text-emerald-400 font-medium" onClick={onClose}>
                Orders
              </Link>
            </li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="text-white text-xl font-bold hover:bg-emerald-400 mt-8 rounded-2xl bg-emerald-500 w-full"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
