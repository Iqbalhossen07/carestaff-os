import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { HeartPulse, Calendar, Pill, Activity, AlertTriangle, User } from "lucide-react";

export default async function FamilyDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/family/login");
  }

  // Find the linked resident(s)
  const familyLinks = await prisma.familyLink.findMany({
    where: { familyMemberId: session.user.id },
    include: {
      resident: {
        include: {
          medications: true,
          progressNotes: {
            orderBy: { timestamp: 'desc' },
            take: 15
          },
          careHome: true
        }
      }
    }
  });

  if (familyLinks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center mt-20">
        <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <HeartPulse className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to the Family Portal</h1>
        <p className="text-gray-500 text-lg">
          Your account is not currently linked to any residents. Please contact the Care Home administration to link your account to your loved one's profile.
        </p>
      </div>
    );
  }

  // Assuming most family members are linked to 1 resident, we pick the first.
  const link = familyLinks[0];
  const resident = link.resident;
  const canViewLogs = link.canViewLogs;

  const calculateAge = (dob: Date) => {
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 text-5xl font-bold shrink-0 shadow-xl">
            {resident.firstName.charAt(0)}{resident.lastName.charAt(0)}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black mb-2">{resident.firstName} {resident.lastName}</h1>
            <p className="text-teal-100 font-medium text-lg mb-4">
              {resident.careHome.name} • Room {resident.roomNumber}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-bold">
                {calculateAge(resident.dateOfBirth)} years old
              </span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-bold flex items-center gap-1.5">
                <User className="w-4 h-4" /> Relation: {link.relation}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
          <HeartPulse className="w-96 h-96" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" /> Medical Info
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Allergies</p>
                {resident.allergies ? (
                  <p className="text-sm font-bold text-red-600 bg-red-50 inline-block px-3 py-1.5 rounded-lg border border-red-100">{resident.allergies}</p>
                ) : (
                  <p className="text-sm font-bold text-gray-700">None reported</p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Dietary Requirements</p>
                <p className="text-sm font-bold text-gray-900">{resident.dietaryReqs || resident.dietaryNeeds || "Standard Diet"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" /> Active Medications
            </h2>
            {resident.medications.length === 0 ? (
              <p className="text-sm text-gray-500">No active medications prescribed.</p>
            ) : (
              <ul className="space-y-3">
                {resident.medications.map(med => (
                  <li key={med.id} className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="font-bold text-gray-900 flex items-center justify-between">
                      {med.name}
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{med.dosage}</span>
                    </p>
                    <p className="text-gray-500 mt-1">{med.frequency}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" /> Care Updates & Progress
            </h2>
            
            {!canViewLogs ? (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 flex items-start gap-4 text-orange-800">
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold mb-1">Access Restricted</h3>
                  <p className="text-sm">You do not have permission to view detailed daily care logs. Please contact the care home administrator if you believe this is a mistake.</p>
                </div>
              </div>
            ) : resident.progressNotes.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
                No care logs recorded yet.
              </div>
            ) : (
              <div className="relative border-l-2 border-teal-100 pl-5 ml-3 space-y-8">
                {resident.progressNotes.map(note => (
                  <div key={note.id} className="relative">
                    <div className="absolute -left-[27px] top-1 w-3 h-3 bg-teal-500 rounded-full ring-4 ring-white"></div>
                    <div className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-5 border border-gray-100 shadow-sm">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{note.note}</p>
                      
                      {(note.mood || note.foodIntake) && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                          {note.mood && (
                            <span className="text-xs bg-white border border-gray-200 px-2.5 py-1.5 rounded-md text-gray-700 font-bold shadow-sm">
                              <span className="text-gray-400 font-normal mr-1">Mood:</span> {note.mood}
                            </span>
                          )}
                          {note.foodIntake && (
                            <span className="text-xs bg-white border border-gray-200 px-2.5 py-1.5 rounded-md text-gray-700 font-bold shadow-sm">
                              <span className="text-gray-400 font-normal mr-1">Intake:</span> {note.foodIntake}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(note.timestamp).toLocaleString(undefined, {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
