"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa";
import { useRouter } from "next/navigation";
import publicAPI from "../../../api/publicAxios";
import Link from "next/link";

const ResendVerificationEmailPage = () => {
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleResend = async () => {
        try {
            setLoading(true);
            const email = typeof window !== "undefined" ? localStorage.getItem("pendingEmail") : "";

            if (!email) {
                toast.error("No email found. Please sign up again.");
                return;
            }

            await publicAPI.post("/auth/resend-verification-email/", { email });

            toast.success("Verification email resent!");
            router.push("/auth/confirm-email"); //  redirect to confirmation page
        } catch (err: any) {
            toast.error("Failed to resend. Try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-white">
            <div className="max-w-md w-full text-center p-6 bg-gray-100 rounded-lg shadow">
                <FaEnvelope className="text-clubRed text-4xl mx-auto mb-4" />

                <h2 className="text-xl font-bold mb-2">Please Verify Your Email</h2>
                <p className="text-gray-700 mb-4">
                    You must verify your email before logging in.
                </p>
                <button
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full bg-clubRed text-white py-2 rounded font-semibold hover:bg-red-600 transition mb-4"
                >
                    {loading ? "Resending..." : "Resend Verification Email"}
                </button>
                <Link href="/auth/login" className="text-sm text-clubRed hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ResendVerificationEmailPage;
