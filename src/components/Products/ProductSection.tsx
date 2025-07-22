"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import SectionTitle from "../Sections/SectionTitle";
import { fetchProductsByCategory } from "@/lib/fetchProductsByCategory";
import { Product } from "@/types/product";

interface Props {
  title: string;
  category: string;
  href: string;
}

export default function ProductSection({ title, category, href }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProductsByCategory(category.toLowerCase()).then(setProducts);
  }, [category]);

  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle title={title} />
        <a href={href} className="text-blue-600 hover:underline text-sm">
          View all
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.slice(0, 3).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
