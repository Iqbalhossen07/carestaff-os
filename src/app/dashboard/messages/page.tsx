import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MessageSquare, Send, User } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch all messages where Admin is involved
  const messages = await prisma.message.findMany({
    where: { 
      OR: [
        { receiverId: userId },
        { senderId: userId }
      ]
    },
    include: {
      sender: true,
      receiver: true
    },
    orderBy: { timestamp: 'desc' } // show newest first for admin overview
  });

  // Get users who have sent messages to Admin to populate a quick reply list
  const uniqueSenders = Array.from(new Set(messages.filter(m => m.senderId !== userId).map(m => m.senderId)));
  const contacts = await prisma.user.findMany({
    where: { id: { in: uniqueSenders } }
  });

  // If no contacts, just fetch some family or staff to start chat
  const allUsers = await prisma.user.findMany({
    where: { careHomeId: session.user.careHomeId, id: { not: userId } },
    take: 10
  });

  async function sendMessage(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    const receiverId = formData.get("receiverId") as string;
    
    if (!content || !receiverId) return;

    await prisma.message.create({
      data: {
        content,
        senderId: userId,
        receiverId
      }
    });
    revalidatePath("/dashboard/messages");
  }

  return (
    <div className="max-w-6xl mx-auto h-[80vh] flex bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Sidebar: Contacts */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Inbox
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {allUsers.map(user => (
            <div key={user.id} className="p-4 border-b border-gray-100 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-colors">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.userType === 'CLIENT' ? 'Family Member' : 'Care Staff'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Broadcast / Quick Reply</h2>
            <p className="text-xs text-gray-500">Recent messages across all contacts.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 flex flex-col-reverse">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No messages yet.
            </div>
          ) : (
            messages.map(msg => {
              const isMe = msg.senderId === userId;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-xs font-bold text-gray-500 mb-1 ml-1">{msg.sender.name}</span>}
                  <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <form action={sendMessage} className="flex gap-2">
            <select name="receiverId" required className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white max-w-[150px]">
              <option value="">Select Recipient...</option>
              {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <input 
              type="text" 
              name="content"
              required
              placeholder="Type your message here..." 
              className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <button 
              type="submit" 
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
