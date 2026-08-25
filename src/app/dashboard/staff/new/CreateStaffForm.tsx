"use client";

import { useState } from "react";
import { createStaffMember } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateStaffForm({ careHomeId, roles }: { careHomeId: string, roles: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await createStaffMember(formData, careHomeId);
      alert("Staff added and email sent successfully!");
      router.push("/dashboard/staff");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to add staff or send email. Check your SMTP settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
        <input
          type="text"
          name="name"
          placeholder="e.g. John Doe"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
        <input
          type="email"
          name="email"
          placeholder="john.doe@example.com"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
        <select
          name="roleId"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
        >
          <option value="">No custom role (Standard Worker)</option>
          {roles.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100">
        <strong>Note:</strong> A random 8-character password will be securely generated. Both you and the new staff member will receive an email notification immediately after creation.
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Link 
          href="/dashboard/staff"
          className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? "Adding Staff & Sending Email..." : "Add Staff Member"}
        </button>
      </div>
    </form>
  );
}
