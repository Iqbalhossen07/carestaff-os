"use client";

import { useState } from "react";
import { reportIncident } from "./actions";
import { AlertOctagon } from "lucide-react";

export function IncidentForm() {
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
      await reportIncident(formData);
      setSuccess("Incident reported successfully and management has been notified.");
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
        <label className="block text-sm font-bold text-gray-700 mb-1">Incident Title</label>
        <input 
          type="text"
          name="title" 
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
          placeholder="e.g., Slip and Fall in Hallway B"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Severity Level</label>
        <select 
          name="severity" 
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white transition-colors"
        >
          <option value="">Select Severity</option>
          <option value="LOW">Low (Minor issue, no injury)</option>
          <option value="MEDIUM">Medium (Requires attention, minor injury)</option>
          <option value="HIGH">High (Severe injury, emergency)</option>
          <option value="CRITICAL">Critical (Life threatening)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Description & Details</label>
        <textarea 
          name="description" 
          rows={5} 
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
          placeholder="Provide a detailed account of what happened, who was involved, and any immediate actions taken..."
        ></textarea>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-sm"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              <AlertOctagon className="w-5 h-5" /> Submit Incident Report
            </>
          )}
        </button>
      </div>
    </form>
  );
}
