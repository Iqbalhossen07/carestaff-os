"use client";

import { useState } from "react";
import { createRole, updateRole } from "./actions";
import { useRouter } from "next/navigation";

export default function CreateRoleForm({ careHomeId, initialData }: { careHomeId?: string, initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (isEdit) {
        await updateRole(initialData.id, formData);
        alert("Role updated successfully!");
        router.push("/dashboard/roles");
      } else {
        if (!careHomeId) throw new Error("CareHome ID missing");
        await createRole(formData, careHomeId);
        (e.target as HTMLFormElement).reset();
        alert("Role created successfully!");
        router.push("/dashboard/roles");
      }
    } catch (error: any) {
      alert(error.message || "Error saving role.");
    } finally {
      setLoading(false);
    }
  };

  const perms = [
    { name: "canViewDashboard", label: "View Dashboard" },
    { name: "canManageRoles", label: "Manage Roles & Permissions" },
    { name: "canManageStaff", label: "Manage Staff Directory & HR" },
    { name: "canViewResidents", label: "View Residents & Profiles" },
    { name: "canManageCRM", label: "Manage Sales & Admissions" },
    { name: "canEditRota", label: "Manage Staff Rota & Shifts" },
    { name: "canViewEmar", label: "Manage eMAR Overview" },
    { name: "canManageMessages", label: "Access Live Messages" },
    { name: "canManageKitchen", label: "Manage Kitchen & Nutrition" },
    { name: "canManageMaintenance", label: "Manage Maintenance" },
    { name: "canManageVisitors", label: "Manage Visitor Logs" },
    { name: "canManageSafeguarding", label: "Manage Safeguarding" },
    { name: "canViewFinance", label: "Manage Finance & Billing" },
    { name: "canManageReports", label: "View Reports & Compliance" },
    { name: "canManageProfile", label: "Manage My Profile" },
    { name: "canManageSettings", label: "Manage Global Settings" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={initialData?.name || ""}
          placeholder="e.g. Senior Nurse"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
        />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Module Permissions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {perms.map(p => (
            <label key={p.name} className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name={p.name} 
                defaultChecked={initialData ? initialData[p.name] : (p.name === 'canViewResidents' || p.name === 'canManageMessages')}
                className="w-4 h-4 text-blue-600 rounded border-gray-300" 
              />
              <span className="text-sm text-gray-600">{p.label}</span>
            </label>
          ))}
        </div>
        
        <label className="flex items-center gap-3 cursor-pointer mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
          <input 
            type="checkbox" 
            name="isSuperAdmin" 
            defaultChecked={initialData?.isSuperAdmin}
            className="w-5 h-5 text-red-600 rounded border-red-300 focus:ring-red-500" 
          />
          <div>
            <span className="text-sm font-bold text-red-800 block">Full Super Admin Access</span>
            <span className="text-xs text-red-600">Grants access to absolutely everything in the system, bypassing granular permissions.</span>
          </div>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/roles")}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : (isEdit ? "Update Role" : "Create Role")}
        </button>
      </div>
    </form>
  );
}
