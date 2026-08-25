import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewShiftFormClient from "./NewShiftFormClient";

export default async function AddShiftPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;

  const staffMembers = await prisma.user.findMany({
    where: { careHomeId, userType: "WORKER" },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard/rota" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6 w-fit text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Rota
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Shift</h1>
        <NewShiftFormClient careHomeId={careHomeId} staffMembers={staffMembers} />
      </div>
    </div>
  );
}
