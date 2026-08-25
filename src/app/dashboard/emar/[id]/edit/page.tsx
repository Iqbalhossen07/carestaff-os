import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import EditMedicationFormClient from "./EditMedicationFormClient";

export default async function EditMedicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const medication = await prisma.medication.findUnique({
    where: { id },
    include: { resident: true }
  });

  if (!medication) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard/emar" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6 w-fit text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to eMAR Overview
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Medication</h1>
        <p className="text-gray-500 mb-6 font-medium">Resident: <span className="text-gray-900">{medication.resident.firstName} {medication.resident.lastName}</span></p>
        <EditMedicationFormClient medication={medication} />
      </div>
    </div>
  );
}
