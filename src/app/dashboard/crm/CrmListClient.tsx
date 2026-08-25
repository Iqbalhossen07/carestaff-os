"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Phone, Mail, Edit, Trash2, UserPlus, Eye, Calendar, User } from "lucide-react";
import { deleteEnquiry, updateEnquiryStatus } from "./actions";
import Swal from "sweetalert2";

export default function CrmListClient({ initialEnquiries }: { initialEnquiries: any[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const router = useRouter();

  const statuses = ["New", "In Progress", "Visit", "Admitted", "Lost"];

  const filteredEnquiries = initialEnquiries.filter(e => {
    const term = search.toLowerCase();
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    const contact = (e.contactName || "").toLowerCase();
    const matchesSearch = fullName.includes(term) || contact.includes(term) || (e.contactPhone || "").includes(term);
    const matchesStatus = filterStatus === "All" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete this Enquiry?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteEnquiry(id);
        if (res.error) throw new Error(res.error);
        Swal.fire('Deleted!', 'Enquiry has been removed.', 'success');
        router.refresh();
      } catch (e: any) {
        Swal.fire('Error', e.message || 'Failed to delete enquiry.', 'error');
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await updateEnquiryStatus(id, newStatus);
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
        title: `Status updated to ${newStatus}`
      });
      router.refresh();
    } catch (e: any) {
      Swal.fire('Error', e.message || 'Failed to update status.', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Progress': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Visit': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Admitted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Lost': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, contact, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-gray-900 transition-all placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button 
            onClick={() => setFilterStatus("All")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === "All" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            All
          </button>
          {statuses.map(status => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === status ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredEnquiries.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
          No enquiries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full">
              
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    {enquiry.firstName[0]}{enquiry.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">
                      {enquiry.firstName} {enquiry.lastName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(enquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <select 
                  value={enquiry.status}
                  onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border appearance-none cursor-pointer outline-none ${getStatusColor(enquiry.status)}`}
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1">
                
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Person</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{enquiry.contactName || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {enquiry.contactPhone ? (
                      <a href={`tel:${enquiry.contactPhone}`} className="hover:text-blue-600 hover:underline">{enquiry.contactPhone}</a>
                    ) : "N/A"}
                  </div>
                  {enquiry.contactEmail && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${enquiry.contactEmail}`} className="hover:text-blue-600 hover:underline truncate">{enquiry.contactEmail}</a>
                    </div>
                  )}
                </div>

                {enquiry.careRequired && (
                  <div className="pt-2 border-t border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Care Level</p>
                    <p className="text-sm text-gray-800 font-medium bg-gray-50 inline-block px-2 py-1 rounded">{enquiry.careRequired}</p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Link 
                    href={`/dashboard/crm/${enquiry.id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Enquiry"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(enquiry.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Enquiry"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {enquiry.status !== "Admitted" && enquiry.status !== "Lost" && (
                  <Link 
                    href={`/dashboard/residents/new?enquiryId=${enquiry.id}&firstName=${encodeURIComponent(enquiry.firstName)}&lastName=${encodeURIComponent(enquiry.lastName)}&contactName=${encodeURIComponent(enquiry.contactName || "")}&phone=${encodeURIComponent(enquiry.contactPhone || "")}&notes=${encodeURIComponent(enquiry.notes || "")}`}
                    className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm border border-emerald-200"
                  >
                    <UserPlus className="w-4 h-4" /> Admit Resident
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
