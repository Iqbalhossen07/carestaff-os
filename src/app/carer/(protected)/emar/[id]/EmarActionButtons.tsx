"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import Swal from "sweetalert2";
import { logMedication } from "./actions";

export default function EmarActionButtons({ medicationId, residentId }: { medicationId: string, residentId: string }) {
  const [loading, setLoading] = useState(false);

  const handleAdminister = async () => {
    const result = await Swal.fire({
      title: 'Confirm Administration',
      text: "Are you sure you have administered this medication exactly as prescribed?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, Administered'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await logMedication(medicationId, residentId, "ADMINISTERED");
        Swal.fire('Logged!', 'Medication has been logged as administered.', 'success');
      } catch (error: any) {
        Swal.fire('Error', error.message || 'Failed to log medication.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRefuse = async () => {
    const { value: reason } = await Swal.fire({
      title: 'Medication Refused',
      input: 'text',
      inputLabel: 'Reason for refusal (Required)',
      inputPlaceholder: 'e.g. Resident was asleep, Refused verbally...',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write a reason!';
        }
      }
    });

    if (reason) {
      setLoading(true);
      try {
        await logMedication(medicationId, residentId, "REFUSED", reason);
        Swal.fire('Logged!', 'Medication has been logged as refused.', 'warning');
      } catch (error: any) {
        Swal.fire('Error', error.message || 'Failed to log medication.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button 
        onClick={handleAdminister}
        disabled={loading}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm disabled:opacity-70"
      >
        <Check className="w-5 h-5" /> Administer
      </button>
      <button 
        onClick={handleRefuse}
        disabled={loading}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm disabled:opacity-70"
      >
        <X className="w-5 h-5" /> Refuse
      </button>
    </div>
  );
}
