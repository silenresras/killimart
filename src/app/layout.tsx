// src/app/layout.tsx
import RouteLoader from "@/components/loader/RouteLoader";
import "./globals.css";
import { CartProvider } from "@/components/Context/CartContext";
import ChatWhatsapp from "@/components/chatbot/ChatWhatsapp";


export const metadata = {
  title: "Killimart",
  description: "Electronics, Computers & Accessories",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <CartProvider>
        <body className="bg-white relative">
          <RouteLoader />
          <ChatWhatsapp />
          {children}
        </body>
      </CartProvider>
    </html>
  );
}
