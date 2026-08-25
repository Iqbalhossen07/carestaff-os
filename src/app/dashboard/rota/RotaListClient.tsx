"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, User, Calendar, PlusCircle } from "lucide-react";
import { assignShift, deleteShift } from "./actions";
import Swal from "sweetalert2";
import { InlineActionButtons } from "@/components/ui/ActionButtons";

export default function RotaListClient({ initialShifts, staffMembers, roles }: { initialShifts: any[], staffMembers: any[], roles: any[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteShift(id);
      if (res.error) throw new Error(res.error);
      Swal.fire('Deleted!', 'Shift has been removed.', 'success');
      router.refresh();
    } catch (e: any) {
      Swal.fire('Error', e.message || 'Failed to delete shift.', 'error');
    }
  };

  const handleAssign = async (shiftId: string, userId: string) => {
    if (!userId) return;
    
    try {
      const staffName = staffMembers.find(s => s.id === userId)?.name;
      const res = await assignShift(shiftId, userId);
      if (res.error) throw new Error(res.error);
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: 'success',
        title: `Shift assigned to ${staffName}`
      });
      router.refresh();
    } catch (e: any) {
      Swal.fire('Error', e.message || 'Failed to assign shift.', 'error');
    }
  };

  if (initialShifts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No upcoming shifts</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Create shifts to start building the roster for your care home.</p>
      </div>
    );
  }

  // Group shifts by Date
  const groupedShifts = initialShifts.reduce((acc: any, shift: any) => {
    const dateStr = new Date(shift.startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(shift);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.keys(groupedShifts).map(dateStr => (
        <div key={dateStr} className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
            <Calendar className="w-5 h-5 text-blue-600" /> {dateStr}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {groupedShifts[dateStr].map((shift: any) => {
              const isAssigned = !!shift.assignedToId;
              const shiftRoleId = roles?.find(r => r.name === shift.title)?.id;
              const validStaff = shiftRoleId ? staffMembers.filter(s => s.roleId === shiftRoleId) : staffMembers;

              return (
                <div key={shift.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden relative">
                  
                  <div className="absolute top-4 right-4 z-10">
                    <InlineActionButtons 
                      editHref={`/dashboard/rota/${shift.id}/edit`}
                      onDelete={() => handleDelete(shift.id)}
                      viewHref={`/dashboard/rota/${shift.id}`}
                      itemName="Shift"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{shift.title}</h3>
                        <p className="text-xs font-semibold text-gray-500">
                          {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                          {' '} - {' '}
                          {new Date(shift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      {isAssigned ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                            {shift.assignedTo.name[0]}
                          </div>
                          <div>
                            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Assigned To</p>
                            <p className="font-semibold text-gray-900">{shift.assignedTo.name}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-wider flex items-center gap-1">
                              <PlusCircle className="w-3 h-3" /> Open Shift
                            </span>
                          </div>
                          <div>
                            <select 
                              onChange={(e) => handleAssign(shift.id, e.target.value)} 
                              className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 px-3 py-2 outline-none bg-white font-medium text-gray-700"
                            >
                              <option value="">Quick Assign Staff...</option>
                              {validStaff.length > 0 ? (
                                validStaff.map(staff => (
                                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                                ))
                              ) : (
                                <option value="" disabled>No staff available for this role</option>
                              )}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
