// src/app/(admin)/admin/categories/page.tsx
"use client";

import { useState } from "react";
import AdminCategoryForm from "@/components/admin/categories/AdminCategoryForm";
import AdminCategoryList from "@/components/admin/categories/AdminCategoryList";
import AdminRoute from "@/components/protect/AdminRoute";

export default function AdminCategoriesPage() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh((prev) => !prev);

  return (
    <AdminRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
        <AdminCategoryForm onCategoryAdded={triggerRefresh} />
        <AdminCategoryList refresh={refresh} />
      </div>
    </AdminRoute>
  );
}
