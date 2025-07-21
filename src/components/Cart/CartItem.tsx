import Image from "next/image";
import type { CartItem as CartItemType } from "../types/cart"; 
import { useCartContext } from "../Context/CartContext";
import ConfirmationModal from "../ui/ConfirmationModal";
import { useEffect, useState } from "react";

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeFromCart, updateQuantity } = useCartContext();

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showConfirm ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showConfirm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = Math.max(1, parseInt(e.target.value) || 1);
    updateQuantity(item.product._id, qty);
  };

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          width={80}
          height={80}
          className="rounded"
        />
        <div>
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="text-sm text-gray-600">
            KES {item.product.price.toLocaleString()} ×
            <input
              type="number"
              value={item.quantity}
              onChange={handleChange}
              className="w-14 ml-2 border rounded px-2 py-0.5 text-center"
              min={1}
            />
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-500 hover:underline text-sm"
      >
        Remove
      </button>

      <ConfirmationModal
        isOpen={showConfirm}
        title="Confirm Deletion"
        description="Items will be removed from the shopping cart list."
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          removeFromCart(item.product._id); // ✅ Remove only this item
          setShowConfirm(false);
        }}
      />
    </div>
  );
}
