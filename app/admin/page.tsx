import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  // Check if user is admin
  const userIsAdmin = await isAdmin();

  if (!userIsAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">도시를 추가하고 관리할 수 있습니다</p>
        </div>

        <AdminDashboard />
      </div>
    </div>
  );
}
