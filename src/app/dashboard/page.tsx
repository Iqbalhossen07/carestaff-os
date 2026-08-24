import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  Activity,
  CalendarCheck,
  ShieldAlert
} from "lucide-react";
import { ActivityChart } from "./DashboardCharts";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Real Database Stats
  const staffCount = await prisma.user.count({ 
    where: { careHomeId: session?.user?.careHomeId, userType: "WORKER" } 
  });
  
  const residentCount = await prisma.resident.count({
    where: { careHomeId: session?.user?.careHomeId }
  });
  
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const openShiftsCount = await prisma.shift.count({
    where: { careHomeId: session?.user?.careHomeId, assignedToId: null, startTime: { gte: now } }
  });

  const missedEmarCount = await prisma.emarLog.count({
    where: { resident: { careHomeId: session?.user?.careHomeId }, status: "MISSED", timestamp: { gte: startOfDay } }
  });

  // Calculate past 7 days activity
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const allIncidents = await prisma.incidentReport.findMany({
    where: { careHomeId: session?.user?.careHomeId, createdAt: { gte: last7Days[0] } }
  });

  const allShifts = await prisma.shift.findMany({
    where: { careHomeId: session?.user?.careHomeId, startTime: { gte: last7Days[0] } }
  });

  const weeklyData = last7Days.map(day => {
    const dayStr = day.toLocaleDateString('en-US', { weekday: 'short' });
    const incidents = allIncidents.filter(i => new Date(i.createdAt).toDateString() === day.toDateString()).length;
    const shifts = allShifts.filter(s => new Date(s.startTime).toDateString() === day.toDateString()).length;
    return { name: dayStr, incidents, shifts };
  });

  // Active staff on shift right now
  const activeShifts = await prisma.shift.findMany({
    where: { 
      careHomeId: session?.user?.careHomeId, 
      assignedToId: { not: null },
      startTime: { lte: now },
      endTime: { gte: now }
    },
    include: { assignedTo: true }
  });

  const stats = [
    { title: "Total Care Staff", value: staffCount.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Active Residents", value: residentCount.toString(), icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
    { title: "Open Shifts", value: openShiftsCount.toString(), icon: Clock, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Missed eMAR", value: missedEmarCount.toString(), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-gray-500 mt-2">
          Here is the live overview of your care home.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-lg ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Weekly Activity Overview
            </h2>
          </div>
          <ActivityChart data={weeklyData} />
        </div>

        {/* Action Center / Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            Alert Center
          </h2>
          
          <div className="flex-1 space-y-4">
            {missedEmarCount > 0 ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm font-bold text-red-800">Missed Medications!</p>
                <p className="text-xs text-red-600 mt-1">There are {missedEmarCount} unadministered medications.</p>
              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-start gap-3">
                <div className="mt-0.5"><UserCheck className="w-4 h-4 text-green-600" /></div>
                <div>
                  <p className="text-sm font-bold text-green-800">All eMAR up to date</p>
                  <p className="text-xs text-green-600 mt-1">No missed medications today.</p>
                </div>
              </div>
            )}

            {openShiftsCount > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-3">
                <div className="mt-0.5"><Clock className="w-4 h-4 text-yellow-600" /></div>
                <div>
                  <p className="text-sm font-bold text-yellow-800">{openShiftsCount} Open Shifts</p>
                  <p className="text-xs text-yellow-700 mt-1">There are unfilled shifts for this week.</p>
                  <Link href="/dashboard/rota" className="text-xs font-semibold text-blue-600 mt-2 inline-block hover:underline">
                    Assign Staff &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Staff on Shift Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <CalendarCheck className="w-5 h-5 text-green-600" />
          Staff on Shift Today
        </h2>
        
        {activeShifts.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">No staff currently on shift.</p>
            <p className="text-gray-400 text-xs mt-1">Active staff will appear here when their shift starts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeShifts.map(shift => (
              <div key={shift.id} className="p-4 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {shift.assignedTo?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{shift.assignedTo?.name}</p>
                  <p className="text-xs text-gray-500">{shift.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
