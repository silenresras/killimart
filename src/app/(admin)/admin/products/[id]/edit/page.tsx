// src/app/(admin)/admin/products/[id]/edit/page.tsx
"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

interface AdminProductFormProps {
  isEdit?: boolean;
  productId?: string;
}

const AdminProductForm = dynamic<AdminProductFormProps>(
  () => import("@/components/admin/products/AdminProductForm"),
  { ssr: false }
);


export default function EditProductPage() {
  const { id } = useParams();
  console.log("Edit Page ID:", id);
  return <AdminProductForm isEdit productId={id as string} />;
}
