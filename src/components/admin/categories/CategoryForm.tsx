"use client";

import { useState } from "react";
import { product_api } from "@/api/api";
import toast from "react-hot-toast";

export default function CategoryForm() {
  const [name, setName] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await product_api.post("/categories", { name });
      toast.success("Category created");
      setName("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating category");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Category</h2>
      <input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-4 py-2 rounded w-full mb-4"
      />
      <button
        type="submit"
        className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-400"
      >
        Create
      </button>
    </form>
  );
}
