import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PoundSterling, TrendingUp, DownloadCloud, FileText } from "lucide-react";
import { CreateInvoiceForm, MarkPaidButton } from "./FinanceClientComponents";

export default async function FinancePage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;
  
  const residents = await prisma.resident.findMany({
    where: { careHomeId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { lastName: 'asc' }
  });

  const invoices = await prisma.invoice.findMany({
    where: { careHomeId },
    orderBy: { createdAt: 'desc' }
  });

  // Basic calculations
  const totalPaid = invoices.filter(i => i.status === "PAID").reduce((sum, i) => sum + i.amount, 0);
  const totalOutstanding = invoices.filter(i => i.status === "UNPAID" || i.status === "OVERDUE").reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <PoundSterling className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finance & Billing</h1>
            <p className="text-gray-500 mt-1">Manage resident ledgers, invoices, and accounting exports.</p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg font-bold border border-indigo-200 transition-colors">
          <DownloadCloud className="w-4 h-4" /> Export to Xero / Sage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Revenue (Paid)</p>
            <p className="text-3xl font-black text-gray-900">£{totalPaid.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-green-100 text-green-600 rounded-full">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Outstanding Balance</p>
            <p className="text-3xl font-black text-red-600">£{totalOutstanding.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-red-100 text-red-600 rounded-full">
            <PoundSterling className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <a href="/dashboard/finance/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm">
          + Create Invoice
        </a>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500"/> Invoice Ledger
          </h2>
        </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-white border-b border-gray-200 text-gray-500">
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Due Date</th>
                    <th className="px-6 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.length === 0 ? (
                    <tr><td colSpan={5} className="p-6 text-center text-gray-500">No invoices generated yet.</td></tr>
                  ) : (
                    invoices.map(inv => {
                      const resident = residents.find(r => r.id === inv.residentId);
                      return (
                        <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">{inv.description}</p>
                            <p className="text-xs text-gray-500 mt-1">To: {resident ? `${resident.firstName} ${resident.lastName}` : "Unknown"}</p>
                          </td>
                          <td className="px-6 py-4 font-black text-gray-900">
                            £{inv.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(inv.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 flex justify-end">
                            {inv.status !== 'PAID' && <MarkPaidButton invoiceId={inv.id} />}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
    </div>
  );
}
