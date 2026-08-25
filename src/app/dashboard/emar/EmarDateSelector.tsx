"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";

export function EmarDateSelector({ defaultDate }: { defaultDate: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = searchParams.get("date") || defaultDate;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    router.push(`/dashboard/emar?date=${newDate}`);
  };

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
      <Calendar className="w-5 h-5 text-gray-500" />
      <div className="flex flex-col">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Chart Date</label>
        <input 
          type="date" 
          value={currentDate}
          onChange={handleDateChange}
          className="text-sm font-bold text-gray-800 outline-none bg-transparent cursor-pointer"
        />
      </div>
    </div>
  );
}
