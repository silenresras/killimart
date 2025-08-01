// lib/fetchRelatedProducts.ts
import { product_api } from "@/api/api";
import { Product } from "@/types/product";

export const fetchRelatedProducts = async (
  slug: string
): Promise<Product[]> => {
  try {
    const res = await product_api.get(`/products/related/${encodeURIComponent(slug)}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};
