"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/AuthStore";
import Image from "next/image";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      toast.success("Login successful!");
      router.push("/");
    } catch {
      if (error) {
        toast.error(error);
        clearError();
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  const handleGoogleLogin = () => {
    // Open the backend endpoint in a new window/tab
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };
  const handleNotImplemented = (provider: string) => {
    alert(`${provider} login is coming soon thank you for staying with us!`);
    // or use a toast library if installed
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        {/* Logo */}

        {/* Title */}
        <div className="text-center space-y-1">
          <div className="flex justify-center">
            <Image
              src="/images.png"
              alt="SmartKenya Logo"
              width={120}
              height={120}
            />
          </div>
          <h2 className="text-xl font-bold">LOG IN</h2>
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-green-600 hover:underline font-semibold">
              Create one now
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm focus:outline-none border-green-600"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm focus:outline-none border-green-600"
            />
            <span
              className="absolute right-3 top-2 text-sm text-clubRed cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-clubRed text-white bg-green-600 py-2 rounded font-semibold hover:bg-green-500 transition"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>



          {/*<Link
          <Link
            href="/auth/reset-password"
            className="block text-center text-xs text-red-500 underline mt-1"
          >
            Forgot Password?
          </Link>
          */}
        </form>

        {/* OR divider */}
        <div className="flex items-center gap-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social logins */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button className="flex-1 border px-4 py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-gray-50" onClick={handleGoogleLogin}>
            <FaGoogle /> Google
            </button>
          <button className="flex-1 border px-4 py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-gray-50" onClick={() => handleNotImplemented("Google")}>
            <FaGoogle /> Google  <span className="text-[10px] text-amber-500">(Coming Soon)</span>
          </button>
          <button className="flex-1 border px-4 py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-gray-50" onClick={() => handleNotImplemented("Facebook")}>
            <FaFacebook /> Facebook <span className="text-[10px] text-amber-500">(Coming Soon)</span>
          </button>
          <button className="flex-1 border px-4 py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-gray-50" onClick={() => handleNotImplemented("Apple")}>
            <FaApple /> Apple  <span className="text-[10px] text-amber-500">(Coming Soon)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
