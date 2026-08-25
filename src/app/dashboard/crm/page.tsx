import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Phone } from "lucide-react";
import CrmListClient from "./CrmListClient";

export default async function CrmPage() {
  const session = await getServerSession(authOptions);
  
  const enquiries = await prisma.enquiry.findMany({
    where: { careHomeId: session?.user?.careHomeId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales & Admissions</h1>
            <p className="text-gray-500 text-sm mt-1">Manage new enquiries, visits, and bed occupancy.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/crm/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Enquiry
        </Link>
      </div>

      <CrmListClient initialEnquiries={enquiries} />
    </div>
  );
}
