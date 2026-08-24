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
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-3xl">
            {resident.firstName[0]}{resident.lastName[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{resident.firstName} {resident.lastName}</h1>
            <p className="text-gray-500 text-lg mt-1">Resident Profile</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
}
