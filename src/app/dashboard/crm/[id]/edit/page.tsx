import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CrmEditClient from "./CrmEditClient";

export default async function EditEnquiryPage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Enquiry</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <CrmEditClient enquiry={enquiry} />
      </div>
    </div>
  );
}
