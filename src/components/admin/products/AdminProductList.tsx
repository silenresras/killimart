'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/AuthStore'; // adjust path if needed

interface Order {
  _id: string;
  user?: {
    name: string;
  };
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

const AdminOrderList = () => {
  const token = useAuthStore((state) => state.token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError('No token found.');
        return;
      }

      try {
        const res = await fetch('http://localhost:7000/api/orders/admin/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const message = await res.text();
          throw new Error(`Error ${res.status}: ${message}`);
        }

        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        console.error('Fetch error:', err);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Orders (Admin)</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Order ID</th>
            <th className="p-2">User</th>
            <th className="p-2">Date</th>
            <th className="p-2">Total</th>
            <th className="p-2">Paid</th>
            <th className="p-2">Delivered</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="p-2">{order._id}</td>
              <td className="p-2">{order.user?.name || 'Unknown'}</td>
              <td className="p-2">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : 'Unknown'}
              </td>
              <td className="p-2">
                KES {typeof order.totalPrice === 'number' ? order.totalPrice.toLocaleString() : '0'}
              </td>
              <td className="p-2">{order.isPaid ? '✅' : '❌'}</td>
              <td className="p-2">{order.isDelivered ? '✅' : '❌'}</td>
              <td className="p-2">
                <Link href={`/admin/orders/${order._id}`} className="text-blue-500 underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderList;
