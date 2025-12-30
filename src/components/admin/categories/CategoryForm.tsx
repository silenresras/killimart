"use client";

import { useState, FormEvent } from "react";
import { product_api } from "@/api/api";
import toast from "react-hot-toast";

export default function CategoryForm() {
  const [name, setName] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await product_api.post("/categories", { name });
      toast.success("Category created");
      setName("");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: unknown }).response === "object" &&
        (err as { response?: { data?: unknown } }).response !== null &&
        "data" in (err as { response: { data?: unknown } }).response &&
        typeof (err as { response: { data?: object } }).response.data === "object" &&
        (err as { response: { data?: object } }).response.data !== null &&
        "message" in (err as { response: { data: Record<string, unknown> } }).response.data &&
        typeof (err as { response: { data: { message?: unknown } } }).response.data.message === "string"
      ) {
        toast.error((err as { response: { data: { message: string } } }).response.data.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error creating category");
      }
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
        required
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
