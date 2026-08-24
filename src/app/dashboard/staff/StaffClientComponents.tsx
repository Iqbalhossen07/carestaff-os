"use client";

import { useState } from "react";
import { createStaffMember } from "./actions";

export function AddStaffForm({ careHomeId, roles }: { careHomeId: string, roles: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createStaffMember(new FormData(e.currentTarget), careHomeId);
      (e.target as HTMLFormElement).reset();
      alert("Staff member added successfully. Default password is: carestaff123");
    } catch (error) {
      alert("Failed to add staff member. Email might already exist.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <h3 className="font-bold text-gray-900 mb-4">Add New Staff Member</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" name="name" required placeholder="e.g. John Doe" className="w-full px-4 py-2 border rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input type="email" name="email" required placeholder="john@example.com" className="w-full px-4 py-2 border rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
        <select name="roleId" className="w-full px-4 py-2 border rounded-lg text-gray-700">
          <option value="">-- No Specific Role --</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      </div>

      <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg mt-2">
        <strong>Note:</strong> Default password for new staff is <code>carestaff123</code>.
      </div>

      <button type="submit" disabled={loading} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg">
        {loading ? "Adding..." : "Add Staff Member"}
      </button>
    </form>
  );
}
