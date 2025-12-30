// src/app/(public)/layout.tsx
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ClientWrapper from "@/components/wrappers/ClientWrapper";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientWrapper>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </ClientWrapper>
  );
}
