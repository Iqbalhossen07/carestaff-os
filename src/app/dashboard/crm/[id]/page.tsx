import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, Clock, Calendar, Edit } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function EnquiryViewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  
  const enquiry = await prisma.enquiry.findUnique({
    where: { 
      id,
      careHomeId: session?.user?.careHomeId
    }
  });

  if (!enquiry) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/crm" className="text-gray-500 hover:text-gray-800 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to CRM
        </Link>
        <Link 
          href={`/dashboard/crm/${enquiry.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
        >
          <Edit className="w-4 h-4" /> Edit Enquiry
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-3xl shadow-sm">
              {enquiry.firstName[0]}{enquiry.lastName[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{enquiry.firstName} {enquiry.lastName}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Enquiry Date: {new Date(enquiry.createdAt).toLocaleDateString()}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                  {enquiry.status}
                </span>
              </div>
            </div>
          </div>
          
          {enquiry.status === "Visit" && enquiry.visitDate && (
            <div className="bg-purple-50 border border-purple-100 px-6 py-4 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-600 uppercase">Scheduled Visit</p>
                <p className="font-bold text-gray-900 text-lg">
                  {new Date(enquiry.visitDate).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Contact Details */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Family & Contact Info</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Person Name</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{enquiry.contactName || "Not Provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{enquiry.contactPhone || "Not Provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{enquiry.contactEmail || "Not Provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Care Details */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Care Requirements & Notes</h2>
            
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Care Level Required</p>
                {enquiry.careRequired ? (
                  <span className="inline-block px-3 py-1 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-bold text-gray-800">
                    {enquiry.careRequired}
                  </span>
                ) : (
                  <span className="text-gray-400 italic text-sm">Not specified</span>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Initial Notes</p>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap min-h-[100px]">
                  {enquiry.notes || <span className="text-gray-400 italic">No notes provided for this enquiry.</span>}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
