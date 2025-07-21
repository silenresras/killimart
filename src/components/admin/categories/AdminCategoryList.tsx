"use client";

import { useEffect, useState } from "react";
import { product_api } from "@/api/api";
import toast from "react-hot-toast";

type Category = {
  _id: string;
  name: string;
};

export default function AdminCategoryList({ refresh }: { refresh: boolean }) {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await product_api.get("/categories");
      setCategories(response.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await product_api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Error deleting category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">All Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat._id} className="flex justify-between items-center border-b py-2">
            <span>{cat.name}</span>
            <button
              onClick={() => handleDelete(cat._id)}
              className="text-red-500 hover:underline text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
