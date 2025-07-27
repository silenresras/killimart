"use client";

import { useEffect, useRef, useState } from "react";
import Image from 'next/image';


const slides = [
  {
    title: "Welcome to Killimart 🛒",
    text: "Best deals on laptops, desktops, and accessories delivered to you.",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1500&q=80",
  },
  {
    title: "Mega Discounts 🤑",
    text: "Enjoy up to 50% off on selected electronics this season.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1500&q=80",
  },
  {
    title: "Trusted Tech Delivered Fast 🚚",
    text: "Get quality gadgets and accessories with fast shipping across Kenya.",
    image:
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1500&q=80",
  },
  {
    title: "Latest Gaming Gear 🎮",
    text: "Upgrade your setup with the latest consoles and accessories.",
    image:
      "https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=1500&q=80",
  },
  {
    title: "Smartphones & Tablets 📱",
    text: "Top brands at unbeatable prices.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1500&q=80",
  },
  {
    title: "Smart Home Devices 🏡",
    text: "Control your home with AI‑powered devices and smart automation.",
    image:
      "https://images.unsplash.com/photo-1585970480901-90d6bb2a48b5?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Office Essentials 💼",
    text: "Equip your workspace with modern and reliable tech tools.",
    image:
      "https://images.unsplash.com/photo-1561197671-9bf9339ca5ac?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Wearable Tech ⌚",
    text: "Track your health and stay connected on the go.",
    image:
      "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Creative Gear for Creators 🎧📷",
    text: "Cameras, headphones, and tools for your content creation journey.",
    image:
      "https://images.unsplash.com/photo-1546624666-b8a2921c192f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Eco‑friendly Tech 🌱",
    text: "Discover energy-efficient gadgets for a greener future.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1200",
  },
  
];


export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(0); // Track index manually

  useEffect(() => {
    const interval = setInterval(() => {
      slideRef.current = (slideRef.current + 1) % slides.length;
      setCurrentSlide(slideRef.current);
    }, 2000); // 2s delay

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-48 md:h-72 overflow-hidden rounded-lg shadow-md">
      {slides.map((slide, index) => (
        <div
          key={`${slide.title}-${index}`}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${currentSlide === index ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
        >
          <div className="relative w-full h-[80vh]">
            <Image
              src={slide.image}
              alt={slide.title}
              className="object-cover"
              fill
              priority
            />
          </div>

          <div className="absolute inset-0 bg-emerald-900/60" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 text-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{slide.title}</h1>
            <p className="text-sm md:text-lg max-w-xl">{slide.text}</p>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              slideRef.current = index; // Sync ref
            }}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-emerald-400 w-4" : "bg-white/60"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
