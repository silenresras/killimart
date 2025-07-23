'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { product_api } from '@/api/api';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  isHotDeal: boolean;
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: object }).response !== null &&
    "data" in (error as { response: object }).response &&
    typeof (error as { response: { data?: unknown } }).response.data === "object" &&
    (error as { response: { data?: object } }).response.data !== null &&
    "message" in (error as { response: { data: Record<string, unknown> } }).response.data &&
    typeof (error as { response: { data: { message?: unknown } } }).response.data.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data.message;
  } else if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
}

export default function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await product_api.get('/products', {
          withCredentials: true,
        });
        setProducts(res.data);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await product_api.delete(`/products/${id}`, { withCredentials: true });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
      console.error(err);
    }
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Admin Products</h1>
        <Link
          href="/admin/products/create"
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-500"
        >
          + Create New
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center">No products found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Price (KES)</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Hot Deal</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                    </td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.price.toLocaleString()}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">
                      {product.isHotDeal ? (
                        <span className="text-red-500 font-semibold">Yes</span>
                      ) : (
                        'No'
                      )}
                    </td>
                    <td className="p-3 space-x-2">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg shadow-sm p-4 bg-white flex flex-col gap-2"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-lg">{product.name}</h2>
                    <p className="text-sm text-gray-600">
                      {product.price.toLocaleString()} KES
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-700">
                  <p>Stock: {product.stock}</p>
                  <p>
                    Hot Deal:{' '}
                    {product.isHotDeal ? (
                      <span className="text-red-500 font-semibold">Yes</span>
                    ) : (
                      'No'
                    )}
                  </p>
                </div>

                <div className="flex justify-end gap-4 text-sm mt-2">
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
