"use client";

import { useState, useEffect } from "react";
import { addMultipleMedications } from "../actions";
import { getResidentMedications } from "./actions";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Info } from "lucide-react";
import Swal from "sweetalert2";

export default function NewMedicationFormClient({ residents }: { residents: any[] }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [existingMeds, setExistingMeds] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  const [medications, setMedications] = useState([{
    name: "", dosage: "", frequency: "Morning", route: "Oral", mealInstruction: "", startDate: "", endDate: "", instructions: "", status: "ACTIVE"
  }]);

  useEffect(() => {
    if (!selectedResidentId) {
      setExistingMeds([]);
      return;
    }

    const fetchMeds = async () => {
      setFetching(true);
      const res = await getResidentMedications(selectedResidentId);
      if (res.meds) {
        setExistingMeds(res.meds);
      }
      setFetching(false);
    };

    fetchMeds();
  }, [selectedResidentId]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...medications];
    (updated[index] as any)[field] = value;
    setMedications(updated);
  };

  const addRow = () => {
    setMedications([...medications, {
      name: "", dosage: "", frequency: "Morning", route: "Oral", mealInstruction: "", startDate: "", endDate: "", instructions: "", status: "ACTIVE"
    }]);
  };

  const removeRow = (index: number) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
  };

  const handleSubmit = async () => {
    if (!selectedResidentId) {
      return Swal.fire('Error', 'Please select a resident first', 'error');
    }

    const isValid = medications.every(m => m.name && m.dosage && m.frequency && m.startDate);
    if (!isValid) {
      return Swal.fire('Error', 'Please fill all required fields in the medication list', 'error');
    }

    setLoading(true);
    try {
      const res = await addMultipleMedications({ residentId: selectedResidentId, medications });
      if (res.error) throw new Error(res.error);
      
      Swal.fire('Success', 'Prescriptions added successfully', 'success');
      router.push("/dashboard/emar");
      router.refresh();
    } catch (error: any) {
      Swal.fire('Error', error.message || "Failed to add medications", 'error');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Resident Selection */}
      <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
        <label className="block text-sm font-bold text-gray-900 mb-3">Select Resident *</label>
        <select 
          className="w-full md:w-1/2 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          value={selectedResidentId}
          onChange={(e) => setSelectedResidentId(e.target.value)}
        >
          <option value="">-- Choose Resident --</option>
          {residents.map(r => (
            <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
          ))}
        </select>
      </div>

      {/* Existing Medications Read-Only Table */}
      {selectedResidentId && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Current Active Medications
          </h3>
          
          {fetching ? (
            <p className="text-sm text-gray-500 italic">Loading current medications...</p>
          ) : existingMeds.length === 0 ? (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 italic">
              No active medications found for this resident.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Medication</th>
                    <th className="px-4 py-3">Dosage</th>
                    <th className="px-4 py-3">Frequency</th>
                    <th className="px-4 py-3">Start Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                  {existingMeds.map(med => (
                    <tr key={med.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{med.name}</td>
                      <td className="px-4 py-3">{med.dosage}</td>
                      <td className="px-4 py-3">
                        {med.frequency} 
                        {med.mealInstruction && <span className="ml-2 text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider">{med.mealInstruction}</span>}
                      </td>
                      <td className="px-4 py-3">{new Date(med.startDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* New Medications Form */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Add New Prescriptions</h2>
        
        <div className="space-y-6">
          {medications.map((med, index) => (
            <div key={index} className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl relative">
              
              {medications.length > 1 && (
                <button 
                  onClick={() => removeRow(index)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
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
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                  <select 
                    value={med.status || "ACTIVE"}
                    onChange={(e) => handleChange(index, 'status', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="DISCONTINUED">Discontinued</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Instructions (Optional)</label>
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
            onClick={addRow}
            className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" /> Add Another Medication
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
        <Link href="/dashboard/emar" className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
          Cancel
        </Link>
        <button 
          onClick={handleSubmit} 
          disabled={loading || !selectedResidentId} 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? "Saving..." : "Save All Medications"}
        </button>
      </div>
    </div>
  );
}
