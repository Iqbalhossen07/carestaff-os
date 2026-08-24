import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserCheck, Clock, LogOut, Plus } from "lucide-react";
import { SignOutButton } from "./VisitorClientComponents";
import Link from "next/link";

export default async function VisitorsPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;
  
  const visitors = await prisma.visitorLog.findMany({
    where: { careHomeId },
    orderBy: { signInTime: 'desc' },
    take: 50
  });

  const currentlySignedIn = visitors.filter(v => !v.signOutTime).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <UserCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Visitor Management</h1>
            <p className="text-gray-500 mt-1">Digital sign-in and sign-out book for all guests.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/visitors/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Sign-In Visitor
        </Link>
      </div>

      {currentlySignedIn > 0 && (
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-full">
              <UserCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Currently On-Site</h3>
              <p className="text-gray-500">There are {currentlySignedIn} visitors currently signed in.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recent Visitor Logs</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-gray-500">
                <th className="px-6 py-3 font-medium">Visitor Name</th>
                <th className="px-6 py-3 font-medium">Purpose</th>
                <th className="px-6 py-3 font-medium">Sign-In</th>
                <th className="px-6 py-3 font-medium">Sign-Out</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitors.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">No visitors logged today.</td></tr>
              ) : (
                visitors.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{v.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{v.purpose}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {new Date(v.signInTime).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      {v.signOutTime ? (
                        <div className="flex items-center gap-1 text-gray-500"><LogOut className="w-3.5 h-3.5"/> {new Date(v.signOutTime).toLocaleTimeString()}</div>
                      ) : (
                        <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">ON SITE</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!v.signOutTime && <SignOutButton visitorId={v.id} />}
                    </td>
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
