"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { product_api } from "@/api/api";
import toast, { Toaster } from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
}

interface AdminProductFormProps {
  isEdit?: boolean;
  productId?: string;
}

interface Product {
  name: string;
  brand: string;
  price: string;
  discount: string;
  description: string;
  stock: string;
  category: string;
  images: (File | string)[];
  isHotDeal: boolean;
}

export default function AdminProductForm({ isEdit = false, productId }: AdminProductFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<Product>({
    name: "",
    brand: "",
    price: "",
    discount: "",
    description: "",
    stock: "",
    category: "",
    images: [],
    isHotDeal: false,
  });

  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await product_api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch product if editing
  useEffect(() => {
    if (isEdit && productId) {
      const fetchProduct = async () => {
        try {
          const res = await product_api.get(`/products/${productId}`);
          const product = res.data;

          setFormData({
            name: product.name,
            brand: product.brand,
            price: product.price.toString(),
            discount: product.discount?.toString() || "",
            description: product.description,
            stock: product.stock.toString(),
            category: product.category?._id || "",
            images: product.images || [],
            isHotDeal: product.isHotDeal || false,
          });
        } catch (err) {
          console.error("Error loading product:", err);
        }
      };
      fetchProduct();
    }
  }, [isEdit, productId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...Array.from(files)],
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const imageUrls: string[] = [];

      for (const img of formData.images) {
        if (typeof img === "string") {
          imageUrls.push(img);
        } else {
          const form = new FormData();
          form.append("images", img);
          const res = await product_api.post("/upload", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          imageUrls.push(...res.data.imageUrls);
        }
      }

      const payload = {
        name: formData.name,
        brand: formData.brand,
        price: Number(formData.price),
        discount: Number(formData.discount),
        description: formData.description,
        stock: Number(formData.stock),
        category: formData.category,
        images: imageUrls,
        isHotDeal: formData.isHotDeal,
      };

      if (productId) {
        await product_api.put(`/products/${productId}`, payload);
        toast.success("Product updated!");
      } else {
        await product_api.post("/products", payload);
        toast.success("Product created!");
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Failed to save product.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg max-w-3xl mx-auto mt-10">
      <Toaster />
      <h2 className="text-xl font-bold mb-6">{productId ? "Edit Product" : "Create Product"}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inputs */}
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Product Name"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="Enter Product Brand"
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Price"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            placeholder="Enter Discount (E.g. 5%, 10%, 20%)"
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="Items in Stock"
            className="border rounded px-3 py-2"
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="border rounded px-3 py-2 bg-white"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={formData.isHotDeal}
              onChange={(e) => setFormData({ ...formData, isHotDeal: e.target.checked })}
              id="hot-deal"
              className="accent-blue-600"
            />
            <label htmlFor="hot-deal" className="text-sm font-medium">
              Mark as Hot Deal
            </label>
          </div>
        </div>

        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Product Description"
          className="w-full border rounded px-3 py-2"
          required
        />

        <div>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.images.map((img, i) => (
              <div key={i} className="relative">
                {typeof img === "string" ? (
                  <Image
                    src={img}
                    alt={`Product image ${i + 1}`}
                    width={200}
                    height={200}
                    className="rounded object-cover"
                    onClick={() => setPreviewImage(img)}
                  />
                ) : (
                  <Image
                    width={200}
                    height={200}
                    src={URL.createObjectURL(img)}
                    alt={`Product preview ${i + 1}`}
                    className="w-full h-24 object-cover rounded cursor-pointer"
                    onClick={() => setPreviewImage(URL.createObjectURL(img))}
                  />
                )}
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {previewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
            <Image
              src={previewImage}
              alt="Preview"
              width={600}
              height={600}
              className="max-w-[90%] max-h-[90%]"
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="submit"
          className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-400"
          disabled={uploading}
        >
          {uploading ? "Saving..." : productId ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
