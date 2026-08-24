import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Plus, User, Calendar, Hash } from "lucide-react";
import { ActionButtons } from "@/components/ActionButtons";

export default async function ResidentsPage() {
  const session = await getServerSession(authOptions);
  
  const residents = await prisma.resident.findMany({
    where: {
      careHomeId: session?.user?.careHomeId,
    },
    orderBy: { lastName: 'asc' }
  });

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resident Directory</h1>
          <p className="text-gray-500 mt-2">Manage all residents and their care profiles.</p>
        </div>
        <Link 
          href="/dashboard/residents/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Resident
        </Link>
      </div>

      {residents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No residents found</h2>
          <p className="text-gray-500 mb-6">Get started by adding your first resident to the system.</p>
          <Link 
            href="/dashboard/residents/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Resident
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Date of Birth</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">NHS Number</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {residents.map((resident) => (
                <tr key={resident.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {resident.firstName[0]}{resident.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{resident.firstName} {resident.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(resident.dateOfBirth).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {resident.roomNumber ? (
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-sm font-medium">
                        Room {resident.roomNumber}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      {resident.nhsNumber || <span className="text-gray-400 italic">N/A</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex justify-end">
                    <ActionButtons 
                      viewUrl={`/dashboard/residents/${resident.id}`}
                      editUrl={`/dashboard/residents/${resident.id}/edit`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
