"use client";

import { useState } from "react";
import { updateCareHomeSettings } from "./actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SettingsForm({ careHome }: { careHome: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await updateCareHomeSettings(careHome.id, formData);
      setMessage("Settings saved successfully!");
    } catch (error) {
      setMessage("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Care Home Name *</label>
          <input 
            type="text" 
            name="name" 
            defaultValue={careHome.name} 
            placeholder="e.g. Sunrise Care Home"
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code *</label>
          <input 
            type="text" 
            name="branchCode" 
            defaultValue={careHome.branchCode} 
            placeholder="e.g. B-001"
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea 
          name="address" 
          defaultValue={careHome.address || ""} 
          placeholder="e.g. 123 High Street, London..."
          rows={3} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
        />
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button 
          type="submit" 
          disabled={loading} 
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
