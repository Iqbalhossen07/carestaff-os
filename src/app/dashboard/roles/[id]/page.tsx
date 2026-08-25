import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CreateRoleForm from "../CreateRoleForm";
import { notFound } from "next/navigation";

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.careHomeId) {
    return <div>Unauthorized</div>;
  }

  const role = await prisma.role.findFirst({
    where: { id: resolvedParams.id, careHomeId: session.user.careHomeId }
  });

  if (!role) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard/roles" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Roles
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
          <div className="p-3 bg-blue-100 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Role: {role.name}</h1>
            <p className="text-gray-500 mt-1">Modify permissions for this role.</p>
          </div>
        </div>

        <CreateRoleForm initialData={role} />
      </div>
    </div>
  );
}
