import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CreateRoleForm from "../CreateRoleForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AddRolePage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/roles" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Roles
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Role</h1>
        <CreateRoleForm careHomeId={careHomeId} />
      </div>
    </div>
  );
}
