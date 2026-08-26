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
    <select
      disabled={loading}
      onChange={(e) => {
        if (e.target.value) {
          handleAction(e.target.value as any);
          e.target.value = "";
        }
      }}
      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-gray-700 disabled:opacity-50 cursor-pointer"
    >
      <option value="">{loading ? "Saving..." : "Log Action..."}</option>
      <option value="ADMINISTERED">✓ Give</option>
      <option value="REFUSED">⚠ Refused</option>
      <option value="MISSED">✕ Missed</option>
    </select>
  );
}
