import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CalendarDays, Clock, MapPin } from "lucide-react";

export default async function CarerRotaPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;
  const userId = session?.user?.id as string;

  // Get shifts from 7 days ago to 30 days ahead
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 7);
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 30);

  const shifts = await prisma.shift.findMany({
    where: {
      careHomeId,
      assignedToId: userId,
      startTime: {
        gte: pastDate,
        lte: futureDate
      }
    },
    orderBy: { startTime: 'asc' }
  });

  const upcomingShifts = shifts.filter(s => new Date(s.endTime) >= new Date());
  const pastShifts = shifts.filter(s => new Date(s.endTime) < new Date());

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-lg">
          <CalendarDays className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Rota</h1>
          <p className="text-gray-500 mt-1">View your assigned shifts and schedule.</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Upcoming Shifts</h2>
        {upcomingShifts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
            You have no upcoming shifts assigned.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingShifts.map(shift => {
              const shiftStart = new Date(shift.startTime);
              const shiftEnd = new Date(shift.endTime);
              const isToday = isSameDay(shiftStart, today);
              
              return (
                <div 
                  key={shift.id} 
                  className={`bg-white rounded-xl border p-5 shadow-sm transition-all ${isToday ? 'border-blue-400 ring-1 ring-blue-400 shadow-blue-50' : 'border-gray-200'}`}
                >
                  {isToday && (
                    <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md mb-3">
                      TODAY
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 text-lg">{shift.title}</h3>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      <span>{shiftStart.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {shiftStart.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} - {shiftEnd.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>Main Facility</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-6 pt-6">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Recent Shifts</h2>
        {pastShifts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
            No recent shifts found.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Shift Title</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pastShifts.slice().reverse().map(shift => {
                  const shiftStart = new Date(shift.startTime);
                  const shiftEnd = new Date(shift.endTime);
                  return (
                  <tr key={shift.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{shiftStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{shift.title}</td>
                    <td className="px-6 py-4">
                      {shiftStart.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} - {shiftEnd.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Completed
                      </span>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
