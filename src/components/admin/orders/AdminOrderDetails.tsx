'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function AdminOrderDetails() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`http://localhost:7000/api/orders/${orderId}`);
      const data = await res.json();
      setOrder(data);
      setPaymentStatus(data.paymentStatus);
      setDeliveryStatus(data.deliveryStatus);
    };

    fetchOrder();
  }, [orderId]);

  const updateField = async (field: string, value: string) => {
    const body = { [field]: value };

    const res = await fetch(`http://localhost:7000/api/orders/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert(`${field} updated!`);
    } else {
      const error = await res.json();
      alert(`Error: ${error.message}`);
    }
  };

  if (!order) return <div>Loading...</div>;

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
