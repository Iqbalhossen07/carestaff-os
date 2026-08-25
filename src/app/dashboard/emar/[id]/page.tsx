import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Activity, Edit, CheckCircle2, XCircle, AlertCircle, User } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function MedicationViewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  
  const medication = await prisma.medication.findUnique({
    where: { id },
    include: { 
      resident: true,
      logs: {
        orderBy: { timestamp: 'desc' },
        take: 50, // recent 50 logs
      }
    }
  });

  if (!medication) notFound();

  // Need to fetch user details for the logs to show WHO administered it
  const adminIds = [...new Set(medication.logs.map(log => log.administeredById))];
  const staffMembers = await prisma.user.findMany({
    where: { id: { in: adminIds } },
    select: { id: true, name: true }
  });
  
  const staffMap = staffMembers.reduce((acc: any, staff: any) => {
    acc[staff.id] = staff.name;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/emar" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to eMAR Overview
        </Link>
        <Link 
          href={`/dashboard/emar/${medication.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
        >
          <Edit className="w-4 h-4" /> Edit Medication
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <p className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-1">Medication Details</p>
            <h1 className="text-3xl font-black text-gray-900">{medication.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="px-3 py-1 bg-white border border-gray-200 text-gray-800 rounded-lg text-sm font-bold shadow-sm">
                Dosage: {medication.dosage}
              </span>
              <span className="px-3 py-1 bg-white border border-gray-200 text-blue-700 rounded-lg text-sm font-bold shadow-sm">
                Freq: {medication.frequency}
              </span>
              <span className="px-3 py-1 bg-white border border-gray-200 text-purple-700 rounded-lg text-sm font-bold shadow-sm">
                Route: {medication.route}
              </span>
              {medication.status === "DISCONTINUED" && (
                <span className="px-3 py-1 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm font-bold shadow-sm">
                  DISCONTINUED
                </span>
              )}
            </div>
            
            <div className="flex gap-4 mt-3 text-sm text-gray-600 font-medium">
              <p>Start Date: <span className="text-gray-900">{new Date(medication.startDate).toLocaleDateString()}</span></p>
              {medication.endDate && <p>End Date: <span className="text-gray-900">{new Date(medication.endDate).toLocaleDateString()}</span></p>}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 min-w-[200px]">
             <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xl shrink-0">
                {medication.resident.firstName[0]}{medication.resident.lastName[0]}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Prescribed To</p>
                <p className="font-bold text-gray-900">{medication.resident.firstName} {medication.resident.lastName}</p>
                <p className="text-xs text-gray-500">Room: {medication.resident.roomNumber || 'N/A'}</p>
              </div>
          </div>
        </div>

        {medication.instructions && (
          <div className="px-8 py-5 border-b border-gray-100 bg-blue-50/30">
            <p className="text-sm font-medium text-gray-500 mb-1">Special Instructions</p>
            <p className="text-gray-900 font-medium">{medication.instructions}</p>
          </div>
        )}

        {/* Logs */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" /> Administration Log
          </h2>

          {medication.logs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No administration logs found for this medication.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medication.logs.map(log => {
                let badge = null;
                let bgClass = "";
                
                if (log.status === "ADMINISTERED") {
                  bgClass = "bg-emerald-50 border-emerald-100";
                  badge = <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md font-bold uppercase"><CheckCircle2 className="w-3.5 h-3.5"/> Given</span>;
                } else if (log.status === "REFUSED") {
                  bgClass = "bg-orange-50 border-orange-100";
                  badge = <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md font-bold uppercase"><AlertCircle className="w-3.5 h-3.5"/> Refused</span>;
                } else {
                  bgClass = "bg-red-50 border-red-100";
                  badge = <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-md font-bold uppercase"><XCircle className="w-3.5 h-3.5"/> Missed</span>;
                }

                return (
                  <div key={log.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${bgClass}`}>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {badge}
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {new Date(log.timestamp).toLocaleString(undefined, {
                            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      {log.refusalReason && (
                        <p className="text-sm text-orange-800 font-medium mb-2 bg-orange-100/50 p-2 rounded-lg">
                          <span className="font-bold">Reason:</span> {log.refusalReason}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white/60 px-3 py-1.5 rounded-lg border border-gray-200/50">
                      <User className="w-4 h-4 text-gray-400" />
                      Logged by: {staffMap[log.administeredById] || "Unknown Staff"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
