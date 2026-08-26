"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMedicationFormClient({ residents }: { residents: any[] }) {
  const router = useRouter();
  const [selectedResidentId, setSelectedResidentId] = useState("");

  const handleSelect = (id: string) => {
    setSelectedResidentId(id);
    if (id) {
      router.push(`/dashboard/emar/resident/${id}/manage`);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-6">
        <label className="block text-sm font-bold text-gray-900 mb-3">Select Resident to Manage Prescriptions</label>
        <select 
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          value={selectedResidentId}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">-- Choose Resident --</option>
          {residents.map(r => (
            <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500">
        Please select a resident to view, edit, or add their medications.
      </p>
    </div>
  );
}
