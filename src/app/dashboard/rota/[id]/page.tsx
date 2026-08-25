import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User, Calendar, Edit, ClipboardList } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ShiftViewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  
  const shift = await prisma.shift.findUnique({
    where: { 
      id,
      careHomeId: session?.user?.careHomeId
    },
    include: { assignedTo: true }
  });

  if (!shift) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/rota" className="text-gray-500 hover:text-gray-800 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Rota
        </Link>
        <Link 
          href={`/dashboard/rota/${shift.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
        >
          <Edit className="w-4 h-4" /> Edit Shift
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-2xl flex items-center justify-center shadow-sm">
              <Clock className="w-10 h-10" />
            </div>
            <div>
              <p className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-1">Shift Details</p>
              <h1 className="text-3xl font-black text-gray-900">{shift.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                  {shift.status}
                </span>
                {!shift.assignedToId && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                    OPEN SHIFT
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" /> Date & Time
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Start Time</p>
                <p className="font-bold text-gray-900 text-lg mt-1">
                  {new Date(shift.startTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm font-medium text-gray-500">End Time</p>
                <p className="font-bold text-gray-900 text-lg mt-1">
                  {new Date(shift.endTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" /> Assignment
            </h2>
            
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 h-full flex flex-col justify-center">
              {shift.assignedTo ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl border-4 border-white shadow-sm">
                    {shift.assignedTo.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Assigned Staff</p>
                    <p className="font-bold text-gray-900 text-xl">{shift.assignedTo.name}</p>
                    <p className="text-sm text-gray-500">{shift.assignedTo.email}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-3">
                    <User className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-gray-900">Not Assigned</p>
                  <p className="text-sm text-gray-500">This is an open shift. Staff can pick it up or you can assign someone.</p>
                </div>
              )}
            </div>
          </div>
          
          {shift.notes && (
            <div className="md:col-span-2 space-y-4 mt-4">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-gray-400" /> Shift Instructions & Notes
              </h2>
              <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-gray-700 whitespace-pre-wrap">
                {shift.notes}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
