import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MessageSquareDiff } from "lucide-react";
import { HandoverForm } from "./HandoverClient";

export default async function CarerHandoversPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;

  // We fetch handovers from users in the same care home
  const handovers = await prisma.handover.findMany({
    where: {
      author: {
        careHomeId
      }
    },
    include: {
      author: {
        select: { name: true, image: true, userType: true }
      }
    },
    orderBy: { timestamp: 'desc' },
    take: 20
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-100 rounded-lg">
          <MessageSquareDiff className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shift Handovers</h1>
          <p className="text-gray-500 mt-1">Read and leave important notes for the next shift.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Write Handover Note</h2>
        <HandoverForm />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Recent Handovers</h2>
        
        {handovers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm">
            No handovers recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {handovers.map(handover => (
              <div key={handover.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                      {handover.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{handover.author.name}</p>
                      <p className="text-xs text-gray-500 font-medium">
                        {handover.author.userType === "SUPER_ADMIN" ? "Management" : "Care Staff"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(handover.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(handover.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-700 whitespace-pre-wrap">{handover.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
