'use client';

import { useEffect, useState } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { format } from 'date-fns';
import Image from 'next/image';
import { Product } from '@/types/product';

type PaymentStatus = 'all' | 'pending' | 'paid' | 'shipped';

export default function OrdersPage() {
  const { fetchOrders, orders } = useOrderStore();
  const [filter, setFilter] = useState<PaymentStatus>('all');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.paymentStatus.toLowerCase() === filter;
  });


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {/* Filter Buttons */}
      {/* Filter Buttons */}
      <div className="overflow-x-auto md:overflow-visible mb-6">
        <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-4 px-1 sm:px-4 whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {['all', 'pending', 'paid', 'shipped'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as PaymentStatus)}
              className={`px-4 py-2 rounded-full transition-colors duration-200 min-w-[100px] text-sm font-medium ${filter === status
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>


      {filteredOrders.map((order, orderIndex) => (
        <div
          key={order._id}
          className="border p-4 rounded-md mb-6 shadow-sm bg-white space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="font-semibold text-lg">
              Order No: <span className="text-green-600">ORDER-{String(orderIndex + 1).padStart(3, '0')}</span>
            </h2>
            <div className="text-sm text-gray-600">
              {format(new Date(order.createdAt), 'MMMM do, yyyy @ hh:mm a')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div><strong>Total:</strong> Ksh {order.totalAmount?.toLocaleString()}</div>
            <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
            <div><strong>Payment Status:</strong> {order.paymentStatus}</div>
            <div><strong>Shipping Fee:</strong> Ksh {order.shippingAddress?.shippingFee?.toLocaleString()}</div>
            <div><strong>Phone:</strong> {order.shippingAddress?.phoneNumber}</div>
            <div>
              <strong>Shipping:</strong> {order.shippingAddress?.county}, {order.shippingAddress?.subCounty}, {order.shippingAddress?.town}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-md mb-2 mt-4">Items</h3>
            <div className="space-y-3">
              {order.items?.length > 0 ? (
                order.items.map((item, index) => {
                  const product = item.product as Product;

                  return (
                    <div
                      key={index}
                      className="flex gap-4 items-center border rounded-lg p-3 shadow-sm hover:shadow-md transition"
                    >
                      <Image
                        src={product?.images?.[0] || '/placeholder.png'}
                        alt={product?.name}
                        className="object-cover rounded-md"
                        width={20}
                        height={20}
                      />
                      <div className="flex-1 space-y-1">
                        <a
                          href={`/products/${product?.slug}`}
                          className="text-green-600 font-medium hover:underline"
                        >
                          {product?.name || 'Product'}
                        </a>
                        <div className="text-sm text-gray-600">
                          {item.quantity} pcs @ Ksh {item.price?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No items in this order</p>
              )}
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}
