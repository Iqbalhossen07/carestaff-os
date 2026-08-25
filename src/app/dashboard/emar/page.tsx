import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Pill, CheckCircle2, XCircle, AlertCircle, Plus, Activity, Clock } from "lucide-react";
import { EmarActionButtons, LogMedicationButton } from "./EmarClientComponents";
import Link from "next/link";
import { InlineActionButtons } from "@/components/ui/ActionButtons";

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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">eMAR Overview</h1>
            <p className="text-gray-500 text-sm mt-1">Electronic Medication Administration Record.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/emar/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Medication
        </Link>
      </div>

      <div className="space-y-6">
        {residents.map(resident => (
          <div key={resident.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                {resident.firstName[0]}{resident.lastName[0]}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{resident.firstName} {resident.lastName}</h2>
                <p className="text-sm text-gray-500 font-medium">Room: {resident.roomNumber || 'N/A'}</p>
              </div>
            </div>
            
            <div className="p-6">
              {resident.medications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Activity className="w-12 h-12 mb-3 opacity-20" />
                  <p className="font-medium">No medications prescribed for this resident.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {resident.medications.map(med => {
                    const lastLog = med.logs[0];
                    let statusBadge = <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold"><Clock className="w-3 h-3"/> Pending Today</span>;
                    
                    if (lastLog) {
                      const isToday = new Date(lastLog.timestamp).toDateString() === new Date().toDateString();
                      if (isToday) {
                        if (lastLog.status === "ADMINISTERED") statusBadge = <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold border border-emerald-200"><CheckCircle2 className="w-3 h-3"/> Given</span>;
                        if (lastLog.status === "REFUSED") statusBadge = <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold border border-orange-200"><AlertCircle className="w-3 h-3"/> Refused</span>;
                        if (lastLog.status === "MISSED") statusBadge = <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold border border-red-200"><XCircle className="w-3 h-3"/> Missed</span>;
                      }
                    }

                    return (
                      <div key={med.id} className="p-5 border border-gray-100 rounded-xl bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] relative group hover:border-blue-100 transition-colors">
                        
                        <div className="absolute top-4 right-4">
                          <EmarActionButtons medicationId={med.id} />
                        </div>

                        <div className="pr-20">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{med.name}</h3>
                            {statusBadge}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="font-semibold px-2 py-1 bg-gray-100 rounded-md text-gray-800">{med.dosage}</span>
                            <span className="text-blue-600 font-bold">{med.frequency}</span>
                          </div>
                          
                          {med.instructions && (
                            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg italic">
                              <span className="font-semibold text-gray-700 not-italic">Note:</span> {med.instructions}
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <LogMedicationButton 
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

// Ensure Clock is imported by adding it to the lucide-react import
