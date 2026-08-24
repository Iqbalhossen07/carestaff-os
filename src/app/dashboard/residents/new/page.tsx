import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createResident } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AddResidentPage() {
  const session = await getServerSession(authOptions);
  
  // We need to pass the careHomeId to the Server Action
  const careHomeId = session?.user?.careHomeId as string;

  // We wrap the server action to pass the careHomeId
  const submitAction = async (formData: FormData) => {
    "use server";
    await createResident(formData, careHomeId);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/residents" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Resident</h1>
        
        <form action={submitAction} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                placeholder="e.g. John"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                name="lastName"
                placeholder="e.g. Doe"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NHS Number</label>
              <input
                type="text"
                name="nhsNumber"
                placeholder="e.g. 123 456 7890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
            <input
              type="text"
              name="roomNumber"
              placeholder="e.g. 101-A"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href="/dashboard/residents"
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Resident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
