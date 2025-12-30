"use client";

import { useEffect, useState } from "react";
import { order_api } from "@/api/api";
import { useAuthStore } from "@/store/AuthStore";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  user: { name: string; email: string };
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  deliveryStatus: string;
  shippingAddress: {
    county: string;
    subCounty: string;
    town: string;
    phoneNumber: string;
    shippingFee: number;
  };
  items: {
    product: {
      _id: string;
      name: string;
      images: string[];
    };
    quantity: number;
    price: number;
  }[];
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
  const [updating, setUpdating] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await order_api.get("/admin/orders");
        setOrders(response.data.orders || response.data);
      } catch (error) {
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

    const confirmMessage = `Are you sure you want to update ${newPaymentStatus ? `payment to "${newPaymentStatus}"` : `delivery to "${newDeliveryStatus}"`
      } for order ${orderId.slice(-6)}?`;

    const confirm = window.confirm(confirmMessage);
    if (!confirm) return;

    try {
      setUpdating(orderId);
      await order_api.patch(`/admin/orders/${orderId}/status`, body);
      toast.success("Order status updated");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, ...body } : order
        )
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-xl font-bold mb-4">Admin Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full text-sm border border-gray-200 min-w-[600px]">
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
              <tr key={order._id} className="border-b text-center hover:bg-gray-50">
                <td className="p-2">{order._id.slice(-6)}</td>
                <td className="p-2">{order.user?.name}</td>
                <td className="p-2">
                  {new Date(order.createdAt).toLocaleString("en-KE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="p-2">KES {order.totalAmount.toLocaleString()}</td>
                <td className="p-2">{order.paymentStatus}</td>
                <td className="p-2">{order.deliveryStatus || "pending"}</td>
                <td className="p-2 flex flex-col md:flex-row justify-center gap-2">
                  <button
                    onClick={() => window.location.href = `/admin/orders/${order._id}`}
                    className="bg-gray-700 text-white text-xs px-3 py-1 rounded"
                  >
                    Details
                  </button>

                  {/* Existing Mark Paid / Delivered Buttons */}
                  {order.paymentStatus === "paid" ? (
                    <span className="bg-green-200 text-green-700 px-3 py-1 text-xs rounded">
                      Paid
                    </span>
                  ) : (
                    <button
                      className="bg-green-600 text-white px-3 py-1 text-xs rounded disabled:opacity-50"
                      disabled={updating === order._id}
                      onClick={() => updateStatus(order._id, "paid")}
                    >
                      {updating === order._id ? "Updating..." : "Mark Paid"}
                    </button>
                  )}

                  {order.deliveryStatus === "delivered" ? (
                    <span className="bg-blue-200 text-blue-700 px-3 py-1 text-xs rounded">
                      Delivered
                    </span>
                  ) : (
                    <button
                      className="bg-blue-600 text-white px-3 py-1 text-xs rounded disabled:opacity-50"
                      disabled={updating === order._id}
                      onClick={() => updateStatus(order._id, undefined, "delivered")}
                    >
                      {updating === order._id ? "Updating..." : "Mark Delivered"}
                    </button>
                  )}
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
