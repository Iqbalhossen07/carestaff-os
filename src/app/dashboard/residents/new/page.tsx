import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ResidentFormClient from "./ResidentFormClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";

export default async function AddResidentPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard/residents" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6 w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Residents
      </Link>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Resident</h1>
        <Suspense fallback={<div>Loading form...</div>}>
          <ResidentFormClient careHomeId={session?.user?.careHomeId as string || ""} />
        </Suspense>
      </div>
    </div>
  );
}
