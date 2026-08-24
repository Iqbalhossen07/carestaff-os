"use client";

import { useState } from "react";
import { createRole } from "./actions";

export default function CreateRoleForm({ careHomeId }: { careHomeId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await createRole(formData, careHomeId);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      alert("Error creating role. It might already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Role</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Senior Nurse"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
          />
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700">Permissions</h3>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="canViewEmar" className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm text-gray-600">View and Edit eMAR</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="canEditRota" className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm text-gray-600">Manage Staff Rota</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="canViewFinance" className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm text-gray-600">View Finance & Billing</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="canManageKitchen" className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm text-gray-600">Manage Kitchen & Dietary</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer mt-4 p-3 bg-red-50 rounded-lg">
            <input type="checkbox" name="isSuperAdmin" className="w-4 h-4 text-red-600 rounded" />
            <span className="text-sm font-medium text-red-800">Full Super Admin Access</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Save Role"}
        </button>
      </form>
    </div>
  );
}
