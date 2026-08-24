import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CreateRoleForm from "./CreateRoleForm";
import { ShieldCheck, Check, X } from "lucide-react";

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
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            Role & Permission Management
          </h1>
          <p className="text-gray-500 mt-2">
            Create custom roles and manage granular access permissions for your staff.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Form */}
        <div className="lg:col-span-1">
          <CreateRoleForm careHomeId={session?.user?.careHomeId as string} />
        </div>

        {/* Right Column: Roles List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Existing Roles</h2>
          
          {roles.map((role) => (
            <div key={role.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role._count.users} Users assigned</p>
                </div>
                {role.isSuperAdmin && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    Super Admin
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-y-2 mt-4">
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
