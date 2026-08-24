import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CalendarDays, Clock, User } from "lucide-react";
import { CreateShiftForm, AssignShiftDropdown } from "./RotaClientComponents";

export default async function RotaPage() {
  const session = await getServerSession(authOptions);
  
  const careHomeId = session?.user?.careHomeId as string;

  const shifts = await prisma.shift.findMany({
    where: { careHomeId },
    include: { user: true },
    orderBy: { startTime: 'asc' }
  });

  const staffMembers = await prisma.user.findMany({
    where: { careHomeId, userType: "WORKER" },
    select: { id: true, name: true, email: true }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg">
          <CalendarDays className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rota & Shifts</h1>
          <p className="text-gray-500 mt-1">Manage staff schedules and open shifts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CreateShiftForm careHomeId={careHomeId} staffMembers={staffMembers} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Shifts</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {shifts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No shifts scheduled yet.</div>
              ) : (
                shifts.map(shift => (
                  <div key={shift.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{shift.roleRequired}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          {new Date(shift.startTime).toLocaleString()} - {new Date(shift.endTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {shift.user ? (
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100">
                          <User className="w-4 h-4" />
                          {shift.user.name}
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                            OPEN SHIFT
                          </span>
                          <AssignShiftDropdown shiftId={shift.id} staffMembers={staffMembers} />
                        </div>
                      )}
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
