import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { HeartPulse, Search, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function CarerResidentsPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;

  const residents = await prisma.resident.findMany({
    where: { careHomeId },
    orderBy: { lastName: 'asc' },
    include: {
      _count: {
        select: {
          progressNotes: true,
          medications: true
        }
      }
    }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <HeartPulse className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Residents</h1>
            <p className="text-gray-500 mt-1">Select a resident to update care logs.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search residents by name or room..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-gray-700"
            // Note: Search implementation would be client-side, skipping for brevity
          />
        </div>
        
        <div className="divide-y divide-gray-100">
          {residents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No residents found.</div>
          ) : (
            residents.map(resident => (
              <Link 
                href={`/carer/residents/${resident.id}`}
                key={resident.id}
                className="flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-lg">
                    {resident.firstName.charAt(0)}{resident.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {resident.firstName} {resident.lastName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">Room {resident.roomNumber}</span>
                      <span>{resident._count.medications} active meds</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">{resident._count.progressNotes} logs</p>
                    <p className="text-xs text-gray-500">Total care logs</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-green-400 group-hover:bg-green-50 transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
