import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle 
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch some stats (dummy/basic for now)
  const staffCount = await prisma.user.count({ where: { userType: "WORKER" } });
  const residentCount = await prisma.resident.count();
  
  const stats = [
    { title: "Total Staff", value: staffCount.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Active Residents", value: residentCount.toString(), icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
    { title: "Open Shifts", value: "0", icon: Clock, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Missed eMAR", value: "0", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-gray-500 mt-2">
          Here is what's happening at your care home today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
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

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-gray-500 text-sm py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
          No recent activity to show yet. Start by adding some staff or residents!
        </div>
      </div>
    </div>
  );
}
