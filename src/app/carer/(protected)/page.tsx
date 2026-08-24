import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Pill, HeartPulse, MessageSquareDiff, Clock } from "lucide-react";
import Link from "next/link";

export default async function CarerDashboard() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;
  const userId = session?.user?.id as string;

  // Fetch some quick stats for the carer
  // 1. Current/Next Shift
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingShift = await prisma.shift.findFirst({
    where: {
      careHomeId,
      assignedToId: userId,
      startTime: {
        gte: today
      }
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  // 2. Pending eMAR (medicines to give today)
  // Simplified logic: Count all medications. In reality, you'd check EmarLog.
  const totalMeds = await prisma.medication.count({
    where: {
      resident: { careHomeId }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1">Here's your overview for today.</p>
        </div>
        <Link 
          href="/carer/rota" 
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Clock className="w-5 h-5 text-gray-500" />
          View My Schedule
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Next Shift Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Next Shift</p>
              {upcomingShift ? (
                <>
                  <p className="text-xl font-bold text-gray-900 mt-1">{upcomingShift.title}</p>
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {new Date(upcomingShift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(upcomingShift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-gray-900 mt-1">No upcoming shifts</p>
              )}
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link href="/carer/rota" className="text-sm text-blue-600 font-medium hover:underline">
            View full rota &rarr;
          </Link>
        </div>

        {/* eMAR Tasks Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">eMAR Tasks</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{totalMeds}</p>
              <p className="text-sm text-gray-500 mt-1">Total active medications</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Pill className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <Link href="/carer/emar" className="text-sm text-orange-600 font-medium hover:underline">
            Go to eMAR &rarr;
          </Link>
        </div>

        {/* Resident Care Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Residents</p>
              <p className="text-xl font-bold text-gray-900 mt-1">Daily Care Logs</p>
              <p className="text-sm text-gray-500 mt-1">Update progress notes</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <HeartPulse className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <Link href="/carer/residents" className="text-sm text-green-600 font-medium hover:underline">
            View Residents &rarr;
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mt-8">
        <MessageSquareDiff className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Shift Handovers</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">Read important notes from the previous shift and leave updates for the next team.</p>
        <Link href="/carer/handovers" className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
          View Handovers
        </Link>
      </div>
    </div>
  );
}
