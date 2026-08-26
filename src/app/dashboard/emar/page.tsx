import prisma from "@/lib/prisma";
import Link from "next/link";
import { Pill, Plus, Clock, Search, User, Eye, Settings2, Edit } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EmarDateSelector } from "./EmarDateSelector";
import { LogMedicationButton } from "./EmarClientComponents";

export default async function EmarOverviewPage({ searchParams }: any) {
  try {
    const session = await getServerSession(authOptions);
    const params = await Promise.resolve(searchParams);
    const todayStr = new Date().toISOString().split('T')[0];
    const selectedDateStr = params?.date || todayStr;
    const searchQ = params?.search || "";
    
    const selectedDate = new Date(selectedDateStr);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const residents = await prisma.resident.findMany({
      where: {
        OR: [
          { firstName: { contains: searchQ } },
          { lastName: { contains: searchQ } },
          { roomNumber: { contains: searchQ } },
          { nhsNumber: { contains: searchQ } }
        ]
      },
      include: {
        medications: {
          where: {
            status: "ACTIVE",
            startDate: { lte: endOfDay },
            OR: [
              { endDate: null },
              { endDate: { gte: startOfDay } }
            ]
          },
          include: {
            logs: {
              where: {
                timestamp: {
                  gte: startOfDay,
                  lte: endOfDay
                }
              },
              orderBy: { timestamp: 'desc' }
            }
          }
        }
      },
      orderBy: { firstName: 'asc' }
    });

    const frequencyOrder = ["Morning", "Afternoon", "Evening", "Night", "Twice Daily (BID)", "Three Times Daily (TID)", "Four Times Daily (QDS)", "As Needed (PRN)"];

    return (
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">eMAR Daily Chart</h1>
              <p className="text-gray-500 font-medium text-xs">Medication Administration Round</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <form className="flex-1 md:flex-none relative">
              <input type="hidden" name="date" value={selectedDateStr} />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                name="search"
                defaultValue={searchQ}
                placeholder="Search Resident..." 
                className="w-full md:w-48 pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
              />
            </form>
            <EmarDateSelector defaultDate={todayStr} />
            
            <Link 
              href="/dashboard/emar/new"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all shadow-sm whitespace-nowrap text-sm"
            >
              <Settings2 className="w-4 h-4" /> Manage
            </Link>
          </div>
        </div>

        {residents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
            <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No Residents Found</h3>
            <p className="text-gray-500 mt-1 text-sm max-w-sm mx-auto">
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {residents.map(resident => {
              const hasMeds = resident.medications.length > 0;
              
              const groupedMeds = resident.medications.reduce((acc: any, med: any) => {
                if (!acc[med.frequency]) acc[med.frequency] = [];
                acc[med.frequency].push(med);
                return acc;
              }, {});

              const sortedKeys = Object.keys(groupedMeds).sort((a, b) => {
                const indexA = frequencyOrder.indexOf(a);
                const indexB = frequencyOrder.indexOf(b);
                return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
              });

              return (
                <div key={resident.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  
                  {/* Resident Compact Header */}
                  <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-200 flex items-center gap-3">
                    {resident.photo ? (
                      <img src={resident.photo} alt={resident.firstName} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                        {resident.firstName[0]}{resident.lastName[0]}
                      </div>
                    )}
                    <div>
                      <h2 className="text-base font-bold text-gray-900 leading-tight">
                        {resident.firstName} {resident.lastName}
                      </h2>
                      <div className="text-[10px] text-gray-500 font-bold flex gap-2 mt-0.5 uppercase tracking-wider">
                        {resident.roomNumber && <span>RM: {resident.roomNumber}</span>}
                        {resident.nhsNumber && <span>NHS: {resident.nhsNumber}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Medications Compact List */}
                  <div className="p-0">
                    {!hasMeds ? (
                      <div className="px-4 py-3 text-xs text-gray-500 font-medium italic">
                        No active medications scheduled.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {sortedKeys.map((freq) => (
                          groupedMeds[freq].map((med: any, idx: number) => {
                            const todaysLog = med.logs[0];
                            let statusLabel = <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">To Be Given</span>;
                            
                            if (todaysLog) {
                              if (todaysLog.status === "ADMINISTERED") statusLabel = <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">✓ Given</span>;
                              if (todaysLog.status === "REFUSED") statusLabel = <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">⚠ Refused</span>;
                              if (todaysLog.status === "MISSED") statusLabel = <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">✕ Missed</span>;
                            }

                            return (
                              <div key={med.id} className="px-4 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:bg-blue-50/10 transition-colors">
                                
                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
                                  {/* Frequency Badge (replaces huge headers) */}
                                  <div className="w-24 shrink-0">
                                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded uppercase flex items-center gap-1 w-fit">
                                      <Clock className="w-3 h-3" /> {freq.split(' ')[0]}
                                    </span>
                                  </div>
                                  
                                  {/* Medication Info */}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <span className="text-sm font-black text-gray-900">{med.name}</span>
                                      <span className="text-xs font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{med.dosage}</span>
                                      {med.mealInstruction && (
                                        <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-purple-200">
                                          {med.mealInstruction}
                                        </span>
                                      )}
                                      {statusLabel}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                      <span>Route: {med.route}</span>
                                      {med.instructions && (
                                        <>
                                          <span className="text-gray-300">|</span>
                                          <span className="text-yellow-700">Note: {med.instructions}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 shrink-0 xl:border-l xl:border-gray-100 xl:pl-4">
                                  <Link href={"/dashboard/emar/" + med.id} title="History" className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                  <Link href={"/dashboard/emar/" + med.id + "/edit"} title="Edit" className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors">
                                    <Edit className="w-4 h-4" />
                                  </Link>
                                  <div className="w-[200px]">
                                    <LogMedicationButton 
                                      medicationId={med.id}
                                      residentId={resident.id}
                                      staffId={session?.user?.id as string}
                                    />
                                  </div>
                                </div>
                                
                                {/* Refusal Reason inline if needed */}
                                {todaysLog && todaysLog.refusalReason && (
                                  <div className="w-full xl:w-auto text-[11px] text-orange-700 bg-orange-50 px-2 py-1 rounded border border-orange-100">
                                    Reason: {todaysLog.refusalReason}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-10 max-w-2xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-2xl text-red-700">
        <h2 className="text-xl font-bold mb-4">Dashboard Rendering Error</h2>
        <pre className="p-4 bg-white rounded-lg text-sm overflow-x-auto font-mono text-red-900">{error?.message || "Unknown error"}</pre>
      </div>
    );
  }
}
