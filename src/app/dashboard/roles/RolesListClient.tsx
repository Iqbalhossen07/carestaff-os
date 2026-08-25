"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";
import { deleteRole } from "./actions";
import { ActionMenu } from "@/components/ui/ActionButtons";

export default function RolesListClient({ roles }: { roles: any[] }) {

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the role "${name}"?`)) {
      try {
        await deleteRole(id);
      } catch (err: any) {
        alert(err.message || "Failed to delete role.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {roles.map((role) => (
        <div key={role.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                {role.name}
                {role.isSuperAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    Super Admin
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {role._count.users} Users assigned
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ActionMenu 
                editHref={`/dashboard/roles/${role.id}`} 
                onDelete={() => handleDelete(role.id, role.name)} 
                itemName="role" 
              />
            </div>
          </div>
          
          {!role.isSuperAdmin && (
            <div className="bg-gray-50 p-6 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2">
                <PermItem label="Residents" hasPermission={role.canViewResidents} />
                <PermItem label="eMAR" hasPermission={role.canViewEmar} />
                <PermItem label="Rota" hasPermission={role.canEditRota} />
                <PermItem label="Staff & HR" hasPermission={role.canManageStaff} />
                <PermItem label="Messages" hasPermission={role.canManageMessages} />
                <PermItem label="Kitchen" hasPermission={role.canManageKitchen} />
                <PermItem label="Maintenance" hasPermission={role.canManageMaintenance} />
                <PermItem label="Visitors" hasPermission={role.canManageVisitors} />
                <PermItem label="Safeguarding" hasPermission={role.canManageSafeguarding} />
                <PermItem label="Finance" hasPermission={role.canViewFinance} />
                <PermItem label="CRM" hasPermission={role.canManageCRM} />
                <PermItem label="Reports" hasPermission={role.canManageReports} />
              </div>
            </div>
          )}
          {role.isSuperAdmin && (
            <div className="bg-blue-50/50 p-6 border-t border-blue-100">
              <p className="text-sm text-blue-800 font-medium">This role has unrestricted access to all modules and settings.</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PermItem({ label, hasPermission }: { label: string; hasPermission: boolean }) {
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
