'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { order_api } from '@/api/api';

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
      } catch (error) {
        console.error("Error fetching order:", error);
        // Optionally set error state or display toast
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
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    alert(`Error: ${message}`);
  }
};

  {if (!order) return <div>Loading...</div>;}

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order #{order._id}</h1>
      <p><strong>User:</strong> {order.user}</p>
      <p><strong>Amount:</strong> Ksh {order.totalAmount}</p>
      <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
      <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>

      <div className="mt-6">
        <label className="block mb-1">Update Payment Status</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="border p-2"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
        <button
          onClick={() => updateField('paymentStatus', paymentStatus)}
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Update Payment
        </button>
      </div>

      <div className="mt-6">
        <label className="block mb-1">Update Delivery Status</label>
        <select
          value={deliveryStatus}
          onChange={(e) => setDeliveryStatus(e.target.value)}
          className="border p-2"
        >
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
        <button
          onClick={() => updateField('deliveryStatus', deliveryStatus)}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Update Delivery
        </button>
      </div>
    </div>
  );
}
