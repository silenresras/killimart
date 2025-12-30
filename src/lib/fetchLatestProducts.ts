// src/lib/fetchLatestProducts.ts
import { product_api } from "@/api/api";
import { Product } from "@/types/product";

export const fetchLatestProducts = async (): Promise<Product[]> => {
  try {
    const res = await product_api.get(`/products?sort=latest`);
    return res.data;
  } catch (error) {
    console.error("Error fetching latest products:", error);
    return [];
  }
};
