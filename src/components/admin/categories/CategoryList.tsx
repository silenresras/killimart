"use client";

import { useEffect, useState } from "react";
import { product_api } from "@/api/api";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await product_api.get("/categories");
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">All Categories</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat: any) => (
            <li
              key={cat._id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <span>{cat.name}</span>
              <button className="text-red-500 hover:underline">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
