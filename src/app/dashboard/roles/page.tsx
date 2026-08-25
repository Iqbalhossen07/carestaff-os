import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ShieldCheck, Plus } from "lucide-react";
import Link from "next/link";
import RolesListClient from "./RolesListClient";

export default async function RolesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.careHomeId) {
    return <div>Unauthorized</div>;
  }

  const roles = await prisma.role.findMany({
    where: { careHomeId: session.user.careHomeId },
    include: {
      _count: {
        select: { users: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role & Permission Management</h1>
            <p className="text-gray-500 mt-1">
              Create custom roles and manage granular access permissions for your staff.
            </p>
          </div>
        </div>
        <Link 
          href="/dashboard/roles/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add New Role
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Existing Roles</h2>
        
        {roles.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No roles configured yet. Create your first role to get started.
          </div>
        ) : (
          <RolesListClient roles={roles} />
        )}
      </div>
    </div>
  );
}
