import { product_api } from "@/api/api";
import { Product } from "@/types/product";

export const fetchProductsByCategory = async (
  categorySlug: string
): Promise<Product[]> => {
  try {
    const res = await product_api.get(
      `/categories/products-by-category?slug=${encodeURIComponent(categorySlug)}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
