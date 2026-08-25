"use client";

import { useState } from "react";
import { addMedication } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function NewMedicationFormClient({ residents }: { residents: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (residents.length === 0) {
    return (
      <div className="p-6 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
        <p className="font-bold">No residents found</p>
        <p className="text-sm mt-1">Please add a resident to your care home first before assigning medications.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      residentId: formData.get("residentId") as string,
      name: formData.get("name") as string,
      dosage: formData.get("dosage") as string,
      frequency: formData.get("frequency") as string,
      instructions: formData.get("instructions") as string,
    };

    try {
      const res = await addMedication(data);
      if (res.error) throw new Error(res.error);
      
      Swal.fire('Success', 'Medication added successfully', 'success');
      router.push("/dashboard/emar");
      router.refresh();
    } catch (error: any) {
      Swal.fire('Error', error.message || "Failed to add medication", 'error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Resident *</label>
        <select name="residentId" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">-- Choose Resident --</option>
          {residents.map(r => (
            <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name *</label>
          <input type="text" name="name" required placeholder="e.g. Paracetamol" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
          <input type="text" name="dosage" required placeholder="e.g. 500mg, 2 Puffs" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
          <select name="frequency" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="Twice Daily (BID)">Twice Daily (BID)</option>
            <option value="Three Times Daily (TID)">Three Times Daily (TID)</option>
            <option value="As Needed (PRN)">As Needed (PRN)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instructions (Optional)</label>
          <input type="text" name="instructions" placeholder="e.g. Take with food" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
        <Link href="/dashboard/emar" className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm">
          {loading ? "Adding..." : "Add Medication"}
        </button>
      </div>
    </form>
  );
}
