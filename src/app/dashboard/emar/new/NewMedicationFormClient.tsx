"use client";

import { useState } from "react";
import { addMultipleMedications } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { Plus, Trash2 } from "lucide-react";

export default function NewMedicationFormClient({ residents }: { residents: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [residentId, setResidentId] = useState("");
  
  // Default to today
  const today = new Date().toISOString().split('T')[0];

  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "Morning", route: "Oral", mealInstruction: "", startDate: today, endDate: "", instructions: "" }
  ]);

  if (residents.length === 0) {
    return (
      <div className="p-6 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
        <p className="font-bold">No residents found</p>
        <p className="text-sm mt-1">Please add a resident to your care home first before assigning medications.</p>
      </div>
    );
  }

  const handleAddRow = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "Morning", route: "Oral", mealInstruction: "", startDate: today, endDate: "", instructions: "" }]);
  };

  const handleRemoveRow = (index: number) => {
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
    if (!residentId) {
      Swal.fire('Error', 'Please select a resident.', 'error');
      return;
    }
    
    // Validate
    const invalid = medications.some(m => !m.name || !m.dosage || !m.frequency || !m.startDate);
    if (invalid) {
      Swal.fire('Error', 'Please fill all required fields (Name, Dosage, Frequency, Start Date).', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const res = await addMultipleMedications({ residentId, medications });
      if (res.error) throw new Error(res.error);
      
      Swal.fire('Success', 'Medications added successfully', 'success');
      router.push("/dashboard/emar");
      router.refresh();
    } catch (error: any) {
      Swal.fire('Error', error.message || "Failed to add medications", 'error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
        <label className="block text-sm font-bold text-blue-900 mb-2">Select Resident *</label>
        <select 
          required 
          value={residentId}
          onChange={(e) => setResidentId(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
        >
          <option value="">-- Choose Resident --</option>
          {residents.map(r => (
            <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-lg font-bold text-gray-900">Medications List</h2>
        </div>

        {medications.map((med, index) => (
          <div key={index} className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
            
            {medications.length > 1 && (
              <button 
                type="button" 
                onClick={() => handleRemoveRow(index)}
                className="absolute -top-3 -right-3 bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full shadow-sm transition-colors"
                title="Remove Medication"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Medication Name *</label>
                <input 
                  type="text" 
                  required 
                  value={med.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="e.g. Paracetamol" 
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dosage *</label>
                <input 
                  type="text" 
                  required 
                  value={med.dosage}
                  onChange={(e) => handleChange(index, 'dosage', e.target.value)}
                  placeholder="e.g. 500mg, 2 Puffs" 
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Route</label>
                <select 
                  value={med.route}
                  onChange={(e) => handleChange(index, 'route', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="Oral">Oral (Mouth)</option>
                  <option value="Injection">Injection</option>
                  <option value="Topical">Topical (Skin)</option>
                  <option value="Inhalation">Inhalation</option>
                  <option value="Drops">Drops</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Meal Instruction</label>
                <select 
                  value={med.mealInstruction}
                  onChange={(e) => handleChange(index, 'mealInstruction', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
                  <option value="">-- Select --</option>
                  <option value="Before Meal">Before Meal</option>
                  <option value="After Meal">After Meal</option>
                  <option value="With Meal">With Meal</option>
                  <option value="Anytime">Anytime</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Frequency (Time) *</label>
                <select 
                  required 
                  value={med.frequency}
                  onChange={(e) => handleChange(index, 'frequency', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                >
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
                <input 
                  type="date" 
                  required 
                  value={med.startDate}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">End Date (Optional)</label>
                <input 
                  type="date" 
                  value={med.endDate}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Instructions</label>
                <input 
                  type="text" 
                  value={med.instructions}
                  onChange={(e) => handleChange(index, 'instructions', e.target.value)}
                  placeholder="e.g. Take after food" 
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                />
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
      </div>

      <div className="pt-6 flex justify-end gap-3 border-t border-gray-200">
        <Link href="/dashboard/emar" className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 shadow-sm text-lg">
          {loading ? "Saving..." : "Save All Medications"}
        </button>
      </div>
    </form>
  );
}
