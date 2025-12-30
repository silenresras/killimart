"use client";

import { useEffect, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";

const WHATSAPP_NUMBER = "254757378874";
const WHATSAPP_MESSAGE = encodeURIComponent("Hi, I have a question about an item on SmartKenya.");

export default function ChatWhatsapp() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="
        fixed bottom-4 right-4 z-50
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-green-500 text-white
        shadow-xl hover:bg-green-600
        transition-all duration-300 ease-in-out
        hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
      "
    >
      <BsWhatsapp size={28} />
    </a>
  );
}