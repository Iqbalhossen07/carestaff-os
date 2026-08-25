import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Hash, Home } from "lucide-react";

export default async function ResidentViewPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const resident = await prisma.resident.findUnique({
    where: { id },
  });

  if (!resident) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard/residents" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Residents
      </Link>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl overflow-hidden bg-emerald-100 text-emerald-600 shadow-sm border border-gray-200">
            {resident.photo ? (
              <img src={resident.photo} alt={`${resident.firstName}`} className="w-full h-full object-cover" />
            ) : (
              <>{resident.firstName[0]}{resident.lastName[0]}</>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{resident.firstName} {resident.lastName}</h1>
            <p className="text-gray-500 text-lg mt-1">Resident Profile</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date of Birth</p>
            <p className="font-semibold text-gray-900">{new Date(resident.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><Home className="w-4 h-4" /> Room Number</p>
            <p className="font-semibold text-gray-900">{resident.roomNumber || "Unassigned"}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><Hash className="w-4 h-4" /> NHS Number</p>
            <p className="font-semibold text-gray-900">{resident.nhsNumber || "N/A"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Medical & Care Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Allergies</p>
                {resident.allergies ? (
                  <p className="text-sm text-red-600 bg-red-50 inline-block px-2 py-1 rounded font-medium mt-1">{resident.allergies}</p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">No known allergies</p>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Dietary Requirements</p>
                <p className="text-sm text-gray-600 mt-1">{resident.dietaryReqs || "Standard Diet"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Medical History & Care Plan</p>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">{resident.medicalHistory || "No specific medical history provided."}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Emergency Contact</h2>
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Contact Name</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{resident.emergencyContactName || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Contact Phone</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{resident.emergencyContactPhone || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
