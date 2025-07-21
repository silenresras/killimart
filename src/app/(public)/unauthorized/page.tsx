// src/app/unauthorized/page.tsx
"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-gray-600 mb-6">
        You do not have permission to view this page.
      </p>
      <Link href="/" className="text-clubRed underline">
        Go back to Home
      </Link>
    </div>
  );
}
