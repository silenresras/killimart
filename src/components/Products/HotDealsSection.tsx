// components/Products/HotDealsSection.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchHotDeals } from "@/lib/fetchHotDeals";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import SectionTitle from "../Sections/SectionTitle";
import Link from "next/link";

export default function HotDealsSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchHotDeals().then(setProducts);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <SectionTitle title="🔥 Hot Deals" />
        <Link href="/category/hot-deals" className="text-emerald-500 hover:underline text-sm mb-5">
          View more
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
