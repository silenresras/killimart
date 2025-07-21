"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/AuthStore";// adjust path

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuthStore();

  const params = useParams();
  const uidb64 = params?.uidb64 as string;
  const token = params?.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMatching, setIsMatching] = useState(true);
  const [strength, setStrength] = useState("");

  useEffect(() => {
    setIsMatching(password === confirmPassword);
    setStrength(checkStrength(password));
  }, [password, confirmPassword]);

  const checkStrength = (pass: string) => {
    if (pass.length < 6) return "Weak";
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[!@#$%^&*]/.test(pass)) return "Strong";
    return "Medium";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isMatching) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(`${uidb64}/${token}`, password);
      toast.success("Password reset successful!");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 space-y-5">
        <div className="flex justify-center">
        <Image
            src="/images.png"
            alt="Killimart Logo"
            width={40}
            height={40}
            className="filter hue-rotate-[140deg] saturate-50"
          />
        </div>

        <h2 className="text-xl font-bold text-center">Change Password</h2>
        <p className="text-gray-600 text-center">Enter your new password below.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring focus:border-clubRed"
            />
            <span
              className="absolute right-3 top-2 text-sm text-clubRed cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            <p
              className={`text-xs mt-1 ${
                strength === "Strong"
                  ? "text-green-600"
                  : strength === "Medium"
                  ? "text-yellow-600"
                  : "text-red-500"
              }`}
            >
              Strength: {strength}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded text-sm focus:outline-none focus:ring focus:border-clubRed"
            />
            <span
              className="absolute right-3 top-2 text-sm text-clubRed cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "Hide" : "Show"}
            </span>
          </div>

          {!isMatching && (
            <p className="text-xs text-red-600">Passwords do not match</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 text-white py-2 rounded font-semibold hover:bg-emerald-400 transition"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
