"use client";

import { useState } from "react";
import { logMedicationAdmin, deleteMedication } from "./actions";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { InlineActionButtons } from "@/components/ui/ActionButtons";

export function EmarActionButtons({ medicationId }: { medicationId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await deleteMedication(medicationId);
      if (res.error) throw new Error(res.error);
      Swal.fire('Deleted!', 'Medication has been removed.', 'success');
      router.refresh();
    } catch (e: any) {
      Swal.fire('Error', e.message || 'Failed to delete.', 'error');
    }
  };

  return (
    <InlineActionButtons 
      editHref={`/dashboard/emar/${medicationId}/edit`}
      onDelete={handleDelete}
      viewHref={`/dashboard/emar/${medicationId}`}
      itemName="Medication"
    />
  );
}

export function LogMedicationButton({ medicationId, residentId, staffId }: { medicationId: string, residentId: string, staffId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (status: "ADMINISTERED" | "REFUSED" | "MISSED") => {
    if (status === "REFUSED") {
      const { value: reason } = await Swal.fire({
        title: 'Reason for Refusal',
        input: 'text',
        inputLabel: 'Why did the resident refuse this medication?',
        inputPlaceholder: 'e.g. Feels nauseous, Sleeping...',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) return 'You need to write something!'
        }
      });
      if (!reason) return;
      
      setLoading(true);
      await logMedicationAdmin({ medicationId, residentId, staffId, status, refusalReason: reason });
      setLoading(false);
      Swal.fire('Logged', 'Refusal has been recorded.', 'warning');
      router.refresh();
      return;
    }

    // Direct log for Given or Missed
    setLoading(true);
    await logMedicationAdmin({ medicationId, residentId, staffId, status });
    setLoading(false);
    Swal.fire('Logged', `Medication marked as ${status.toLowerCase()}.`, status === "ADMINISTERED" ? 'success' : 'error');
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleAction("ADMINISTERED")}
        disabled={loading}
        className="flex-1 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition-colors border border-emerald-200 disabled:opacity-50"
      >
        Give
      </button>
      <button 
        onClick={() => handleAction("REFUSED")}
        disabled={loading}
        className="flex-1 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold rounded-lg transition-colors border border-orange-200 disabled:opacity-50"
      >
        Refused
      </button>
      <button 
        onClick={() => handleAction("MISSED")}
        disabled={loading}
        className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg transition-colors border border-red-200 disabled:opacity-50"
      >
        Missed
      </button>
    </div>
  );
}
