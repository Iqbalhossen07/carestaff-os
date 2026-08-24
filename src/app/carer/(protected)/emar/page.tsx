import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Pill, Search, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function CarerEmarPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;

  const residents = await prisma.resident.findMany({
    where: { careHomeId },
    orderBy: { lastName: 'asc' },
    include: {
      medications: true,
      emarLogs: {
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0,0,0,0)) // only today's logs
          }
        }
      }
    }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Pill className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">eMAR Tasks</h1>
            <p className="text-gray-500 mt-1">Manage electronic medication administration.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search residents for medication..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-gray-700"
          />
        </div>
        
        <div className="divide-y divide-gray-100">
          {residents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No residents found.</div>
          ) : (
            residents.map(resident => {
              const medsCount = resident.medications.length;
              const medsGivenToday = resident.emarLogs.length;
              
              let statusColor = "text-gray-500";
              let StatusIcon = AlertCircle;
              
              if (medsCount > 0 && medsGivenToday >= medsCount) {
                statusColor = "text-green-600";
                StatusIcon = CheckCircle2;
              } else if (medsCount > 0) {
                statusColor = "text-orange-500";
              }

              return (
                <Link 
                  href={`/carer/emar/${resident.id}`}
                  key={resident.id}
                  className="flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-lg">
                      {resident.firstName.charAt(0)}{resident.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {resident.firstName} {resident.lastName}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">Room {resident.roomNumber}</span>
                        <span>{medsCount} active medications</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className={`hidden sm:flex flex-col items-end ${statusColor}`}>
                      <div className="flex items-center gap-1.5 font-bold">
                        <StatusIcon className="w-4 h-4" />
                        <span>{medsGivenToday} / {medsCount}</span>
                      </div>
                      <span className="text-xs font-medium">Logged today</span>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-orange-400 group-hover:bg-orange-50 transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
