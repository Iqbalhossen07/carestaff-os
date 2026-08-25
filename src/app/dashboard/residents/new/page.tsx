import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResidentFormClient from "./ResidentFormClient";

export default async function AddResidentPage() {
  const session = await getServerSession(authOptions);
  
  const careHomeId = session?.user?.careHomeId as string || "";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/residents" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Resident</h1>
        <ResidentFormClient careHomeId={careHomeId} />
      </div>
    </div>
  );
}
