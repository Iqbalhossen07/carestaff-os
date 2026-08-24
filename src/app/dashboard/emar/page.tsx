import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Pill, CheckCircle2, XCircle, AlertCircle, Plus } from "lucide-react";
import { EmarActionButtons } from "./EmarClientComponents";
import Link from "next/link";

export default async function EmarPage() {
  const session = await getServerSession(authOptions);
  
  const residents = await prisma.resident.findMany({
    where: { careHomeId: session?.user?.careHomeId },
    include: {
      medications: {
        include: {
          logs: {
            take: 1,
            orderBy: { timestamp: 'desc' }
          }
        }
      }
    },
    orderBy: { lastName: 'asc' }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Pill className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">eMAR Overview</h1>
            <p className="text-gray-500 mt-1">Electronic Medication Administration Record.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/emar/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Medication
        </Link>
      </div>

      <div className="space-y-6">
        {residents.map(resident => (
          <div key={resident.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{resident.firstName} {resident.lastName}</h2>
              <p className="text-sm text-gray-500">Room: {resident.roomNumber || 'N/A'}</p>
            </div>
            
            <div className="p-6">
              {resident.medications.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No medications prescribed.</p>
              ) : (
                <div className="space-y-4">
                  {resident.medications.map(med => {
                    const lastLog = med.logs[0];
                    let statusBadge = <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Pending</span>;
                    
                    if (lastLog) {
                      const isToday = new Date(lastLog.timestamp).toDateString() === new Date().toDateString();
                      if (isToday) {
                        if (lastLog.status === "ADMINISTERED") statusBadge = <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded"><CheckCircle2 className="w-3 h-3"/> Given</span>;
                        if (lastLog.status === "REFUSED") statusBadge = <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"><AlertCircle className="w-3 h-3"/> Refused</span>;
                        if (lastLog.status === "MISSED") statusBadge = <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded"><XCircle className="w-3 h-3"/> Missed</span>;
                      }
                    }

                    return (
                      <div key={med.id} className="p-4 border border-gray-100 rounded-lg flex justify-between items-center bg-gray-50/50">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{med.name}</span>
                            {statusBadge}
                          </div>
                          <p className="text-sm text-gray-600">{med.dosage} • {med.instructions}</p>
                          <p className="text-xs text-blue-600 font-medium mt-1">Schedule: {med.frequency}</p>
                        </div>
                        
                        <div className="text-right">
                          <EmarActionButtons 
                            medicationId={med.id} 
                            residentId={resident.id} 
                            staffId={session?.user?.id as string} 
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
