"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCartContext } from "@/components/Context/CartContext";
import { fetchProductBySlug } from "@/lib/fetchProductsBySlug";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { FaChevronLeft, FaChevronRight, FaShareAlt, FaHeart } from "react-icons/fa";
import Link from "next/link";

export default function ProductDetailPage() {
    const slug = useParams().slug as string;
    const [product, setProduct] = useState<any>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useCartContext()

    const handleAddToCart = () => {
        addToCart(product, 1); // or any default quantity
        toast.success("✅ Added to cart!");
    };

    useEffect(() => {
        if (!slug) return;

        fetchProductBySlug(slug).then((data) => {
            if (data) setProduct(data);
        });
    }, [slug]);

    if (!product) return <div>Loading...</div>;

    const handleThumbnailClick = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handlePrev = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const increaseQty = () => {
        if (quantity < product.stock) setQuantity(quantity + 1);
    };

    const decreaseQty = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    return (

        <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-10">
            <Toaster position="top-right" />
            {/* Left: Images */}
            <div>
                <div className="relative">
                    <div className="relative w-full h-[450px] bg-white rounded-xl">
                        <Image
                            src={product.images[currentImageIndex]}
                            alt={product.name}
                            fill
                            className="object-contain p-4 rounded-xl"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>

                    <button
                        className="absolute top-1/2 left-2 bg-white p-2 rounded-full shadow"
                        onClick={handlePrev}
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        className="absolute top-1/2 right-2 bg-white p-2 rounded-full shadow"
                        onClick={handleNext}
                    >
                        <FaChevronRight />
                    </button>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 mt-4 overflow-x-auto">
                    {product.images.map((img: string, i: number) => (
                        <Image
                            key={i}
                            src={img}
                            alt={`thumbnail-${i}`}
                            width={100}
                            height={100}
                            className={`rounded cursor-pointer border-2 ${i === currentImageIndex ? "border-blue-500" : "border-transparent"
                                }`}
                            onClick={() => handleThumbnailClick(i)}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Details */}
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="text-lg text-emerald-500 font-semibold">
                    KES {product.price.toLocaleString()}
                </p>
                <p className="text-gray-700">{product.description}</p>
                <p className="text-sm text-green-600">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>

                {/* Quantity selector */}
                <div className="flex items-center gap-4 mt-4">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={decreaseQty}
                            className="px-3 py-1 border rounded text-lg font-bold"
                        >
                            -
                        </button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button
                            onClick={increaseQty}
                            className="px-3 py-1 border rounded text-lg font-bold"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 mt-6">
                    {product.stock === 0 ? (
                        <div className="text-red-500 font-semibold">Out of Stock!</div>
                    ) : (<>
                        <Link href="/checkout">
                            <button className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-400">
                                Buy Now
                            </button>
                        </Link>
                        <button
                            onClick={handleAddToCart}
                            className="border border-emerald-500 text-emerald-500 px-6 py-2 rounded hover:bg-emerald-50"
                        >
                            Add to Cart
                        </button> </>)}
                    <button className="p-2 text-gray-600 hover:text-blue-600">
                        <FaShareAlt />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-500">
                        <FaHeart />
                    </button>
                </div>
            </div>
        </div>
    );
}
