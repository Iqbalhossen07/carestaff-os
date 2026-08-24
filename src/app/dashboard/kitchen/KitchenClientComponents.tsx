"use client";

import { useState } from "react";
import { updateDietaryProfile } from "./actions";
import { Utensils, AlertTriangle } from "lucide-react";

export function DietaryForm({ resident }: { resident: any }) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await updateDietaryProfile(resident.id, new FormData(e.currentTarget));
    setLoading(false);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="font-semibold text-gray-700 w-24">Diet:</span>
            <span className="text-gray-600">{resident.dietaryNeeds || "No specific requirements"}</span>
          </div>
          <div className="flex gap-2 items-start">
            <span className="font-semibold text-red-700 w-24 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4"/> Allergies:
            </span>
            <span className="text-red-600 font-medium">{resident.allergies || "None recorded"}</span>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Dietary Requirements</label>
        <input 
          type="text" 
          name="dietaryNeeds" 
          defaultValue={resident.dietaryNeeds || ""} 
          placeholder="e.g. Vegetarian, Diabetic, Soft Food"
          className="w-full px-3 py-1.5 border rounded-lg text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-red-700 mb-1">Allergies</label>
        <input 
          type="text" 
          name="allergies" 
          defaultValue={resident.allergies || ""} 
          placeholder="e.g. Peanuts, Gluten, Dairy"
          className="w-full px-3 py-1.5 border border-red-200 bg-red-50 rounded-lg text-sm"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={() => setIsEditing(false)} className="text-xs px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
        <button type="submit" disabled={loading} className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
