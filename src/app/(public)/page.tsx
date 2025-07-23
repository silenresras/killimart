import Hero from "@/components/Hero/Hero";
import ProductSection from "@/components/Products/ProductSection";
import CategoryCard from "@/components/Category/CategoryCard";
import SectionTitle from "@/components/Sections/SectionTitle";
import LatestProductsSection from "@/components/Products/LatestProductsSection";
import HotDealsSection from "@/components/Products/HotDealsSection";

export default function Home() {
  return (
    <main className="p-6 space-y-12 bg-gray-50">
      <Hero />
      <LatestProductsSection />

      <HotDealsSection />

      <ProductSection title="Laptops" category="Laptops" href="/category/laptops" />


      <section>
        <SectionTitle title="📦Top Categories" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryCard name="Laptops" />
          <CategoryCard name="Desktops" />
          <CategoryCard name="Accessories" />
          <CategoryCard name="Storage Devices" />
        </div>
      </section>

      <ProductSection title="Computer Desktops" category="desktops" href="/category/desktops" />

      <ProductSection title="Accessories" category="accessories" href="/category/accessories" />

      <section>
        <SectionTitle title="Kllimart Online Sellers" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CategoryCard name="We Deliver Countrywide" />
          <CategoryCard name="Secure Payments" />
          <CategoryCard name="Trusted Online Seller" />
          <CategoryCard name="Fast Delivery 3-5 days" />
        </div>
      </section>

      <ProductSection title="Networking" category="networking" href="/category/networking" />
      
    </main>
  );
}
