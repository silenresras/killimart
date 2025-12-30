// src/components/admin/topbar/AdminTopbar.tsx
import { Menu } from "lucide-react";

export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="w-full bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm md:rounded-bl-2xl">
      <div className="flex items-center space-x-4">
        {/* Hamburger menu only on small screens */}
        <button className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold">Killimart Admin</h1>
      </div>
      <div className="text-sm text-gray-600">Admin User</div>
    </header>
  );
}
