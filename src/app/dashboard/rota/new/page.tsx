import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateShiftForm } from "../RotaClientComponents";

export default async function AddShiftPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;

  const staffMembers = await prisma.user.findMany({
    where: { careHomeId, userType: "WORKER" },
    select: { id: true, name: true, email: true }
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/rota" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Rota
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <CreateShiftForm careHomeId={careHomeId} staffMembers={staffMembers} />
      </div>
    </div>
  );
}
