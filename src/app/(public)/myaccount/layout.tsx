import { ReactNode } from "react";
import Sidebar from "@/components/UserDashboard/Sidebar"; // Client component

export default function MyAccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 px-2 md:px-4 py-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="mr-3"><Sidebar /></div>
        <main className="flex-1 bg-white rounded-2xl shadow p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
