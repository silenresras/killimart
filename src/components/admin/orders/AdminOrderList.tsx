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

export default function AdminOrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("🔄 Fetching orders via order_api...");
        const response = await order_api.get("/admin/orders");
        console.log("✅ Orders fetched:", response.data);

        setOrders(response.data.orders || response.data);
      } catch (error) {
        console.error("❌ Error fetching orders:", getErrorMessage(error));
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateStatus = async (
    orderId: string,
    newPaymentStatus?: string,
    newDeliveryStatus?: string
  ) => {
    const body: Record<string, string> = {};
    if (newPaymentStatus) body.paymentStatus = newPaymentStatus;
    if (newDeliveryStatus) body.deliveryStatus = newDeliveryStatus;

    try {
      await order_api.patch(`/admin/orders/${orderId}/status`, body);
      toast.success("Order status updated");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, ...body } : order
        )
      );
    } catch (error) {
      console.error("❌ Error updating order status:", getErrorMessage(error));
      toast.error(getErrorMessage(error));
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
