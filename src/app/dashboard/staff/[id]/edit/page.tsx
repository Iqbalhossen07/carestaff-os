import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { updateStaff } from "../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditStaffPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const staff = await prisma.user.findUnique({
    where: { id },
  });

  if (!staff) notFound();

  // Redirect Super Admin back if they shouldn't be edited here
  if (staff.userType === "SUPER_ADMIN") {
    redirect("/dashboard/staff");
  }

  const roles = await prisma.role.findMany({
    where: { careHomeId: staff.careHomeId },
    orderBy: { name: 'asc' }
  });

  const submitAction = async (formData: FormData) => {
    "use server";
    await updateStaff(id, formData);
    redirect("/dashboard/staff");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/staff" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Staff
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Staff Member</h1>
        
        <form action={submitAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={staff.name}
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              defaultValue={staff.email}
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
            <select 
              name="roleId" 
              defaultValue={staff.roleId || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
            >
              <option value="">No custom role (Standard Worker)</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href="/dashboard/staff"
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
