"use client";

import { useState } from "react";
import { createEnquiry } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function CrmFormClient({ careHomeId }: { careHomeId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      careHomeId,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      contactName: formData.get("contactName") as string,
      contactPhone: formData.get("contactPhone") as string,
      contactEmail: formData.get("contactEmail") as string,
      careRequired: formData.get("careRequired") as string,
      notes: formData.get("notes") as string,
    };

    try {
      const res = await createEnquiry(data);
      if (res.error) throw new Error(res.error);
      
      Swal.fire('Success', 'Enquiry added successfully', 'success');
      router.push("/dashboard/crm");
      router.refresh();
    } catch (error: any) {
      Swal.fire('Error', error.message || "Failed to save enquiry", 'error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h3 className="text-lg font-bold text-gray-900">Prospective Resident Details</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input type="text" name="firstName" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input type="text" name="lastName" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="border-b border-gray-200 pb-4 pt-4 mb-4">
        <h3 className="text-lg font-bold text-gray-900">Family / Contact Person</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
        <input type="text" name="contactName" placeholder="e.g. John Doe (Son)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="text" name="contactPhone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input type="email" name="contactEmail" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="border-b border-gray-200 pb-4 pt-4 mb-4">
        <h3 className="text-lg font-bold text-gray-900">Care Needs & Notes</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Care Level Required</label>
        <select name="careRequired" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
          <option value="">Select level...</option>
          <option value="Residential Care">Residential Care</option>
          <option value="Nursing Care">Nursing Care</option>
          <option value="Dementia Care">Dementia Care</option>
          <option value="Respite Care">Respite Care</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Notes</label>
        <textarea name="notes" rows={4} placeholder="Any specific requirements or conversations..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Link href="/dashboard/crm" className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Save Enquiry"}
        </button>
      </div>
    </form>
  );
}
