import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FileText, Download, ShieldCheck, Activity } from "lucide-react";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  
  const emarLogs = await prisma.emarLog.findMany({
    where: { resident: { careHomeId: session?.user?.careHomeId } },
    include: { medication: true, resident: true, administeredBy: true },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance & Reports</h1>
            <p className="text-gray-500 mt-1">CQC governance, audit trails, and data export.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
          <Download className="w-5 h-5" /> Download CQC Report
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600"/> Clinical Audit Trail (eMAR)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-gray-500">
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">Resident</th>
                <th className="px-6 py-3 font-medium">Medication</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {emarLogs.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">No clinical logs recorded yet.</td></tr>
              ) : (
                emarLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-gray-600">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{log.resident.firstName} {log.resident.lastName}</td>
                    <td className="px-6 py-3 text-gray-600">{log.medication.name} ({log.medication.dosage})</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        log.status === "ADMINISTERED" ? "bg-green-100 text-green-700" :
                        log.status === "REFUSED" ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{log.administeredBy.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
