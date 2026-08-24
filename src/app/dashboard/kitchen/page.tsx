import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UtensilsCrossed, AlertTriangle } from "lucide-react";
import { DietaryForm } from "./KitchenClientComponents";

export default async function KitchenPage() {
  const session = await getServerSession(authOptions);
  
  const residents = await prisma.resident.findMany({
    where: { careHomeId: session?.user?.careHomeId },
    orderBy: { lastName: 'asc' }
  });

  const allergyCount = residents.filter(r => r.allergies && r.allergies.trim().length > 0).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-orange-100 rounded-lg">
          <UtensilsCrossed className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kitchen & Nutrition</h1>
          <p className="text-gray-500 mt-1">Manage dietary requirements and meal planning.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Residents</h3>
            <p className="text-4xl font-black text-gray-900">{residents.length}</p>
          </div>
          <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100 text-center">
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
              <AlertTriangle className="w-4 h-4"/> Allergies Tracked
            </h3>
            <p className="text-4xl font-black text-red-700">{allergyCount}</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Resident Dietary Profiles</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {residents.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No residents found in directory.</div>
              ) : (
                residents.map(resident => (
                  <div key={resident.id} className="p-6">
                    <h4 className="font-bold text-gray-900 mb-3">{resident.firstName} {resident.lastName} <span className="text-gray-400 font-normal text-sm ml-2">Room {resident.roomNumber}</span></h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <DietaryForm resident={resident} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
