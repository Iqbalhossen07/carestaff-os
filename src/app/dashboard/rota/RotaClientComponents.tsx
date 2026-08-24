"use client";

import { useState } from "react";
import { createShift, assignShift } from "./actions";

export function CreateShiftForm({ careHomeId, staffMembers }: { careHomeId: string, staffMembers: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createShift(new FormData(e.currentTarget), careHomeId);
      (e.target as HTMLFormElement).reset();
      alert("Shift created successfully!");
    } catch (error) {
      alert("Failed to create shift.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-gray-900 text-xl mb-6">Create New Shift</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Required Role</label>
        <select name="title" required className="w-full px-4 py-2 border border-gray-300 rounded-lg">
          <option value="Senior Nurse">Senior Nurse</option>
          <option value="Care Assistant">Care Assistant</option>
          <option value="Support Worker">Support Worker</option>
          <option value="Cleaner">Cleaner</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input type="datetime-local" name="startTime" required className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input type="datetime-local" name="endTime" required className="w-full px-4 py-2 border rounded-lg" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Staff (Optional)</label>
        <select name="assignedToId" className="w-full px-4 py-2 border border-gray-300 rounded-lg">
          <option value="">-- Leave Open --</option>
          {staffMembers.map(staff => (
            <option key={staff.id} value={staff.id}>{staff.name} ({staff.email})</option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg">
        {loading ? "Creating..." : "Create Shift"}
      </button>
    </form>
  );
}

export function AssignShiftDropdown({ shiftId, staffMembers }: { shiftId: string, staffMembers: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleAssign = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    if (!userId) return;
    
    setLoading(true);
    await assignShift(shiftId, userId);
    setLoading(false);
  };

  return (
    <select 
      onChange={handleAssign} 
      disabled={loading}
      className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 py-1 pl-2 pr-8"
    >
      <option value="">{loading ? "Assigning..." : "Assign Staff"}</option>
      {staffMembers.map(staff => (
        <option key={staff.id} value={staff.id}>{staff.name}</option>
      ))}
    </select>
  );
}
