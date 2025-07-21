'use client';

import { useEffect, useState } from 'react';
import { useOrderStore } from '@/store/useOrderStore';// Adjust path if needed
import { format } from 'date-fns';

export default function OrdersPage() {
  const { fetchOrders, orders } = useOrderStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'shipped'>('all');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.paymentStatus === filter;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {/* Filter Buttons */}
      <div className={`
          flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible sm:mr-10 sm:ml-10
          whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mb-3
        `}>
        {['all', 'pending', 'paid', 'shipped'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded-md mb-6 shadow-sm bg-white"
          >
            <h2 className="font-semibold text-lg mb-2">
              Order ID: {order._id}
            </h2>

            <div className="mb-2">
              <strong>Date:</strong>{' '}
              {format(new Date(order.createdAt), 'MMMM do, yyyy @ hh:mm a')}
            </div>

            <div className="mb-2">
              <strong>Total Price:</strong> Ksh{' '}
              {order.totalAmount?.toLocaleString() || '0.00'}
            </div>

            <div className="mb-2">
              <strong>Shipping:</strong>{' '}
              {order.shippingAddress?.county}, {order.shippingAddress?.subCounty},{' '}
              {order.shippingAddress?.town}
            </div>

            <div className="mb-2">
              <strong>Phone:</strong> {order.shippingAddress?.phoneNumber}
            </div>

            <div className="mb-2">
              <strong>Shipping Fee:</strong> Ksh{' '}
              {order.shippingAddress?.shippingFee?.toLocaleString() || '0.00'}
            </div>

            <div className="mb-2">
              <strong>Payment Method:</strong> {order.paymentMethod}
            </div>

            <div className="mb-2">
              <strong>Payment Status:</strong> {order.paymentStatus}
            </div>

            <div className="mb-2">
              <strong>Items:</strong>
              <ul className="list-disc list-inside mt-1">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <li key={index}>
                      Product ID: {item.product} — {item.quantity} pcs @ Ksh{' '}
                      {item.price?.toLocaleString()}
                    </li>
                  ))
                ) : (
                  <li>No items in this order</li>
                )}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
