'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { order_api } from '@/api/api';
import { AxiosError } from 'axios';

interface Order {
  _id: string;
  user: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  deliveryStatus: 'pending' | 'shipped' | 'delivered';
}

export default function AdminOrderDetails() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await order_api.get(`/${orderId}`);
        const data = res.data;

        setOrder(data);
        setPaymentStatus(data.paymentStatus);
        setDeliveryStatus(data.deliveryStatus);
      } catch (error: unknown) {
        const err = error as AxiosError<{ message: string }>;
        const message =
          err.response?.data?.message || err.message || "Something went wrong";
        alert(`Error: ${message}`);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const updateField = async (field: string, value: string) => {
    const body = { [field]: value };

    try {
      await order_api.patch(`/admin/orders/${orderId}/status`, body);
      alert(`${field} updated!`);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      alert(`Error: ${message}`);
    }
  };

  { if (!order) return <div>Loading...</div>; }

  return (
    <div className="p-4 max-w-xl mx-auto bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold mb-4">Order #{order._id}</h1>

      <div className="space-y-2 text-sm">
        <p><strong>User:</strong> {order.user}</p>
        <p><strong>Amount:</strong> Ksh {order.totalAmount}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
      </div>

      <div className="mt-6 space-y-4">
        {/* Payment Status */}
        <div>
          <label className="block mb-1 font-medium">Update Payment Status</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="border p-2 rounded w-full sm:w-auto"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
            <button
              onClick={() => updateField('paymentStatus', paymentStatus)}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Update Payment
            </button>
          </div>
        </div>

        {/* Delivery Status */}
        <div>
          <label className="block mb-1 font-medium">Update Delivery Status</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="border p-2 rounded w-full sm:w-auto"
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <button
              onClick={() => updateField('deliveryStatus', deliveryStatus)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Update Delivery
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}
