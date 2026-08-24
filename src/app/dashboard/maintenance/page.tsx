import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Wrench, AlertTriangle, Hammer, CheckCircle2 } from "lucide-react";
import { AddTicketForm, TicketStatusDropdown } from "./MaintenanceClientComponents";

export default async function MaintenancePage() {
  const session = await getServerSession(authOptions);
  const careHomeId = session?.user?.careHomeId as string;
  
  const tickets = await prisma.maintenanceTicket.findMany({
    where: { careHomeId },
    orderBy: { createdAt: 'desc' }
  });

  const openTickets = tickets.filter(t => t.status !== "RESOLVED").length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-orange-100 rounded-lg">
          <Wrench className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance & Facilities</h1>
          <p className="text-gray-500 mt-1">Track repairs, issues, and facility requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex justify-center gap-1"><AlertTriangle className="w-4 h-4"/> Open Issues</h3>
            <p className="text-4xl font-black text-orange-600">{openTickets}</p>
          </div>
          <AddTicketForm careHomeId={careHomeId} userName={session?.user?.name as string} />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Hammer className="w-5 h-5 text-gray-500"/> Ticket Queue
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No maintenance tickets reported.</div>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className="p-6 flex items-start justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={`font-bold text-lg ${ticket.status === 'RESOLVED' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{ticket.title}</h4>
                        {ticket.priority === 'HIGH' && ticket.status !== 'RESOLVED' && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">URGENT</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {ticket.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
                        <span>Reported by: <strong>{ticket.reportedBy}</strong></span> • 
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                    <div className="ml-4">
                      <TicketStatusDropdown ticketId={ticket.id} currentStatus={ticket.status} />
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
