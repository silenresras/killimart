// src/app/(public)/search/SearchResultsClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { product_api } from '@/api/api';
import ProductCard from '@/components/Products/ProductCard';
import { Product } from '@/types/product';

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const { data } = await product_api.get(`/products/search?q=${encodeURIComponent(query)}`);
        setResults(data || []);
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Search Results for: <span className="text-emerald-600">&quot;{query}&quot;</span>
      </h2>

      {results.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
