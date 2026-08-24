"use client";

import { useState } from "react";
import { addMedication, logMedicationAdmin } from "./actions";

export function AddMedicationForm({ residents }: { residents: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMedication(new FormData(e.currentTarget));
      (e.target as HTMLFormElement).reset();
      alert("Medication added successfully!");
    } catch (error) {
      alert("Failed to add medication.");
    }
    setLoading(false);
  };

  if (residents.length === 0) {
    return <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg text-sm">Please add a resident first before adding medications.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <h3 className="font-bold text-gray-900 mb-4">Add New Medication</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Resident</label>
        <select name="residentId" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500">
          <option value="">-- Choose Resident --</option>
          {residents.map(r => (
            <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
          <input type="text" name="name" required placeholder="e.g. Paracetamol" className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
          <input type="text" name="dosage" required placeholder="e.g. 500mg" className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
          <select name="frequency" required className="w-full px-4 py-2 border rounded-lg">
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
            <option value="As Needed (PRN)">As Needed (PRN)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
          <select name="route" required className="w-full px-4 py-2 border rounded-lg">
            <option value="Oral">Oral</option>
            <option value="Injection">Injection</option>
            <option value="Topical">Topical</option>
            <option value="Inhalation">Inhalation</option>
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg">
        {loading ? "Adding..." : "Add Medication"}
      </button>
    </form>
  );
}

export function EmarActionButtons({ medicationId, residentId, staffId }: { medicationId: string, residentId: string, staffId: string }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (status: string) => {
    setLoading(true);
    await logMedicationAdmin(medicationId, residentId, staffId, status);
    setLoading(false);
  };

  return (
    <div className="flex gap-2 mt-3">
      <button 
        onClick={() => handleAction("ADMINISTERED")}
        disabled={loading}
        className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-bold rounded"
      >
        Given
      </button>
      <button 
        onClick={() => handleAction("REFUSED")}
        disabled={loading}
        className="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold rounded"
      >
        Refused
      </button>
      <button 
        onClick={() => handleAction("MISSED")}
        disabled={loading}
        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded"
      >
        Missed
      </button>
    </div>
  );
}
