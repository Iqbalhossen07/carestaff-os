import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pill, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import EmarActionButtons from "./EmarActionButtons";

export default async function CarerEmarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  
  const resident = await prisma.resident.findUnique({
    where: { 
      id,
      careHomeId: session?.user?.careHomeId
    },
    include: {
      medications: true,
      emarLogs: {
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0,0,0,0))
          }
        },
        orderBy: { timestamp: 'desc' }
      }
    }
  });

  if (!resident) {
    notFound();
  }

  // Map to easily check if medication is given today
  const medsGivenToday = new Map();
  resident.emarLogs.forEach(log => {
    if (!medsGivenToday.has(log.medicationId)) {
      medsGivenToday.set(log.medicationId, log);
    }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/carer/emar" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to eMAR List
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{resident.firstName} {resident.lastName}</h1>
          <p className="text-gray-500 font-medium mt-1">Room {resident.roomNumber} • {resident.medications.length} active medications</p>
        </div>
        
        {(resident.allergies || resident.dietaryReqs) && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2.5 rounded-lg border border-red-100">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-bold">Check Allergies Before Administering</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {resident.medications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm">
            <Pill className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No active medications</h3>
            <p>This resident does not have any medications prescribed.</p>
          </div>
        ) : (
          resident.medications.map(med => {
            const todayLog = medsGivenToday.get(med.id);
            const isCompleted = !!todayLog;
            
            return (
              <div key={med.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${isCompleted ? 'border-gray-200 opacity-75' : 'border-orange-200 ring-1 ring-orange-200'}`}>
                <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Pill className="w-5 h-5 text-orange-500" /> {med.name}
                      </h3>
                      {isCompleted && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${todayLog.status === 'ADMINISTERED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {todayLog.status === 'ADMINISTERED' ? <CheckCircle2 className="w-3.5 h-3.5"/> : <XCircle className="w-3.5 h-3.5" />}
                          {todayLog.status}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-gray-500 font-medium text-xs mb-1">Dosage</p>
                        <p className="font-bold text-gray-900">{med.dosage}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-gray-500 font-medium text-xs mb-1">Frequency</p>
                        <p className="font-bold text-gray-900">{med.frequency}</p>
                      </div>
                    </div>
                    
                    {med.instructions && (
                      <div className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-100 mt-2">
                        <span className="font-bold text-orange-800">Instructions:</span> {med.instructions}
                      </div>
                    )}
                  </div>
                  
                  {!isCompleted ? (
                    <div className="flex-shrink-0 w-full lg:w-auto">
                      <EmarActionButtons medicationId={med.id} residentId={resident.id} />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 text-right w-full lg:w-auto">
                      <p className="text-sm font-medium text-gray-500 mb-1">Logged at {new Date(todayLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      {todayLog.refusalReason && (
                        <p className="text-xs text-red-600 font-bold max-w-[200px] truncate">
                          Reason: {todayLog.refusalReason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
