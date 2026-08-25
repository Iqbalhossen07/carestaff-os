import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CrmFormClient from "./CrmFormClient";

export default async function NewEnquiryPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Enquiry</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <CrmFormClient careHomeId={session?.user?.careHomeId as string} />
      </div>
    </div>
  );
}
