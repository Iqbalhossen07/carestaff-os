import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import RotaListClient from "./RotaListClient";

export default async function RotaPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;

  const shifts = await prisma.shift.findMany({
    where: { careHomeId },
    include: { assignedTo: true },
    orderBy: { startTime: 'asc' }
  });

  const staffMembers = await prisma.user.findMany({
    where: { careHomeId, userType: "WORKER" },
    select: { id: true, name: true, email: true, roleId: true }
  });

  const roles = await prisma.role.findMany({
    where: { careHomeId },
    select: { id: true, name: true }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rota & Shifts</h1>
            <p className="text-gray-500 text-sm mt-1">Manage staff schedules, shifts, and assignments.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/rota/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" /> Create Shift
        </Link>
      </div>

      <RotaListClient initialShifts={shifts} staffMembers={staffMembers} roles={roles} />
    </div>
  );
}
