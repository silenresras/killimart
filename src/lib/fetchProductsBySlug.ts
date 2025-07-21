// src/lib/fetchProductsBySlug.ts
import { product_api } from "@/api/api";
import { Product } from "@/types/product";

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const res = await product_api.get(`/products/slug/${slug}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};
