"use client";

import Link from "next/link";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/AuthStore";
import Image from "next/image";
import SearchBar from "../search/SearchBar";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, [checkAuth]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleUserClick = () => {
    window.location.href = isAuthenticated && user ? "/myaccount" : "/auth/login";
  };

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b gap-2 lg:gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images.png"
            alt="SmartKenya Logo"
            width={100}
            height={100}
            className="h-10 w-auto"
          />
        </Link>

        {/* Search */}
        <div className="flex-grow max-w-2xl mx-4">
          <SearchBar />
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-4 text-gray-700 dark:text-white text-lg">
          <div
            className="relative cursor-pointer flex items-center gap-1"
            onClick={handleUserClick}
          >
            <FaUser />
            <span className="text-sm font-medium">
              {isAuthenticated && user ? user.name.split(" ")[0] : "Login"}
            </span>
          </div>

          <Link href="/cart" className="relative">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-emerald-500 text-white rounded-full px-1.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Hamburger Icon */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-2xl text-gray-700 dark:text-white"
        >
          <FaBars />
        </button>
      </div>

      {/* Side Drawer for Mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            ref={drawerRef}
            className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-72 h-full shadow-lg animate-slide-in z-50 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <Link href="/">
                  <Image
                    width={40}
                    height={40}
                    src="/images.png"
                    alt="Killimart Logo"
                    className="w-8 h-8 transition-transform hover:scale-105"
                  />
                </Link>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="text-xl font-bold text-emerald-500 hover:underline"
                >
                  SmartKenya
                </Link>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-full flex-1">
              <div
                className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition"
                onClick={handleUserClick}
              >
                <FaUser className="text-lg" />
                <span className="text-sm font-medium">
                  {isAuthenticated && user ? user.name.split(" ")[0] : "Login"}
                </span>
              </div>

              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="relative flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition"
              >
                <FaShoppingCart className="text-lg" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 left-20 text-xs bg-emerald-500 text-white rounded-full px-1.5">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Categories */}
              <div className="mt-6">
                <h4 className="text-sm text-gray-500 dark:text-gray-300 mb-2">Categories</h4>
                <div className="flex flex-col gap-2">
                  {["laptops", "desktops", "phones", "accessories", "networking", "storage"].map((category) => (
                    <Link
                      key={category}
                      href={`/category/${category}`}
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-emerald-500 hover:underline"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Bar */}
      <div className="hidden sm:flex justify-center items-center text-center overflow-x-auto dark:bg-gray-800">
        <nav className="px-6 py-2 flex gap-6 text-sm md:text-base font-medium text-gray-700 dark:text-gray-100">
          {["laptops", "desktops", "phones", "accessories", "networking", "storage"].map((category) => (
            <Link
              key={category}
              href={`/category/${category}`}
              className="hover:text-emerald-500 hover:underline transition-all"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
