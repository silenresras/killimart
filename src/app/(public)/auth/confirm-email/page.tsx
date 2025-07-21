"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../../../store/AuthStore";

const ConfirmEmailPage = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const router = useRouter();

  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleInputChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only last digit
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasted)) return;

    const digits = pasted.split("");
    setCode(digits);
    digits.forEach((digit, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = digit;
      }
    });
    inputsRef.current[5]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeStr = code.join("");
    if (codeStr.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }

    try {
      await verifyEmail(codeStr);
      toast.success("Email verified!");
      router.push("/auth/login");
    } catch {
      if (error) {
        toast.error(error);
        clearError();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <Toaster position="top-right" />
      <div className="w-full max-w-md p-6 rounded-lg shadow bg-white space-y-6">
        <h2 className="text-xl font-bold text-center">Verify Your Email</h2>
        <p className="text-center text-sm text-gray-600">
          Enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="flex justify-between gap-2"
            onPaste={handlePaste}
          >
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-10 h-12 text-center border rounded focus:outline-none focus:ring focus:border-emerald-500 text-xl"
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  inputsRef.current[index] = el!;
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 rounded font-semibold hover:bg-emerald-300 transition"
          >
            Confirm Code
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Didn't receive it?{" "}
          <button
            onClick={() => router.push("/auth/resend-verification-email")}
            className="text-emerald-500 hover:underline"
          >
            Resend Code
          </button>
        </p>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
