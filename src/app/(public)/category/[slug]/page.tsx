import { fetchProductsByCategory } from "@/lib/fetchProductsByCategory";
import { fetchHotDeals } from "@/lib/fetchHotDeals";
import ProductCard from "@/components/Products/ProductCard";
import SectionTitle from "@/components/Sections/SectionTitle";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;  

  let products = [];

  if (slug === "hot-deals") {
    products = await fetchHotDeals();
  } else {
    products = await fetchProductsByCategory(slug);
  }

  const title =
    slug === "hot-deals"
      ? "🔥 Hot Deals"
      : `Products in ${slug
          .replace(/-/g, " ")
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ")}`;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <SectionTitle title={title} />
      {products.length === 0 ? (
        <p className="text-gray-600 mt-6">
          No products found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
