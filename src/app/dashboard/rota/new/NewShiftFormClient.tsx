"use client";

import { useState } from "react";
import { createShift } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function NewShiftFormClient({ careHomeId, staffMembers }: { careHomeId: string, staffMembers: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      careHomeId,
      title: formData.get("title") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      assignedToId: formData.get("assignedToId") as string,
      notes: formData.get("notes") as string,
    };

    try {
      const res = await createShift(data);
      if (res.error) throw new Error(res.error);
      
      Swal.fire('Success', 'Shift created successfully', 'success');
      router.push("/dashboard/rota");
      router.refresh();
    } catch (error: any) {
      Swal.fire('Error', error.message || "Failed to create shift", 'error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Required Role *</label>
        <select name="title" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">Select Role...</option>
          <option value="Senior Nurse">Senior Nurse</option>
          <option value="Care Assistant">Care Assistant</option>
          <option value="Support Worker">Support Worker</option>
          <option value="Cleaner">Cleaner</option>
          <option value="Kitchen Staff">Kitchen Staff</option>
          <option value="Activity Coordinator">Activity Coordinator</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
          <input type="datetime-local" name="startTime" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
          <input type="datetime-local" name="endTime" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Staff (Optional)</label>
        <select name="assignedToId" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">-- Leave Open (Staff can pick up) --</option>
          {staffMembers.map(staff => (
            <option key={staff.id} value={staff.id}>{staff.name} - {staff.email}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shift Notes & Instructions (Optional)</label>
        <textarea name="notes" rows={3} placeholder="Any specific tasks or instructions for this shift..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
        <Link href="/dashboard/rota" className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm">
          {loading ? "Creating..." : "Create Shift"}
        </button>
      </div>
    </form>
  );
}
