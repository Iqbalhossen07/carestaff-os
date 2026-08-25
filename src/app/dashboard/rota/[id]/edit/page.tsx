import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditShiftFormClient from "./EditShiftFormClient";

export default async function EditShiftPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  
  const shift = await prisma.shift.findUnique({
    where: { 
      id,
      careHomeId: session?.user?.careHomeId
    }
  });

  if (!shift) notFound();

  const staffMembers = await prisma.user.findMany({
    where: { careHomeId: session?.user?.careHomeId, userType: "WORKER" },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard/rota" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6 w-fit text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Rota
      </Link>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Shift</h1>
        <EditShiftFormClient shift={shift} staffMembers={staffMembers} />
      </div>
    </div>
  );
}
