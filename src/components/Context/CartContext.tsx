"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;

  // Buy Now support
  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;
  clearBuyNowItem: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const prevCartJson = useRef<string>("");

  // Load from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    const storedBuyNowItem = localStorage.getItem("buyNowItem");
    if (storedBuyNowItem) {
      setBuyNowItem(JSON.parse(storedBuyNowItem));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    const cartJson = JSON.stringify(cart);
    if (prevCartJson.current !== cartJson) {
      localStorage.setItem("cart", cartJson);
      prevCartJson.current = cartJson;
    }
  }, [cart]);

  // Save buyNowItem to localStorage
  useEffect(() => {
    if (buyNowItem) {
      localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
    } else {
      localStorage.removeItem("buyNowItem");
    }
  }, [buyNowItem]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const clearBuyNowItem = () => {
    setBuyNowItem(null);
    localStorage.removeItem("buyNowItem");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        buyNowItem,
        setBuyNowItem,
        clearBuyNowItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within CartProvider");
  return context;
};
