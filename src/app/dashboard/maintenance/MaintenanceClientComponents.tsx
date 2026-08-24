"use client";

import { useState } from "react";
import { createTicket, updateTicketStatus } from "./actions";
import { CheckCircle2 } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";

export function AddTicketForm({ careHomeId, userName }: { careHomeId: string, userName: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTicket(new FormData(e.currentTarget), careHomeId, userName);
      (e.target as HTMLFormElement).reset();
      alert("Ticket submitted successfully!");
    } catch (error) {
      alert("Failed to submit ticket.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <h3 className="font-bold text-gray-900 mb-4">Report an Issue</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
        <input type="text" name="title" required placeholder="e.g. Broken heater in Room 101" className="w-full px-4 py-2 border rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select name="priority" className="w-full px-4 py-2 border rounded-lg">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High (Urgent)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <RichTextEditor name="description" placeholder="Describe the problem in detail..." />
      </div>

      <button type="submit" disabled={loading} className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-lg">
        {loading ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
}

export function TicketStatusDropdown({ ticketId, currentStatus }: { ticketId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    await updateTicketStatus(ticketId, e.target.value);
    setLoading(false);
  };

  if (currentStatus === "RESOLVED") {
    return <span className="flex items-center gap-1 text-sm font-bold text-green-600"><CheckCircle2 className="w-4 h-4"/> Resolved</span>;
  }

  return (
    <select 
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={loading}
      className={`text-xs font-bold rounded px-2 py-1 border-0 ring-1 ring-inset ${
        currentStatus === 'OPEN' ? 'bg-red-50 text-red-700 ring-red-600/20' :
        'bg-blue-50 text-blue-700 ring-blue-600/20'
      }`}
    >
      <option value="OPEN">Open</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="RESOLVED">Resolved</option>
    </select>
  );
}
