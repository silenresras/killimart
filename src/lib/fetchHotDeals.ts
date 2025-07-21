// lib/fetchHotDeals.ts
import { product_api } from "@/api/api";
import { Product } from "@/types/product";

export const fetchHotDeals = async (): Promise<Product[]> => {
  try {
    const res = await product_api.get("/products?hot=true");
    console.log(res.data)
    return res.data;
  } catch (err) {
    console.error("Failed to fetch hot deals:", err);
    return [];
  }
};
