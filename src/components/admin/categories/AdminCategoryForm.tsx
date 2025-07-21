"use client";

import { product_api } from "@/api/api";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminCategoryForm({ onCategoryAdded }: { onCategoryAdded: () => void }) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    try {
      setIsLoading(true);
      await product_api.post("/categories", { name });
      toast.success("Category created");
      setName("");
      onCategoryAdded();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        toast.error(axiosErr.response?.data?.message || "Error creating category");
      } else {
        toast.error("Unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2 ">Create New Category</h2>
      <input
        type="text"
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Enter category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-400"
      >
        {isLoading ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
}
