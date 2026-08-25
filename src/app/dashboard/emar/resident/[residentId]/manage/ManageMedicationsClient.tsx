"use client";

import { useState } from "react";
import { saveResidentMedicationsBulk } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { Plus, Trash2 } from "lucide-react";

export default function ManageMedicationsClient({ residentId, existingMedications }: { residentId: string, existingMedications: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toLocalDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split('T')[0];
  };

  const initialMeds = existingMedications.map(m => ({
    id: m.id,
    name: m.name,
    dosage: m.dosage,
    route: m.route || "Oral",
    frequency: m.frequency,
    startDate: toLocalDate(m.startDate),
    endDate: toLocalDate(m.endDate),
    status: m.status || "ACTIVE",
    instructions: m.instructions || ""
  }));

  const [medications, setMedications] = useState(initialMeds.length > 0 ? initialMeds : [
    { id: `new-${Date.now()}`, name: "", dosage: "", route: "Oral", frequency: "Morning", startDate: new Date().toISOString().split('T')[0], endDate: "", status: "ACTIVE", instructions: "" }
  ]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const handleAddRow = () => {
    setMedications([...medications, { 
      id: `new-${Date.now()}`, name: "", dosage: "", route: "Oral", frequency: "Morning", startDate: new Date().toISOString().split('T')[0], endDate: "", status: "ACTIVE", instructions: "" 
    }]);
  };

  const handleRemoveRow = (index: number, id: string) => {
    if (!id.startsWith('new-')) {
      setDeletedIds([...deletedIds, id]);
    }
    const updated = [...medications];
    updated.splice(index, 1);
    setMedications(updated);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...medications];
    (updated[index] as any)[field] = value;
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate
    if (medications.length === 0 && deletedIds.length === 0) {
      Swal.fire('Info', 'Nothing to save.', 'info');
      return;
    }

    const invalid = medications.some(m => !m.name || !m.dosage || !m.frequency || !m.startDate);
    if (invalid) {
      Swal.fire('Error', 'Please fill all required fields (Name, Dosage, Frequency, Start Date).', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await saveResidentMedicationsBulk({ residentId, medications, deletedIds });
      if (res.error) throw new Error(res.error);
      
      Swal.fire('Success', 'Prescriptions updated successfully', 'success');
      router.push("/dashboard/emar");
      router.refresh();
    } catch (error: any) {
      Swal.fire('Error', error.message || "Failed to update", 'error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {medications.map((med, index) => (
        <div key={med.id} className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
          
          <button 
            type="button" 
            onClick={() => handleRemoveRow(index, med.id)}
            className="absolute -top-3 -right-3 bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full shadow-sm transition-colors"
            title="Remove Medication"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Medication Name *</label>
              <input type="text" required value={med.name} onChange={(e) => handleChange(index, 'name', e.target.value)} placeholder="e.g. Paracetamol" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Dosage *</label>
              <input type="text" required value={med.dosage} onChange={(e) => handleChange(index, 'dosage', e.target.value)} placeholder="e.g. 500mg" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Route</label>
              <select value={med.route} onChange={(e) => handleChange(index, 'route', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                <option value="Oral">Oral (Mouth)</option>
                <option value="Injection">Injection</option>
                <option value="Topical">Topical (Skin)</option>
                <option value="Inhalation">Inhalation</option>
                <option value="Drops">Drops</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Frequency (Time) *</label>
              <select required value={med.frequency} onChange={(e) => handleChange(index, 'frequency', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Start Date *</label>
              <input type="date" required value={med.startDate} onChange={(e) => handleChange(index, 'startDate', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">End Date (Optional)</label>
              <input type="date" value={med.endDate} onChange={(e) => handleChange(index, 'endDate', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
              <select value={med.status} onChange={(e) => handleChange(index, 'status', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                <option value="ACTIVE">Active</option>
                <option value="DISCONTINUED">Discontinued</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">Instructions (Optional)</label>
              <input type="text" value={med.instructions} onChange={(e) => handleChange(index, 'instructions', e.target.value)} placeholder="e.g. Take after food" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
          </div>
        </div>
      ))}

      <button 
        type="button" 
        onClick={handleAddRow}
        className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-colors border border-blue-100 shadow-sm"
      >
        <Plus className="w-5 h-5" /> Add Another Medication
      </button>

      <div className="pt-6 flex justify-end gap-3 border-t border-gray-200">
        <Link href="/dashboard/emar" className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 shadow-sm text-lg">
          {loading ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </form>
  );
}
