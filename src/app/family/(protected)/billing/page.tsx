import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Receipt, FileText, Calendar, Info, Wallet } from "lucide-react";

export default async function FamilyBillingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/family/login");
  }

  // Get family links
  const familyLinks = await prisma.familyLink.findMany({
    where: { familyMemberId: session.user.id }
  });

  if (familyLinks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center mt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">No Linked Resident</h1>
        <p className="text-gray-500">You must be linked to a resident to view invoices.</p>
      </div>
    );
  }

  const residentId = familyLinks[0].residentId;

  const invoices = await prisma.invoice.findMany({
    where: { residentId },
    orderBy: { createdAt: 'desc' }
  });

  const unpaidCount = invoices.filter(i => i.status === 'UNPAID' || i.status === 'OVERDUE').length;
  const totalUnpaid = invoices.filter(i => i.status === 'UNPAID' || i.status === 'OVERDUE').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-teal-100 rounded-lg">
          <Receipt className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-500 mt-1">View your monthly care home statements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Unpaid Invoices</p>
            <p className="text-3xl font-bold text-gray-900">{unpaidCount}</p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Balance Due</p>
            <p className="text-3xl font-bold text-gray-900">£{totalUnpaid.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Invoice History</h2>
        
        {invoices.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
            No invoices have been generated for your account yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-semibold text-gray-600">Description</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Date Issued</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Due Date</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm font-medium text-gray-900">{inv.description}</td>
                    <td className="py-4 text-sm text-gray-600">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-sm font-bold text-gray-900">
                      £{inv.amount.toLocaleString()}
                    </td>
                    <td className="py-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        inv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        inv.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm">
                      <button className="text-teal-600 hover:text-teal-800 font-medium">View PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-1">Payment Information</p>
          <p>Please pay all invoices directly to the Care Home's designated bank account. Online payment via this portal is currently disabled. Use your Invoice ID as the payment reference.</p>
        </div>
      </div>
    </div>
  );
}
