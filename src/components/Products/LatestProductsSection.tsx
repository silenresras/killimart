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
    <section className="px-4 sm:px-6 lg:px-8">
      <SectionTitle title="🆕 Latest Products" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {latestProducts.slice(0, 12).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>


  );
}
