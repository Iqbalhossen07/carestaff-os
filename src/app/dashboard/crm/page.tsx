import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Users, PhoneCall, Bed, LayoutList } from "lucide-react";
import { AddEnquiryForm, EnquiryStatusDropdown } from "./CrmClientComponents";

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
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-teal-100 rounded-lg">
          <PhoneCall className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & Admissions (CRM)</h1>
          <p className="text-gray-500 mt-1">Manage new enquiries and bed occupancy.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Active Enquiries</h3>
            <p className="text-4xl font-black text-teal-600">{activeEnquiries}</p>
          </div>
          <AddEnquiryForm careHomeId={careHomeId} />
        </div>

        <div className="lg:col-span-3">
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
                        <p className="text-sm text-gray-500 mt-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 italic">
                          "{enq.notes}"
                        </p>
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
      </div>
    </div>
  );
}
