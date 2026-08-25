"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Phone, Mail, UserPlus, Eye, Calendar, User, Clock } from "lucide-react";
import { deleteEnquiry, updateEnquiryStatus } from "./actions";
import Swal from "sweetalert2";
import { InlineActionButtons } from "@/components/ui/ActionButtons";

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
    // Note: InlineActionButtons already handles confirmation, but since we are overriding onDelete
    // We just need to do the API call here because InlineActionButtons does the SweetAlert.
    try {
      const res = await deleteEnquiry(id);
      if (res.error) throw new Error(res.error);
      Swal.fire('Deleted!', 'Enquiry has been removed.', 'success');
      router.refresh();
    } catch (e: any) {
      Swal.fire('Error', e.message || 'Failed to delete enquiry.', 'error');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === "Visit") {
      const { value: date } = await Swal.fire({
        title: 'Schedule a Visit',
        input: 'datetime-local',
        inputLabel: 'When will they visit?',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to choose a date!'
          }
        }
      });

      if (date) {
        try {
          const res = await updateEnquiryStatus(id, newStatus, date);
          if (res.error) throw new Error(res.error);
          Swal.fire('Scheduled!', `Visit scheduled for ${new Date(date).toLocaleString()}`, 'success');
          router.refresh();
        } catch (e: any) {
          Swal.fire('Error', e.message || 'Failed to update status.', 'error');
        }
      }
    } else {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden relative">
              
              <div className="p-6 relative">
                
                {/* Top Action Buttons (Global Component) */}
                <div className="absolute top-4 right-4 z-10">
                  <InlineActionButtons 
                    editHref={`/dashboard/crm/${enquiry.id}/edit`}
                    onDelete={() => handleDelete(enquiry.id)}
                    viewHref={`/dashboard/crm/${enquiry.id}`}
                    itemName="Enquiry"
                  />
                </div>

                <div className="flex flex-col items-center mb-6 pt-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-black text-3xl shadow-sm mb-4">
                    {enquiry.firstName[0]}{enquiry.lastName[0]}
                  </div>
                  
                  <h3 className="font-bold text-xl text-gray-900 text-center leading-tight">
                    {enquiry.firstName} {enquiry.lastName}
                  </h3>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <select 
                      value={enquiry.status}
                      onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border appearance-none cursor-pointer outline-none shadow-sm ${getStatusColor(enquiry.status)}`}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  
                  {enquiry.status === "Visit" && enquiry.visitDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium">Scheduled Visit</p>
                        <p className="font-semibold text-purple-700 truncate">
                          {new Date(enquiry.visitDate).toLocaleString(undefined, {
                            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Contact Person</p>
                      <p className="font-semibold text-gray-900 truncate">
                        {enquiry.contactName || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {(enquiry.contactPhone || enquiry.contactEmail) && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium">Contact Info</p>
                        {enquiry.contactPhone && <p className="font-semibold text-gray-900 truncate">{enquiry.contactPhone}</p>}
                        {enquiry.contactEmail && <p className="font-semibold text-gray-600 truncate text-xs">{enquiry.contactEmail}</p>}
                      </div>
                    </div>
                  )}
                  
                  {enquiry.careRequired && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                       <span className="text-xs font-bold text-gray-500 uppercase">Care: </span>
                       <span className="text-sm font-semibold text-gray-800">{enquiry.careRequired}</span>
                    </div>
                  )}
                </div>

                {/* Admit Action */}
                {enquiry.status !== "Admitted" && enquiry.status !== "Lost" && (
                  <div className="mt-4 flex justify-center">
                    <Link 
                      href={`/dashboard/residents/new?enquiryId=${enquiry.id}&firstName=${encodeURIComponent(enquiry.firstName)}&lastName=${encodeURIComponent(enquiry.lastName)}&contactName=${encodeURIComponent(enquiry.contactName || "")}&phone=${encodeURIComponent(enquiry.contactPhone || "")}&notes=${encodeURIComponent(enquiry.notes || "")}`}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl text-sm font-bold transition-colors border border-emerald-200 shadow-sm"
                    >
                      <UserPlus className="w-4 h-4" /> Admit as Resident
                    </Link>
                  </div>
                )}
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
