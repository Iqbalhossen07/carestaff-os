import * as fs from 'fs';

const content = `import prisma from "@/lib/prisma";
import Link from "next/link";
import { Pill, Plus, Clock, Search, User } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EmarDateSelector } from "./EmarDateSelector";
import { LogMedicationButton, EmarActionButtons } from "./EmarClientComponents";

export default async function EmarOverviewPage({ searchParams }: any) {
  try {
    const session = await getServerSession(authOptions);
    
    // Resolve searchParams
    const params = await Promise.resolve(searchParams);
    
    const todayStr = new Date().toISOString().split('T')[0];
    const selectedDateStr = params?.date || todayStr;
    const searchQ = params?.search || "";
    
    // Convert selected string back to Date for comparison
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
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">eMAR Daily Chart</h1>
              <p className="text-gray-500 font-medium text-sm">Electronic Medication Administration Record.</p>
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
                placeholder="Search Name, Room, NHS..." 
                className="w-full md:w-64 pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
              />
            </form>
            <EmarDateSelector defaultDate={todayStr} />
            
            <Link 
              href="/dashboard/emar/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-sm whitespace-nowrap"
            >
              <Plus className="w-5 h-5" /> Add Prescription
            </Link>
          </div>
        </div>

        {residents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No Residents Found</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Try adjusting your search criteria or add new residents to the system.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
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
                <div key={resident.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  
                  {/* Resident Header */}
                  <div className="p-5 bg-indigo-50/50 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xl shadow-inner border border-indigo-200 shrink-0">
                        {resident.firstName[0]}{resident.lastName[0]}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          {resident.firstName} {resident.lastName}
                          <Link href={"/dashboard/emar/resident/" + resident.id + "/manage"} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full hover:bg-gray-50 uppercase tracking-wide shrink-0">
                            Manage List
                          </Link>
                        </h2>
                        <div className="text-sm text-gray-500 font-medium flex gap-3">
                          <span>Room: {resident.roomNumber || 'N/A'}</span>
                          {resident.nhsNumber && <span>NHS: {resident.nhsNumber}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medications Content */}
                  <div className="p-0">
                    {!hasMeds ? (
                      <div className="p-8 text-center bg-gray-50/50 border-t border-gray-200">
                        <p className="text-gray-400 font-medium italic">No medications scheduled for {selectedDateStr}.</p>
                      </div>
                    ) : (
                      sortedKeys.map((freq) => (
                        <div key={freq} className="border-b border-gray-100 last:border-0">
                          <div className="bg-gray-50/80 px-6 py-2.5 border-y border-gray-200/60 first:border-t-0 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{freq}</h3>
                          </div>
                          
                          <div className="divide-y divide-gray-100">
                            {groupedMeds[freq].map((med: any) => {
                              const todaysLog = med.logs[0];
                              let statusLabel = <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-bold">To Be Given</span>;
                              
                              if (todaysLog) {
                                if (todaysLog.status === "ADMINISTERED") statusLabel = <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold">✓ Given</span>;
                                if (todaysLog.status === "REFUSED") statusLabel = <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-bold">⚠ Refused</span>;
                                if (todaysLog.status === "MISSED") statusLabel = <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-bold">✕ Missed</span>;
                              }

                              return (
                                <div key={med.id} className="p-6 flex flex-col xl:flex-row justify-between gap-6 hover:bg-blue-50/20 transition-colors relative group">
                                  
                                  <div className="absolute top-4 right-4 xl:hidden group-hover:block transition-opacity opacity-0 xl:opacity-100 group-hover:opacity-100 z-10">
                                    <EmarActionButtons medicationId={med.id} />
                                  </div>

                                  <div className="flex-1 pr-0 xl:pr-32">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                      <Link href={"/dashboard/emar/" + med.id} className="text-lg font-black text-gray-900 hover:text-blue-600 transition-colors">
                                        {med.name}
                                      </Link>
                                      {statusLabel}
                                      {med.mealInstruction && (
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-purple-200">
                                          {med.mealInstruction}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                      <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200 shadow-sm">{med.dosage}</span>
                                      <span className="text-gray-500 font-medium px-2 py-0.5 bg-white border border-gray-200 rounded-md shadow-sm">Route: {med.route}</span>
                                    </div>
                                    {med.instructions && (
                                      <p className="text-sm text-gray-500 mt-3 font-medium bg-yellow-50/50 p-2 rounded-lg border border-yellow-100 inline-block">
                                        <span className="font-bold text-yellow-700">Note:</span> {med.instructions}
                                      </p>
                                    )}
                                  </div>

                                  <div className="w-full xl:w-[320px] shrink-0 mt-4 xl:mt-0 xl:border-l xl:border-gray-100 xl:pl-6 relative">
                                    <div className="hidden xl:block absolute -top-4 -right-2">
                                      <EmarActionButtons medicationId={med.id} />
                                    </div>
                                    <div className="mt-8 xl:mt-6">
                                      <LogMedicationButton 
                                        medicationId={med.id}
                                        residentId={resident.id}
                                        staffId={session?.user?.id as string}
                                      />
                                      {todaysLog && todaysLog.refusalReason && (
                                        <p className="mt-3 text-xs text-orange-700 bg-orange-50 p-2 rounded-lg border border-orange-100">
                                          <strong>Reason:</strong> {todaysLog.refusalReason}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
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
        <p className="mb-4">An error occurred while loading the eMAR chart.</p>
        <pre className="p-4 bg-white rounded-lg text-sm overflow-x-auto whitespace-pre-wrap shadow-inner font-mono text-red-900">
          {error?.message || "Unknown error"}
        </pre>
        <p className="mt-4 text-sm font-bold text-red-800">Stack Trace:</p>
        <pre className="p-4 bg-white rounded-lg text-xs overflow-x-auto whitespace-pre-wrap shadow-inner font-mono text-red-900 mt-2">
          {error?.stack || "No stack trace available"}
        </pre>
      </div>
    );
  }
}
`;
fs.writeFileSync('src/app/dashboard/emar/page.tsx', content);
