"use client";

import { useEffect, useState } from "react";
import { order_api } from "@/api/api";
import { useAuthStore } from "@/store/AuthStore";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  user: { name: string };
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  deliveryStatus: string;
}

export default function AdminOrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/admin/orders`;
        console.log("🔄 Fetching orders from:", url);

        const response = await order_api.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ Fetched orders:", response.data);
        setOrders(response.data.orders || response.data); // support both shaped responses
      } catch (error: any) {
        console.error("❌ Error fetching orders:", error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const updateStatus = async (
    orderId: string,
    newPaymentStatus?: string,
    newDeliveryStatus?: string
  ) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/admin/orders/${orderId}/status`;

    const body: Record<string, string> = {};
    if (newPaymentStatus) body.paymentStatus = newPaymentStatus;
    if (newDeliveryStatus) body.deliveryStatus = newDeliveryStatus;

    console.log("🔄 Updating order:", {
      orderId,
      newPaymentStatus,
      newDeliveryStatus,
      body,
      url,
    });

    try {
      const response = await order_api.patch(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Update response:", response.data);
      toast.success("Order status updated");

      // Refresh updated order locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...body,
              }
            : order
        )
      );
    } catch (error: any) {
      toast.error("Failed to update status");
      console.error("❌ Error updating status:", {
        url,
        orderId,
        error: error?.response?.data || error.message,
      });
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Date</th>
              <th className="p-2">Total</th>
              <th className="p-2">Payment</th>
              <th className="p-2">Delivery</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b text-center">
                <td className="p-2">{order._id.slice(-6)}</td>
                <td className="p-2">{order.user?.name}</td>
                <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-2">KES {order.totalAmount.toLocaleString()}</td>
                <td className="p-2">{order.paymentStatus}</td>
                <td className="p-2">{order.deliveryStatus || "pending"}</td>
                <td className="p-2 space-y-2">
                  <button
                    className="bg-green-600 text-white px-2 py-1 text-sm rounded mr-2"
                    onClick={() => updateStatus(order._id, "paid")}
                  >
                    Mark Paid
                  </button>
                  <button
                    className="bg-blue-600 text-white px-2 py-1 text-sm rounded"
                    onClick={() => updateStatus(order._id, undefined, "delivered")}
                  >
                    Mark Delivered
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
