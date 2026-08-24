"use client";

import { useState } from "react";
import { reportIncident } from "./actions";

export function ReportIncidentForm({ careHomeId, userId }: { careHomeId: string, userId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await reportIncident(new FormData(e.currentTarget), careHomeId, userId);
    (e.target as HTMLFormElement).reset();
    setLoading(false);
    alert("Incident reported successfully for safeguarding review.");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <h3 className="font-bold text-gray-900 mb-4">File Incident Report (RIDDOR)</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Incident Title</label>
        <input type="text" name="title" required placeholder="e.g. Resident Fall in Hallway" className="w-full px-4 py-2 border rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Severity / Risk Level</label>
        <select name="severity" required className="w-full px-4 py-2 border rounded-lg">
          <option value="LOW">Low (Minor cut/bruise)</option>
          <option value="MEDIUM">Medium (Requires basic first aid)</option>
          <option value="HIGH">High (Requires hospital visit)</option>
          <option value="CRITICAL">Critical (Life-threatening / RIDDOR)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
        <textarea name="description" required rows={5} placeholder="Describe what happened, who was involved, and what action was taken..." className="w-full px-4 py-2 border rounded-lg"></textarea>
      </div>

      <button type="submit" disabled={loading} className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg">
        {loading ? "Submitting..." : "Submit Confidential Report"}
      </button>
    </form>
  );
}
