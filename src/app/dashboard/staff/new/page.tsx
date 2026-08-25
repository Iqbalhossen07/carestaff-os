import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CreateStaffForm from "./CreateStaffForm";

export default async function AddStaffPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;

  const roles = await prisma.role.findMany({
    where: { careHomeId },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/staff" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Staff Directory
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Staff Member</h1>
        <CreateStaffForm careHomeId={careHomeId} roles={roles} />
      </div>
    </div>
  );
}
