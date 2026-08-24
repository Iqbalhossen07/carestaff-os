import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ShieldAlert, AlertTriangle, Plus } from "lucide-react";
import Link from "next/link";

export default async function IncidentsPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;
  const userId = session?.user?.id as string;
  
  const incidents = await prisma.incidentReport.findMany({
    where: { careHomeId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Safeguarding & Incidents</h1>
            <p className="text-gray-500 mt-1">Report and track critical incidents (RIDDOR).</p>
          </div>
        </div>
        <Link 
          href="/dashboard/incidents/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Report Incident
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gray-500"/> Incident Log
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {incidents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No incidents reported.</div>
          ) : (
            incidents.map(inc => (
              <div key={inc.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg text-gray-900">{inc.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold border ${
                    inc.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-200' :
                    inc.severity === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                    inc.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    {inc.severity}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100 prose prose-sm max-w-none prose-p:my-0">
                  <div dangerouslySetInnerHTML={{ __html: inc.description }} />
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Reported on: {new Date(inc.createdAt).toLocaleString()}</span>
                  <span className="font-bold text-gray-600">Status: {inc.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
