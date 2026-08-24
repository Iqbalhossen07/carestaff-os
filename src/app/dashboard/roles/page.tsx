import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ShieldCheck, Check, X, Plus } from "lucide-react";
import Link from "next/link";

export default async function RolesPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch roles for the logged-in user's Care Home
  const roles = await prisma.role.findMany({
    where: {
      careHomeId: session?.user?.careHomeId,
    },
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Existing Roles</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {roles.map((role) => (
            <div key={role.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role._count.users} Users assigned</p>
                </div>
                {role.isSuperAdmin && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                    Super Admin
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <PermissionBadge label="View eMAR" hasPermission={role.canViewEmar} />
                <PermissionBadge label="Edit Rota" hasPermission={role.canEditRota} />
                <PermissionBadge label="View Finance" hasPermission={role.canViewFinance} />
                <PermissionBadge label="Manage Kitchen" hasPermission={role.canManageKitchen} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PermissionBadge({ label, hasPermission }: { label: string, hasPermission: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {hasPermission ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-gray-300" />
      )}
      <span className={hasPermission ? "text-gray-700" : "text-gray-400"}>{label}</span>
    </div>
  );
}
