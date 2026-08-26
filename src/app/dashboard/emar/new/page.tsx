import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewMedicationFormClient from "./NewMedicationFormClient";

export default async function AddMedicationPage() {
  try {
    const session = await getServerSession(authOptions);

    const residents = await prisma.resident.findMany({
      where: { careHomeId: session?.user?.careHomeId },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: 'asc' }
    });

    return (
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard/emar" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6 w-fit text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to eMAR Overview
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Prescriptions</h1>
          <NewMedicationFormClient residents={residents} />
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-10 max-w-2xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-2xl text-red-700">
        <h2 className="text-xl font-bold mb-4">Page Error</h2>
        <pre className="p-4 bg-white rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono text-red-900">
          {error?.message || "Unknown error"}
        </pre>
        <pre className="p-4 mt-4 bg-white rounded-lg text-xs overflow-x-auto whitespace-pre-wrap font-mono text-red-900">
          {error?.stack || "No stack trace"}
        </pre>
      </div>
    );
  }
}
