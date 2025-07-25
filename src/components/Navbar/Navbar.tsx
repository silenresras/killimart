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

    // Handle click outside of drawer
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
      <header className="shadow-md sticky top-0 z-50 bg-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/images.png"
              alt="Killimart Logo"
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10 filter hue-rotate-[140deg] saturate-50"
            />
            <Link href="/" className="hidden md:block text-2xl font-bold text-emerald-500 whitespace-nowrap">
              Killimart
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Icons for Desktop */}
          <div className="hidden md:flex items-center gap-4 text-gray-700 text-lg">
            <div className="relative cursor-pointer flex items-center gap-1" onClick={handleUserClick}>
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
            className="md:hidden text-2xl text-gray-700"
          >
            <FaBars />
          </button>
        </div>

        {/* Side Drawer for Mobile */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

            {/* Right Drawer */}
            <div
              ref={drawerRef}
              className="relative bg-white w-72 h-full shadow-lg animate-slide-in z-50 flex flex-col"
            >
              {/* Drawer Header (non-scrollable) */}
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                  <Link href="/">
                  <Image
                  width={40}
                  height={40}
                    src="/images.png"
                    alt="Killimart Logo"
                    className="w-8 h-8 filter hue-rotate-[140deg] saturate-50 transition-transform hover:scale-105"
                  />
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="text-xl font-bold text-emerald-500 hover:underline"
                  >
                    Killimart
                  </Link>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl text-gray-600 hover:text-red-500 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Drawer Body (scrollable) */}
              <div className="p-4 overflow-y-auto max-h-full flex-1">
                {/* User */}
                <div
                  className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 rounded-md transition"
                  onClick={handleUserClick}
                >
                  <FaUser className="text-lg" />
                  <span className="text-sm font-medium">
                    {isAuthenticated && user ? user.name.split(" ")[0] : "Login"}
                  </span>
                </div>

                {/* Cart */}
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="relative flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition"
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
                  <h4 className="text-sm text-gray-500 mb-2">Categories</h4>
                  <div className="flex flex-col gap-2">
                    <Link href="/category/laptops" className="hover:text-emerald-500   hover:underline" onClick={() => setMenuOpen(false)}>Laptops</Link>
                    <Link href="/category/desktops" className="hover:text-emerald-500 hover:underline" onClick={() => setMenuOpen(false)}>Computer Desktops</Link>
                    <Link href="/category/phones" className="hover:text-emerald-500 hover:underline" onClick={() => setMenuOpen(false)}>Phones</Link>
                    <Link href="/category/accessories" className="hover:text-emerald-500 hover:underline" onClick={() => setMenuOpen(false)}>Accessories</Link>
                    <Link href="/category/networking" className="hover:text-emerald-500 hover:underline" onClick={() => setMenuOpen(false)}>Networking</Link>
                    <Link href="/category/storage" className="hover:text-emerald-500 hover:underline" onClick={() => setMenuOpen(false)}>Storage Devices</Link>
                    <Link href="/category/phones" className="hover:text-emerald-500 hover:underline" onClick={() => setMenuOpen(false)}>Phones</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}




        {/* Category Bar */}
        <div className="hidden sm:flex justify-center items-center text-center overflow-x-auto">
          <nav className="px-6 py-2 flex gap-6 text-xl md:text-lg sm:text-base whitespace-nowrap font-medium">
            <Link href="/category/laptops" className="hover:text-emerald-500 hover:underline transition-all">Laptops</Link>
            <Link href="/category/desktops" className="hover:text-emerald-500 hover:underline transition-all">Computer Desktops</Link>
            <Link href="/category/phones" className="hover:text-emerald-500 hover:underline" onClick={() => setMenuOpen(false)}>Phones</Link>
            <Link href="/category/accessories" className="hover:text-emerald-500 hover:underline transition-all">Accessories</Link>
            <Link href="/category/networking" className="hover:text-emerald-500 hover:underline transition-all">Networking</Link>
            <Link href="/category/storage" className="hover:text-emerald-500 hover:underline transition-all">Storage Devices</Link>
          </nav>
        </div>

      </header>
    );
  }
