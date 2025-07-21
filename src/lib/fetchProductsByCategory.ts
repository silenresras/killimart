import { product_api } from "@/api/api";
import { Product } from "@/types/product";

export const fetchProductsByCategory = async (categoryName: string): Promise<Product[]> => {
  try {
    // fetchProductsByCategory.ts
    const res = await product_api.get(`/categories/products-by-category?category=${categoryName}`);

    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
