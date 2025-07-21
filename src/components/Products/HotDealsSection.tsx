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
    <section>
      <div className="flex items-center justify-between mb-4">
        <SectionTitle title="🔥 Hot Deals" />
        <Link href="/category/hot-deals" className="text-blue-600 hover:underline text-sm">
          View more
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
