import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Users, Mail, ShieldCheck, Plus } from "lucide-react";
import { ActionButtons } from "@/components/ActionButtons";
import { deleteStaff } from "./actions";
import Link from "next/link";

export default async function StaffPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;

  const staffList = await prisma.user.findMany({
    where: { careHomeId },
    include: { role: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-500 mt-1">Manage your workforce, HR compliance, and access levels.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/staff/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Staff Member
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Active Staff Directory</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {staffList.map(staff => (
            <div key={staff.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {staff.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    {staff.name}
                    {staff.userType === "SUPER_ADMIN" && (
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-purple-200">Admin</span>
                    )}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {staff.email}</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 
                      {staff.role?.name || "No custom role"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <ActionButtons 
                  viewUrl={`/dashboard/staff/${staff.id}`} 
                  editUrl={`/dashboard/staff/${staff.id}/edit`}
                  deleteAction={staff.userType !== "SUPER_ADMIN" ? deleteStaff.bind(null, staff.id) : undefined}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
