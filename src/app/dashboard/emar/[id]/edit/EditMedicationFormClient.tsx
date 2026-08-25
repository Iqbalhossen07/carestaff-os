"use client";

import { useState } from "react";
import { updateMedication } from "../../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function EditMedicationFormClient({ medication }: { medication: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toLocalDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      dosage: formData.get("dosage") as string,
      frequency: formData.get("frequency") as string,
      route: formData.get("route") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      status: formData.get("status") as string,
      instructions: formData.get("instructions") as string,
    };

    try {
      const res = await updateMedication(medication.id, data);
      if (res.error) throw new Error(res.error);
      
      Swal.fire('Success', 'Medication updated successfully', 'success');
      router.push("/dashboard/emar");
      router.refresh();
    } catch (error: any) {
      Swal.fire('Error', error.message || "Failed to update medication", 'error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name *</label>
          <input type="text" name="name" defaultValue={medication.name} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
          <input type="text" name="dosage" defaultValue={medication.dosage} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
          <select name="route" defaultValue={medication.route || "Oral"} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="Oral">Oral (Mouth)</option>
            <option value="Injection">Injection</option>
            <option value="Topical">Topical (Skin)</option>
            <option value="Inhalation">Inhalation</option>
            <option value="Drops">Drops</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency (Time) *</label>
          <select name="frequency" defaultValue={medication.frequency} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="Twice Daily (BID)">Twice Daily (BID)</option>
            <option value="Three Times Daily (TID)">Three Times Daily (TID)</option>
            <option value="Four Times Daily (QDS)">Four Times Daily (QDS)</option>
            <option value="As Needed (PRN)">As Needed (PRN)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" defaultValue={medication.status || "ACTIVE"} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="ACTIVE">Active</option>
            <option value="DISCONTINUED">Discontinued</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
          <input type="date" name="startDate" defaultValue={toLocalDate(medication.startDate)} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
          <input type="date" name="endDate" defaultValue={toLocalDate(medication.endDate)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Instructions (Optional)</label>
          <input type="text" name="instructions" defaultValue={medication.instructions || ""} placeholder="e.g. Take with food" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
        <Link href="/dashboard/emar" className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
