import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Users, Mail, ShieldCheck } from "lucide-react";
import { AddStaffForm } from "./StaffClientComponents";

export default async function StaffPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;

  const staffList = await prisma.user.findMany({
    where: { careHomeId },
    include: { role: true },
    orderBy: { name: 'asc' }
  });

  const roles = await prisma.role.findMany({
    where: { careHomeId },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage your workforce, HR compliance, and access levels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddStaffForm careHomeId={careHomeId} roles={roles} />
        </div>
        
        <div className="lg:col-span-2">
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
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
