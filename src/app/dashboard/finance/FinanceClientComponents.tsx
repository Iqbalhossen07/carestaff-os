"use client";

import { useState } from "react";
import { createInvoice, markInvoicePaid } from "./actions";
import { CheckCircle2 } from "lucide-react";

export function CreateInvoiceForm({ careHomeId, residents }: { careHomeId: string, residents: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await createInvoice(new FormData(e.currentTarget), careHomeId);
    (e.target as HTMLFormElement).reset();
    setLoading(false);
    alert("Invoice generated successfully.");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <h3 className="font-bold text-gray-900 mb-4">Generate Invoice</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Resident</label>
        <select name="residentId" required className="w-full px-4 py-2 border rounded-lg text-sm">
          <option value="">-- Choose Resident --</option>
          {residents.map(r => (
            <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description / Services</label>
        <input type="text" name="description" required placeholder="e.g. Monthly Care Fees - August" className="w-full px-4 py-2 border rounded-lg text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (£)</label>
          <input type="number" step="0.01" name="amount" required placeholder="e.g. 1500.00" className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input type="date" name="dueDate" required className="w-full px-4 py-2 border rounded-lg text-sm" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm">
        {loading ? "Generating..." : "Create Invoice"}
      </button>
    </form>
  );
}

export function MarkPaidButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button 
      onClick={async () => {
        setLoading(true);
        await markInvoicePaid(invoiceId);
        setLoading(false);
      }}
      disabled={loading}
      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 font-bold rounded-lg border border-green-200"
    >
      <CheckCircle2 className="w-3.5 h-3.5" />
      {loading ? "..." : "Mark Paid"}
    </button>
  );
}
