'use client';

import { useEffect, useState } from "react";
import { useCartContext } from "@/components/Context/CartContext";
import CartItem from "@/components/Cart/CartItem";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Link from "next/link";

export default function CartPage() {
  const { cart, clearCart } = useCartContext();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showConfirm ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showConfirm]);

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return <>
      <div className="p-6 text-center text-gray-600">Your cart is empty.</div>
      <div className="flex items-center justify-center">
        <Link href="/">
          <button className="text-white rounded-xl mx-4 my-4 text-center px-4 py-2 font-semibold bg-emerald-500 hover:bg-emerald-400">Continue Shopping</button>
        </Link>
      </div>
    </>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <CartItem key={item.product._id} item={item} />
        ))}
      </div>
      <div className="mt-6 text-right text-xl font-semibold">
        Total: KES {total.toLocaleString()}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Link href="/checkout">
          <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded">
            Checkout
          </button>
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 border text-red-500 rounded hover:bg-red-50"
        >
          Clear Cart
        </button>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        title="Confirm Deletion"
        description="Items will be removed from the shopping cart list."
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          clearCart();
          setShowConfirm(false);
        }}
      />
    </div>
  );
}
