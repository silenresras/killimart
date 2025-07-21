'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white shadow-sm rounded-md w-[180px] hover:shadow-md transition duration-300 cursor-pointer hover:scale-105">
        <div className="relative w-full h-[180px] bg-white flex items-center justify-center">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 180px"
          />
        </div>
        <div className="px-3 py-2">
          <h3 className="text-sm font-medium leading-tight line-clamp-2 h-[3em]">
            {product.name}
          </h3>
          <div className="mt-1 text-sm font-bold text-emerald-600">
            KES {product.price.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
