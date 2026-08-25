import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Plus } from "lucide-react";
import ResidentListClient from "./ResidentListClient";

export default async function ResidentsPage() {
  const session = await getServerSession(authOptions);
  
  const residents = await prisma.resident.findMany({
    where: {
      careHomeId: session?.user?.careHomeId,
    },
    orderBy: { lastName: 'asc' }
  });

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resident Directory</h1>
          <p className="text-gray-500 mt-2">Manage all residents and their care profiles.</p>
        </div>
        <Link 
          href="/dashboard/residents/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Resident
        </Link>
      </div>

      <ResidentListClient initialResidents={residents} />
    </div>
  );
}
