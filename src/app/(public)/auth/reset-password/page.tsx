"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../../store/AuthStore";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  // Zustand store actions & state
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const loading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPassword(email);
      toast.success("Password reset email sent!");
      router.push("/auth/request-password-submitted");
    } catch {
      toast.error(error || "Failed to send reset email.");
    } finally {
      clearError(); // optional
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
        <Image
            src="/images.png"
            alt="Killimart Logo"
            width={40}
            height={40}
            className="filter hue-rotate-[140deg] saturate-50"
          />
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold">RESET PASSWORD</h2>
          <p className="text-sm text-gray-600">
            Enter your email and we’ll send you instructions to reset your password.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleResetRequest}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border-emerald-500 border px-3 py-2 rounded text-sm focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-2 rounded font-semibold hover:bg-emerald-400 transition"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>

        {/* Links */}
        <div className="text-center text-sm text-gray-600 mt-4">
          <Link href="/auth/signup" className="hover:underline text-emerald-500">
            Create an account
          </Link>{" "}
          or{" "}
          <Link href="/auth/login" className="hover:underline text-emerald-500">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
