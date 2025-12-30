import { useAuthStore } from "@/store/AuthStore";

export default function Settings() {
  const { user } = useAuthStore();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <form className="space-y-6 max-w-lg">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            defaultValue={user?.name}
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            className="w-full border border-gray-300 rounded px-4 py-2"
            disabled
          />
        </div>
        {/* You can later add change password or update profile */}
        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
        >
          Edit Profile (Coming Soon)
        </button>
      </form>
    </div>
  );
}
