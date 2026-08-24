import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PoundSterling } from "lucide-react";
import { CreateInvoiceForm } from "../FinanceClientComponents";

export default async function NewInvoicePage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;
  
  const residents = await prisma.resident.findMany({
    where: { careHomeId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { lastName: 'asc' }
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg">
          <PoundSterling className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
          <p className="text-gray-500 mt-1">Generate a new invoice for a resident.</p>
        </div>
      </div>
      
      <CreateInvoiceForm careHomeId={careHomeId} residents={residents} />
    </div>
  );
}
