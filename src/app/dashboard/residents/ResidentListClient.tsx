"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, User, Calendar, Hash, Home, Search, Trash2 } from "lucide-react";
import { deleteResident } from "./actions";

export default function ResidentListClient({ initialResidents }: { initialResidents: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

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
    if (selectedIds.size === filteredResidents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredResidents.map(r => r.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} residents?`)) return;
    setDeleting(true);
    try {
      // In a real app, you'd have a bulk delete action. 
      // For now, we loop the single delete action.
      for (const id of Array.from(selectedIds)) {
        await deleteResident(id);
      }
      setSelectedIds(new Set());
      // The page will revalidate and update automatically because deleteResident calls revalidatePath
    } catch (e) {
      alert("Error deleting some residents");
    }
    setDeleting(false);
  };

  if (initialResidents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">No residents found</h2>
        <p className="text-gray-500 mb-6">Get started by adding your first resident to the system.</p>
        <Link 
          href="/dashboard/residents/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Resident
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, room, or NHS number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
        
        {selectedIds.size > 0 && (
          <button 
            onClick={handleBulkDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors border border-red-200"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting..." : `Delete Selected (${selectedIds.size})`}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <input 
          type="checkbox" 
          checked={selectedIds.size > 0 && selectedIds.size === filteredResidents.length}
          onChange={toggleAll}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span>Select All</span>
      </div>

      {filteredResidents.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
          No residents match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResidents.map((resident) => {
            const isSelected = selectedIds.has(resident.id);
            return (
              <div 
                key={resident.id} 
                className={`bg-white rounded-xl border-2 transition-all overflow-hidden ${
                  isSelected ? "border-blue-500 shadow-md" : "border-gray-100 hover:border-gray-200 shadow-sm hover:shadow"
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(resident.id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex gap-2">
                      <Link href={`/dashboard/residents/${resident.id}/edit`} className="text-xs font-medium text-gray-500 hover:text-blue-600 px-2 py-1 bg-gray-50 rounded hover:bg-blue-50">Edit</Link>
                      <Link href={`/dashboard/residents/${resident.id}`} className="text-xs font-medium text-gray-500 hover:text-blue-600 px-2 py-1 bg-gray-50 rounded hover:bg-blue-50">View</Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                      {resident.firstName[0]}{resident.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{resident.firstName} {resident.lastName}</h3>
                      <p className="text-sm text-gray-500">
                        {calculateAge(resident.dateOfBirth)} years old
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <Home className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{resident.roomNumber ? `Room ${resident.roomNumber}` : "Unassigned Room"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span>NHS: <span className="font-medium">{resident.nhsNumber || "N/A"}</span></span>
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
