import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import ManageMedicationsClient from "./ManageMedicationsClient";

export default async function ManageResidentMedicationsPage({ params }: { params: Promise<{ residentId: string }> }) {
  await getServerSession(authOptions);
  
  const { residentId } = await params;
  
  const resident = await prisma.resident.findUnique({
    where: { id: residentId },
    include: {
      medications: {
        orderBy: { startDate: 'asc' }
      }
    }
  });

  if (!resident) notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/dashboard/emar" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 font-medium w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to eMAR Overview
      </Link>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Manage Prescriptions</h1>
        <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
          <User className="w-4 h-4" /> {resident.firstName} {resident.lastName}
        </p>
      </div>

      <ManageMedicationsClient 
        residentId={residentId} 
        existingMedications={resident.medications} 
      />
    </div>
  );
}
