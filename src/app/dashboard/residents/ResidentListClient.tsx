"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, User, Hash, Home, Search, Trash2, Eye, Edit } from "lucide-react";
import { deleteResident } from "./actions";
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteResident(id);
        if (res.error) throw new Error(res.error);
        Swal.fire('Deleted!', 'Resident has been removed.', 'success');
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        router.refresh(); 
      } catch (e: any) {
        Swal.fire('Error', e.message || 'Failed to delete resident.', 'error');
      }
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
          const res = await deleteResident(id);
          if (res.error) throw new Error(res.error);
        }
        Swal.fire('Deleted!', `${selectedIds.size} residents have been deleted.`, 'success');
        setSelectedIds(new Set());
        router.refresh();
      } catch (e: any) {
        Swal.fire('Error', e.message || 'Error deleting some residents', 'error');
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResidents.map((resident) => {
            const isSelected = selectedIds.has(resident.id);
            return (
              <div 
                key={resident.id} 
                className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isSelected 
                    ? "border-blue-500 ring-4 ring-blue-50 shadow-md transform -translate-y-1" 
                    : "border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-gray-300"
                }`}
              >
                
                <div className="p-6 relative">
                  
                  <div className="absolute top-4 left-4 z-10">
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(resident.id)}
                      className="w-5 h-5 rounded shadow-sm border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-end gap-1 mb-4 relative z-10">
                    <Link 
                      href={`/dashboard/residents/${resident.id}`}
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link 
                      href={`/dashboard/residents/${resident.id}/edit`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Profile"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => handleSingleDelete(resident.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Resident"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full p-1 bg-white shadow-md border border-gray-100 mb-4">
                      {resident.photo ? (
                        <img 
                          src={resident.photo} 
                          alt={`${resident.firstName} ${resident.lastName}`} 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-3xl">
                          {resident.firstName[0]}{resident.lastName[0]}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-900 text-center">
                      {resident.firstName} {resident.lastName}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      {calculateAge(resident.dateOfBirth)} Years Old
                    </p>
                  </div>

                  <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium">Room Number</p>
                        <p className="font-semibold text-gray-900 truncate">
                          {resident.roomNumber || "Unassigned"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Hash className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium">NHS Number</p>
                        <p className="font-semibold text-gray-900 truncate">
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
