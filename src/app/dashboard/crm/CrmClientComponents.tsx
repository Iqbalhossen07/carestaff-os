"use client";

import { useState } from "react";
import { createEnquiry, updateEnquiryStatus } from "./actions";
import { RichTextEditor } from "@/components/RichTextEditor";

export function AddEnquiryForm({ careHomeId }: { careHomeId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEnquiry(new FormData(e.currentTarget), careHomeId);
      (e.target as HTMLFormElement).reset();
      alert("Enquiry added successfully!");
    } catch (error) {
      alert("Failed to add enquiry.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <h3 className="font-bold text-gray-900 mb-4">New Enquiry</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Resident/Family Name</label>
        <input type="text" name="name" required className="w-full px-4 py-2 border rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details (Phone/Email)</label>
        <input type="text" name="contactInfo" required className="w-full px-4 py-2 border rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Notes</label>
        <RichTextEditor name="notes" placeholder="Enter any specific requirements or notes..." />
      </div>

      <button type="submit" disabled={loading} className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg">
        {loading ? "Saving..." : "Add Enquiry"}
      </button>
    </form>
  );
}

export function EnquiryStatusDropdown({ enquiryId, currentStatus }: { enquiryId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    await updateEnquiryStatus(enquiryId, e.target.value);
    setLoading(false);
  };

  return (
    <select 
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={loading}
      className={`text-xs font-bold rounded px-2 py-1 border-0 ring-1 ring-inset ${
        currentStatus === 'NEW' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
        currentStatus === 'CONTACTED' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
        currentStatus === 'ADMITTED' ? 'bg-green-50 text-green-700 ring-green-600/20' :
        'bg-red-50 text-red-700 ring-red-600/20'
      }`}
    >
      <option value="NEW">New</option>
      <option value="CONTACTED">Contacted</option>
      <option value="ADMITTED">Admitted</option>
      <option value="LOST">Lost</option>
    </select>
  );
}
