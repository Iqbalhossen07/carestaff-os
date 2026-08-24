"use client";

import { useState } from "react";
import { addHandover } from "./actions";
import { Send } from "lucide-react";

export function HandoverForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(e.currentTarget);
      await addHandover(formData);
      setSuccess("Handover note added successfully.");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>}

      <div>
        <textarea 
          name="notes" 
          rows={4} 
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
          placeholder="Write important updates, incidents, or instructions for the next shift..."
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              <Send className="w-4 h-4" /> Post Handover
            </>
          )}
        </button>
      </div>
    </form>
  );
}
