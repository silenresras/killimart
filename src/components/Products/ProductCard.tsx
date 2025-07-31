'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <div className="bg-white shadow-sm rounded-md hover:shadow-md transition duration-300 cursor-pointer hover:scale-105 flex flex-col h-full w-full">
        <div className="relative w-full h-48 bg-white flex items-center justify-center">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        <div className="px-3 py-2 flex flex-col flex-grow">
          <h3 className="text-sm font-medium leading-snug line-clamp-2 min-h-[3.5rem]
               text-slate-800 dark:text-slate-200">
            {product.name}
          </h3>
          <div className="mt-auto text-sm font-bold text-emerald-600">
            KES {product.price.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
