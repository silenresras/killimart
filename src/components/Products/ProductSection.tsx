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
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <SectionTitle title={title} />
        <a href={href} className="text-emerald-500 hover:underline text-sm whitespace-nowrap mb-5">
          View all
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.slice(0, 3).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>

  );
}
