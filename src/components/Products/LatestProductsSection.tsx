// src/components/Products/LatestProductsSection.tsx
"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { fetchLatestProducts } from "@/lib/fetchLatestProducts";
import ProductCard from "./ProductCard";
import SectionTitle from "../Sections/SectionTitle";

export default function LatestProductsSection() {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchLatestProducts().then(setLatestProducts);
  }, []);

  if (latestProducts.length === 0) return null;

  return (
    <section>
      <SectionTitle title="🆕 Latest Products" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {latestProducts.slice(0, 8).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
