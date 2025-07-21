// src/app/admin/dashboard/page.tsx
"use client";

import AdminRoute from "@/components/protect/AdminRoute";

export default function AdminDashboardPage() {
  return (
    <AdminRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-4">Welcome to the admin panel.</p>
      </div>
    </AdminRoute>
  );
}
