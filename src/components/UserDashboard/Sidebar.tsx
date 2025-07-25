"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { useAuthStore } from "@/store/AuthStore";
import clsx from "clsx";
import { useState } from "react";
import ConfirmationModal from "../ui/ConfirmationModal"; // update path as needed

const links = [
  { href: "/myaccount/overview", label: "Overview" },
  { href: "/myaccount/orders", label: "Orders" },
  { href: "/myaccount/shipments", label: "Shipments" },
  { href: "/myaccount/reviews", label: "Reviews" },
  { href: "/myaccount/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setIsLoggingOut(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <aside className="bg-white rounded-2xl shadow p-4 md:p-6 mx-2 mt-4 md:mx-4 md:mt-6 w-full md:w-64 md:ml-4 sm:mr-4">
        {/* User Info */}
        <div className="flex flex-col items-center mb-4 md:mb-6">
          <FaUserCircle className="text-4xl md:text-5xl text-emerald-500 mb-1 md:mb-2" />
          <p className="text-sm md:text-lg font-semibold text-gray-800">
            {user?.name || "Guest"}
          </p>
        </div>

        {/* Navigation Links */}
        <nav
          className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible sm:mr-10 sm:ml-10 whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "px-3 py-2 rounded-md font-medium text-sm md:text-base transition flex-shrink-0",
                pathname === link.href
                  ? "bg-emerald-500 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => setShowModal(true)}
          disabled={isLoggingOut || isLoading}
          className={clsx(
            "mt-6 w-full text-center px-4 py-2 rounded-md font-medium text-sm md:text-base transition",
            "bg-emerald-500 text-white hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </aside>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showModal}
        title="Confirm Logout"
        description="Are you sure you want to log out of your account?"
        onConfirm={confirmLogout}
        onCancel={() => setShowModal(false)}
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
}
