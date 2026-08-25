import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Activity, Info } from "lucide-react";
import { AddProgressNoteForm } from "./ProgressNoteClient";

export default async function CarerResidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  
  const resident = await prisma.resident.findUnique({
    where: { 
      id,
      careHomeId: session?.user?.careHomeId
    },
    include: {
      progressNotes: {
        orderBy: { timestamp: 'desc' },
        take: 10
      }
    }
  });

  if (!resident) {
    notFound();
  }

  const calculateAge = (dob: Date) => {
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/carer/residents" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Residents
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 text-3xl font-bold overflow-hidden">
              {resident.photo ? (
                <img src={resident.photo} alt={resident.firstName} className="w-full h-full object-cover" />
              ) : (
                <>{resident.firstName.charAt(0)}{resident.lastName.charAt(0)}</>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-black">{resident.firstName} {resident.lastName}</h1>
              <p className="text-blue-100 font-medium mt-1">Room {resident.roomNumber} • {calculateAge(resident.dateOfBirth)} years old</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4" /> Key Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">NHS Number</p>
                <p className="text-sm font-bold text-gray-900">{resident.nhsNumber || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                <p className="text-sm font-bold text-gray-900">{new Date(resident.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" /> Medical Alerts
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">Allergies</p>
                {resident.allergies ? (
                  <p className="text-sm font-bold text-red-600 bg-red-50 inline-block px-2 py-1 rounded">{resident.allergies}</p>
                ) : (
                  <p className="text-sm font-bold text-green-600">No known allergies</p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Dietary Requirements</p>
                <p className="text-sm font-bold text-gray-900">{resident.dietaryReqs || resident.dietaryNeeds || "Standard Diet"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Medical History & Care Plan</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 whitespace-pre-wrap">{resident.medicalHistory || "None provided"}</p>
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
              <User className="w-4 h-4" /> Emergency Contact
            </h3>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-900">{resident.emergencyContactName || "Not provided"}</p>
              {resident.emergencyContactPhone && (
                <p className="text-sm text-blue-600 font-medium">{resident.emergencyContactPhone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Care Log</h2>
            <AddProgressNoteForm residentId={resident.id} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" /> Recent Care Logs
            </h2>
            
            <div className="space-y-6">
              {resident.progressNotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
                  No care logs recorded yet.
                </div>
              ) : (
                <div className="relative border-l-2 border-blue-100 pl-4 ml-2 space-y-8">
                  {resident.progressNotes.map(note => (
                    <div key={note.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full ring-4 ring-white"></div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.note}</p>
                        
                        {(note.mood || note.foodIntake) && (
                          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                            {note.mood && (
                              <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-600 font-medium">
                                Mood: {note.mood}
                              </span>
                            )}
                            {note.foodIntake && (
                              <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-600 font-medium">
                                Intake: {note.foodIntake}
                              </span>
                            )}
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-400 font-medium mt-3">
                          {new Date(note.timestamp).toLocaleString(undefined, {
                            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
