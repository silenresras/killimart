interface CategoryCardProps {
    name: string;
  }
  
  export default function CategoryCard({ name }: CategoryCardProps) {
    return (
      <div className="p-6 text-center bg-white rounded shadow hover:shadow-md cursor-pointer transition">
        <span className="font-semibold text-gray-700">{name}</span>
      </div>
    );
  }
  