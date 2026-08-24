"use client";

import { useState } from "react";
import { signInVisitor, signOutVisitor } from "./actions";

export function SignInForm({ careHomeId }: { careHomeId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await signInVisitor(new FormData(e.currentTarget), careHomeId);
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-gray-900 text-xl mb-6">Digital Sign-In</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Name</label>
        <input type="text" name="name" required placeholder="e.g. Jane Doe" className="w-full px-4 py-2 border rounded-lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
        <select name="purpose" className="w-full px-4 py-2 border rounded-lg">
          <option value="Visiting Resident">Visiting Resident</option>
          <option value="Contractor / Repair">Contractor / Repair</option>
          <option value="Official Inspection">Official Inspection</option>
          <option value="Interview">Interview</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button type="submit" disabled={loading} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg">
        {loading ? "Signing In..." : "Sign In Visitor"}
      </button>
    </form>
  );
}

export function SignOutButton({ visitorId }: { visitorId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <button 
      onClick={async () => {
        setLoading(true);
        await signOutVisitor(visitorId);
        setLoading(false);
      }}
      disabled={loading}
      className="text-xs px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-lg border border-red-200"
    >
      {loading ? "..." : "Sign Out"}
    </button>
  );
}
