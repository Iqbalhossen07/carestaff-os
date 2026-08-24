"use client";

import { useState } from "react";
import { addProgressNote } from "./actions";

export function AddProgressNoteForm({ residentId }: { residentId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(e.currentTarget);
      await addProgressNote(residentId, formData);
      setSuccess("Care log added successfully.");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>}

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Care Notes</label>
        <textarea 
          name="note" 
          rows={4} 
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="Describe the resident's day, any issues, or general observations..."
        ></textarea>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Mood (Optional)</label>
          <select name="mood" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
            <option value="">Select mood</option>
            <option value="Happy">Happy</option>
            <option value="Calm">Calm</option>
            <option value="Anxious">Anxious</option>
            <option value="Agitated">Agitated</option>
            <option value="Sad">Sad</option>
            <option value="Tired">Tired</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Food Intake (Optional)</label>
          <select name="foodIntake" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
            <option value="">Select intake</option>
            <option value="Good">Good (Ate most/all)</option>
            <option value="Fair">Fair (Ate half)</option>
            <option value="Poor">Poor (Ate very little)</option>
            <option value="Refused">Refused</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-70 flex justify-center"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            "Add Care Log"
          )}
        </button>
      </div>
    </form>
  );
}
