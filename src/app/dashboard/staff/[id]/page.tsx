import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, ShieldCheck } from "lucide-react";

export default async function StaffViewPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const staff = await prisma.user.findUnique({
    where: { id },
    include: { role: true }
  });

  if (!staff) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard/staff" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Staff
      </Link>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-3xl">
            {staff.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{staff.name}</h1>
            <p className="text-gray-500 text-lg mt-1">{staff.userType}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</p>
            <p className="font-semibold text-gray-900">{staff.email}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Assigned Role</p>
            <p className="font-semibold text-gray-900">{staff.role?.name || "No custom role assigned"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
