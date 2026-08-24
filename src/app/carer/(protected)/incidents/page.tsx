import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AlertOctagon, Info } from "lucide-react";
import { IncidentForm } from "./IncidentClient";

export default async function CarerIncidentsPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;
  const userId = session?.user?.id as string;

  // Fetch past incidents reported by this user
  const incidents = await prisma.incidentReport.findMany({
    where: {
      careHomeId,
      reportedById: userId
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 rounded-lg">
          <AlertOctagon className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report an Incident</h1>
          <p className="text-gray-500 mt-1">Log accidents, injuries, or emergencies immediately.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">New Incident Report</h2>
            <IncidentForm />
          </div>
          
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Important Notice</p>
              <p>For critical emergencies, please contact emergency services (999) before filling out this form. This form notifies management immediately.</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Your Recent Reports</h2>
            
            {incidents.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
                You haven't reported any incidents recently.
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map(incident => {
                  let badgeColor = "bg-gray-100 text-gray-700";
                  if (incident.severity === "HIGH" || incident.severity === "CRITICAL") badgeColor = "bg-red-100 text-red-700";
                  else if (incident.severity === "MEDIUM") badgeColor = "bg-orange-100 text-orange-700";
                  
                  return (
                    <div key={incident.id} className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">{incident.title}</h3>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
                          {incident.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{incident.description}</p>
                      <div className="flex items-center justify-between text-xs font-medium text-gray-500 border-t border-gray-200 pt-3">
                        <span>Reported: {new Date(incident.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 rounded ${incident.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          Status: {incident.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
