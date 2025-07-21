"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/AuthStore";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 h-[90vh] ml-4 mt-6 mr-4 bg-white border border-gray-200 p-6 shadow-lg rounded-2xl flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-8">Admin Panel</h2>
        <ul className="space-y-6 text-sm text-gray-700">
          <li>
            <Link href="/admin/dashboard" className="hover:text-emerald-400 font-medium">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className="hover:text-emerald-400 font-medium">
              Manage Products
            </Link>
          </li>
          <li>
            <Link href="/admin/categories" className="hover:text-emerald-400 font-medium">
              Manage Categories
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="hover:text-emerald-400 font-medium">
              Orders
            </Link>
          </li>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="text-white text-xl font-bold hover:bg-emerald-400 mt-8 rounded-2xl bg-emerald-500 "
      >
        Logout
      </button>
    </aside>
  );
}
