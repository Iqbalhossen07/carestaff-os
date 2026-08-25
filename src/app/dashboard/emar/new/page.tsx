import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewMedicationFormClient from "./NewMedicationFormClient";

export default async function AddMedicationPage() {
  const session = await getServerSession(authOptions);

  const residents = await prisma.resident.findMany({
    where: { careHomeId: session?.user?.careHomeId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { lastName: 'asc' }
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard/emar" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6 w-fit text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to eMAR Overview
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Medication</h1>
        <NewMedicationFormClient residents={residents} />
      </div>
    </div>
  );
}
