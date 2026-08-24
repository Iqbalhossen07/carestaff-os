import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PhoneCall, LayoutList, Plus } from "lucide-react";
import { EnquiryStatusDropdown } from "./CrmClientComponents";
import Link from "next/link";

export default async function CrmPage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;
  
  const enquiries = await prisma.enquiry.findMany({
    where: { careHomeId },
    orderBy: { createdAt: 'desc' }
  });

  const activeEnquiries = enquiries.filter(e => e.status === "NEW" || e.status === "CONTACTED").length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 rounded-lg">
            <PhoneCall className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales & Admissions (CRM)</h1>
            <p className="text-gray-500 mt-1">Manage new enquiries and bed occupancy.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/crm/new"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Enquiry
        </Link>
      </div>

      {activeEnquiries > 0 && (
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-teal-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 rounded-full">
              <PhoneCall className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Active Enquiries</h3>
              <p className="text-gray-500">There are {activeEnquiries} active enquiries in the pipeline.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <LayoutList className="w-5 h-5 text-gray-500"/> Pipeline
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {enquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No enquiries recorded yet.</div>
          ) : (
            enquiries.map(enq => (
              <div key={enq.id} className="p-6 flex items-start justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{enq.name}</h4>
                  <p className="text-sm text-gray-600 mt-1"><span className="font-medium text-gray-700">Contact:</span> {enq.contactInfo}</p>
                  {enq.notes && (
                    <div className="text-sm text-gray-500 mt-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 prose prose-sm max-w-none prose-p:my-0">
                      <div dangerouslySetInnerHTML={{ __html: enq.notes }} />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-3">Received: {new Date(enq.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <EnquiryStatusDropdown enquiryId={enq.id} currentStatus={enq.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
