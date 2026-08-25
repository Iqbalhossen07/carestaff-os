"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, User, Hash, Home, Search, Trash2, CalendarHeart } from "lucide-react";
import { deleteResident } from "./actions";
import { ActionMenu } from "@/components/ui/ActionButtons";
import Swal from "sweetalert2";

export default function ResidentListClient({ initialResidents }: { initialResidents: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const filteredResidents = initialResidents.filter(r => {
    const term = search.toLowerCase();
    const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
    const room = (r.roomNumber || "").toLowerCase();
    const nhs = (r.nhsNumber || "").toLowerCase();
    return fullName.includes(term) || room.includes(term) || nhs.includes(term);
  });

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredResidents.length && filteredResidents.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredResidents.map(r => r.id)));
    }
  };

  const handleSingleDelete = async (id: string) => {
    try {
      await deleteResident(id);
      Swal.fire('Deleted!', 'Resident has been removed.', 'success');
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      router.refresh(); // Refresh Next.js server data
    } catch (e) {
      Swal.fire('Error', 'Failed to delete resident.', 'error');
    }
  };

  const handleBulkDelete = async () => {
    const result = await Swal.fire({
      title: `Delete ${selectedIds.size} residents?`,
      text: "You won't be able to revert this bulk action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete all!'
    });

    if (result.isConfirmed) {
      setDeleting(true);
      try {
        for (const id of Array.from(selectedIds)) {
          await deleteResident(id);
        }
        Swal.fire('Deleted!', `${selectedIds.size} residents have been deleted.`, 'success');
        setSelectedIds(new Set());
        router.refresh();
      } catch (e) {
        Swal.fire('Error', 'Error deleting some residents', 'error');
      }
      setDeleting(false);
    }
  };

  if (initialResidents.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No residents found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Get started by adding your first resident to the system to start managing their care profiles.</p>
        <Link 
          href="/dashboard/residents/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Resident
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, room, or NHS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 transition-all placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900">
            <input 
              type="checkbox" 
              checked={selectedIds.size > 0 && selectedIds.size === filteredResidents.length}
              onChange={toggleAll}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
            />
            Select All
          </label>

          {selectedIds.size > 0 && (
            <button 
              onClick={handleBulkDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-all border border-red-100 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Deleting..." : `Delete (${selectedIds.size})`}
            </button>
          )}
        </div>
      </div>

      {filteredResidents.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
          No residents match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResidents.map((resident) => {
            const isSelected = selectedIds.has(resident.id);
            return (
              <div 
                key={resident.id} 
                className={`relative group bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isSelected 
                    ? "border-blue-500 ring-4 ring-blue-50 shadow-md transform -translate-y-1" 
                    : "border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-gray-200"
                }`}
              >
                {/* Premium Banner */}
                <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-700 w-full relative">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  
                  {/* Action Menu (Top Right) */}
                  <div className="absolute top-3 right-3 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg">
                    <ActionMenu 
                      itemName="resident"
                      viewHref={`/dashboard/residents/${resident.id}`}
                      editHref={`/dashboard/residents/${resident.id}/edit`}
                      onDelete={() => handleSingleDelete(resident.id)}
                    />
                  </div>

                  {/* Selection Checkbox (Top Left) */}
                  <div className="absolute top-4 left-4 z-10">
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(resident.id)}
                      className="w-5 h-5 rounded shadow-sm border-white text-blue-600 focus:ring-white cursor-pointer bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="px-6 pb-6 relative">
                  {/* Avatar overlapping banner */}
                  <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-lg absolute -top-10 left-6">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-2xl">
                      {resident.firstName[0]}{resident.lastName[0]}
                    </div>
                  </div>

                  {/* Spacer for avatar */}
                  <div className="h-14"></div>

                  <div className="mb-4">
                    <h3 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                      {resident.firstName} {resident.lastName}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 mt-0.5">
                      {calculateAge(resident.dateOfBirth)} Years Old
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-sm p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium">Room Number</p>
                        <p className="font-bold text-gray-900 truncate">
                          {resident.roomNumber || "Unassigned"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Hash className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium">NHS Number</p>
                        <p className="font-bold text-gray-900 truncate">
                          {resident.nhsNumber || "Not Provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function calculateAge(dob: string | Date) {
  const diff = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diff); 
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
