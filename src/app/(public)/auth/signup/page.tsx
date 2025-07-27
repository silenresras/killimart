"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../../../store/AuthStore";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const signup = useAuthStore((state) => state.signup);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signup(name, email, password);
      toast.success("Signup successful! Please check your email.");
      localStorage.setItem("pendingEmail", email);
      router.push("/auth/confirm-email");
    } catch {
      // Error already handled in AuthStore
      if (error) {
        toast.error(error);
        clearError(); // clear error after showing it
      }
    }
  };

  const handleNotImplemented = (provider: string) => {
    alert(`${provider} Coming soon thank you for trusting us!!`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images.png"
            alt="SmartKenya Logo"
            width={120}
            height={120}
          />
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold">CREATE AN ACCOUNT</h2>
          <p className="text-sm text-gray-600">
            Join now for free and be part of SmartKenya to enjoy
            exclusive content, perks & rewards
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded text-sm focus:outline-none border-emerald-500"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded text-sm focus:outline-none border-emerald-500"
            required
          />
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border px-3 py-2 rounded text-sm focus:outline-none border-emerald-500"
              required
            />
            <span
              className="absolute right-3 top-2 text-sm text-clubRed cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            By signing up, you agree to SmartKenya using your personal data
            in accordance with our Privacy Policy.
          </p>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded font-semibold hover:bg-emerald-400 transition"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* OR section */}
        <div className="flex items-center gap-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Sign Up */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button onClick={() => handleNotImplemented("Google")} className="flex-1 border px-4 py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
            <FaGoogle /> Google <span className="text-[10px] text-amber-500">(Coming Soon)</span>
          </button>
          <button onClick={() => handleNotImplemented("Facebook")} className="flex-1 border px-4 py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
            <FaFacebook /> Facebook <span className="text-[10px] text-amber-500">(Coming Soon)</span>
          </button>
          <button onClick={() => handleNotImplemented("Apple")} className="flex-1 border px-4 py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
            <FaApple /> Apple <span className="text-[10px] text-amber-500">(Coming Soon)</span>
          </button>
        </div>

        {/* Login link */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-emerald-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
