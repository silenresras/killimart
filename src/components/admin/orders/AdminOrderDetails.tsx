'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { order_api } from '@/api/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

// Define TypeScript interfaces
interface Product {
  slug: string;
  name: string;
  images: string[];
}

interface OrderItem {
  _id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface ShippingAddress {
  town: string;
  subCounty: string;
  county: string;
  phoneNumber: string;
}

interface User {
  name: string;
  email: string;
}

interface Order {
  _id: string;
  user: User;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
}

export default function AdminOrderDetails() {
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await order_api.get(`/admin/orders/${id}`);
        setOrder(response.data);
      } catch {
        toast.error('Failed to fetch order details.');
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <div className="p-4">Loading order details...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order #{order._id.slice(-6)}</h2>

      <div className="mb-4">
        <h3 className="font-semibold">Customer Info</h3>
        <p>Name: {order.user.name}</p>
        <p>Email: {order.user.email}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Shipping Address</h3>
        <p>
          {order.shippingAddress.town}, {order.shippingAddress.subCounty},{' '}
          {order.shippingAddress.county}
        </p>
        <p>Phone: {order.shippingAddress.phoneNumber}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Order Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {order.items.map((item) => (
            <Link key={item._id} href={`/products/${item.product.slug}`}>
              <div className="flex items-center gap-4 border p-2 rounded cursor-pointer">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="rounded object-cover"
                />
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: KES {item.price.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p>
          <strong>Total:</strong> KES {order.totalAmount.toLocaleString()}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.paymentStatus}
        </p>
        <p>
          <strong>Delivery Status:</strong>{' '}
          {order.deliveryStatus || 'pending'}
        </p>
        <p>
          <strong>Ordered on:</strong>{' '}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
