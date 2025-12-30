import { useAuthStore } from "@/store/AuthStore";

export default function AccountOverview() {
  const { user } = useAuthStore();
  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name} 👋</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold mb-2">Email</h3>
          <p>{user?.email}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold mb-2">Verified</h3>
          <p>{user?.isVerified ? "✅ Verified" : "❌ Not Verified"}</p>
        </div>
      </div>
    </div>
  );
}
