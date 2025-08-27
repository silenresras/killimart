// src/app/layout.tsx
import RouteLoader from "@/components/loader/RouteLoader";
import "./globals.css";
import { CartProvider } from "@/components/Context/CartContext";
import ChatWhatsapp from "@/components/chatbot/ChatWhatsapp";

import MaintenancePage from "@/components/maintanance/MaintainancePage";
import CookieConsent from "@/components/ui/CookieConsent";
import UpdateNotification from "@/components/ui/UpdateNotification";

const MAINTENANCE_MODE = false; // ⛔ Set to false when ready

export const metadata = {
  title: "Killimart",
  description: "Electronics, Computers & Accessories",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  if (MAINTENANCE_MODE) {
    return (
      <html lang="en">
        <body>
          <MaintenancePage />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <CartProvider>
        <body className="bg-white relative">
          <RouteLoader />
          <ChatWhatsapp />
          <CookieConsent />
          <UpdateNotification />
          {children}
        </body>
      </CartProvider>
    </html>
  );
}
