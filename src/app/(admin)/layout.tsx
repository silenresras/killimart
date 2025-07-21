import AdminSidebar from "@/components/admin/sidebar/AdminSidebar";
import AdminTopbar from "@/components/admin/topbar/AdminTopbar";

// src/app/(admin)/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <AdminSidebar ></AdminSidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminTopbar></AdminTopbar>
        <main className="p-6 bg-gray-100 flex-1">{children}</main>
      </div>
    </div>
  );
}
